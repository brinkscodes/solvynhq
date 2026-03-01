export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type TaskTag =
  | "Homepage"
  | "Page"
  | "Nav"
  | "Footer"
  | "Config"
  | "Assets"
  | "SEO"
  | "Animation"
  | "Performance"
  | "Responsive"
  | "QA"
  | "Review"
  | "Launch"
  | "Design"
  | "Mockup"
  | "Legal"
  | "Form"
  | "Automation"
  | "Waiting"
  | "Content"
  | "Social";

export interface Task {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  tag: TaskTag;
  completedAt?: string;
}

export interface Section {
  id: string;
  name: string;
  order: number;
  phase: 1 | 2 | 3;
  tasks: Task[];
}

export interface ProjectData {
  project: {
    name: string;
    description: string;
  };
  sections: Section[];
}
