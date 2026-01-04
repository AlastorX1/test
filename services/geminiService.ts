
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const API_KEY = process.env.API_KEY || '';

export const analyzeSalesCall = async (audioBase64: string, mimeType: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `
    You are a world-class Sales Performance Coach. 
    Analyze the provided audio of a sales call.
    1. Provide a diarized transcript distinguishing between the "Salesperson" and the "Prospect".
    2. Assess sentiment for each turn on a scale of -1 (Frustrated/Negative) to 1 (Excited/Positive).
    3. Generate a "Coaching Card" with exactly 3 things the salesperson did well (strengths) and 3 missed opportunities.
    4. Calculate metrics: Talk Ratio (percentage), Overall Sentiment, and Engagement Score (0-100).
    
    Output must be strictly valid JSON.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      transcript: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            speaker: { type: Type.STRING, description: "Either 'Salesperson' or 'Prospect'" },
            text: { type: Type.STRING },
            timestamp: { type: Type.STRING, description: "Format M:SS" },
            sentiment: { type: Type.NUMBER, description: "Between -1 and 1" }
          },
          required: ["speaker", "text", "timestamp", "sentiment"]
        }
      },
      coachingCard: {
        type: Type.OBJECT,
        properties: {
          strengths: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["title", "description"]
            }
          },
          missedOpportunities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["title", "description"]
            }
          }
        },
        required: ["strengths", "missedOpportunities"]
      },
      metrics: {
        type: Type.OBJECT,
        properties: {
          talkRatio: {
            type: Type.OBJECT,
            properties: {
              sales: { type: Type.NUMBER },
              prospect: { type: Type.NUMBER }
            },
            required: ["sales", "prospect"]
          },
          overallSentiment: { type: Type.NUMBER },
          engagementScore: { type: Type.NUMBER }
        },
        required: ["talkRatio", "overallSentiment", "engagementScore"]
      }
    },
    required: ["transcript", "coachingCard", "metrics"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        {
          parts: [
            { text: "Analyze this sales call audio and provide the requested intelligence." },
            {
              inlineData: {
                data: audioBase64,
                mimeType: mimeType
              }
            }
          ]
        }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    const resultText = response.text || '{}';
    return JSON.parse(resultText) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze audio. Please check the file and try again.");
  }
};
