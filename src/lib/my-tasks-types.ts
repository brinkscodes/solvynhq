export type MyTaskStatus = "todo" | "in-progress" | "done";
export type MyTaskPriority = "low" | "medium" | "high";

export type MyTaskTag =
  | "Urgent"
  | "Follow-up"
  | "Idea"
  | "Meeting"
  | "Review"
  | "Waiting"
  | "Personal"
  | "Research";

export const MY_TASK_TAGS: MyTaskTag[] = [
  "Urgent",
  "Follow-up",
  "Idea",
  "Meeting",
  "Review",
  "Waiting",
  "Personal",
  "Research",
];

export interface MyTaskSection {
  id: string;
  name: string;
  position: number;
}

export interface MyTask {
  id: string;
  sectionId: string | null;
  name: string;
  notes: string;
  status: MyTaskStatus;
  priority: MyTaskPriority;
  tags: MyTaskTag[];
  deadline: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface MyTasksData {
  tasks: MyTask[];
  sections: MyTaskSection[];
}

export interface CreateTaskPayload {
  name: string;
  sectionId?: string | null;
  priority?: MyTaskPriority;
  deadline?: string | null;
  tags?: MyTaskTag[];
  notes?: string;
}

export interface UpdateTaskPayload {
  taskId: string;
  name?: string;
  sectionId?: string | null;
  notes?: string;
  status?: MyTaskStatus;
  priority?: MyTaskPriority;
  tags?: MyTaskTag[];
  deadline?: string | null;
  position?: number;
}

export interface CreateSectionPayload {
  name: string;
}

export interface UpdateSectionPayload {
  sectionId: string;
  name?: string;
  position?: number;
}

export type MyTaskSortOption =
  | "position"
  | "deadline"
  | "name"
  | "priority"
  | "created";

export type MyTaskView = "list" | "kanban";
