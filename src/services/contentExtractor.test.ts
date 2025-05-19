import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { extractContent, extractMultipleContents } from './contentExtractor';
import { ExtractedContent } from '../types';

// Mocking global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Mocking DOMParser
const mockParseFromString = vi.fn();
const mockQuerySelector = vi.fn();
const mockGetElementsByTagName = vi.fn();
const mockRemove = vi.fn();

class MockDOMElement {
  textContent = '';
  title = '';
  body = {
    getElementsByTagName: mockGetElementsByTagName,
    textContent: 'Body text content with nav footer and script.',
    querySelector: mockQuerySelector,
    querySelectorAll: vi.fn(() => ({
      forEach: (callback: (el: { remove: () => void }) => void) => {
        // Simulate removing elements by having their 'remove' called
        callback({ remove: mockRemove }); 
      }
    }))
  };
  constructor(html = '') {
    if (html.includes('<title>Test Title</title>')) {
      this.title = 'Test Title';
    }
    if (html.includes('Malformed HTML')) {
      // Simulate malformed HTML causing textContent to be null or problematic
      this.textContent = null as any; // Cast to any to bypass null check if needed for test
      this.body.textContent = null as any;
    }
     if (html.includes('Main content here')) {
      this.body.textContent = 'Main content here Nav content Footer content';
    }
  }
  getElementsByTagName = mockGetElementsByTagName;
  querySelector = mockQuerySelector;
}

vi.stubGlobal('DOMParser', class {
  parseFromString = (html: string, type: string) => {
    mockParseFromString(html, type);
    if (html === 'malformed_html_trigger_parse_error') {
      throw new Error('Simulated DOM parsing error');
    }
    const doc = new MockDOMElement(html);
    // Simulate querySelector for main/article
    if (html.includes('<main>Main content here</main>')) {
      mockQuerySelector.mockImplementation((selector: string) => {
        if (selector === 'main') return { textContent: 'Main content here', querySelectorAll: vi.fn(() => ({ forEach: vi.fn()})) };
        return null;
      });
    } else if (html.includes('<article>Article content here</article>')) {
       mockQuerySelector.mockImplementation((selector: string) => {
        if (selector === 'article') return { textContent: 'Article content here', querySelectorAll: vi.fn(() => ({ forEach: vi.fn()})) };
        return null;
      });
    } else {
       mockQuerySelector.mockReturnValue(null); // Default no main/article
    }
    return doc;
  }
});


describe('contentExtractor', () => {
  beforeEach(() => {
    vi.resetAllMocks(); // Reset mocks before each test

    // Default mock for getElementsByTagName (<a> links)
    mockGetElementsByTagName.mockReturnValue([
      { href: 'http://example.com/internal1', getAttribute: (attr: string) => 'http://example.com/internal1' },
      { href: '/internal2', getAttribute: (attr: string) => '/internal2' }, // relative
      { href: 'http://another.com/external', getAttribute: (attr: string) => 'http://another.com/external' },
      { href: 'malformed-url', getAttribute: (attr: string) => 'malformed-url' },
      { href: null, getAttribute: (attr: string) => null },
    ]);
    // Default mock for querySelector (main/article)
    mockQuerySelector.mockImplementation((selector: string) => {
      if (selector === 'main') {
        return { 
          textContent: 'Main content here. Nav content. Footer content. Script content.', 
          querySelectorAll: vi.fn((sel: string) => {
            if (['nav', 'footer', 'aside', 'script', 'style', 'header'].includes(sel)) {
              return [{ remove: mockRemove }];
            }
            return [];
          }),
          remove: mockRemove // In case main itself is removed by a selector
        };
      }
      return null;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('extractContent', () => {
    it('should extract title, text, and internal links successfully', async () => {
      const htmlContent = '<title>Test Title</title><main>Main content here. <a href="/internal2">Internal Link 2</a></main><footer>Footer</footer>';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ contents: htmlContent }),
      });
       mockQuerySelector.mockImplementation((selector: string) => {
        if (selector === 'main') {
            return { 
                textContent: 'Main content here. Internal Link 2', 
                querySelectorAll: vi.fn().mockImplementation(() => ({ forEach: vi.fn() })),
                remove: mockRemove
            };
        }
        return null;
      });


      const result = await extractContent('http://example.com');
      expect(result.title).toBe('Test Title');
      expect(result.text).toBe('Main content here. Internal Link 2');
      expect(result.links).toEqual(['http://example.com/internal1', 'http://example.com/internal2']);
      expect(mockParseFromString).toHaveBeenCalledWith(htmlContent, 'text/html');
    });

    it('should use article if main is not present', async () => {
      const htmlContent = '<title>Article Page</title><article>Article content here</article>';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ contents: htmlContent }),
      });
      mockQuerySelector.mockImplementation((selector: string) => {
        if (selector === 'main') return null;
        if (selector === 'article') return { 
            textContent: 'Article content here', 
            querySelectorAll: vi.fn().mockImplementation(() => ({ forEach: vi.fn() })),
            remove: mockRemove
        };
        return null;
      });
      const result = await extractContent('http://example.com');
      expect(result.title).toBe('Article Page');
      expect(result.text).toBe('Article content here');
    });
    
    it('should use body if main and article are not present and exclude non-content tags', async () => {
        const htmlContent = '<title>Body Page</title><body>Body text. <nav>Nav stuff</nav> <a href="/link3">Link 3</a> <footer>Footer stuff</footer></body>';
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ contents: htmlContent }),
        });
  
        // Simulate querySelector not finding main or article
        mockQuerySelector.mockReturnValue(null);
        
        // Simulate querySelectorAll on body to remove nav/footer
        const mockBodyElement = {
            textContent: 'Body text. Nav stuff Link 3 Footer stuff',
            querySelectorAll: vi.fn((selector: string) => {
                if (['nav', 'footer', 'aside', 'script', 'style', 'header'].some(s => selector.includes(s))) {
                    return [{ remove: mockRemove }];
                }
                return [];
            }),
            remove: mockRemove
        };
        
        // Mock the DOMParser to return a document where body is this mockBodyElement
        vi.spyOn(global, 'DOMParser').mockImplementation(class {
            parseFromString() {
                return {
                    title: 'Body Page',
                    body: mockBodyElement,
                    querySelector: mockQuerySelector, // this is for main/article check
                    getElementsByTagName: mockGetElementsByTagName 
                };
            }
        } as any);

        const result = await extractContent('http://example.com');
        expect(result.title).toBe('Body Page');
        // The textContent of body is "Body text. Nav stuff Link 3 Footer stuff"
        // The heuristic should remove "Nav stuff" and "Footer stuff"
        // However, the current mock setup for text extraction is simplified.
        // A more robust test would involve asserting the calls to querySelectorAll and remove.
        // For now, we assume the heuristic works if the structure is right.
        // The key is that `baseElement.textContent` is called on the modified body.
        // Let's refine the text content based on the heuristic logic
        expect(result.text.trim()).not.toContain('Nav stuff');
        expect(result.text.trim()).not.toContain('Footer stuff');
        expect(result.text.trim()).toContain('Body text.'); // What remains after heuristic
        expect(result.text.trim()).toContain('Link 3');
      });

    it('should throw error for network failures', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      await expect(extractContent('http://example.com')).rejects.toThrow('Content extraction failed: Network error');
    });

    it('should throw error if response not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({}),
      });
      await expect(extractContent('http://example.com')).rejects.toThrow('Failed to fetch from proxy: 404 Not Found');
    });

    it('should throw error if data.contents is missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}), // No contents property
      });
      await expect(extractContent('http://example.com')).rejects.toThrow('Proxy returned empty or invalid content for the URL.');
    });
    
    it('should throw specific error for malformed HTML during parsing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ contents: 'malformed_html_trigger_parse_error' }),
      });
      // The DOMParser mock is set up to throw when html is 'malformed_html_trigger_parse_error'
      await expect(extractContent('http://example.com')).rejects.toThrow('Failed to parse HTML content: Simulated DOM parsing error');
    });
  });

  describe('extractMultipleContents', () => {
    // For these tests, we mock extractContent itself to simplify
    const mockExtractContent = vi.fn();
    vi.mock('./contentExtractor', async (importOriginal) => {
        const original = await importOriginal<typeof import('./contentExtractor')>();
        return {
            ...original,
            extractContent: mockExtractContent, // our mock for this suite
        };
    });


    beforeEach(() => {
        mockExtractContent.mockReset();
    });

    it('should process multiple URLs, returning content and errors', async () => {
      const urls = ['http://success.com', 'http://fail.com', 'http://another.com'];
      mockExtractContent
        .mockImplementation(async (url: string) => {
          if (url === 'http://success.com') {
            return { title: 'Success', text: 'Content', links: [] } as ExtractedContent;
          } else if (url === 'http://fail.com') {
            throw new Error('Failed extraction');
          } else if (url === 'http://another.com') {
             return { title: 'Another', text: 'More Content', links: ['/link'] } as ExtractedContent;
          }
          throw new Error('Should not reach here');
        });

      // We need to call the original extractMultipleContents, not a mocked one
      const originalModule = await vi.importActual<typeof import('./contentExtractor')>('./contentExtractor');
      const result = await originalModule.extractMultipleContents(urls);
      
      expect(result['http://success.com']).toEqual({ title: 'Success', text: 'Content', links: [] });
      expect(result['http://fail.com']).toEqual({ error: 'Failed extraction' });
      expect(result['http://another.com']).toEqual({ title: 'Another', text: 'More Content', links: ['/link'] });
      expect(mockExtractContent).toHaveBeenCalledTimes(3);
    });

    it('should handle malformed URLs passed to extractMultipleContents', async () => {
      const urls = ['http://valid.com', 'invalid-url-directly'];
      mockExtractContent.mockImplementation(async (url: string) => {
        if (url === 'http://valid.com') {
          return { title: 'Valid', text: 'Valid Content', links: [] };
        }
        // extractContent shouldn't be called for 'invalid-url-directly' if new URL() check fails
        throw new Error('extractContent called unexpectedly'); 
      });

      const originalModule = await vi.importActual<typeof import('./contentExtractor')>('./contentExtractor');
      const result = await originalModule.extractMultipleContents(urls);

      expect(result['http://valid.com']).toEqual({ title: 'Valid', text: 'Valid Content', links: [] });
      // The error message for 'invalid-url-directly' comes from `new URL(url)` failing
      expect(result['invalid-url-directly']?.error).toMatch(/Invalid URL/i); 
      expect(mockExtractContent).toHaveBeenCalledTimes(1); // Only for valid.com
      expect(mockExtractContent).toHaveBeenCalledWith('http://valid.com');
    });
  });
});
