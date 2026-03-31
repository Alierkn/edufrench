/** Sanity eduExercise (GROQ ile genişletilmiş) */
export type CmsExerciseOption = { text?: string; isCorrect?: boolean };

export type CmsExercise = {
  _id: string;
  title?: string;
  slug?: string;
  exerciseType?: string;
  content?: string;
  mediaUrl?: string | null;
  hint?: string;
  feedbackCorrect?: string;
  feedbackWrong?: string;
  sortOrder?: number;
  options?: CmsExerciseOption[];
};

/** Sanity eduModule */
export type CmsModule = {
  _id: string;
  title: string;
  slug?: string;
  subtitle?: string;
  moduleType?: string;
  level?: string;
  description?: string | null;
  estimatedMinutes?: number;
  tags?: string[];
  coverUrl?: string | null;
  sortOrder?: number;
  targetGrades?: string[];
  targetSchools?: string[];
  exercises?: CmsExercise[] | null;
};

export type VocabCard = {
  frontFr?: string;
  backTr?: string;
  example?: string;
};

export type VocabTopic = {
  _id: string;
  title: string;
  slug?: string;
  summary?: string;
  level?: string;
  targetGrades?: string[];
  targetSchools?: string[];
  cards?: VocabCard[] | null;
};
