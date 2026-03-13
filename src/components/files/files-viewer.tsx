"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Upload,
  File,
  Image,
  FileText,
  FileSpreadsheet,
  Film,
  Music,
  Archive,
  Download,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type FileTag = "branding" | "marketing" | "operations" | "research" | "other";

interface ProjectFile {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  tag: FileTag;
  created_at: string;
  profiles: { full_name: string | null; avatar_url: string | null } | null;
}

const TAGS: { value: FileTag | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "branding", label: "Branding" },
  { value: "marketing", label: "Marketing" },
  { value: "operations", label: "Operations" },
  { value: "research", label: "Research" },
  { value: "other", label: "Other" },
];

const TAG_COLORS: Record<FileTag, string> = {
  branding: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  marketing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  operations: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  research: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  other: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return Image;
  if (type === "application/pdf" || type.startsWith("text/")) return FileText;
  if (type.includes("spreadsheet") || type.includes("csv") || type.includes("excel")) return FileSpreadsheet;
  if (type.startsWith("video/")) return Film;
  if (type.startsWith("audio/")) return Music;
  if (type.includes("zip") || type.includes("tar") || type.includes("rar")) return Archive;
  return File;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${sizes[i]}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function FilesViewer() {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<FileTag | "all">("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<FileTag>("other");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const fetchFiles = useCallback(async () => {
    const params = new URLSearchParams();
    if (activeTag !== "all") params.set("tag", activeTag);
    if (search) params.set("search", search);
    const res = await fetch(`/api/files?${params}`);
    if (res.ok) {
      setFiles(await res.json());
    }
    setLoading(false);
  }, [activeTag, search]);

  useEffect(() => {
    setLoading(true);
    const debounce = setTimeout(fetchFiles, search ? 300 : 0);
    return () => clearTimeout(debounce);
  }, [fetchFiles, search]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("tag", selectedTag);

    const res = await fetch("/api/files", { method: "POST", body: formData });
    if (res.ok) {
      const newFile = await res.json();
      setFiles((prev) => [newFile, ...prev]);
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setSelectedTag("other");
    }
    setUploading(false);
  };

  const handleDelete = async (fileId: string) => {
    const res = await fetch("/api/files", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId }),
    });
    if (res.ok) {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    }
    setDeleteConfirm(null);
  };

  const getDownloadUrl = (storagePath: string) => {
    const { data } = supabase.storage.from("project-files").getPublicUrl(storagePath);
    return data.publicUrl;
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadDialogOpen(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadDialogOpen(true);
    }
    e.target.value = "";
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleFileDrop}
    >
      {/* Search + Upload bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--solvyn-text-tertiary)]" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)] py-2.5 pl-10 pr-4 text-[13px] text-[var(--solvyn-text-primary)] placeholder-[var(--solvyn-text-tertiary)] outline-none transition-colors focus:border-[var(--solvyn-olive)]/40"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-text-secondary)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 rounded-xl bg-[var(--solvyn-olive)] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--solvyn-olive)]/90"
        >
          <Upload className="h-4 w-4" />
          Upload File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Tag filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <button
            key={tag.value}
            onClick={() => setActiveTag(tag.value)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-all duration-150",
              activeTag === tag.value
                ? "border-[var(--solvyn-olive)]/30 bg-[var(--solvyn-olive)]/10 text-[var(--solvyn-olive)]"
                : "border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)] text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-text-secondary)]"
            )}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* Drag overlay */}
      {dragOver && (
        <div className="mb-6 flex items-center justify-center rounded-2xl border-2 border-dashed border-[var(--solvyn-olive)]/40 bg-[var(--solvyn-olive)]/5 py-12">
          <div className="text-center">
            <Upload className="mx-auto mb-2 h-8 w-8 text-[var(--solvyn-olive)]/60" />
            <p className="text-[14px] font-medium text-[var(--solvyn-olive)]">Drop file to upload</p>
          </div>
        </div>
      )}

      {/* Files list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--solvyn-text-tertiary)]" />
        </div>
      ) : files.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--solvyn-border-default)] py-16 text-center">
          <File className="mx-auto mb-3 h-10 w-10 text-[var(--solvyn-text-tertiary)]/40" />
          <p className="text-[14px] font-medium text-[var(--solvyn-text-secondary)]">
            {search ? "No files match your search" : "No files uploaded yet"}
          </p>
          <p className="mt-1 text-[12px] text-[var(--solvyn-text-tertiary)]">
            {search ? "Try a different search term" : "Upload files to share with your team"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => {
            const Icon = getFileIcon(file.file_type);
            return (
              <div
                key={file.id}
                className="group flex items-center gap-4 rounded-xl border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)] px-4 py-3.5 transition-all duration-150 hover:border-[var(--solvyn-border-default)]"
              >
                {/* Icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--solvyn-bg-base)]">
                  <Icon className="h-5 w-5 text-[var(--solvyn-text-tertiary)]" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[var(--solvyn-text-primary)]">
                    {file.file_name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--solvyn-text-tertiary)]">
                    <span>{formatFileSize(file.file_size)}</span>
                    <span>·</span>
                    <span>{formatDate(file.created_at)}</span>
                    {file.profiles?.full_name && (
                      <>
                        <span>·</span>
                        <span>{file.profiles.full_name}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Tag */}
                <span className={cn("shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-medium capitalize", TAG_COLORS[file.tag])}>
                  {file.tag}
                </span>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <a
                    href={getDownloadUrl(file.storage_path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={file.file_name}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--solvyn-text-tertiary)] transition-colors hover:bg-[var(--solvyn-bg-base)] hover:text-[var(--solvyn-text-secondary)]"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => setDeleteConfirm(file.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--solvyn-text-tertiary)] transition-colors hover:bg-[var(--solvyn-bg-base)] hover:text-[var(--solvyn-rust)]"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload dialog — choose tag */}
      <Dialog open={uploadDialogOpen} onOpenChange={(open) => { if (!open) { setUploadDialogOpen(false); setSelectedFile(null); } }}>
        <DialogContent showCloseButton={false} className="max-w-md border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)]">
          <DialogHeader>
            <DialogTitle className="text-[15px] text-[var(--solvyn-text-primary)]">Upload File</DialogTitle>
            <DialogDescription className="text-[13px] text-[var(--solvyn-text-tertiary)]">
              Choose a tag to categorize this file for your team.
            </DialogDescription>
          </DialogHeader>

          {selectedFile && (
            <div className="flex items-center gap-3 rounded-xl bg-[var(--solvyn-bg-base)] px-4 py-3">
              <File className="h-5 w-5 shrink-0 text-[var(--solvyn-text-tertiary)]" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-[var(--solvyn-text-primary)]">{selectedFile.name}</p>
                <p className="text-[11px] text-[var(--solvyn-text-tertiary)]">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
          )}

          <div>
            <p className="mb-2 text-[12px] font-medium text-[var(--solvyn-text-secondary)]">Tag</p>
            <div className="flex flex-wrap gap-2">
              {(["branding", "marketing", "operations", "research", "other"] as FileTag[]).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-[12px] font-medium capitalize transition-all duration-150",
                    selectedTag === tag
                      ? TAG_COLORS[tag]
                      : "border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-base)] text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-text-secondary)]"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <button
              onClick={() => { setUploadDialogOpen(false); setSelectedFile(null); }}
              disabled={uploading}
              className="flex-1 rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-base)] px-4 py-2.5 text-[13px] font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-elevated)] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--solvyn-olive)] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--solvyn-olive)]/90 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5" />
                  Upload
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent showCloseButton={false} className="max-w-sm border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-elevated)]">
          <DialogHeader>
            <DialogTitle className="text-[15px] text-[var(--solvyn-text-primary)]">Delete file?</DialogTitle>
            <DialogDescription className="text-[13px] text-[var(--solvyn-text-tertiary)]">
              This will permanently delete the file for all team members. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 rounded-xl border border-[var(--solvyn-border-default)] bg-[var(--solvyn-bg-base)] px-4 py-2.5 text-[13px] font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-elevated)]"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="flex-1 rounded-xl bg-[var(--solvyn-rust)] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--solvyn-rust)]/90"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
