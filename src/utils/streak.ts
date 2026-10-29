import { LeaderboardEntry } from '../types/crossword';
import { getTodayIsoDate } from '../data/puzzles';

const STREAK_DATES_STORAGE_KEY = 'cruciverbalist_daily_streak_dates_v1';

export interface DailyStreakSummary {
  currentStreak: number;
  longestStreak: number;
  totalDaysSolved: number;
  solvedToday: boolean;
  lastSolvedDate: string | null;
  last7Days: Array<{
    isoDate: string;
    dayShort: string;
    solved: boolean;
    isToday: boolean;
  }>;
}

/**
 * Helper to step backward or forward by N days from a YYYY-MM-DD ISO date string in UTC.
 */
export function shiftIsoDate(isoDate: string, deltaDays: number): string {
  const parsed = new Date(`${isoDate}T12:00:00Z`);
  if (isNaN(parsed.getTime())) return isoDate;
  const shifted = new Date(parsed.getTime() + deltaDays * 86400000);
  const yyyy = shifted.getUTCFullYear();
  const mm = String(shifted.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(shifted.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Reads the list of YYYY-MM-DD dates on which the local player solved at least one daily crossword.
 */
export function getStoredSolvedDates(): string[] {
  try {
    const raw = localStorage.getItem(STREAK_DATES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (d): d is string => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)
      );
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Records a YYYY-MM-DD date as solved for the daily streak counter.
 */
export function recordDailyPuzzleSolvedDate(
  isoDate: string = getTodayIsoDate()
): string[] {
  const cleanDate = isoDate.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
    return getStoredSolvedDates();
  }
  const existing = new Set<string>(getStoredSolvedDates());
  existing.add(cleanDate);
  const sorted = Array.from(existing).sort();
  try {
    localStorage.setItem(STREAK_DATES_STORAGE_KEY, JSON.stringify(sorted));
  } catch {
    // ignore storage errors
  }
  return sorted;
}

/**
 * Calculates the player's current consecutive daily streak, longest streak, and 7-day history
 * anchored to 00:00 London, UK time.
 */
export function calculateDailyStreak(
  localSolvedDates: string[],
  leaderboardEntries: LeaderboardEntry[],
  currentUid?: string | null,
  playerDisplayName?: string | null,
  todayIso: string = getTodayIsoDate()
): DailyStreakSummary {
  const dateSet = new Set<string>();

  for (const d of localSolvedDates) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      dateSet.add(d);
    }
  }

  // Merge cloud/leaderboard entries belonging to the signed-in player
  if (currentUid || playerDisplayName) {
    const normName = playerDisplayName?.trim().toLowerCase();
    for (const entry of leaderboardEntries) {
      const matchesUid = Boolean(currentUid && entry.uid === currentUid);
      const matchesName = Boolean(
        normName &&
          entry.isCloudSynced &&
          entry.playerName.trim().toLowerCase() === normName
      );
      if (matchesUid || matchesName) {
        const d = entry.completedAt.slice(0, 10);
        if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
          dateSet.add(d);
        }
        // Also check if puzzleId encodes a daily date (e.g., daily-YYYY-MM-DD or quick8x8-YYYY-MM-DD)
        const matchPuzzleDate = entry.puzzleId.match(/(\d{4}-\d{2}-\d{2})/);
        if (matchPuzzleDate && matchPuzzleDate[1] <= todayIso) {
          dateSet.add(matchPuzzleDate[1]);
        }
      }
    }
  }

  const sortedDates = Array.from(dateSet).sort();
  const solvedToday = dateSet.has(todayIso);
  const yesterdayIso = shiftIsoDate(todayIso, -1);

  // Calculate current streak:
  // Starts from todayIso if solvedToday is true, or from yesterdayIso if yesterday was solved (streak still alive today!)
  let currentStreak = 0;
  let cursorDate: string | null = null;
  if (solvedToday) {
    cursorDate = todayIso;
  } else if (dateSet.has(yesterdayIso)) {
    cursorDate = yesterdayIso;
  }

  while (cursorDate && dateSet.has(cursorDate)) {
    currentStreak++;
    cursorDate = shiftIsoDate(cursorDate, -1);
  }

  // Calculate longest streak across all sorted dates
  let longestStreak = 0;
  let runningStreak = 0;
  let prevDate: string | null = null;

  for (const d of sortedDates) {
    if (!prevDate) {
      runningStreak = 1;
    } else if (shiftIsoDate(prevDate, 1) === d) {
      runningStreak++;
    } else if (prevDate !== d) {
      runningStreak = 1;
    }
    if (runningStreak > longestStreak) {
      longestStreak = runningStreak;
    }
    prevDate = d;
  }

  // Build 7-day visual strip ending at todayIso
  const last7Days: DailyStreakSummary['last7Days'] = [];
  for (let offset = 6; offset >= 0; offset--) {
    const dIso = shiftIsoDate(todayIso, -offset);
    const parsed = new Date(`${dIso}T12:00:00Z`);
    const dayShort = isNaN(parsed.getTime())
      ? dIso.slice(8, 10)
      : parsed.toLocaleDateString('en-GB', {
          weekday: 'short',
          timeZone: 'UTC',
        });
    last7Days.push({
      isoDate: dIso,
      dayShort,
      solved: dateSet.has(dIso),
      isToday: offset === 0,
    });
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalDaysSolved: sortedDates.length,
    solvedToday,
    lastSolvedDate:
      sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : null,
    last7Days,
  };
}
