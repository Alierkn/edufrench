/** Sanity eduExercise (GROQ ile genişletilmiş) */
export type CmsExerciseOption = { text?: string; isCorrect?: boolean };

export type CmsExercise = {
  _id: string;
  title?: string;
  slug?: string;
  exerciseType?: string;
  content?: string;
  mediaUrl?: string | null;
  options?: CmsExerciseOption[];
};

/** Sanity eduModule */
export type CmsModule = {
  _id: string;
  title: string;
  slug?: string;
  moduleType?: string;
  level?: string;
  description?: string | null;
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
