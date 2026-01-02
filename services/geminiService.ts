import { GoogleGenAI, Type, Schema } from "@google/genai";
import { OptimizationResult } from '../types';

// Initialize the client. 
// NOTE: process.env.API_KEY is expected to be available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    matchScore: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 indicating how well the resume matches the job description.",
    },
    summary: {
      type: Type.STRING,
      description: "A brief executive summary of the analysis.",
    },
    missingKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of critical keywords or skills found in the JD but missing from the resume.",
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of strong points in the resume.",
    },
    weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of weak points or gaps in the resume.",
    },
    suggestedImprovements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          section: { type: Type.STRING, description: "The section of the resume (e.g., Professional Summary, Experience)." },
          original: { type: Type.STRING, description: "A brief snippet or description of the current content." },
          improved: { type: Type.STRING, description: "A rewritten version or specific actionable advice." },
          reason: { type: Type.STRING, description: "Why this change is recommended." },
        },
        required: ["section", "original", "improved", "reason"],
      },
      description: "Specific actionable suggestions to improve the resume.",
    },
  },
  required: ["matchScore", "summary", "missingKeywords", "strengths", "weaknesses", "suggestedImprovements"],
};

export const analyzeResume = async (resumeText: string, jobDescription: string): Promise<OptimizationResult> => {
  if (!resumeText || !jobDescription) {
    throw new Error("Both resume and job description are required.");
  }

  try {
    const prompt = `
      Act as an expert Technical Recruiter and ATS (Applicant Tracking System) specialist.
      
      I will provide you with a Resume and a Job Description (JD).
      Your goal is to analyze the resume against the JD and provide actionable feedback to increase the candidate's chances of getting an interview.
      
      RESUME:
      ${resumeText}
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      Analyze strict keyword matching, tone, impact, and relevance.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a helpful career coach that provides constructive, specific, and encouraging feedback.",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    const result = JSON.parse(text) as OptimizationResult;
    return result;

  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
};
