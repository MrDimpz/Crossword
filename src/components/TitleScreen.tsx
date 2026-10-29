import React, { useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  ClueDifficulty,
  FIXED_DIFFICULTY_SCORES,
  GridSizeOption,
  LeaderboardEntry,
  PlayerProfile,
  PuzzleDefinition,
  VisualTheme,
  VisualThemeId,
} from '../types/crossword';
import { VISUAL_THEMES } from '../data/themes';
import { formatDuration } from '../utils/leaderboard';
import { DailyStreakSummary } from '../utils/streak';
import {
  Play,
  Trophy,
  Sparkles,
  Volume2,
  VolumeX,
  Palette,
  Calendar,
  Clock,
  UserCheck,
  LogIn,
  Grid,
  Zap,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface TitleScreenProps {
  puzzles: PuzzleDefinition[];
  selectedPuzzleId: string;
  onSelectPuzzle: (id: string) => void;
  visualThemeId: VisualThemeId;
  onSelectVisualTheme: (id: VisualThemeId) => void;
  clueDifficulty: ClueDifficulty;
  easiestBaseForSelected: ClueDifficulty;
  onSelectClueDifficulty: (difficulty: ClueDifficulty) => void;
  onStartGame: () => void;
  onOpenArchive: () => void;
  onOpenLeaderboard: () => void;
  onOpenAuthModal: () => void;
  currentUser: User | null;
  playerProfile: PlayerProfile | null;
  streakSummary: DailyStreakSummary;
  areElementsVisible: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  topScores: LeaderboardEntry[];
  londonCountdown: string;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  puzzles,
  selectedPuzzleId,
  onSelectPuzzle,
  visualThemeId,
  onSelectVisualTheme,
  clueDifficulty,
  easiestBaseForSelected,
  onSelectClueDifficulty,
  onStartGame,
  onOpenArchive,
  onOpenLeaderboard,
  onOpenAuthModal,
  currentUser,
  playerProfile,
  streakSummary,
  areElementsVisible,
  isMuted,
  onToggleMute,
  topScores,
  londonCountdown,
}) => {
  const theme: VisualTheme = VISUAL_THEMES[visualThemeId];
  const selectedPuzzle =
    puzzles.find((p) => p.id === selectedPuzzleId) || puzzles[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onStartGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartGame]);

  const bestForSelected = topScores.find(
    (s) => s.puzzleId === selectedPuzzle.id
  );

  // Switch between today's 20x20 Standard and 8x8 Quick Crossword on the same date if available
  const handleSelectGridFormat = (targetSize: GridSizeOption) => {
    const sameDateMatch = puzzles.find(
      (p) =>
        p.archiveDate === selectedPuzzle.archiveDate &&
        p.gridSize === targetSize
    );
    if (sameDateMatch) {
      onSelectPuzzle(sameDateMatch.id);
      return;
    }
    const firstSizeMatch = puzzles.find((p) => p.gridSize === targetSize);
    if (firstSizeMatch) {
      onSelectPuzzle(firstSizeMatch.id);
    }
  };

  // Show featured editions matching the currently selected gridSize (or top 4)
  const matchingSizePuzzles = puzzles.filter(
    (p) => p.gridSize === selectedPuzzle.gridSize
  );
  const featuredPuzzles = (
    matchingSizePuzzles.length > 0 ? matchingSizePuzzles : puzzles
  ).slice(0, 4);

  const lockedFixedScore = FIXED_DIFFICULTY_SCORES[easiestBaseForSelected];

  return (
    <div
      className={`min-h-screen w-full app-main-bg ${theme.textPrimary} flex flex-col justify-between relative overflow-hidden select-none transition-colors duration-200`}
    >
      <div
        className={`min-h-screen w-full flex flex-col justify-between relative game-elements-fade ${
          areElementsVisible ? 'game-elements-fade-visible' : 'pointer-events-none'
        }`}
      >
        {/* Subtle Ambient Veil to harmonize board surface palette with main background image */}
        <div
          className={`pointer-events-none absolute inset-0 ${
            visualThemeId === 'editorial' ? 'bg-white/15' : 'bg-black/25'
          } transition-colors duration-200`}
          aria-hidden="true"
        />

        {/* Top Perimeter Utility Bar */}
      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-6 pt-5 flex flex-wrap items-center justify-between gap-4">
        <div
          className={`flex flex-wrap items-center gap-2.5 text-xs tracking-wide px-4 py-2 rounded-xl border ${theme.borderSubtle} ${theme.bgSurface} shadow-sm`}
        >
          <span className="font-semibold">Cruciverbalist Daily</span>
          <span className={theme.textMuted} aria-hidden="true">
            ·
          </span>
          <span className={theme.textSecondary}>
            Generates 00:00 London, UK
          </span>
          <span className={theme.textMuted} aria-hidden="true">
            ·
          </span>
          <span
            className={`${theme.textSecondary} font-mono-tabular inline-flex items-center gap-1`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Next in {londonCountdown}</span>
          </span>
          <span className={theme.textMuted} aria-hidden="true">
            ·
          </span>
          <span className="font-mono-tabular font-semibold inline-flex items-center gap-1 text-amber-500">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>
              {streakSummary.currentStreak}{' '}
              {streakSummary.currentStreak === 1 ? 'Day' : 'Days'} Streak
            </span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Player Account Registration / Login Button */}
          <button
            type="button"
            onClick={onOpenAuthModal}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg border ${
              currentUser
                ? `${theme.accentBorder} ${theme.bgElevated}`
                : `${theme.accentBg} ${theme.accentText}`
            } hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer`}
          >
            {currentUser ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  {playerProfile?.displayName ||
                    currentUser.displayName ||
                    'Player'}
                </span>
                <span className={`font-mono-tabular ${theme.textMuted}`}>
                  · {(playerProfile?.totalScore || 0).toLocaleString()} pts
                </span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                <span>Register / Sign In</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenArchive}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg border ${theme.borderSubtle} ${theme.bgSurface} ${theme.textPrimary} hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Daily Archive ({puzzles.length})</span>
          </button>

          <button
            type="button"
            onClick={onOpenLeaderboard}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg border ${theme.borderSubtle} ${theme.bgSurface} ${theme.textPrimary} hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Scoreboard ({topScores.length})</span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            className={`p-2 rounded-lg border ${theme.borderSubtle} ${theme.bgSurface} ${theme.textPrimary} hover:opacity-90 transition-opacity cursor-pointer`}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main Centerpiece & Setup Stage */}
      <main className="relative z-10 w-full max-w-[1360px] mx-auto px-6 py-5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Bespoke SVG Lockup + Daily Streak Counter Card + Format Switcher + Live Preview + Primary Start CTA */}
        <div className="lg:col-span-7 flex flex-col items-start">
          <div
            className={`w-full max-w-xl p-5 rounded-2xl border ${theme.borderSubtle} ${theme.bgSurface} shadow-lg mb-4`}
          >
            <div className="mb-3">
              <svg
                viewBox="0 0 580 96"
                className="w-full max-w-[540px] h-auto"
                role="img"
                aria-label="Cruciverbalist 20x20 & 8x8 Daily Crossword"
              >
              <g transform="translate(4, 10)">
                <rect
                  x="0"
                  y="0"
                  width="72"
                  height="72"
                  rx="6"
                  fill="currentColor"
                  fillOpacity="0.1"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="24"
                  y1="0"
                  x2="24"
                  y2="72"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                />
                <line
                  x1="48"
                  y1="0"
                  x2="48"
                  y2="72"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                />
                <line
                  x1="0"
                  y1="24"
                  x2="72"
                  y2="24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                />
                <line
                  x1="0"
                  y1="48"
                  x2="72"
                  y2="48"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                />
                <rect
                  x="48"
                  y="0"
                  width="24"
                  height="24"
                  fill="currentColor"
                  fillOpacity="0.85"
                />
                <rect
                  x="0"
                  y="48"
                  width="24"
                  height="24"
                  fill="currentColor"
                  fillOpacity="0.85"
                />
                <text
                  x="12"
                  y="17"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="13"
                  fontWeight="700"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {selectedPuzzle.gridSize === 8 ? '0' : '2'}
                </text>
                <text
                  x="36"
                  y="17"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="13"
                  fontWeight="700"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {selectedPuzzle.gridSize === 8 ? '8' : '0'}
                </text>
                <text
                  x="36"
                  y="41"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="13"
                  fontWeight="700"
                  fontFamily="JetBrains Mono, monospace"
                >
                  ×
                </text>
                <text
                  x="36"
                  y="65"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="13"
                  fontWeight="700"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {selectedPuzzle.gridSize === 8 ? '0' : '2'}
                </text>
                <text
                  x="60"
                  y="65"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="13"
                  fontWeight="700"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {selectedPuzzle.gridSize === 8 ? '8' : '0'}
                </text>
              </g>

              <text
                x="92"
                y="46"
                fill="currentColor"
                fontFamily="Fraunces, Georgia, serif"
                fontSize="38"
                fontWeight="700"
                letterSpacing="-0.02em"
              >
                CRUCIVERBALIST
              </text>
              <text
                x="94"
                y="74"
                fill="currentColor"
                fillOpacity="0.72"
                fontFamily="JetBrains Mono, monospace"
                fontSize="13"
                fontWeight="600"
                letterSpacing="0.12em"
              >
                DAILY 20×20 STANDARD &amp; 8×8 QUICK CROSSWORDS
              </text>
              </svg>
            </div>

            <p
              className={`text-sm sm:text-base ${theme.textSecondary} max-w-xl leading-relaxed`}
            >
              New crosswords generate daily at{' '}
              <strong>00:00 London, UK time</strong>: choose between the full{' '}
              <strong>20×20 Standard Edition</strong> (General Knowledge
              Mon–Fri, Weekend Themes Sat–Sun) or the fast-paced{' '}
              <strong>8×8 Daily Quick Crossword</strong>.
            </p>
          </div>

          {/* Daily Streak Counter & 7-Day Consecutive Progress Card */}
          <div
            className={`w-full max-w-xl p-4 rounded-xl border ${theme.borderSubtle} ${theme.bgSurface} mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
            aria-label="Daily Crossword Streak Counter"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
                <Flame className="w-6 h-6 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold font-mono-tabular">
                    {streakSummary.currentStreak}{' '}
                    {streakSummary.currentStreak === 1 ? 'Day' : 'Days'}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                    Daily Streak
                  </span>
                </div>
                <div
                  className={`text-xs ${theme.textSecondary} font-mono-tabular mt-0.5 flex flex-wrap items-center gap-1.5`}
                >
                  <span>Best Streak: {streakSummary.longestStreak}d</span>
                  <span aria-hidden="true">·</span>
                  {streakSummary.solvedToday ? (
                    <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Today’s Daily Completed</span>
                    </span>
                  ) : (
                    <span>Solve any daily puzzle today to extend</span>
                  )}
                </div>
              </div>
            </div>

            {/* 7-Day London Calendar Strip */}
            <div className="flex items-center gap-1.5 shrink-0">
              {streakSummary.last7Days.map((day) => (
                <div
                  key={day.isoDate}
                  title={`${day.isoDate}: ${
                    day.solved ? 'Solved' : 'Not yet solved'
                  }`}
                  className={`w-8 py-1.5 rounded-lg border text-center font-mono-tabular ${
                    day.solved
                      ? 'border-amber-500/50 bg-amber-500/15 text-amber-500 font-bold'
                      : day.isToday
                      ? `${theme.accentBorder} ${theme.bgElevated}`
                      : `${theme.borderSubtle} ${theme.bgCanvas} ${theme.textMuted}`
                  }`}
                >
                  <div className="text-[10px] leading-none">{day.dayShort}</div>
                  <div className="text-[11px] mt-1 leading-none">
                    {day.solved ? '✓' : day.isoDate.slice(8, 10)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Grid Size Switcher: 20x20 Standard vs 8x8 Quick */}
          <div className="w-full max-w-xl grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => handleSelectGridFormat(20)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                selectedPuzzle.gridSize === 20
                  ? `${theme.accentBorder} ${theme.bgElevated} shadow-sm`
                  : `${theme.borderSubtle} ${theme.bgSurface} opacity-80 hover:opacity-100`
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold font-mono-tabular">
                  <Grid className="w-3.5 h-3.5 text-amber-500" />
                  <span>20×20 STANDARD</span>
                </div>
                <div className={`text-[11px] ${theme.textSecondary} mt-0.5`}>
                  Full 30+ Clue Daily Edition
                </div>
              </div>
              <span className="text-xs font-mono-tabular font-bold">20×20</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectGridFormat(8)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                selectedPuzzle.gridSize === 8
                  ? `${theme.accentBorder} ${theme.bgElevated} shadow-sm`
                  : `${theme.borderSubtle} ${theme.bgSurface} opacity-80 hover:opacity-100`
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold font-mono-tabular">
                  <Zap className="w-3.5 h-3.5 text-emerald-500" />
                  <span>8×8 QUICK SPRINT</span>
                </div>
                <div className={`text-[11px] ${theme.textSecondary} mt-0.5`}>
                  Bite-sized ~3 Minute Daily Grid
                </div>
              </div>
              <span className="text-xs font-mono-tabular font-bold">8×8</span>
            </button>
          </div>

          {/* Interactive Selected Puzzle Preview Strip */}
          <div
            className={`w-full max-w-xl p-5 rounded-xl border ${theme.borderSubtle} ${theme.bgSurface} mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
          >
            <div>
              <div
                className={`text-xs ${theme.textMuted} mb-1 font-mono-tabular`}
              >
                <span className="font-semibold text-amber-500">
                  {selectedPuzzle.archiveDate} ({selectedPuzzle.dayOfWeekName})
                </span>
                <span className="mx-1.5" aria-hidden="true">
                  ·
                </span>
                <span>
                  {selectedPuzzle.editionType === 'quick-8x8'
                    ? '8×8 Quick Daily Sprint'
                    : selectedPuzzle.editionType === 'weekend-themed'
                    ? `Weekend Theme: ${selectedPuzzle.themeName}`
                    : selectedPuzzle.editionType === 'weekday-general'
                    ? 'Weekday General 20×20'
                    : `Custom Theme: ${selectedPuzzle.themeName}`}
                </span>
              </div>
              <h2 className="text-xl font-bold font-display">
                {selectedPuzzle.title}
              </h2>
              <div
                className={`text-xs ${theme.textSecondary} mt-1.5 font-mono-tabular`}
              >
                <span>
                  {selectedPuzzle.gridSize}×{selectedPuzzle.gridSize} Grid
                </span>
                <span className="mx-1.5" aria-hidden="true">
                  ·
                </span>
                <span>
                  Fixed Base: {lockedFixedScore.toLocaleString()} pts (
                  {easiestBaseForSelected.toUpperCase()})
                </span>
                <span className="mx-1.5" aria-hidden="true">
                  ·
                </span>
                <span>
                  {selectedPuzzle.clues.across.length +
                    selectedPuzzle.clues.down.length}{' '}
                  Clues
                </span>
              </div>
            </div>

            {/* Live Miniature Grid Silhouette Preview (20x20 or 8x8) with Solid Black Crossword Background */}
            <div
              className={`relative p-1.5 rounded-lg border ${theme.borderSubtle} bg-black overflow-hidden shrink-0`}
              title={`Live ${selectedPuzzle.gridSize}×${selectedPuzzle.gridSize} Grid Topology Preview`}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 crossword-board-bg"
              />
              <div
                className="relative z-10 grid gap-[1px]"
                style={{
                  gridTemplateColumns: `repeat(${selectedPuzzle.gridSize}, minmax(0, 1fr))`,
                  width: '80px',
                  height: '80px',
                }}
              >
                {selectedPuzzle.grid.map((row, rIdx) =>
                  row.map((cell, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={
                        cell.isBlocked
                          ? 'bg-black opacity-100'
                          : 'bg-white opacity-100'
                      }
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Primary Start CTA + Archive Explorer Button */}
          <div className="flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={onStartGame}
              className={`px-7 py-3.5 rounded-xl font-semibold text-base ${theme.accentBg} ${theme.accentText} shadow-sm transition-transform active:scale-[0.99] flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                Start {selectedPuzzle.gridSize}×{selectedPuzzle.gridSize} Puzzle
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenArchive}
              className={`px-5 py-3.5 rounded-xl font-semibold text-sm border ${theme.borderSubtle} ${theme.bgSurface} ${theme.textPrimary} hover:opacity-90 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer`}
            >
              <Calendar className="w-4 h-4" />
              <span>Archive &amp; Weekend Themes</span>
            </button>

            {bestForSelected && (
              <div
                className={`w-full text-xs ${theme.textSecondary} font-mono-tabular mt-1`}
              >
                <span>
                  Edition Record: {bestForSelected.score.toLocaleString()} pts (
                  {bestForSelected.easiestDifficultyUsed.toUpperCase()} Base)
                </span>
                <span className="mx-1.5" aria-hidden="true">
                  ·
                </span>
                <span>{formatDuration(bestForSelected.timeSeconds)}</span>
                <span className="mx-1.5" aria-hidden="true">
                  ·
                </span>
                <span>by {bestForSelected.playerName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Clue Base Scoring Selector, Daily Schedule & Visual Palette */}
        <div
          className={`lg:col-span-5 p-6 rounded-2xl border ${theme.borderSubtle} ${theme.bgSurface} flex flex-col gap-5`}
        >
          {/* 1. Clue Difficulty & Fixed Score Base System */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-sm font-semibold tracking-tight flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>01. Select Clue Difficulty Base</span>
              </h3>
              <span className={`text-xs ${theme.textMuted} font-mono-tabular`}>
                Fixed Today: {lockedFixedScore.toLocaleString()} pts
              </span>
            </div>
            <p className={`text-[11px] ${theme.textMuted} mb-2`}>
              Your score for a puzzle is fixed to the easiest clue base you
              select that day.
            </p>
            <div
              className={`grid grid-cols-3 gap-1.5 p-1 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas}`}
            >
              {(
                [
                  {
                    id: 'easy',
                    label: 'Easy · 1,000',
                    desc: 'Direct definitions',
                  },
                  {
                    id: 'medium',
                    label: 'Medium · 2,000',
                    desc: 'Clever wordplay',
                  },
                  {
                    id: 'hard',
                    label: 'Hard · 3,000',
                    desc: 'Complex cryptic',
                  },
                ] as const
              ).map((opt) => {
                const active = clueDifficulty === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onSelectClueDifficulty(opt.id)}
                    className={`py-2 px-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                      active
                        ? `${theme.accentBg} ${theme.accentText}`
                        : `${theme.textSecondary} hover:${theme.textPrimary}`
                    }`}
                  >
                    <div className="text-xs font-bold font-mono-tabular whitespace-nowrap">
                      {opt.label}
                    </div>
                    <div className="text-[10px] opacity-85 truncate">
                      {opt.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Daily Crossword Schedule (20x20 Standard or 8x8 Quick) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold tracking-tight">
                02. Recent {selectedPuzzle.gridSize}×{selectedPuzzle.gridSize}{' '}
                Editions (00:00 London)
              </h3>
              <button
                type="button"
                onClick={onOpenArchive}
                className="text-xs font-semibold underline cursor-pointer whitespace-nowrap shrink-0"
              >
                All {puzzles.length} Editions →
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {featuredPuzzles.map((p) => {
                const isSelected = p.id === selectedPuzzle.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectPuzzle(p.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? `${theme.accentBorder} ${theme.bgElevated}`
                        : `${theme.borderSubtle} hover:opacity-90`
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">
                        {p.title}
                      </div>
                      <div
                        className={`text-xs ${theme.textMuted} truncate mt-0.5 font-mono-tabular`}
                      >
                        <span>{p.archiveDate}</span>
                        <span className="mx-1.5" aria-hidden="true">
                          ·
                        </span>
                        <span>
                          {p.gridSize}×{p.gridSize}
                        </span>
                        <span className="mx-1.5" aria-hidden="true">
                          ·
                        </span>
                        <span>
                          {p.editionType === 'quick-8x8'
                            ? 'Daily Quick Sprint'
                            : p.editionType === 'weekend-themed'
                            ? `Weekend: ${p.themeName}`
                            : 'Weekday General'}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-mono-tabular whitespace-nowrap shrink-0 ${
                        isSelected ? 'font-bold underline' : theme.textMuted
                      }`}
                    >
                      {isSelected ? 'Active' : 'Select'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Visual Board Theme */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold tracking-tight flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>03. Board Surface Palette</span>
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(VISUAL_THEMES) as VisualThemeId[]).map((tKey) => {
                const tObj = VISUAL_THEMES[tKey];
                const active = visualThemeId === tKey;
                return (
                  <button
                    key={tKey}
                    type="button"
                    onClick={() => onSelectVisualTheme(tKey)}
                    className={`px-3 py-2 rounded-lg border text-left transition-colors cursor-pointer ${
                      active
                        ? `${theme.accentBorder} ${theme.bgElevated}`
                        : `${theme.borderSubtle} hover:opacity-85`
                    }`}
                  >
                    <div className="text-xs font-semibold whitespace-nowrap truncate">
                      {tObj.name}
                    </div>
                    <div className={`text-[11px] ${theme.textMuted} truncate`}>
                      {tObj.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Flat Control-Hint Line */}
      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-6 pb-5">
        <div
          className={`px-4 py-2.5 rounded-xl border ${theme.borderSubtle} ${theme.bgSurface} shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs`}
        >
          <div className={`${theme.textMuted} font-mono-tabular tracking-wide`}>
            Enter / Space Start Game · Arrows Navigate Grid · Tab Next Clue ·
            Space Switch Across/Down · Esc Pause
          </div>
          <div className={`${theme.textMuted} font-mono-tabular`}>
            Generates Daily at 00:00 London, UK · 20×20 Standard &amp; 8×8 Quick
            Editions
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
