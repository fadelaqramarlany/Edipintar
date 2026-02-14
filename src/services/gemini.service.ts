
import { Injectable } from '@angular/core';
import { GoogleGenAI, Type, SchemaType } from '@google/genai';

export interface StudySection {
  heading: string;
  content: string;
}

export interface StudyGuide {
  title: string;
  introduction: string;
  sections: StudySection[];
  summary: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] });
  }

  async generateStudyMaterial(level: string, subject: string, topic: string): Promise<StudyGuide> {
    const prompt = `Buatkan materi belajar yang menarik, ringkas, dan mudah dipahami untuk siswa tingkat ${level} mata pelajaran ${subject} dengan topik: "${topic}". Gunakan Bahasa Indonesia yang baik dan edukatif.`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Judul materi menarik" },
            introduction: { type: Type.STRING, description: "Pengantar singkat tentang topik" },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  heading: { type: Type.STRING },
                  content: { type: Type.STRING, description: "Isi materi, bisa beberapa paragraf" }
                }
              }
            },
            summary: { type: Type.STRING, description: "Ringkasan atau poin kunci untuk diingat" }
          },
          required: ["title", "introduction", "sections", "summary"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error('No content generated');
    return JSON.parse(text) as StudyGuide;
  }

  async generateQuiz(level: string, subject: string, topic: string): Promise<Quiz> {
    const prompt = `Buatkan kuis pilihan ganda (5 soal) untuk siswa tingkat ${level} mata pelajaran ${subject} topik "${topic}". Soal harus bervariasi kesulitannya. Berikan penjelasan pembahasannya.`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Judul Kuis" },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Array of 4 options"
                  },
                  correctIndex: { type: Type.INTEGER, description: "Index (0-3) of the correct answer" },
                  explanation: { type: Type.STRING, description: "Pembahasan kenapa jawaban itu benar" }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error('No content generated');
    return JSON.parse(text) as Quiz;
  }
}
