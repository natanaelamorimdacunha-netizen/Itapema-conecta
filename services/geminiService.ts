
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getComplaintSuggestion = async (description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Melhore esta reclamação para ser mais profissional e clara para a prefeitura de Itapema: "${description}"`,
      config: {
        systemInstruction: "Você é um assistente de cidadania que ajuda moradores a escreverem reclamações formais e claras para a prefeitura.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return description;
  }
};

export const analyzeImageForComplaint = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Descreva o problema urbano visível nesta imagem e sugira a categoria (Buraco, Lixo, Iluminação, etc.)" }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            suggestedCategory: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
