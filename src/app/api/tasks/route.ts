import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { ProjectData, TaskStatus } from "@/lib/types";

const TASKS_FILE = path.join(process.cwd(), "data", "tasks.json");

function readTasks(): ProjectData {
  const raw = fs.readFileSync(TASKS_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeTasks(data: ProjectData) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  const data = readTasks();
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { taskId, status } = body as { taskId: string; status: TaskStatus };

  if (!taskId || !status) {
    return NextResponse.json({ error: "taskId and status required" }, { status: 400 });
  }

  const data = readTasks();
  let found = false;

  for (const section of data.sections) {
    for (const task of section.tasks) {
      if (task.id === taskId) {
        task.status = status;
        if (status === "done") {
          task.completedAt = new Date().toISOString();
        } else {
          delete task.completedAt;
        }
        found = true;
        break;
      }
    }
    if (found) break;
  }

  if (!found) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  writeTasks(data);
  return NextResponse.json({ success: true });
}
