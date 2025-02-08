import React from 'react';
import { BarChart as BarChartIcon, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface LinkAnalysisProps {
  links: string[];
}

export function LinkAnalysis({ links }: LinkAnalysisProps) {
  // Group links by domain
  const domainCounts = links.reduce((acc: Record<string, number>, link: string) => {
    try {
      const domain = new URL(link).hostname;
      acc[domain] = (acc[domain] || 0) + 1;
      return acc;
    } catch {
      return acc;
    }
  }, {});

  const chartData = Object.entries(domainCounts)
    .map(([domain, count]) => ({
      domain: domain || 'unknown',
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BarChartIcon className="w-6 h-6 text-blue-500" />
        Link Analysis
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-4">Link Distribution by Domain</h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ bottom: 90 }}>
                <XAxis 
                  dataKey="domain" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">All Links ({links.length})</h4>
          <div className="bg-gray-50 rounded-lg p-4 max-h-[300px] overflow-y-auto">
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 truncate"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}