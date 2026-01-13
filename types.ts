export interface SurveyData {
  tenure: string;
  department: string;
  primaryReason: string;
  satisfaction: {
    culture: number;
    compensation: number;
    growth: number;
    leadership: number;
    workLifeBalance: number;
  };
  openEnded: {
    bestThing: string;
    worstThing: string;
    suggestion: string;
  };
  nps: number;
}

export enum Step {
  WELCOME,
  BASIC_INFO,
  PRIMARY_REASON,
  SATISFACTION,
  OPEN_ENDED,
  ANALYSIS
}

export interface AnalysisResult {
  summary: string;
  sentiment: string;
  rootCause: string;
  detailedDiagnosis: string;
  strategies: string[];
}