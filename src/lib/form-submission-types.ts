export type SubmissionStatus = "new" | "read" | "archived";

export interface FormSubmission {
  id: string;
  formName: string;
  fields: Record<string, unknown>;
  meta: Record<string, unknown>;
  status: SubmissionStatus;
  createdAt: string;
}
