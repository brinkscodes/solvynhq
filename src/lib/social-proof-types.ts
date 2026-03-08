export interface Partner {
  id: string;
  project_id: string;
  name: string;
  logo_url: string;
  type: "retail" | "distribution" | "co-brand" | "media" | "other";
  description: string;
  website: string;
  status: "active" | "pending" | "past";
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AdvisoryBoardMember {
  id: string;
  project_id: string;
  name: string;
  title: string;
  organization: string;
  expertise_area: string;
  bio: string;
  linkedin_url: string;
  headshot_url: string;
  status: "active" | "emeritus";
  date_joined: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Volunteer {
  id: string;
  project_id: string;
  name: string;
  email: string;
  phone: string;
  role: "ambassador" | "event-coordinator" | "content-creator" | "community-lead" | "field-rep";
  status: "applied" | "active" | "inactive" | "alumni";
  bio: string;
  photo_url: string;
  instagram_url: string;
  application_date: string;
  start_date: string | null;
  total_hours: number;
  events_attended: number;
  notes: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SocialProofData {
  partners: Partner[];
  advisors: AdvisoryBoardMember[];
  volunteers: Volunteer[];
}

export type SocialProofTable = "partners" | "advisory_board" | "volunteers";
