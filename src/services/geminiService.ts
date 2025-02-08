/* eslint-disable @typescript-eslint/no-unused-vars */
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function analyzeContent(content: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      Analyze the following web content and provide a detailed report in markdown format including:

      1. # Summary
         - Brief overview of the content
         - Main purpose of the page

      2. # Key Topics
         - List the main topics and themes
         - Highlight important concepts

      3. # Content Analysis
         - Writing style and tone
         - Content organization
         - Key sections breakdown

      4. # Link Structure
         - Analysis of internal linking
         - Navigation patterns
         - Content hierarchy insights

      5. # Recommendations
         - Content improvement suggestions
         - SEO recommendations
         - User experience enhancements

      Please format the response in clear markdown with appropriate headings, lists, and emphasis.
      
      Content to analyze:
      ${content}
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error('Failed to analyze content with Gemini AI');
  }
}