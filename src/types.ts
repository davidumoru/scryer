export interface AnalysisResult {
  title: string;
  summary: string;
  internalLinks: string[];
  keyTopics: string[];
  sentiment: string;
  readabilityScore: number;
}

export interface ExtractedContent {
  title: string;
  text: string;
  links: string[];
}