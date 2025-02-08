import { Brain } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { LinkAnalysis } from './LinkAnalysis';

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

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-500" />
          Analysis Report
        </h2>
        
        <div className="prose prose-blue max-w-none">
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </div>
      </div>

      {links.length > 0 && <LinkAnalysis links={links} />}
    </>
  );
}