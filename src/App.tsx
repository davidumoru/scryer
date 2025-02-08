/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Globe, Search, AlertCircle, Brain } from 'lucide-react';
import { extractContent } from './services/contentExtractor';
import { analyzeContent } from './services/geminiService';
import { AnalysisReport } from './components/AnalysisReport';

function App() {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [links, setLinks] = useState<string[]>([]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnalysis('');
    setLinks([]);

    try {
      const content = await extractContent(url);
      setLinks(content.links);
      const analysisResult = await analyzeContent(
        `Title: ${content.title}\n\nContent: ${content.text}\n\nInternal Links: ${content.links.join('\n')}`
      );
      setAnalysis(analysisResult);
    } catch (err) {
      setError('Failed to analyze the URL. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">URL Content Analyzer</h1>
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
              {loading ? 'Analyzing...' : 'Analyze Content'}
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