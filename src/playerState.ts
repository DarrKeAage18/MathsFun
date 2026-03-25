const STORAGE_KEY = 'funMathsPlayer';

export interface PlayerData {
  name: string;
  points: number;
  level: number;
}

function load(): PlayerData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PlayerData;
  } catch { /* ignore parse errors */ }
  return { name: '', points: 0, level: 1 };
}

function save(data: PlayerData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const playerState = {
  get(): PlayerData { return load(); },

  setName(name: string): void {
    const d = load(); d.name = name; save(d);
  },

  addPoints(pts: number): void {
    const d = load(); d.points += pts; save(d);
  },

  setLevel(level: number): void {
    const d = load(); d.level = level; save(d);
  },
};
