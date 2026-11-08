export interface LessonPlan {
  id: string;
  schoolId?: string;
  academicYear?: string;
  subject: string;
  grade: string;
  date: string;
  duration: string;
  chapter: string;
  topic: string;
  objKnowledge: string;
  objSkills: string;
  objAttitude: string;
  materials: string;
  references: string;
  step1Teacher: string;
  step1Student: string;
  step2Teacher: string;
  step2Student: string;
  step3Content: string;
  step3Teacher: string;
  step3Student: string;
  step4Teacher: string;
  step4Student: string;
  step5Teacher: string;
  step5Student: string;
}

export interface Subject {
  id: string;
  schoolId?: string;
  name: string;
  code?: string;
  grades?: string[];
  color?: string;
  description?: string;
  totalHours?: number;
  createdAt?: string;
}

export interface School {
  id: string;
  name: string;
  code?: string;
  level?: string;
  province?: string;
  district?: string;
  phone?: string;
  email?: string;
  logo?: string;
}

export interface AcademicYear {
  id: string;
  name: string;
  code: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  grade: string;
  due: string;
  total: number;
  submitted: number;
  status: "pending" | "completed";
}

export interface Resource {
  id: string;
  title: string;
  type: "pdf" | "ppt" | "doc" | "video";
  icon: string;
  color: string;
  size: string;
}

export type QuestionType = "mcq" | "truefalse" | "short" | "essay";
export type Difficulty = "easy" | "medium" | "hard";

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  subject: string;
  grade: string;
  chapter: string;
  difficulty: Difficulty;
  content: string;
  options: QuestionOption[]; // សម្រាប់ mcq
  correctAnswer: string; // សម្រាប់ short / truefalse
  explanation: string;
  points: number;
  createdAt: string;
  tags: string[];
}

export interface ExamQuestion extends Question {
  order: number;
  examPoints: number; // ពិន្ទុក្នុងវិញ្ញាសា (អាចខុសពីធនាគារ)
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  grade: string;
  duration: number; // នាទី
  totalPoints: number;
  instructions: string;
  questions: ExamQuestion[];
  createdAt: string;
  status: "draft" | "published";
}
