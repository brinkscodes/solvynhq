"use client";

import { Inbox, FolderOpen } from "lucide-react";
import { MyTaskRow } from "./my-task-row";
import type { MyTask, MyTaskStatus } from "@/lib/my-tasks-types";

interface MyTaskSectionGroupProps {
  name: string;
  isInbox?: boolean;
  tasks: MyTask[];
  onStatusChange: (taskId: string, status: MyTaskStatus) => void;
  onEdit: (task: MyTask) => void;
}

export function MyTaskSectionGroup({
  name,
  isInbox,
  tasks,
  onStatusChange,
  onEdit,
}: MyTaskSectionGroupProps) {
  if (tasks.length === 0) return null;

  return (
    <div className="mb-6">
      {/* Section header */}
      <div className="mb-2 flex items-center gap-2">
        {isInbox ? (
          <Inbox className="h-4 w-4 text-[#1A1A1A]/25" />
        ) : (
          <FolderOpen className="h-4 w-4 text-[#6C7B5A]/60" />
        )}
        <h3 className="text-[13px] font-semibold text-[#1A1A1A]/60">
          {name}
        </h3>
        <span className="text-[11px] font-medium text-[#1A1A1A]/25">
          {tasks.length}
        </span>
        <div className="h-px flex-1 bg-[#EAE4D9]/50" />
      </div>

      {/* Task rows */}
      <div className="overflow-hidden rounded-2xl border border-[#E8E4DE] bg-white">
        {tasks.map((task) => (
          <MyTaskRow
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}
