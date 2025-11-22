
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- Helper function to convert file to base64 ---
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};


// --- API Functions ---

export const generateChatResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text;
  } catch (error) {
    console.error("Error in generateChatResponse:", error);
    return "Error: Unable to process your request. The molecular registry might be experiencing high traffic.";
  }
};

export const analyzeImage = async (prompt: string, imageFile: File): Promise<string> => {
    try {
      const imagePart = await fileToGenerativePart(imageFile);
      const textPart = { text: prompt };
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [imagePart, textPart] }],
      });
      return response.text;
    } catch (error) {
      console.error("Error in analyzeImage:", error);
      return "Error: Could not analyze the provided image. Please ensure it is a valid format.";
    }
};

export const runDeepAnalysis = async (prompt: string): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            thinkingConfig: { thinkingBudget: 32768 },
        },
      });
      return response.text;
    } catch (error) {
      console.error("Error in runDeepAnalysis:", error);
      return "Error: Deep analysis failed. The query may be too complex or the connection was interrupted.";
    }
};

export const runWebQuery = async (prompt: string): Promise<{ text: string; sources: any[] }> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            tools: [{googleSearch: {}}],
        },
      });

      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      const sources = groundingMetadata?.groundingChunks?.map(chunk => chunk.web) ?? [];

      return { text: response.text, sources: sources.filter(Boolean) };
    } catch (error) {
      console.error("Error in runWebQuery:", error);
      return { text: "Error: Unable to perform web query. The external data stream is unresponsive.", sources: [] };
    }
};
