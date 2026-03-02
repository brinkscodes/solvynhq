export type ActionItemStatus = "pending" | "done";

export interface MeetingActionItem {
  owner: string;
  action: string;
  status: ActionItemStatus;
}

export interface Meeting {
  id: string;
  date: string;
  title: string;
  attendees: string[];
  summary: string;
  decisions: string[];
  actionItems: MeetingActionItem[];
  notes: string[];
}
