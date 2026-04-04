// Shared localStorage-based store for prompts and registered users

export interface StoredPrompt {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  prompt: string;
  language: string;
  generatedCode: string;
  createdAt: string; // ISO string
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  plan: "free" | "pro";
  createdAt: string; // ISO string
}

const PROMPTS_KEY = "codegenie_prompts";
const USERS_KEY = "codegenie_users";

// ─── Prompts ────────────────────────────────────────────

export function getAllPrompts(): StoredPrompt[] {
  try {
    return JSON.parse(localStorage.getItem(PROMPTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getPromptsByUser(userId: string): StoredPrompt[] {
  return getAllPrompts().filter((p) => p.userId === userId);
}

export function savePrompt(prompt: StoredPrompt) {
  const all = getAllPrompts();
  all.unshift(prompt);
  localStorage.setItem(PROMPTS_KEY, JSON.stringify(all));
}

export function deletePrompt(id: string) {
  const all = getAllPrompts().filter((p) => p.id !== id);
  localStorage.setItem(PROMPTS_KEY, JSON.stringify(all));
}

// ─── Users ──────────────────────────────────────────────

export function getAllUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveUser(user: StoredUser) {
  const all = getAllUsers().filter((u) => u.email !== user.email);
  all.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(all));
}

export function deleteUser(id: string) {
  const all = getAllUsers().filter((u) => u.id !== id);
  localStorage.setItem(USERS_KEY, JSON.stringify(all));
}

export function updateUserRole(id: string, role: "user" | "admin") {
  const all = getAllUsers().map((u) => (u.id === id ? { ...u, role } : u));
  localStorage.setItem(USERS_KEY, JSON.stringify(all));
}

export function getTodayPromptCount(userId: string): number {
  const today = new Date().toDateString();
  return getAllPrompts().filter(
    (p) => p.userId === userId && new Date(p.createdAt).toDateString() === today
  ).length;
}
