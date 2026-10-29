import {
  calculatePuzzleScore,
  ClueDifficulty,
  getEasierDifficulty,
  LeaderboardEntry,
} from '../types/crossword';
import { getTodayIsoDate } from '../data/puzzles';

const STORAGE_KEY = 'cruciverbalist_20x20_leaderboard_v5';
const EASIEST_BASE_STORAGE_KEY = 'cruciverbalist_easiest_base_by_puzzle_v1';

const todayIso = getTodayIsoDate();

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'seed-1',
    playerName: 'Eleanor Vance',
    puzzleId: `daily-${todayIso}`,
    puzzleTitle: 'Daily 20×20 Crossword Edition',
    themeName: 'General Knowledge (Weekday Edition)',
    gridSize: 20,
    score: calculatePuzzleScore('hard', 312),
    timeSeconds: 312,
    hintsUsed: 0,
    easiestDifficultyUsed: 'hard',
    clueDifficulty: 'hard',
    accuracy: 99,
    completedAt: todayIso,
  },
  {
    id: 'seed-2',
    playerName: 'Julian Sterling',
    puzzleId: `quick8x8-${todayIso}`,
    puzzleTitle: 'Daily 8×8 Quick Crossword',
    themeName: 'Quick 8×8 Daily Sprint',
    gridSize: 8,
    score: calculatePuzzleScore('hard', 94),
    timeSeconds: 94,
    hintsUsed: 0,
    easiestDifficultyUsed: 'hard',
    clueDifficulty: 'hard',
    accuracy: 100,
    completedAt: todayIso,
  },
  {
    id: 'seed-3',
    playerName: 'Arthur Pendelton',
    puzzleId: 'daily-2026-10-25',
    puzzleTitle: 'Sunday Weekend Special: Prisms & Light Waves',
    themeName: 'Astronomy & Deep Space',
    gridSize: 20,
    score: calculatePuzzleScore('hard', 295),
    timeSeconds: 295,
    hintsUsed: 0,
    easiestDifficultyUsed: 'hard',
    clueDifficulty: 'hard',
    accuracy: 100,
    completedAt: '2026-10-25',
  },
  {
    id: 'seed-4',
    playerName: 'Clara Lin',
    puzzleId: 'daily-2026-10-24',
    puzzleTitle: 'Saturday Weekend Special: The Living Biosphere',
    themeName: 'Ecology & Natural Wonders',
    gridSize: 20,
    score: calculatePuzzleScore('medium', 355),
    timeSeconds: 355,
    hintsUsed: 1,
    easiestDifficultyUsed: 'medium',
    clueDifficulty: 'medium',
    accuracy: 97,
    completedAt: '2026-10-24',
  },
  {
    id: 'seed-5',
    playerName: 'Maeve O’Connor',
    puzzleId: `quick8x8-${todayIso}`,
    puzzleTitle: 'Daily 8×8 Quick Crossword',
    themeName: 'Quick 8×8 Daily Sprint',
    gridSize: 8,
    score: calculatePuzzleScore('medium', 118),
    timeSeconds: 118,
    hintsUsed: 1,
    easiestDifficultyUsed: 'medium',
    clueDifficulty: 'medium',
    accuracy: 96,
    completedAt: todayIso,
  },
];

export function getStoredEasiestBaseMap(): Record<string, ClueDifficulty> {
  try {
    const raw = localStorage.getItem(EASIEST_BASE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function recordEasiestBaseForPuzzle(
  puzzleId: string,
  chosenDifficulty: ClueDifficulty
): ClueDifficulty {
  const map = getStoredEasiestBaseMap();
  const existing = map[puzzleId];
  const updatedBase = existing
    ? getEasierDifficulty(existing, chosenDifficulty)
    : chosenDifficulty;
  map[puzzleId] = updatedBase;
  try {
    localStorage.setItem(EASIEST_BASE_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore storage errors
  }
  return updatedBase;
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADERBOARD));
      return INITIAL_LEADERBOARD;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => {
          const easiest: ClueDifficulty =
            item.easiestDifficultyUsed === 'easy' ||
            item.easiestDifficultyUsed === 'medium' ||
            item.easiestDifficultyUsed === 'hard'
              ? item.easiestDifficultyUsed
              : 'medium';
          const secs =
            typeof item.timeSeconds === 'number' ? item.timeSeconds : 180;
          return {
            ...item,
            gridSize: item.gridSize === 8 ? 8 : 20,
            score: calculatePuzzleScore(easiest, secs),
          };
        })
        .sort((a, b) => b.score - a.score || a.timeSeconds - b.timeSeconds);
    }
    return INITIAL_LEADERBOARD;
  } catch {
    return INITIAL_LEADERBOARD;
  }
}

/**
 * Records or updates a player's score locally for the given puzzle based on the easiest clue base chosen that day
 * minus 25 points for every 60 seconds taken.
 */
export function addLeaderboardEntry(
  entry: Omit<LeaderboardEntry, 'id' | 'completedAt' | 'score'>
): LeaderboardEntry[] {
  const current = getLeaderboard();
  const normalizedPlayer = entry.playerName.trim().toLowerCase();

  const existingIndex = current.findIndex(
    (item) =>
      item.puzzleId === entry.puzzleId &&
      item.playerName.trim().toLowerCase() === normalizedPlayer
  );

  let effectiveEasiest = entry.easiestDifficultyUsed;
  if (existingIndex !== -1) {
    effectiveEasiest = getEasierDifficulty(
      current[existingIndex].easiestDifficultyUsed,
      entry.easiestDifficultyUsed
    );
  }

  const finalScore = calculatePuzzleScore(effectiveEasiest, entry.timeSeconds);

  const newEntry: LeaderboardEntry = {
    ...entry,
    gridSize: entry.gridSize === 8 ? 8 : 20,
    easiestDifficultyUsed: effectiveEasiest,
    score: finalScore,
    id:
      existingIndex !== -1
        ? current[existingIndex].id
        : `entry-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    completedAt: getTodayIsoDate(),
  };

  let updated: LeaderboardEntry[];
  if (existingIndex !== -1) {
    updated = [...current];
    updated[existingIndex] = newEntry;
  } else {
    updated = [...current, newEntry];
  }

  updated.sort((a, b) => b.score - a.score || a.timeSeconds - b.timeSeconds);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
  return updated;
}

export function resetLeaderboard(): LeaderboardEntry[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADERBOARD));
    return INITIAL_LEADERBOARD;
  } catch {
    return INITIAL_LEADERBOARD;
  }
}

/**
 * Merges permanent Cloud Firestore leaderboard entries with local fallback entries, deduplicating by (puzzleId, playerName/uid).
 */
export function mergeCloudAndLocalLeaderboards(
  cloudEntries: LeaderboardEntry[],
  localEntries: LeaderboardEntry[]
): LeaderboardEntry[] {
  const map = new Map<string, LeaderboardEntry>();

  // Add local entries first
  for (const item of localEntries) {
    const key = `${item.puzzleId}::${item.playerName.trim().toLowerCase()}`;
    map.set(key, item);
  }

  // Cloud entries take precedence as permanent verified records
  for (const cloudItem of cloudEntries) {
    const key = `${cloudItem.puzzleId}::${cloudItem.playerName
      .trim()
      .toLowerCase()}`;
    map.set(key, { ...cloudItem, isCloudSynced: true });
  }

  return Array.from(map.values()).sort(
    (a, b) => b.score - a.score || a.timeSeconds - b.timeSeconds
  );
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
