
export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface UserAnswer {
  questionId: number;
  selectedOption: number;
}

export interface UserResult {
  walletAddress: string;
  score: number;
  displayName?: string;
  name?: string; // For network participants
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  network: string | null;
}

// Network related types
export interface ServerInfo {
  ip: string;
  port: number;
  participants: number;
}

export interface Participant {
  id: string;
  name: string;
  walletAddress: string;
  status: 'waiting' | 'in-progress' | 'completed';
}

export interface QuizState {
  inProgress: boolean;
  totalParticipants: number;
  finishedParticipants: number;
}

export interface QuizCompletionData {
  walletAddress: string;
  answers: UserAnswer[];
  score: number;
  displayName?: string;
}
