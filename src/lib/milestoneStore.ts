// src/lib/milestoneStore.ts
export type StoredResource = {
  title: string;
  type: "course" | "article";
  provider: string;
  duration?: string;
  url?: string;
};

export type StoredMilestones = {
  courses: StoredResource[];   // type = "course"
  articles: StoredResource[];  // type = "article"
  aiAdvice?: string[];
  capturedAt: string;
};

const KEY = "careerhub.milestones.v1";

export function saveMilestones(data: StoredMilestones) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function loadMilestones(): StoredMilestones | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredMilestones;
  } catch {
    return null;
  }
}
