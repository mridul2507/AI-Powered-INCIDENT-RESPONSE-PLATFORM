import { GoogleGenAI } from "@google/genai";

export function getAI() { 
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });
}