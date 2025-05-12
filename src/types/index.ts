
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
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  network: string | null;
}
