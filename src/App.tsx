/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Globe, Search, AlertCircle, Brain } from 'lucide-react';
import { extractContent, extractMultipleContents } from './services/contentExtractor'; // Updated import
import { analyzeContent } from './services/geminiService';
import { AnalysisReport } from './components/AnalysisReport';
import { ExtractedContent } from './types'; // Import ExtractedContent type

function App() {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(''); // New state for loading messages
  const [error, setError] = useState('');
  const [extractionError, setExtractionError] = useState('');
  const [analysisError, setAnalysisError] = useState('');
  const [links, setLinks] = useState<string[]>([]);
  // New state for secondary page contents
  const [secondaryPageContents, setSecondaryPageContents] = useState<Record<string, ExtractedContent | { error: string }>>({});

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage('Starting analysis...');
    setError('');
    setExtractionError('');
    setAnalysisError('');
    setAnalysis('');
    setLinks([]);
    setSecondaryPageContents({});

    // URL Validation
    try {
      new URL(url);
    } catch (_) {
      setError('Please enter a valid URL (e.g., http://example.com)');
      setLoading(false);
      setLoadingMessage('');
      return;
    }

    try {
      // Step 1: Extract Initial Content
      setLoadingMessage('Extracting content from the primary URL...');
      const initialContent = await extractContent(url);
      setLinks(initialContent.links);

      // Step 2: Extract Content from Internal Links
      let extractedSecondaryContents: Record<string, ExtractedContent | { error: string }> = {};
      if (initialContent.links && initialContent.links.length > 0) {
        setLoadingMessage(`Extracting content from ${initialContent.links.length} linked page(s)...`);
        extractedSecondaryContents = await extractMultipleContents(initialContent.links);
        setSecondaryPageContents(extractedSecondaryContents);
        // Check if all secondary extractions failed
        const allFailed = Object.values(extractedSecondaryContents).every(res => 'error' in res);
        if (allFailed && initialContent.links.length > 0) {
            setExtractionError(`Failed to extract content from any of the ${initialContent.links.length} linked pages. Analysis will proceed with primary page content only.`);
            // Do not return, proceed with primary content
        }
      }
      
      // Step 3: Prepare Combined Content for AI
      setLoadingMessage('Preparing combined content for AI analysis...');
      let combinedContentString = `Primary Page Content (URL: ${url}):\nTitle: ${initialContent.title}\nContent: ${initialContent.text}\n---\n`;

      if (initialContent.links && initialContent.links.length > 0) {
        combinedContentString += "Linked Page Content:\n";
        for (const linkUrl of initialContent.links) {
          const contentOrError = extractedSecondaryContents[linkUrl];
          if (contentOrError) {
            if ('error' in contentOrError) {
              combinedContentString += `URL: ${linkUrl}\nError: Failed to extract content - ${contentOrError.error}\n---\n`;
            } else {
              combinedContentString += `URL: ${linkUrl}\nTitle: ${contentOrError.title}\nContent: ${contentOrError.text}\n---\n`;
            }
          } else {
            combinedContentString += `URL: ${linkUrl}\nError: Content not found or extraction skipped.\n---\n`;
          }
        }
      }
      combinedContentString += `Overall Internal Links Found on Primary Page:\n${initialContent.links.join('\n')}`;

      // Step 4: Call AI Service
      setLoadingMessage('Analyzing all content with AI...');
      const analysisResult = await analyzeContent(combinedContentString, url);
      setAnalysis(analysisResult);

    } catch (err) { // This catch block now primarily handles errors from initial extractContent or unexpected issues
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = err instanceof Error ? (err as any).message : String(err);
      // Errors from extractMultipleContents are handled above and stored in secondaryPageContents
      // Errors from analyzeContent are caught in its own try...catch if we were to add one, or here if not.
      // For simplicity, we'll assume analyzeContent throws and gets caught here if not handled by its own specific error state.
      if (message.includes('API key not valid')) {
        setAnalysisError('AI analysis failed: Invalid API key.');
      } else if (message.includes('Gemini API')) { // Generic Gemini error from service
        setAnalysisError(message);
      } else if (message.includes('Failed to fetch from proxy') || message.includes('Proxy returned empty') || message.includes('Failed to parse HTML content') || message.includes('Content extraction failed')) {
        setExtractionError(message); // Error from initial content extraction
      }
      else {
        setError(`An unexpected error occurred: ${message}`);
      }
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">Scryer</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* URL Input Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                Enter URL to Analyze
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  id="url"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? loadingMessage || 'Analyzing...' : 'Analyze Content'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
          {extractionError && (
            <div className="mt-4 p-4 bg-red-50 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{extractionError}</h3>
                </div>
              </div>
            </div>
          )}
          {analysisError && (
            <div className="mt-4 p-4 bg-red-50 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{analysisError}</h3>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Analysis Report */}
        <AnalysisReport analysis={analysis} loading={loading} links={links} />

        {/* How it Works - Only show when no analysis is present */}
        {!analysis && !loading && (
          <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">How it Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="mt-4 font-semibold">1. URL Processing</h3>
                <p className="mt-2 text-gray-600">Enter any webpage URL to begin the analysis process</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="mt-4 font-semibold">2. Content Extraction</h3>
                <p className="mt-2 text-gray-600">We extract relevant text and links from the webpage</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="mt-4 font-semibold">3. AI Analysis</h3>
                <p className="mt-2 text-gray-600">Gemini AI analyzes the content and generates insights</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;