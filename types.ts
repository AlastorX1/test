
export interface TranscriptPart {
  speaker: 'Salesperson' | 'Prospect';
  text: string;
  timestamp: string; // e.g., "0:15"
  sentiment: number; // -1 to 1
}

export interface CoachingInsight {
  type: 'strength' | 'opportunity';
  title: string;
  description: string;
}

export interface AnalysisResult {
  transcript: TranscriptPart[];
  coachingCard: {
    strengths: CoachingInsight[];
    missedOpportunities: CoachingInsight[];
  };
  metrics: {
    talkRatio: { sales: number; prospect: number };
    overallSentiment: number;
    engagementScore: number;
  };
}

export enum AppStatus {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  PROCESSING = 'PROCESSING',
  ANALYZED = 'ANALYZED',
  ERROR = 'ERROR'
}
