export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  content: string;
  mentions: string[];
  reactions: ReactionSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface ReactionSummary {
  emoji: string;
  count: number;
  reacted: boolean; // whether current user reacted
}

export interface CreateTaskCommentPayload {
  taskId: string;
  content: string;
  mentions?: string[];
}

export interface ToggleReactionPayload {
  commentId: string;
  emoji: string;
}
