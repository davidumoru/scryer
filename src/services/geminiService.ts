/* eslint-disable @typescript-eslint/no-unused-vars */
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function analyzeContent(content: string, sourceUrl: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
    
    const prompt = `
      You will be provided with content from a primary web page and several pages linked from it.
      Your goal is to analyze all this information and provide a comprehensive report in markdown format.

      The input will be structured as follows:
      Primary Page Content (URL: [primary_url]):
      Title: [primary_title]
      Content: [primary_text]
      ---
      Linked Page Content:
      URL: [link1_url]
      Title: [link1_title]
      Content: [link1_text] 
      (or "Error: [error_message]" if a linked page failed extraction)
      ---
      URL: [link2_url]
      ...
      ---
      Overall Internal Links Found on Primary Page:
      [list of links]

      Please include the following in your markdown report:

      1.  # Overall Website Summary (Based on all provided pages)
          -   Brief overview of the site's apparent purpose and theme.
          -   Key topics and messages conveyed across the analyzed pages.

      2.  # Primary Page Analysis (URL: ${sourceUrl})
          -   Specific summary and purpose of the primary page.
          -   Key topics and content analysis (style, tone, organization) for this page.

      3.  # Linked Pages Overview
          -   For each *successfully extracted* linked page, provide a brief (1-2 sentence) summary of its content or purpose. Note any linked pages where content extraction failed.
          -   General observations about the type of content found on the linked pages.

      4.  # Link Structure & Navigation
          -   Analysis of how the primary page links to the internal pages.
          -   Observations on content flow or user navigation paths suggested by these links.
          -   How effectively the internal linking supports the overall site structure and purpose.

      5.  # Consolidated Recommendations
          -   Actionable content improvement suggestions for the website as a whole.
          -   Overall SEO recommendations considering all analyzed content.
          -   User experience enhancements for navigating between these pages.
      
      Please format the response in clear markdown, using headings, subheadings, bullet points, and bolding where appropriate to ensure a well-structured and readable report.

      Source URL (Primary Page): ${sourceUrl}

      Content to analyze:
      ${content}
    `;
        
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: unknown) {
    let errorMessage = 'The AI model encountered an issue processing the request.';
    if (error instanceof Error) {
      // General check for API key issues (common across Google APIs)
      if (error.message.toLowerCase().includes('api key not valid') || error.message.toLowerCase().includes('invalid api key')) {
        errorMessage = 'Gemini API Key is invalid or missing. Please check your configuration.';
      } 
      // Check for quota exhausted errors
      else if (error.message.toLowerCase().includes('quota exceeded') || error.message.toLowerCase().includes('resource has been exhausted')) {
        errorMessage = 'Gemini API quota exceeded. Please try again later or check your quota.';
      }
      // Check for content safety blocks (this is a guess, actual message might differ)
      else if (error.message.toLowerCase().includes('safety policy violation') || error.message.toLowerCase().includes('content blocked')) {
        errorMessage = 'The content was blocked by the AI for safety reasons.';
      }
      // Check for network-related issues (very generic)
      else if (error.message.toLowerCase().includes('network error') || error.message.toLowerCase().includes('failed to fetch')) {
        errorMessage = 'Could not connect to the Gemini AI service. Please check your network.';
      }
      // If the error is from the Gemini API but not specifically identified, use its message.
      else if (error.message.toLowerCase().includes('gemini') || error.message.toLowerCase().includes('google generative ai')) {
        errorMessage = `Gemini API error: ${error.message}`;
      }
    }
    // For errors not specifically handled, or not Error instances, we keep a generic one.
    // Or, if it's a very generic error, we might just use the default.

    // Log the original error for debugging purposes, if possible in the environment
    // console.error("Gemini API Error:", error); 

    throw new Error(errorMessage);
  }
}