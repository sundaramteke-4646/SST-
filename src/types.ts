export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // 0, 1, 2, or 3 representing index of options
  explanation: string;
}

export interface Passage {
  id: string;
  title: string;
  subject: 'Constitutional Law' | 'Jurisprudence' | 'Public International Law' | 'Law of Contract' | 'Criminal Law' | 'Other Law';
  text: string;
  questions: Question[];
}

export interface MockTest {
  id: string;
  title: string;
  durationMinutes: number;
  passages: Passage[];
  totalQuestionsCount: number;
}

export interface TestResult {
  id: string;
  testId: string;
  testTitle: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  totalQuestions: number;
  date: string;
  timeSpentSeconds: number;
  percentage: number;
}

export interface UserProfile {
  username: string;
  email: string;
  targetYear: string;
  dailyGoalMinutes: number;
  studyStreakDays: number;
  avatarUrl?: string;
}

export interface User {
  username: string;
  email: string;
  profile: UserProfile;
  completedTests: TestResult[];
  plan?: 'free' | 'basic' | 'premium';
}
