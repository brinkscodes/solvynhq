export interface Competitor {
  id: string;
  name: string;
  url: string;
  type: "b2b" | "d2c" | "both";
  description: string;
  targetKeywords: string[];
  contentAngles: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface Keyword {
  id: string;
  term: string;
  intent: "informational" | "commercial" | "transactional" | "navigational";
  priority: "high" | "medium" | "low";
  volume?: string;
  difficulty?: string;
  source?: string;
  notes?: string;
}

export interface KeywordCluster {
  id: string;
  name: string;
  keywords: Keyword[];
}

export interface PageKeywords {
  pageId: string;
  pageName: string;
  primary: string;
  secondary: string[];
  clusters: KeywordCluster[];
}

export interface MetaTag {
  pageId: string;
  pageName: string;
  title: string;
  titleLength: number;
  description: string;
  descriptionLength: number;
  h1: string;
}

export interface ContentGap {
  id: string;
  topic: string;
  reason: string;
  action: string;
  priority: "high" | "medium" | "low";
  competitorExample?: string;
}

export interface PageGaps {
  pageId: string;
  pageName: string;
  gaps: ContentGap[];
}

export interface ImageSeo {
  id: string;
  filename: string;
  url: string;
  altText: string;
  title: string;
  caption: string;
  description: string;
}

export interface SeoResearch {
  lastUpdated: string;
  competitors: Competitor[];
  keywords: PageKeywords[];
  metaTags: MetaTag[];
  contentGaps: PageGaps[];
  imageSeo: ImageSeo[];
}
