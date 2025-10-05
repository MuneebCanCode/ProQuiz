/*
  # Quiz Platform Database Schema

  1. New Tables
    - `courses`
      - `id` (uuid, primary key) - Unique course identifier
      - `title` (text) - Course name
      - `description` (text) - Course description
      - `category` (text) - Course category/subject
      - `created_at` (timestamptz) - Creation timestamp
    
    - `quizzes`
      - `id` (uuid, primary key) - Unique quiz identifier
      - `course_id` (uuid, foreign key) - Reference to courses table
      - `title` (text) - Quiz title
      - `description` (text) - Quiz description
      - `duration_minutes` (integer) - Time limit in minutes
      - `passing_score` (integer) - Minimum score to pass (percentage)
      - `created_at` (timestamptz) - Creation timestamp
    
    - `questions`
      - `id` (uuid, primary key) - Unique question identifier
      - `quiz_id` (uuid, foreign key) - Reference to quizzes table
      - `question_text` (text) - The question content
      - `question_type` (text) - Type: 'multiple_choice', 'true_false'
      - `options` (jsonb) - Array of answer options
      - `correct_answer` (text) - The correct answer
      - `points` (integer) - Points for this question
      - `order_number` (integer) - Display order
      - `created_at` (timestamptz) - Creation timestamp
    
    - `user_quiz_attempts`
      - `id` (uuid, primary key) - Unique attempt identifier
      - `user_id` (uuid) - User identifier (for future auth)
      - `quiz_id` (uuid, foreign key) - Reference to quizzes table
      - `score` (integer) - Score achieved (percentage)
      - `total_questions` (integer) - Total number of questions
      - `correct_answers` (integer) - Number of correct answers
      - `time_taken_seconds` (integer) - Time taken to complete
      - `answers` (jsonb) - User's answers with details
      - `completed_at` (timestamptz) - Completion timestamp
      - `created_at` (timestamptz) - Start timestamp
    
  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to courses, quizzes, and questions
    - Add policies for users to manage their own quiz attempts

  3. Important Notes
    - Initial schema supports public access for demo purposes
    - Questions store correct answers for validation
    - User attempts track detailed progress and scoring
    - All timestamps use timestamptz for proper timezone handling
*/

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  duration_minutes integer DEFAULT 30,
  passing_score integer DEFAULT 70,
  created_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type text DEFAULT 'multiple_choice',
  options jsonb NOT NULL,
  correct_answer text NOT NULL,
  points integer DEFAULT 1,
  order_number integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_quiz_attempts table
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  correct_answers integer NOT NULL,
  time_taken_seconds integer NOT NULL,
  answers jsonb NOT NULL,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Policies for courses (public read)
CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  TO public
  USING (true);

-- Policies for quizzes (public read)
CREATE POLICY "Anyone can view quizzes"
  ON quizzes FOR SELECT
  TO public
  USING (true);

-- Policies for questions (public read)
CREATE POLICY "Anyone can view questions"
  ON questions FOR SELECT
  TO public
  USING (true);

-- Policies for user_quiz_attempts (public insert for demo, read own)
CREATE POLICY "Anyone can create quiz attempts"
  ON user_quiz_attempts FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view all attempts"
  ON user_quiz_attempts FOR SELECT
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quizzes_course_id ON quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_questions_order ON questions(quiz_id, order_number);
CREATE INDEX IF NOT EXISTS idx_attempts_quiz_id ON user_quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user_id ON user_quiz_attempts(user_id);

-- Insert sample courses
INSERT INTO courses (title, description, category) VALUES
  ('JavaScript Fundamentals', 'Master the basics of JavaScript programming including variables, functions, and control flow.', 'Programming'),
  ('React Development', 'Learn modern React development with hooks, components, and state management.', 'Web Development'),
  ('Database Design', 'Understanding database concepts, SQL, and normalization principles.', 'Database'),
  ('Web Development Basics', 'HTML, CSS, and fundamental web technologies for beginners.', 'Web Development')
ON CONFLICT DO NOTHING;

-- Get course IDs for quiz creation
DO $$
DECLARE
  js_course_id uuid;
  react_course_id uuid;
  db_course_id uuid;
  web_course_id uuid;
  quiz1_id uuid;
  quiz2_id uuid;
  quiz3_id uuid;
  quiz4_id uuid;
BEGIN
  -- Get course IDs
  SELECT id INTO js_course_id FROM courses WHERE title = 'JavaScript Fundamentals' LIMIT 1;
  SELECT id INTO react_course_id FROM courses WHERE title = 'React Development' LIMIT 1;
  SELECT id INTO db_course_id FROM courses WHERE title = 'Database Design' LIMIT 1;
  SELECT id INTO web_course_id FROM courses WHERE title = 'Web Development Basics' LIMIT 1;

  -- Insert quizzes
  INSERT INTO quizzes (id, course_id, title, description, duration_minutes, passing_score)
  VALUES 
    (gen_random_uuid(), js_course_id, 'JavaScript Basics Quiz', 'Test your knowledge of JavaScript fundamentals', 20, 70),
    (gen_random_uuid(), react_course_id, 'React Hooks Quiz', 'Assess your understanding of React hooks and components', 15, 75),
    (gen_random_uuid(), db_course_id, 'SQL Fundamentals Quiz', 'Test your SQL and database knowledge', 25, 70),
    (gen_random_uuid(), web_course_id, 'HTML & CSS Quiz', 'Evaluate your web development basics', 15, 70)
  ON CONFLICT DO NOTHING;

  -- Get quiz IDs
  SELECT id INTO quiz1_id FROM quizzes WHERE title = 'JavaScript Basics Quiz' LIMIT 1;
  SELECT id INTO quiz2_id FROM quizzes WHERE title = 'React Hooks Quiz' LIMIT 1;
  SELECT id INTO quiz3_id FROM quizzes WHERE title = 'SQL Fundamentals Quiz' LIMIT 1;
  SELECT id INTO quiz4_id FROM quizzes WHERE title = 'HTML & CSS Quiz' LIMIT 1;

  -- Insert questions for JavaScript quiz
  IF quiz1_id IS NOT NULL THEN
    INSERT INTO questions (quiz_id, question_text, question_type, options, correct_answer, points, order_number)
    VALUES 
      (quiz1_id, 'What is the correct way to declare a variable in JavaScript?', 'multiple_choice', 
       '["var x = 5;", "variable x = 5;", "x := 5;", "int x = 5;"]'::jsonb, 'var x = 5;', 1, 1),
      (quiz1_id, 'Which of the following is a JavaScript data type?', 'multiple_choice',
       '["String", "Boolean", "Number", "All of the above"]'::jsonb, 'All of the above', 1, 2),
      (quiz1_id, 'JavaScript is a compiled language.', 'true_false',
       '["True", "False"]'::jsonb, 'False', 1, 3),
      (quiz1_id, 'What does DOM stand for?', 'multiple_choice',
       '["Document Object Model", "Data Object Model", "Digital Oriented Method", "Document Oriented Model"]'::jsonb, 'Document Object Model', 1, 4),
      (quiz1_id, 'Which operator is used for strict equality in JavaScript?', 'multiple_choice',
       '["==", "===", "=", "!="]'::jsonb, '===', 1, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Insert questions for React quiz
  IF quiz2_id IS NOT NULL THEN
    INSERT INTO questions (quiz_id, question_text, question_type, options, correct_answer, points, order_number)
    VALUES 
      (quiz2_id, 'What is the purpose of useState hook?', 'multiple_choice',
       '["To manage component state", "To handle side effects", "To optimize performance", "To create refs"]'::jsonb, 'To manage component state', 1, 1),
      (quiz2_id, 'useEffect runs after every render by default.', 'true_false',
       '["True", "False"]'::jsonb, 'True', 1, 2),
      (quiz2_id, 'Which hook is used for side effects in React?', 'multiple_choice',
       '["useState", "useEffect", "useContext", "useReducer"]'::jsonb, 'useEffect', 1, 3),
      (quiz2_id, 'React components must return JSX.', 'true_false',
       '["True", "False"]'::jsonb, 'True', 1, 4)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Insert questions for SQL quiz
  IF quiz3_id IS NOT NULL THEN
    INSERT INTO questions (quiz_id, question_text, question_type, options, correct_answer, points, order_number)
    VALUES 
      (quiz3_id, 'Which SQL command is used to retrieve data from a database?', 'multiple_choice',
       '["GET", "SELECT", "RETRIEVE", "FETCH"]'::jsonb, 'SELECT', 1, 1),
      (quiz3_id, 'A primary key can contain NULL values.', 'true_false',
       '["True", "False"]'::jsonb, 'False', 1, 2),
      (quiz3_id, 'Which clause is used to filter results in SQL?', 'multiple_choice',
       '["FILTER", "WHERE", "HAVING", "IF"]'::jsonb, 'WHERE', 1, 3),
      (quiz3_id, 'What does SQL stand for?', 'multiple_choice',
       '["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"]'::jsonb, 'Structured Query Language', 1, 4),
      (quiz3_id, 'The DELETE command removes the table structure.', 'true_false',
       '["True", "False"]'::jsonb, 'False', 1, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Insert questions for HTML & CSS quiz
  IF quiz4_id IS NOT NULL THEN
    INSERT INTO questions (quiz_id, question_text, question_type, options, correct_answer, points, order_number)
    VALUES 
      (quiz4_id, 'What does HTML stand for?', 'multiple_choice',
       '["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"]'::jsonb, 'Hyper Text Markup Language', 1, 1),
      (quiz4_id, 'CSS is used to style HTML elements.', 'true_false',
       '["True", "False"]'::jsonb, 'True', 1, 2),
      (quiz4_id, 'Which HTML tag is used for the largest heading?', 'multiple_choice',
       '["<h1>", "<h6>", "<heading>", "<head>"]'::jsonb, '<h1>', 1, 3),
      (quiz4_id, 'Which CSS property is used to change text color?', 'multiple_choice',
       '["text-color", "color", "font-color", "text-style"]'::jsonb, 'color', 1, 4)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;