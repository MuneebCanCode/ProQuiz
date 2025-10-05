import { supabase } from '../lib/supabase';
import { Course, Quiz, Question, QuizAttempt, UserAnswer } from '../types/quiz';

export const quizService = {
  async getCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('title');

    if (error) throw error;
    return data || [];
  },

  async getQuizzesByCourse(courseId: string): Promise<Quiz[]> {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at');

    if (error) throw error;
    return data || [];
  },

  async getQuizById(quizId: string): Promise<Quiz | null> {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getQuestionsByQuiz(quizId: string): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('order_number');

    if (error) throw error;
    return data || [];
  },

  async saveQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'created_at' | 'completed_at'>): Promise<QuizAttempt> {
    const { data, error } = await supabase
      .from('user_quiz_attempts')
      .insert({
        user_id: attempt.user_id,
        quiz_id: attempt.quiz_id,
        score: attempt.score,
        total_questions: attempt.total_questions,
        correct_answers: attempt.correct_answers,
        time_taken_seconds: attempt.time_taken_seconds,
        answers: attempt.answers,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getQuizAttempts(quizId?: string): Promise<QuizAttempt[]> {
    let query = supabase
      .from('user_quiz_attempts')
      .select('*')
      .order('completed_at', { ascending: false })
      .limit(10);

    if (quizId) {
      query = query.eq('quiz_id', quizId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getUserBestScore(quizId: string): Promise<number | null> {
    const { data, error } = await supabase
      .from('user_quiz_attempts')
      .select('score')
      .eq('quiz_id', quizId)
      .order('score', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data?.score || null;
  },
};

export const calculateScore = (
  questions: Question[],
  userAnswers: Map<string, string>
): { score: number; correctAnswers: number; details: UserAnswer[] } => {
  let correctAnswers = 0;
  const details: UserAnswer[] = [];

  questions.forEach((question) => {
    const userAnswer = userAnswers.get(question.id) || '';
    const isCorrect = userAnswer === question.correct_answer;

    if (isCorrect) {
      correctAnswers++;
    }

    details.push({
      question_id: question.id,
      selected_answer: userAnswer,
      is_correct: isCorrect,
      time_spent_seconds: 0,
    });
  });

  const score = Math.round((correctAnswers / questions.length) * 100);

  return { score, correctAnswers, details };
};
