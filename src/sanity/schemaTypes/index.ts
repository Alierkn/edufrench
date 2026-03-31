import type { SchemaTypeDefinition } from "sanity";
import { appCopy } from "./appCopy";
import { eduExercise } from "./eduExercise";
import { eduModule } from "./eduModule";
import { grammarSpotlight } from "./grammarSpotlight";
import { legalPage } from "./legalPage";
import { siteSettings } from "./siteSettings";
import { vocabTopic } from "./vocabTopic";
import { blockContent } from "./objects/blockContent";
import { footerColumn } from "./objects/footerColumn";
import { learningAreaCopy } from "./objects/learningAreaCopy";
import { navItem } from "./objects/navItem";
import { onboardingOption } from "./objects/onboardingOption";
import { onboardingStepCopy } from "./objects/onboardingStepCopy";
import { seo } from "./objects/seo";

const objects: SchemaTypeDefinition[] = [
  blockContent,
  seo,
  navItem,
  footerColumn,
  learningAreaCopy,
  onboardingOption,
  onboardingStepCopy,
];

const documents: SchemaTypeDefinition[] = [
  siteSettings,
  appCopy,
  eduExercise,
  eduModule,
  vocabTopic,
  grammarSpotlight,
  legalPage,
];

export const schemaTypes: SchemaTypeDefinition[] = [...objects, ...documents];
