"use client";

import { useState, useEffect } from "react";
import {
  KeyRound,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  ExternalLink,
  Lock,
  Check,
  Pencil,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Credential = {
  id: string;
  service_name: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

const VAULT_PASSWORD = "Mineral";
const SESSION_KEY = "solvyn-vault-unlocked";

export function CredentialsVault() {
  const [unlocked, setUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Credential>>({});
  const [newCred, setNewCred] = useState({
    service_name: "",
    username: "",
    password: "",
    url: "",
    notes: "",
  });

  // Check if already unlocked this session
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setUnlocked(true);
    }
  }, []);

  // Fetch credentials when unlocked
  useEffect(() => {
    if (unlocked) {
      fetchCredentials();
    }
  }, [unlocked]);

  async function fetchCredentials() {
    setLoading(true);
    try {
      const res = await fetch("/api/credentials");
      const data = await res.json();
      setCredentials(data.credentials || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function handleUnlock() {
    if (passwordInput === VAULT_PASSWORD) {
      setUnlocked(true);
      setPasswordError(false);
      sessionStorage.setItem(SESSION_KEY, "true");
    } else {
      setPasswordError(true);
      setPasswordInput("");
    }
  }

  async function handleAdd() {
    if (!newCred.service_name.trim() || !newCred.username.trim() || !newCred.password.trim()) return;

    try {
      const res = await fetch("/api/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCred),
      });
      const data = await res.json();
      if (res.ok) {
        setNewCred({ service_name: "", username: "", password: "", url: "", notes: "" });
        setShowAdd(false);
        fetchCredentials();
      } else {
        console.error("Failed to save credential:", data.error);
        alert("Failed to save: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Save credential error:", err);
      alert("Failed to save credential. Check the console for details.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/credentials?id=${id}`, { method: "DELETE" });
      setCredentials((prev) => prev.filter((c) => c.id !== id));
    } catch {
      // ignore
    }
  }

  async function handleSaveEdit(id: string) {
    try {
      const res = await fetch("/api/credentials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editForm }),
      });
      if (res.ok) {
        setEditingId(null);
        setEditForm({});
        fetchCredentials();
      }
    } catch {
      // ignore
    }
  }

  function togglePasswordVisibility(id: string) {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function copyToClipboard(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function startEdit(cred: Credential) {
    setEditingId(cred.id);
    setEditForm({
      service_name: cred.service_name,
      username: cred.username,
      password: cred.password,
      url: cred.url,
      notes: cred.notes,
    });
  }

  // Password gate
  if (!unlocked) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-full max-w-sm rounded-xl border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)] p-8">
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--solvyn-olive)]/10">
              <Lock className="h-7 w-7 text-[var(--solvyn-olive)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--solvyn-text-primary)]">
              Vault Locked
            </h2>
            <p className="mt-1 text-center text-sm text-[var(--solvyn-text-tertiary)]">
              Enter the vault password to access stored credentials
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUnlock();
            }}
          >
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError(false);
              }}
              placeholder="Enter password"
              autoFocus
              className={cn(
                "w-full rounded-lg border bg-[var(--solvyn-bg-sunken)] px-4 py-2.5 text-sm text-[var(--solvyn-text-primary)] placeholder:text-[var(--solvyn-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--solvyn-olive)]/50",
                passwordError
                  ? "border-[var(--solvyn-rust)]"
                  : "border-[var(--solvyn-border-subtle)]"
              )}
            />
            {passwordError && (
              <p className="mt-2 text-xs text-[var(--solvyn-rust)]">
                Incorrect password. Try again.
              </p>
            )}
            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-[var(--solvyn-olive)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--solvyn-olive)]/90"
            >
              Unlock Vault
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Add button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 rounded-lg bg-[var(--solvyn-olive)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--solvyn-olive)]/90"
        >
          <Plus className="h-4 w-4" />
          Add Credential
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="mb-6 rounded-xl border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)] p-6">
          <h3 className="mb-4 text-sm font-semibold text-[var(--solvyn-text-primary)]">
            New Credential
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--solvyn-text-tertiary)]">
                Service Name *
              </label>
              <input
                type="text"
                value={newCred.service_name}
                onChange={(e) => setNewCred({ ...newCred, service_name: e.target.value })}
                placeholder="e.g. WordPress Admin"
                className="w-full rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-sunken)] px-3 py-2 text-sm text-[var(--solvyn-text-primary)] placeholder:text-[var(--solvyn-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--solvyn-olive)]/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--solvyn-text-tertiary)]">
                URL
              </label>
              <input
                type="text"
                value={newCred.url}
                onChange={(e) => setNewCred({ ...newCred, url: e.target.value })}
                placeholder="e.g. https://example.com/wp-admin"
                className="w-full rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-sunken)] px-3 py-2 text-sm text-[var(--solvyn-text-primary)] placeholder:text-[var(--solvyn-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--solvyn-olive)]/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--solvyn-text-tertiary)]">
                Username / Email *
              </label>
              <input
                type="text"
                value={newCred.username}
                onChange={(e) => setNewCred({ ...newCred, username: e.target.value })}
                placeholder="Username or email"
                className="w-full rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-sunken)] px-3 py-2 text-sm text-[var(--solvyn-text-primary)] placeholder:text-[var(--solvyn-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--solvyn-olive)]/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--solvyn-text-tertiary)]">
                Password *
              </label>
              <input
                type="password"
                value={newCred.password}
                onChange={(e) => setNewCred({ ...newCred, password: e.target.value })}
                placeholder="Password"
                className="w-full rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-sunken)] px-3 py-2 text-sm text-[var(--solvyn-text-primary)] placeholder:text-[var(--solvyn-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--solvyn-olive)]/50"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-[var(--solvyn-text-tertiary)]">
                Notes
              </label>
              <textarea
                value={newCred.notes}
                onChange={(e) => setNewCred({ ...newCred, notes: e.target.value })}
                placeholder="Any additional notes..."
                rows={2}
                className="w-full rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-sunken)] px-3 py-2 text-sm text-[var(--solvyn-text-primary)] placeholder:text-[var(--solvyn-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--solvyn-olive)]/50"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => {
                setShowAdd(false);
                setNewCred({ service_name: "", username: "", password: "", url: "", notes: "" });
              }}
              className="rounded-lg border border-[var(--solvyn-border-subtle)] px-4 py-2 text-sm font-medium text-[var(--solvyn-text-secondary)] transition-colors hover:bg-[var(--solvyn-bg-sunken)]"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!newCred.service_name.trim() || !newCred.username.trim() || !newCred.password.trim()}
              className="rounded-lg bg-[var(--solvyn-olive)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--solvyn-olive)]/90 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Credentials list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--solvyn-olive)] border-t-transparent" />
        </div>
      ) : credentials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--solvyn-olive)]/10">
            <KeyRound className="h-7 w-7 text-[var(--solvyn-olive)]" />
          </div>
          <p className="text-sm font-medium text-[var(--solvyn-text-secondary)]">
            No credentials stored yet
          </p>
          <p className="mt-1 text-xs text-[var(--solvyn-text-tertiary)]">
            Click &quot;Add Credential&quot; to store your first login
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {credentials.map((cred) => (
            <div
              key={cred.id}
              className="rounded-xl border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-elevated)] p-5 transition-colors hover:border-[var(--solvyn-border-default)]"
            >
              {editingId === cred.id ? (
                /* Edit mode */
                <div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-[var(--solvyn-text-tertiary)]">
                        Service Name
                      </label>
                      <input
                        type="text"
                        value={editForm.service_name || ""}
                        onChange={(e) => setEditForm({ ...editForm, service_name: e.target.value })}
                        className="w-full rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-sunken)] px-3 py-2 text-sm text-[var(--solvyn-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--solvyn-olive)]/50"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-[var(--solvyn-text-tertiary)]">
                        URL
                      </label>
                      <input
                        type="text"
                        value={editForm.url || ""}
                        onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                        className="w-full rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-sunken)] px-3 py-2 text-sm text-[var(--solvyn-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--solvyn-olive)]/50"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-[var(--solvyn-text-tertiary)]">
                        Username
                      </label>
                      <input
                        type="text"
                        value={editForm.username || ""}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        className="w-full rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-sunken)] px-3 py-2 text-sm text-[var(--solvyn-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--solvyn-olive)]/50"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-[var(--solvyn-text-tertiary)]">
                        Password
                      </label>
                      <input
                        type="text"
                        value={editForm.password || ""}
                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                        className="w-full rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-sunken)] px-3 py-2 text-sm text-[var(--solvyn-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--solvyn-olive)]/50"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-[var(--solvyn-text-tertiary)]">
                        Notes
                      </label>
                      <textarea
                        value={editForm.notes || ""}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                        rows={2}
                        className="w-full rounded-lg border border-[var(--solvyn-border-subtle)] bg-[var(--solvyn-bg-sunken)] px-3 py-2 text-sm text-[var(--solvyn-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--solvyn-olive)]/50"
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      onClick={() => { setEditingId(null); setEditForm({}); }}
                      className="flex items-center gap-1 rounded-lg border border-[var(--solvyn-border-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--solvyn-text-secondary)] hover:bg-[var(--solvyn-bg-sunken)]"
                    >
                      <X className="h-3 w-3" /> Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(cred.id)}
                      className="flex items-center gap-1 rounded-lg bg-[var(--solvyn-olive)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--solvyn-olive)]/90"
                    >
                      <Check className="h-3 w-3" /> Save
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <div>
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-[var(--solvyn-olive)]" />
                      <h3 className="text-sm font-semibold text-[var(--solvyn-text-primary)]">
                        {cred.service_name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      {cred.url && (
                        <a
                          href={cred.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md p-1.5 text-[var(--solvyn-text-tertiary)] transition-colors hover:bg-[var(--solvyn-bg-sunken)] hover:text-[var(--solvyn-text-secondary)]"
                          title="Open URL"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => startEdit(cred)}
                        className="rounded-md p-1.5 text-[var(--solvyn-text-tertiary)] transition-colors hover:bg-[var(--solvyn-bg-sunken)] hover:text-[var(--solvyn-text-secondary)]"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cred.id)}
                        className="rounded-md p-1.5 text-[var(--solvyn-text-tertiary)] transition-colors hover:bg-[var(--solvyn-bg-sunken)] hover:text-[var(--solvyn-rust)]"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {cred.username && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--solvyn-text-tertiary)]">User:</span>
                        <span className="text-sm text-[var(--solvyn-text-secondary)]">
                          {cred.username}
                        </span>
                        <button
                          onClick={() => copyToClipboard(cred.username, `user-${cred.id}`)}
                          className="rounded p-1 text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-text-secondary)]"
                          title="Copy username"
                        >
                          {copiedId === `user-${cred.id}` ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    )}
                    {cred.password && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--solvyn-text-tertiary)]">Pass:</span>
                        <span className="font-mono text-sm text-[var(--solvyn-text-secondary)]">
                          {visiblePasswords.has(cred.id)
                            ? cred.password
                            : "\u2022".repeat(Math.min(cred.password.length, 12))}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(cred.id)}
                          className="rounded p-1 text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-text-secondary)]"
                          title={visiblePasswords.has(cred.id) ? "Hide" : "Show"}
                        >
                          {visiblePasswords.has(cred.id) ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(cred.password, `pass-${cred.id}`)}
                          className="rounded p-1 text-[var(--solvyn-text-tertiary)] hover:text-[var(--solvyn-text-secondary)]"
                          title="Copy password"
                        >
                          {copiedId === `pass-${cred.id}` ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {cred.url && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-[var(--solvyn-text-tertiary)]">URL:</span>
                      <span className="truncate text-sm text-[var(--solvyn-text-secondary)]">
                        {cred.url}
                      </span>
                    </div>
                  )}

                  {cred.notes && (
                    <p className="mt-2 text-xs text-[var(--solvyn-text-tertiary)]">
                      {cred.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
