export type AgendaItemType = "note" | "question" | "action";

export interface MeetingAgendaItem {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  type: AgendaItemType;
  content: string;
  completed: boolean;
  createdAt: string;
  imageUrl: string | null;
}
