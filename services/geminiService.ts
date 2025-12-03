import { GoogleGenAI, Type } from "@google/genai";
import { Theme } from "../types";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateTheme = async (prompt: string): Promise<Theme> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const model = "gemini-2.5-flash";
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `You are a creative game designer and language teacher. 
      Generate a visual theme for a snake game based on this concept: "${prompt}".
      
      Crucially, generate a list of 6-8 Cantonese vocabulary words related to this theme for the user to learn.
      
      The snake needs a head color and a body color (hex codes).
      The background should be a hex code that contrasts well with the snake.
      Provide a particle color (hex) for effects.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "A creative short name for the theme" },
            snakeHeadColor: { type: Type.STRING, description: "Hex color for snake head" },
            snakeBodyColor: { type: Type.STRING, description: "Hex color for snake body" },
            backgroundColor: { type: Type.STRING, description: "Hex color for the canvas background" },
            particleColor: { type: Type.STRING, description: "Hex color for explosion particles" },
            vocabulary: {
                type: Type.ARRAY,
                description: "List of vocabulary words related to the theme",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        emoji: { type: Type.STRING, description: "A single representative emoji" },
                        cantonese: { type: Type.STRING, description: "Traditional Chinese characters (e.g. 蘋果)" },
                        jyutping: { type: Type.STRING, description: "Cantonese Romanization (e.g. ping4 gwo2)" },
                        english: { type: Type.STRING, description: "English translation" }
                    },
                    required: ["emoji", "cantonese", "jyutping", "english"]
                }
            }
          },
          required: ["name", "snakeHeadColor", "snakeBodyColor", "backgroundColor", "vocabulary", "particleColor"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as Theme;
  } catch (error) {
    console.error("Gemini Theme Generation Error:", error);
    throw error;
  }
};