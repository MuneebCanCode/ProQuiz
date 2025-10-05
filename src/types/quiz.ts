export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
}

export interface Quiz {
  id: string;
  course_id: string;
  title: string;
  description: string;
  duration_minutes: number;
  passing_score: number;
  created_at: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false';
  options: string[];
  correct_answer: string;
  points: number;
  order_number: number;
  created_at: string;
}

export interface UserAnswer {
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
  time_spent_seconds: number;
}

export interface QuizAttempt {
  id: string;
  user_id: string | null;
  quiz_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  time_taken_seconds: number;
  answers: UserAnswer[];
  completed_at: string;
  created_at: string;
}

export interface QuizState {
  quiz: Quiz | null;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Map<string, string>;
  startTime: number;
  questionStartTime: number;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  passed: boolean;
  details: Array<{
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
}
