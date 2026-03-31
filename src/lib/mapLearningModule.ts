import type { CmsExercise, CmsModule } from "@/types/cms";
import type { UnifiedExercise, UnifiedLearningModule } from "@/types/learning";
import type { Exercise, ExerciseOption, Module } from "@prisma/client";

type PrismaModuleWithExercises = Module & {
  exercises: (Exercise & { options: ExerciseOption[] })[];
};

function mapCmsOptions(ex: CmsExercise): UnifiedExercise["options"] {
  const raw = ex.options ?? [];
  return raw.map((o, i) => ({
    id: `cms-${ex._id}-${i}`,
    text: o.text ?? "",
    isCorrect: Boolean(o.isCorrect),
  }));
}

export function mapCmsModule(m: CmsModule): UnifiedLearningModule {
  const exercises = (m.exercises ?? []).map((ex) => ({
    id: ex._id,
    content: ex.content ?? "",
    mediaUrl: ex.mediaUrl ?? null,
    exerciseType: ex.exerciseType,
    options: mapCmsOptions(ex),
  }));
  return {
    id: m._id,
    source: "cms",
    title: m.title,
    level: m.level ?? "—",
    description: m.description ?? null,
    type: m.moduleType ?? "",
    exercises,
  };
}

export function mapPrismaModule(m: PrismaModuleWithExercises): UnifiedLearningModule {
  return {
    id: m.id,
    source: "prisma",
    title: m.title,
    level: m.level,
    description: m.description,
    type: m.type,
    exercises: m.exercises.map((ex) => ({
      id: ex.id,
      content: ex.content,
      mediaUrl: ex.mediaUrl,
      exerciseType: ex.type,
      options: ex.options.map((o) => ({
        id: o.id,
        text: o.text,
        isCorrect: o.isCorrect,
      })),
    })),
  };
}

function hasMcqOptions(ex: UnifiedExercise): boolean {
  return ex.options.length >= 2;
}

/** Modül tipine göre en az bir kullanılabilir egzersiz var mı */
export function isModuleUsableForType(u: UnifiedLearningModule, moduleType: string): boolean {
  const exs = u.exercises;
  if (!exs.length) return false;
  switch (moduleType) {
    case "CE":
      return exs.some(hasMcqOptions);
    case "CO":
      return exs.some((e) => hasMcqOptions(e));
    case "PE":
      return Boolean(
        u.description?.trim() ||
          exs.some((e) => e.exerciseType === "TEXT" && e.content.trim()) ||
          exs.some((e) => e.content.trim().length > 40)
      );
    case "PO":
      return Boolean(
        u.description?.trim() || exs.some((e) => e.content.trim().length > 10)
      );
    default:
      return true;
  }
}

export function pickExerciseForCE(u: UnifiedLearningModule): UnifiedExercise | null {
  return u.exercises.find(hasMcqOptions) ?? u.exercises[0] ?? null;
}

export function pickExerciseForCO(u: UnifiedLearningModule): UnifiedExercise | null {
  const withAudio = u.exercises.find((e) => e.mediaUrl && hasMcqOptions(e));
  if (withAudio) return withAudio;
  return u.exercises.find(hasMcqOptions) ?? u.exercises[0] ?? null;
}

export function pickPromptForPE(u: UnifiedLearningModule): { title: string; instructions: string } {
  const textEx = u.exercises.find((e) => e.exerciseType === "TEXT");
  if (textEx?.content?.trim()) {
    return { title: u.title, instructions: textEx.content.trim() };
  }
  if (u.description?.trim()) {
    return { title: u.title, instructions: u.description.trim() };
  }
  const first = u.exercises[0];
  return {
    title: u.title,
    instructions: first?.content?.trim() || "Écrivez un texte argumenté (100–150 mots) sur le thème indiqué.",
  };
}

export function pickPromptForPO(u: UnifiedLearningModule): { title: string; instructions: string } {
  if (u.description?.trim()) {
    return { title: u.title, instructions: u.description.trim() };
  }
  const c = u.exercises[0]?.content?.trim();
  if (c) return { title: u.title, instructions: c };
  return {
    title: u.title,
    instructions:
      "Préparez un monologue d’environ 2 minutes en développant votre opinion avec des exemples.",
  };
}

export function randomElement<T>(items: T[]): T | null {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)]!;
}
