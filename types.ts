export interface OptimizationResult {
  matchScore: number;
  summary: string;
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  suggestedImprovements: Array<{
    section: string;
    original: string;
    improved: string;
    reason: string;
  }>;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface AnalysisState {
  status: AnalysisStatus;
  result: OptimizationResult | null;
  error: string | null;
}