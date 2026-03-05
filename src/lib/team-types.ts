export type MemberRole = "owner" | "admin" | "member";

export interface TeamMember {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  role: MemberRole;
  joinedAt: string;
}

export interface ProjectInvite {
  id: string;
  inviteCode: string;
  email: string | null;
  role: MemberRole;
  invitedBy: string;
  invitedByName: string;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
}

export interface CreateInvitePayload {
  email?: string;
  role: "admin" | "member";
}
