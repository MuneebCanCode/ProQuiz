import { useEffect, useState } from 'react';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { Course, Quiz } from '../types/quiz';
import { quizService } from '../services/quizService';
import { CourseCard } from './CourseCard';
import { QuizCard } from './QuizCard';

interface CourseSelectionProps {
  onStartQuiz: (quizId: string) => void;
}

export function CourseSelection({ onStartQuiz }: CourseSelectionProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [bestScores, setBestScores] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadQuizzes(selectedCourse.id);
    }
  }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await quizService.getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuizzes = async (courseId: string) => {
    try {
      setLoading(true);
      const data = await quizService.getQuizzesByCourse(courseId);
      setQuizzes(data);

      const scores = new Map<string, number>();
      for (const quiz of data) {
        const bestScore = await quizService.getUserBestScore(quiz.id);
        if (bestScore !== null) {
          scores.set(quiz.id, bestScore);
        }
      }
      setBestScores(scores);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
    }
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setQuizzes([]);
    setBestScores(new Map());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Platform</h1>
          <p className="text-gray-600 text-lg">
            {selectedCourse
              ? `Select a quiz from ${selectedCourse.title}`
              : 'Select a course to begin your learning journey'}
          </p>
        </div>

        {selectedCourse && (
          <button
            onClick={handleBackToCourses}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </button>
        )}

        {!selectedCourse ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} onSelect={handleCourseSelect} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                bestScore={bestScores.get(quiz.id)}
                onStart={onStartQuiz}
              />
            ))}
          </div>
        )}

        {!selectedCourse && courses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No courses available at the moment.</p>
          </div>
        )}

        {selectedCourse && quizzes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No quizzes available for this course.</p>
          </div>
        )}
      </div>
    </div>
  );
}
