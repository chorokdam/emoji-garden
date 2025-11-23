import { GoogleGenAI, Type } from "@google/genai";
import { Riddle } from '../types';
import { FALLBACK_RIDDLES } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchRiddles = async (count: number = 5): Promise<Riddle[]> => {
  try {
    if (!process.env.API_KEY) {
      console.warn("No API Key found, using fallback data.");
      return FALLBACK_RIDDLES;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate ${count} distinct emoji riddles for a casual web game in Korean. 
      Target audience: General public (Clean, polite tone).
      Categories: Popular Movies, K-Dramas, K-Pop, Idioms.
      
      Requirements:
      1. 'question': Simple instruction in Korean (e.g. '영화 제목을 맞춰보세요').
      2. 'emojis': 2-5 emojis that clearly represent the answer.
      3. 'correctAnswer': The title or phrase in Korean.
      4. 'wrongOptions': 3 plausible distractors in Korean.
      5. 'category': Category name in Korean (e.g. 영화, 드라마).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              emojis: { type: Type.STRING },
              question: { type: Type.STRING },
              correctAnswer: { type: Type.STRING },
              wrongOptions: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }
              },
              category: { type: Type.STRING }
            },
            required: ["emojis", "question", "correctAnswer", "wrongOptions", "category"]
          }
        }
      }
    });

    if (!response.text) throw new Error("Empty response");

    let jsonString = response.text.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json/, '').replace(/```$/, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```/, '').replace(/```$/, '');
    }
    
    const rawData = JSON.parse(jsonString);
    
    const riddles: Riddle[] = rawData.map((item: any, index: number) => {
      const options = [...item.wrongOptions, item.correctAnswer]
        .sort(() => Math.random() - 0.5);

      return {
        id: `gen-${Date.now()}-${index}`,
        emojis: item.emojis,
        question: item.question,
        correctAnswer: item.correctAnswer,
        options: options,
        category: item.category
      };
    });

    return riddles;

  } catch (error) {
    console.error("Gemini fetch failed:", error);
    return [...FALLBACK_RIDDLES].sort(() => Math.random() - 0.5).slice(0, count);
  }
};
