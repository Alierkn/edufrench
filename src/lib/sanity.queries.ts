/** Yayında modüller; egzersiz referansları genişletilir (GROQ) */
export const modulesWithExercisesQuery = `
  *[_type == "eduModule" && isActive == true] | order(coalesce(sortOrder, 999) asc, title asc) {
    _id,
    title,
    subtitle,
    "slug": slug.current,
    moduleType,
    level,
    description,
    estimatedMinutes,
    tags,
    "coverUrl": coverImage.asset->url,
    targetGrades,
    targetSchools,
    sortOrder,
    "exercises": exercises[]-> {
      _id,
      title,
      "slug": slug.current,
      exerciseType,
      content,
      hint,
      feedbackCorrect,
      feedbackWrong,
      sortOrder,
      "mediaUrl": media.asset->url,
      options
    }
  }
`;

export const vocabTopicsQuery = `
  *[_type == "vocabTopic" && (isActive != false)] | order(coalesce(sortOrder, 999) asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    level,
    targetGrades,
    targetSchools,
    sortOrder,
    isActive,
    cards
  }
`;

export const siteSettingsQuery = `
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    siteName,
    tagline,
    "logoUrl": logo.asset->url,
    "defaultSeo": defaultSeo {
      title,
      description,
      "ogImageUrl": ogImage.asset->url
    },
    headerNav,
    footerColumns,
    footerNote,
    supportEmail,
    announcement
  }
`;

export const legalPagesSlugsQuery = `
  *[_type == "legalPage" && defined(slug.current)] {
    "slug": slug.current
  }
`;

export const legalPageBySlugQuery = `
  *[_type == "legalPage" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    seo {
      title,
      description,
      "ogImageUrl": ogImage.asset->url
    },
    body
  }
`;

export const appCopyQuery = `
  *[_type == "appCopy" && _id == "appCopy"][0] {
    "homeSeo": homeSeo {
      title,
      description,
      "ogImageUrl": ogImage.asset->url
    },
    homeBadge,
    homeHeadlineLine1,
    homeHeadlineAccent,
    homeSubhead,
    homeCtaLabel,
    homeCtaHref,
    loginBadge,
    loginTitle,
    loginSubtitle,
    loginEmailLabel,
    loginPasswordLabel,
    loginSubmitLabel,
    loginErrorMessage,
    registerTitle,
    registerSubtitle,
    onboardingProgressTemplate,
    onboardingHeaderRight,
    onboardingNextButton,
    onboardingCompleteButton,
    onboardingSavingLabel,
    onboardingSteps,
    dashboardLoading,
    dashboardWelcomePrefix,
    dashboardGuestName,
    dashboardWelcomeSub,
    dashboardSignOut,
    dashboardRecommendationBadge,
    dashboardWeaknessTitleTemplate,
    dashboardWeaknessBodyTemplate,
    dashboardModuleCtaTemplate,
    dashboardMetricsTitle,
    dashboardTotalScoreLabel,
    dashboardScoreHint,
    dashboardWeaknessesLabel,
    dashboardNoWeaknesses,
    dashboardQuickLinksTitle,
    learningAreas,
    adminPanelTitle
  }
`;

/** Grammaire vitrin listesi (aktif) */
export const grammarSpotlightsQuery = `
  *[_type == "grammarSpotlight" && isActive == true] | order(coalesce(sortOrder, 999) asc) {
    _id,
    "key": key.current,
    title,
    level,
    summary,
    theoryIntro,
    hasExercise,
    exercisePlaceholderMessage,
    sortOrder,
    "linkedModuleId": linkedModule._ref
  }
`;
