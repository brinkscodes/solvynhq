export interface PersonaRow {
  persona: string;
  caresAbout: string;
  challenge: string;
  valuePromise: string;
}

export interface ObjectionRow {
  objection: string;
  response: string;
}

export interface GlossaryRow {
  term: string;
  meaning: string;
}

export interface ValueThemeRow {
  theme: string;
  proof: string;
}

export interface ProductContext {
  lastUpdated: string;
  productOverview: {
    oneLiner: string;
    whatItDoes: string;
    productCategory: string;
    productType: string;
  };
  targetAudience: {
    targetCompanies: string;
    decisionMakers: string;
    primaryUseCase: string;
    jobsToBeDone: string[];
    secondaryAudience: string;
  };
  personas: PersonaRow[];
  painPoints: {
    coreProblem: string;
    whyAlternativesFallShort: string[];
    whatItCosts: string;
    emotionalTension: string;
  };
  competitiveLandscape: {
    direct: string[];
    secondary: string[];
    indirect: string[];
    howEachFallsShort: string;
  };
  differentiation: {
    keyDifferentiators: string[];
    howDifferently: string;
    whyBetter: string;
    whyChooseUs: string;
  };
  objections: {
    items: ObjectionRow[];
    antiPersona: string;
  };
  switchingDynamics: {
    push: string;
    pull: string;
    habit: string;
    anxiety: string;
  };
  customerLanguage: {
    problemDescriptions: string[];
    solutionDescriptions: string[];
    wordsToUse: string;
    wordsToAvoid: string;
    glossary: GlossaryRow[];
  };
  brandVoice: {
    tone: string;
    style: string;
    personality: string;
    whatWereNot: string;
  };
  proofPoints: {
    metrics: string;
    customers: string;
    testimonials: string;
    medicalCredibility: string;
    certifications: string[];
    valueThemes: ValueThemeRow[];
  };
}
