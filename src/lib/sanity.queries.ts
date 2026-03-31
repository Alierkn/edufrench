/** Yayında modüller; egzersiz referansları genişletilir (GROQ) */
export const modulesWithExercisesQuery = `
  *[_type == "eduModule" && isActive == true] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    moduleType,
    level,
    description,
    targetGrades,
    targetSchools,
    "exercises": exercises[]-> {
      _id,
      title,
      "slug": slug.current,
      exerciseType,
      content,
      "mediaUrl": media.asset->url,
      options
    }
  }
`;

export const vocabTopicsQuery = `
  *[_type == "vocabTopic"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    level,
    targetGrades,
    cards
  }
`;
