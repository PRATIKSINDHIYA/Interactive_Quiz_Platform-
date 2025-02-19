export interface Question {
  id: number;
  text: string;
  type: 'multiple-choice' | 'integer';
  options?: string[];
  correctAnswer: string | number;
}

export interface QuizAttempt {
  id: string;
  timestamp: number;
  score: number;
  totalQuestions: number;
  answers: Record<number, string | number>;
  timePerQuestion: Record<number, number>;
}

export interface QuizState {
  currentQuestion: number;
  answers: Record<number, string | number>;
  timeRemaining: number;
  isComplete: boolean;
  timePerQuestion: Record<number, number>;
}