import { GoogleGenAI } from '@google/genai';

// Gemini SDK client initialized with runtime environment key
// In AI Studio frontend preview, Vite exposes process.env or import.meta.env
const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || 
               (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) || 
               '';

export const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// Fast, intelligent model recommendation
export const GEMINI_MODEL = 'gemini-2.5-flash';
