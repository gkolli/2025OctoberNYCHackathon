import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiA11yIssue, A11yIssue } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: 'A short, descriptive title for the issue.',
      },
      description: {
        type: Type.STRING,
        description: "A detailed explanation of the problem and why it's an issue.",
      },
      severity: {
        type: Type.STRING,
        description: "The severity of the issue: 'Critical', 'High', 'Medium', or 'Low'.",
      },
      type: {
        type: Type.STRING,
        description: "The type of issue: 'Accessibility' or 'Localization'.",
      },
    },
    required: ["title", "description", "severity", "type"],
  },
};

export async function analyzeCodeForA11y(code: string): Promise<A11yIssue[]> {
  try {
    const prompt = `
      You are an expert web accessibility (WCAG) and internationalization (i18n) agent. 
      Analyze the following HTML code snippet. Identify potential issues related to accessibility (like missing alt text on images) and internationalization/localization (like text in a fixed-width container that could cause overflow when translated to a longer language like German).

      Return your findings as a JSON array of objects. Do not return any other text or markdown formatting.

      Here is the code:
      \`\`\`html
      ${code}
      \`\`\`
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const issues: GeminiA11yIssue[] = JSON.parse(jsonText);
    
    // Add a unique ID to each issue for React keys
    // FIX: Added 'status' property to satisfy the A11yIssue type.
    return issues.map((issue, index) => ({
      ...issue,
      id: `issue-${Date.now()}-${index}`,
      status: 'TODO',
    }));

  } catch (error) {
    console.error("Error analyzing code with Gemini:", error);
    throw new Error("Failed to get a valid response from the AI agent.");
  }
}
