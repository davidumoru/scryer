import { Brain, ClipboardCopy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { LinkAnalysis } from './LinkAnalysis';
import { useState } from 'react';

interface Props {
  analysis: string;
  loading: boolean;
  links?: string[];
}

export function AnalysisReport({ analysis, loading, links = [] }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      // Optionally, set an error state here to inform the user
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 mt-6 relative">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-500" />
            Analysis Report
          </h2>
          <button
            onClick={handleCopy}
            className={`p-2 rounded-md text-sm flex items-center gap-2 transition-all duration-150 ease-in-out
              ${copied 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <ClipboardCopy className="w-4 h-4" />
                Copy Report
              </>
            )}
          </button>
        </div>
        
        <div className="prose prose-blue dark:prose-invert max-w-none">
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </div>
      </div>

      {links.length > 0 && <LinkAnalysis links={links} />}
    </>
  );
}