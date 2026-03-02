"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

type SaveState = "idle" | "saving" | "saved";

export function ProfileEditor() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data: Profile) => {
        setProfile(data);
        setName(data.full_name || "");
        setAvatarUrl(data.avatar_url || null);
      });
  }, []);

  function getInitials(fullName: string | null): string {
    if (!fullName) return "?";
    return fullName
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  async function handleAvatarUpload(file: File) {
    setUploading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);

      // Append cache-buster so browser shows updated image
      const url = `${publicUrl}?t=${Date.now()}`;
      setAvatarUrl(url);

      // Save to profile
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_url: url }),
      });
    } catch (err) {
      console.error("Avatar upload error:", err);
      setError("Failed to upload avatar. Make sure the avatars storage bucket exists.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaveState("saving");
    setError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: name }),
      });

      if (!res.ok) throw new Error("Save failed");

      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setError("Failed to save profile");
      setSaveState("idle");
    }
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  const hasChanges = name !== (profile.full_name || "");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Profile</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Manage your account settings
      </p>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-8">
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-[#9CAF88] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xl font-semibold text-white">
                {getInitials(name || profile.full_name)}
              </span>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              ) : (
                <Camera className="h-5 w-5 text-white" />
              )}
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleAvatarUpload(file);
              e.target.value = "";
            }}
          />
          <div>
            <p className="text-sm font-medium text-neutral-900">
              Profile photo
            </p>
            <p className="text-xs text-neutral-500">
              Click to upload a new photo
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-neutral-100" />

        {/* Name field */}
        <div>
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-neutral-700"
          >
            Full name
          </label>
          <input
            id="full_name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full max-w-md rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none transition-colors focus:border-[#9CAF88] focus:ring-1 focus:ring-[#9CAF88]"
            placeholder="Your full name"
          />
        </div>

        {/* Email (read-only) */}
        <div className="mt-5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={profile.email || ""}
            disabled
            className="mt-1.5 w-full max-w-md rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm text-neutral-500"
          />
          <p className="mt-1 text-xs text-neutral-400">
            Email cannot be changed here
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}

        {/* Save */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={!hasChanges || saveState === "saving"}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1A1B23] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {saveState === "saving" && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {saveState === "saved" && <Check className="h-4 w-4" />}
            {saveState === "saved" ? "Saved" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
