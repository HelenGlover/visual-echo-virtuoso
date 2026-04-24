// Per-bill notes persisted to localStorage.
// Each bill has its own list of notes keyed by bill id.

export type BillNote = {
  id: string;
  text: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
};

const STORAGE_KEY = "billtrax:notes:v1";

type NotesStore = Record<string, BillNote[]>;

function readStore(): NotesStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? (parsed as NotesStore) : {};
  } catch {
    return {};
  }
}

function writeStore(store: NotesStore) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore quota / serialization errors
  }
}

export function getNotes(billId: string): BillNote[] {
  const store = readStore();
  return store[billId] ?? [];
}

export function saveNotes(billId: string, notes: BillNote[]) {
  const store = readStore();
  store[billId] = notes;
  writeStore(store);
}

export function createNote(text: string): BillNote {
  const now = new Date().toISOString();
  return {
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    createdAt: now,
    updatedAt: now,
  };
}
