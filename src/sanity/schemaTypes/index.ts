import type { SchemaTypeDefinition } from "sanity";
import { eduExercise } from "./eduExercise";
import { eduModule } from "./eduModule";
import { vocabTopic } from "./vocabTopic";

export const schemaTypes: SchemaTypeDefinition[] = [eduExercise, eduModule, vocabTopic];
