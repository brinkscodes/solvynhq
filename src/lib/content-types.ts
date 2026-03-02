export interface ContentBlock {
  id: string;
  type: "heading" | "subheading" | "body" | "cta" | "list" | "badge" | "step";
  label?: string;
  text: string;
  items?: string[];
  note?: string;
}

export interface ContentSection {
  id: string;
  name: string;
  blocks: ContentBlock[];
}

export interface ContentPage {
  id: string;
  name: string;
  description: string;
  sections: ContentSection[];
}

export interface Comment {
  id: string;
  author_name: string;
  author_email: string;
  comment: string;
  created_at: string;
}

export type SectionComments = Record<string, Comment[]>;
