import { ExtractedContent } from "../types";

export async function extractContent(url: string): Promise<ExtractedContent> {
  let originalError: Error | null = null;
  try {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch from proxy: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.contents) {
      throw new Error("Proxy returned empty or invalid content for the URL.");
    }
    
    let doc;
    try {
      doc = new DOMParser().parseFromString(data.contents, 'text/html');
    } catch (e) {
      originalError = e instanceof Error ? e : new Error(String(e));
      throw new Error(`Failed to parse HTML content: ${originalError.message}`);
    }
    
    // Extract title
    const title = doc.title || '';
    
    // Basic Main Content Heuristic
    let mainContentElement: HTMLElement | null = doc.querySelector('main');
    if (!mainContentElement) {
      mainContentElement = doc.querySelector('article');
    }
    const baseElement = mainContentElement || doc.body;

    // Exclude common non-content tags
    const selectorsToExclude = ['nav', 'footer', 'aside', 'script', 'style', 'header', '.advertisement', '.ad', '#ad', '#ads'];
    selectorsToExclude.forEach(selector => {
      baseElement.querySelectorAll(selector).forEach(el => el.remove());
    });
    
    // Extract text content
    const text = (baseElement.textContent || '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Refine Internal Link Extraction
    const pageOrigin = new URL(url).origin;
    const links: string[] = [];
    Array.from(doc.getElementsByTagName('a')).forEach(a => {
      const href = a.getAttribute('href');
      if (href) {
        try {
          const absoluteUrl = new URL(href, url).href; // Resolve relative URLs
          if (new URL(absoluteUrl).origin === pageOrigin) {
            links.push(absoluteUrl);
          }
        } catch (e) {
          // Ignore malformed URLs, but log for potential debugging
          // console.warn(`Malformed href "${href}" on page ${url}: ${e}`);
        }
      }
    });
    
    return { title, text, links };

  } catch (error) {
    if (error instanceof Error && (
        error.message.startsWith('Failed to fetch from proxy:') || 
        error.message.startsWith('Proxy returned empty or invalid content') ||
        error.message.startsWith('Failed to parse HTML content:')
      )) {
      throw error; // Re-throw specific, already well-formed errors
    }
    // Preserve original error if it was captured (e.g. from DOM parsing)
    const finalError = originalError || (error instanceof Error ? error : new Error(String(error)));
    throw new Error(`Content extraction failed: ${finalError.message}`);
  }
}

export async function extractMultipleContents(
  urls: string[]
): Promise<Record<string, ExtractedContent | { error: string }>> {
  const results: Record<string, ExtractedContent | { error: string }> = {};

  await Promise.all(
    urls.map(async (url) => {
      try {
        // Basic URL validation before attempting to extract
        // This prevents malformed URLs from breaking the URL constructor in extractContent
        // or causing Promise.all to reject prematurely if not handled inside extractContent
        new URL(url); 
        const content = await extractContent(url);
        results[url] = content;
      } catch (error) {
        if (error instanceof Error) {
          results[url] = { error: error.message };
        } else {
          results[url] = { error: 'An unknown error occurred during extraction.' };
        }
      }
    })
  );

  return results;
}