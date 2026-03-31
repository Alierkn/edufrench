/** CE / CO / PE / PO için CMS ve Prisma ortak görünümü */
export type UnifiedExerciseOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type UnifiedExercise = {
  id: string;
  content: string;
  mediaUrl?: string | null;
  exerciseType?: string;
  options: UnifiedExerciseOption[];
};

export type UnifiedLearningModule = {
  id: string;
  source: "cms" | "prisma";
  title: string;
  level: string;
  description: string | null;
  type: string;
  exercises: UnifiedExercise[];
};
