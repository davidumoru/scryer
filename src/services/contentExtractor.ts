/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExtractedContent } from "../types";

export async function extractContent(url: string): Promise<ExtractedContent> {
  try {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    
    // Create a temporary DOM element to parse the HTML
    const doc = new DOMParser().parseFromString(data.contents, 'text/html');
    
    // Extract title
    const title = doc.title || '';
    
    // Extract text content (excluding scripts, styles, etc.)
    const text = Array.from(doc.body.getElementsByTagName('*'))
      .map(element => element.textContent)
      .filter(text => text && text.trim().length > 0)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Extract internal links
    const links = Array.from(doc.getElementsByTagName('a'))
      .map(a => a.href)
      .filter(href => href && href.startsWith(url));
    
    return { title, text, links };
  } catch (error) {
    throw new Error('Failed to extract content from URL');
  }
}