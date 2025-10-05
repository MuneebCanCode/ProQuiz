import { BookOpen, ChevronRight } from 'lucide-react';
import { Course } from '../types/quiz';

interface CourseCardProps {
  course: Course;
  onSelect: (courseId: string) => void;
}

export function CourseCard({ course, onSelect }: CourseCardProps) {
  return (
    <div
      onClick={() => onSelect(course.id)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border-2 border-transparent hover:border-blue-500 transform hover:-translate-y-1"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {course.category}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
      </div>
    </div>
  );
}
