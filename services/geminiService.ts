
import { GoogleGenAI, Type } from "@google/genai";

// Guideline: Always use direct environment variable access and Named Parameter for apiKey.
// Guideline: Instantiate right before making an API call to ensure the most up-to-date API key is used.

export const getParentingAdvice = async (query: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As an expert child psychologist and digital safety advisor, answer the following parental concern: "${query}". 
      Provide a concise summary and 3-4 actionable bullet points. Format the response as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING, description: 'The main advice text.' },
            suggestions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: 'Actionable steps for the parent.'
            }
          },
          required: ['content', 'suggestions']
        }
      }
    });

    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Advice Error:", error);
    return {
      content: "I'm having trouble connecting to my expert database right now.",
      suggestions: ["Check connection", "Try again later"]
    };
  }
};

export const analyzeAmbientEnvironment = async (transcript: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this intercepted ambient audio transcript for safety risks: "${transcript}".
      Identify:
      1. Environmental context (e.g., classroom, street, party, domestic).
      2. Threat Level (Low, Medium, High).
      3. Key suspicious keywords or phrases.
      4. Summary of the interaction.
      Format as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            context: { type: Type.STRING },
            threatLevel: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING }
          },
          required: ['context', 'threatLevel', 'summary']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Ambient Error:", error);
    return { context: 'Indeterminate', threatLevel: 'Low', summary: 'Audio analysis offline.' };
  }
};

export const analyzeSocialMediaPlatform = async (platform: string, recentActivityExcerpt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Deep safety audit on ${platform}. Data: "${recentActivityExcerpt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING },
            keyRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
            safetyScore: { type: Type.NUMBER },
            urgentAction: { type: Type.STRING }
          },
          required: ['sentiment', 'keyRisks', 'safetyScore', 'urgentAction']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { sentiment: 'Unknown', keyRisks: ['Audit failed'], safetyScore: 50, urgentAction: 'Check manual.' };
  }
};

export const analyzeActivityScreenshot = async (base64Data: string, mimeType: string, query: string = "") => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const imagePart = { inlineData: { data: base64Data, mimeType } };
    const prompt = query 
      ? `Parental concern screenshot analysis: "${query}".`
      : `Analyze this screenshot from a child's device for risks.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            riskLevel: { type: Type.STRING },
            detectedPlatform: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['content', 'riskLevel', 'suggestions']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { content: "Analysis error.", riskLevel: "Unknown", suggestions: [] };
  }
};

export const analyzeCallIntent = async (number: string, transcriptExcerpt: string = "") => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze phone call: "${number}". Transcript: "${transcriptExcerpt}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classification: { type: Type.STRING },
            riskScore: { type: Type.NUMBER },
            action: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ['classification', 'riskScore', 'action', 'reasoning']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { classification: 'Unknown', riskScore: 50, action: 'Monitor', reasoning: 'Metadata failed.' };
  }
};

export const analyzeFileRisk = async (fileName: string, fileSize: string, path: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `File audit: "${fileName}" (${fileSize}) at "${path}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING },
            reason: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          },
          required: ['riskLevel', 'reason', 'recommendation']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { riskLevel: 'Unknown', reason: 'Error scan.', recommendation: 'Manual required.' };
  }
};
