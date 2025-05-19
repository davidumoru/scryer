import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzeContent } from './geminiService';

// Mock @google/generative-ai
const mockGenerateContent = vi.fn();
const mockGetGenerativeModel = vi.fn(() => ({
  generateContent: mockGenerateContent,
}));

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(() => ({
    getGenerativeModel: mockGetGenerativeModel,
  })),
}));

describe('geminiService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call generateContent with the correct prompt structure and return text', async () => {
    const mockResponseText = 'Mocked AI analysis report';
    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => mockResponseText,
      },
    });

    const content = "Primary Page Content (URL: http://example.com):\nTitle: Test\nContent: Test content\n---\nLinked Page Content:\nURL: http://example.com/link1\nTitle: Link1\nContent: Link1 Content\n---\nOverall Internal Links Found on Primary Page:\nhttp://example.com/link1";
    const sourceUrl = 'http://example.com';

    const result = await analyzeContent(content, sourceUrl);

    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-1.0-pro' });
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    
    const calledPrompt = mockGenerateContent.mock.calls[0][0] as string;
    expect(calledPrompt).toContain('You will be provided with content from a primary web page and several pages linked from it.');
    expect(calledPrompt).toContain(`Primary Page Analysis (URL: ${sourceUrl})`);
    expect(calledPrompt).toContain(`Source URL (Primary Page): ${sourceUrl}`);
    expect(calledPrompt).toContain(`Content to analyze:\n      ${content}`);
    expect(result).toBe(mockResponseText);
  });

  it('should throw specific error for invalid API key', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('API key not valid'));
    await expect(analyzeContent('Test content', 'http://example.com'))
      .rejects.toThrow('Gemini API Key is invalid or missing. Please check your configuration.');
  });
  
  it('should throw specific error for invalid API key (alternative message)', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('Invalid API key'));
    await expect(analyzeContent('Test content', 'http://example.com'))
      .rejects.toThrow('Gemini API Key is invalid or missing. Please check your configuration.');
  });

  it('should throw specific error for quota exceeded', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('Quota exceeded'));
    await expect(analyzeContent('Test content', 'http://example.com'))
      .rejects.toThrow('Gemini API quota exceeded. Please try again later or check your quota.');
  });
  
  it('should throw specific error for resource exhausted (quota)', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('Resource has been exhausted'));
    await expect(analyzeContent('Test content', 'http://example.com'))
      .rejects.toThrow('Gemini API quota exceeded. Please try again later or check your quota.');
  });


  it('should throw specific error for safety policy violation', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('Safety policy violation'));
    await expect(analyzeContent('Test content', 'http://example.com'))
      .rejects.toThrow('The content was blocked by the AI for safety reasons.');
  });
  
  it('should throw specific error for content blocked', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('Content blocked due to safety reasons'));
    await expect(analyzeContent('Test content', 'http://example.com'))
      .rejects.toThrow('The content was blocked by the AI for safety reasons.');
  });

  it('should throw specific error for network error', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('Network error, failed to fetch'));
    await expect(analyzeContent('Test content', 'http://example.com'))
      .rejects.toThrow('Could not connect to the Gemini AI service. Please check your network.');
  });
  
  it('should throw specific error for failed to fetch', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('failed to fetch'));
    await expect(analyzeContent('Test content', 'http://example.com'))
      .rejects.toThrow('Could not connect to the Gemini AI service. Please check your network.');
  });

  it('should throw generic Gemini API error if message contains "gemini"', async () => {
    const geminiErrorMessage = 'Gemini API internal error XYZ';
    mockGenerateContent.mockRejectedValueOnce(new Error(geminiErrorMessage));
    await expect(analyzeContent('Test content', 'http://example.com'))
      .rejects.toThrow(`Gemini API error: ${geminiErrorMessage}`);
  });
  
  it('should throw generic Gemini API error if message contains "google generative ai"', async () => {
    const generativeAiErrorMessage = 'Google Generative AI service unavailable';
    mockGenerateContent.mockRejectedValueOnce(new Error(generativeAiErrorMessage));
    await expect(analyzeContent('Test content', 'http://example.com'))
      .rejects.toThrow(`Gemini API error: ${generativeAiErrorMessage}`);
  });


  it('should throw a default model error for unidentified errors', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('Some other random error'));
    await expect(analyzeContent('Test content', 'http://example.com'))
      .rejects.toThrow('The AI model encountered an issue processing the request.');
  });

  it('should handle non-Error instances thrown', async () => {
    mockGenerateContent.mockRejectedValueOnce('A string error, not an Error object');
    await expect(analyzeContent('Test content', 'http://example.com'))
      .rejects.toThrow('The AI model encountered an issue processing the request.');
  });
});
