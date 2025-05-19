import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App'; // Assuming App.tsx is the component
import React from 'react'; // Import React for JSX

// Mock services
const mockExtractContent = vi.fn();
const mockExtractMultipleContents = vi.fn();
const mockAnalyzeContent = vi.fn();

vi.mock('./services/contentExtractor', () => ({
  extractContent: mockExtractContent,
  extractMultipleContents: mockExtractMultipleContents,
}));

vi.mock('./services/geminiService', () => ({
  analyzeContent: mockAnalyzeContent,
}));

// Helper to fill URL and submit
const submitUrl = async (url: string) => {
  const urlInput = screen.getByPlaceholderText('https://example.com');
  const analyzeButton = screen.getByRole('button', { name: /analyze content/i });

  await fireEvent.change(urlInput, { target: { value: url } });
  await fireEvent.click(analyzeButton);
};

describe('App.tsx', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Default successful mocks
    mockExtractContent.mockResolvedValue({ title: 'Primary Title', text: 'Primary Text', links: [] });
    mockExtractMultipleContents.mockResolvedValue({});
    mockAnalyzeContent.mockResolvedValue('AI Analysis Report Content');
  });

  it('renders the initial UI correctly', () => {
    render(<App />);
    expect(screen.getByText('Scryer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('https://example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analyze content/i })).toBeInTheDocument();
  });

  it('shows URL validation error for invalid URL', async () => {
    render(<App />);
    await submitUrl('invalid-url');
    expect(await screen.findByText('Please enter a valid URL (e.g., http://example.com)')).toBeInTheDocument();
    expect(mockExtractContent).not.toHaveBeenCalled();
  });

  it('handles successful analysis flow with no internal links', async () => {
    render(<App />);
    const testUrl = 'http://example.com';
    mockExtractContent.mockResolvedValueOnce({ title: 'Test Title', text: 'Test text', links: [] });
    
    await submitUrl(testUrl);

    await waitFor(() => {
      expect(mockExtractContent).toHaveBeenCalledWith(testUrl);
    });
    expect(mockExtractMultipleContents).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(mockAnalyzeContent).toHaveBeenCalledWith(
        expect.stringContaining('Primary Page Content (URL: http://example.com):\nTitle: Test Title\nContent: Test text'),
        testUrl
      );
    });
    
    // Check for loading messages during the process
    expect(screen.getByRole('button', { name: /Extracting content from the primary URL.../i })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: /Preparing combined content for AI analysis.../i })).toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('button', { name: /Analyzing all content with AI.../i })).toBeInTheDocument());

    // Final state
    await waitFor(() => expect(screen.getByText('AI Analysis Report Content')).toBeInTheDocument());
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument(); // No error messages
  });

  it('handles successful analysis flow with internal links', async () => {
    render(<App />);
    const testUrl = 'http://example.com/main';
    const links = ['http://example.com/link1', 'http://example.com/link2'];
    mockExtractContent.mockResolvedValueOnce({ title: 'Main Page', text: 'Main content', links });
    mockExtractMultipleContents.mockResolvedValueOnce({
      'http://example.com/link1': { title: 'Link1', text: 'Link1 content', links: [] },
      'http://example.com/link2': { error: 'Failed to fetch Link2' },
    });

    await submitUrl(testUrl);

    await waitFor(() => expect(mockExtractContent).toHaveBeenCalledWith(testUrl));
    await waitFor(() => expect(mockExtractMultipleContents).toHaveBeenCalledWith(links));
    await waitFor(() => {
      expect(mockAnalyzeContent).toHaveBeenCalledWith(
        expect.stringContaining('URL: http://example.com/link1\nTitle: Link1\nContent: Link1 content'),
        testUrl
      );
      expect(mockAnalyzeContent).toHaveBeenCalledWith(
        expect.stringContaining('URL: http://example.com/link2\nError: Failed to extract content - Failed to fetch Link2'),
        testUrl
      );
    });
    
    // Check for loading messages including linked page extraction
    expect(screen.getByRole('button', { name: /Extracting content from the primary URL.../i })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: /Extracting content from 2 linked page\(s\).../i })).toBeInTheDocument());

    await waitFor(() => expect(screen.getByText('AI Analysis Report Content')).toBeInTheDocument());
  });

  it('shows extractionError if extractContent fails', async () => {
    render(<App />);
    mockExtractContent.mockRejectedValueOnce(new Error('Primary extraction failed'));
    await submitUrl('http://example.com');

    await waitFor(() => expect(screen.getByText('Primary extraction failed')).toBeInTheDocument());
    expect(mockAnalyzeContent).not.toHaveBeenCalled();
    expect(screen.queryByText('AI Analysis Report Content')).not.toBeInTheDocument();
  });

  it('shows extractionError if all extractMultipleContents fail, but still proceeds with primary', async () => {
    render(<App />);
    const testUrl = 'http://example.com/main';
    const links = ['http://example.com/link1'];
    mockExtractContent.mockResolvedValueOnce({ title: 'Main Page', text: 'Main content', links });
    mockExtractMultipleContents.mockResolvedValueOnce({
      'http://example.com/link1': { error: 'Failed for link1' },
    });

    await submitUrl(testUrl);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to extract content from any of the 1 linked pages. Analysis will proceed with primary page content only.')).toBeInTheDocument();
    });
    
    // AI analysis should still be called with primary content
    await waitFor(() => {
      expect(mockAnalyzeContent).toHaveBeenCalledWith(
        expect.stringContaining('Primary Page Content (URL: http://example.com/main)'),
        testUrl
      );
    });
    await waitFor(() => expect(screen.getByText('AI Analysis Report Content')).toBeInTheDocument());
  });


  it('shows analysisError if analyzeContent fails', async () => {
    render(<App />);
    mockAnalyzeContent.mockRejectedValueOnce(new Error('AI analysis has failed'));
    await submitUrl('http://example.com');

    await waitFor(() => expect(screen.getByText('AI analysis has failed')).toBeInTheDocument());
    expect(screen.queryByText('AI Analysis Report Content')).not.toBeInTheDocument();
  });
  
  it('shows specific analysisError for API key issue from analyzeContent', async () => {
    render(<App />);
    mockAnalyzeContent.mockRejectedValueOnce(new Error('Gemini API Key is invalid or missing. Please check your configuration.'));
    await submitUrl('http://example.com');

    await waitFor(() => expect(screen.getByText('Gemini API Key is invalid or missing. Please check your configuration.')).toBeInTheDocument());
  });


  it('disables button and shows loading messages during analysis', async () => {
    render(<App />);
    // Make analyzeContent promise never resolve to keep loading state
    mockAnalyzeContent.mockImplementation(() => new Promise(() => {})); 
    
    const analyzeButton = screen.getByRole('button', { name: /analyze content/i });
    await submitUrl('http://example.com');

    expect(analyzeButton).toBeDisabled();
    // Check for initial loading message
    expect(screen.getByRole('button', { name: /Extracting content from the primary URL.../i })).toBeInTheDocument();
    
    // Wait for subsequent loading messages if needed, depending on mock setup
    await waitFor(() => expect(screen.getByRole('button', { name: /Preparing combined content for AI analysis.../i })).toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('button', { name: /Analyzing all content with AI.../i })).toBeInTheDocument());
  });
});
