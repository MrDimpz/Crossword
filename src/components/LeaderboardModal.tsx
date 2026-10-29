import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  ClueDifficulty,
  LETTER_POINTS_PER_DIFFICULTY,
  LeaderboardEntry,
  PlayerProfile,
  PuzzleDefinition,
  VisualTheme,
  VisualThemeId,
} from '../types/crossword';
import { VISUAL_THEMES } from '../data/themes';
import { formatDuration } from '../utils/leaderboard';
import {
  X,
  Trophy,
  Award,
  Cloud,
  UserCheck,
  LogIn,
  ShieldCheck,
} from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  puzzles: PuzzleDefinition[];
  visualThemeId: VisualThemeId;
  currentUser?: User | null;
  playerProfile?: PlayerProfile | null;
  onOpenAuthModal?: () => void;
  activeSessionStats?: {
    puzzleId: string;
    puzzleTitle: string;
    themeName: string;
    gridSize: 8 | 20;
    score: number;
    timeSeconds: number;
    hintsUsed: number;
    easiestDifficultyUsed: ClueDifficulty;
    clueDifficulty: ClueDifficulty;
    accuracy: number;
    progressPercent: number;
  };
  onRecordCurrentScore?: (playerName: string) => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  entries,
  puzzles,
  visualThemeId,
  currentUser,
  playerProfile,
  onOpenAuthModal,
  activeSessionStats,
  onRecordCurrentScore,
}) => {
  const theme: VisualTheme = VISUAL_THEMES[visualThemeId];
  const [filterPuzzleId, setFilterPuzzleId] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<'all' | 20 | 8>('all');
  const [playerName, setPlayerName] = useState<string>('');
  const [hasSubmittedCurrent, setHasSubmittedCurrent] = useState<boolean>(false);

  useEffect(() => {
    if (playerProfile?.displayName) {
      setPlayerName(playerProfile.displayName);
    } else if (currentUser?.displayName) {
      setPlayerName(currentUser.displayName);
    }
  }, [playerProfile, currentUser]);

  if (!isOpen) return null;

  const filteredEntries = entries.filter((e) => {
    if (formatFilter !== 'all' && e.gridSize !== formatFilter) return false;
    if (filterPuzzleId !== 'all' && e.puzzleId !== filterPuzzleId) return false;
    return true;
  });

  const handleSaveCurrentRun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onRecordCurrentScore || !playerName.trim()) return;
    onRecordCurrentScore(playerName.trim());
    setHasSubmittedCurrent(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leaderboard-modal-title"
    >
      <div
        className={`relative w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl border ${theme.borderSubtle} ${theme.bgSurface} ${theme.textPrimary} shadow-xl overflow-hidden`}
      >
        {/* Top-Right Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} hover:opacity-80 transition-opacity cursor-pointer z-10`}
          aria-label="Close scoreboard"
          title="Close scoreboard"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div
          className={`px-6 pr-16 py-4 border-b ${theme.borderSubtle} flex flex-wrap items-center justify-between gap-3`}
        >
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-500" />
            <div>
              <h2
                id="leaderboard-modal-title"
                className="text-xl font-bold font-display"
              >
                Permanent Cloud &amp; Local Scoreboard
              </h2>
              <p className={`text-xs ${theme.textMuted}`}>
                Base score by easiest clue tier chosen (Hard: 3,000 · Medium:
                2,000 · Easy: 1,000) minus 25 pts per 60s taken
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAuthModal && (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className={`px-3 py-1.5 rounded-lg border ${
                  currentUser
                    ? `${theme.accentBorder} ${theme.bgElevated}`
                    : `${theme.accentBg} ${theme.accentText}`
                } text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0`}
              >
                {currentUser ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>
                      {playerProfile?.displayName ||
                        currentUser.displayName ||
                        'Account'}
                    </span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Register / Sign In</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div
          className={`px-6 py-3 border-b ${theme.borderSubtle} ${theme.bgCanvas} space-y-2.5`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {(
                [
                  { id: 'all', label: 'All Formats' },
                  { id: 20, label: '20×20 Standard' },
                  { id: 8, label: '8×8 Quick' },
                ] as const
              ).map((fmt) => (
                <button
                  key={String(fmt.id)}
                  type="button"
                  onClick={() => setFormatFilter(fmt.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    formatFilter === fmt.id
                      ? `${theme.accentBg} ${theme.accentText}`
                      : `${theme.textSecondary} hover:${theme.textPrimary}`
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            <div className={`text-xs ${theme.textMuted} flex items-center gap-1.5`}>
              <Cloud className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                {currentUser
                  ? 'Signed in — scores permanently synced to Cloud'
                  : 'Sign in to permanently sync scores across devices'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilterPuzzleId('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filterPuzzleId === 'all'
                  ? `${theme.bgElevated} font-bold underline`
                  : `${theme.textSecondary} hover:${theme.textPrimary}`
              }`}
            >
              All Editions ({entries.length})
            </button>
            {puzzles.slice(0, 6).map((p) => {
              const active = filterPuzzleId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setFilterPuzzleId(p.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono-tabular transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? `${theme.bgElevated} font-bold underline`
                      : `${theme.textSecondary} hover:${theme.textPrimary}`
                  }`}
                >
                  {p.archiveDate} ({p.gridSize}×{p.gridSize})
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Current Active Session Score Log Bar */}
        {activeSessionStats &&
          !hasSubmittedCurrent &&
          onRecordCurrentScore && (
            <form
              onSubmit={handleSaveCurrentRun}
              className={`px-6 py-3.5 border-b ${theme.borderSubtle} ${theme.bgElevated} flex flex-wrap items-center justify-between gap-3`}
            >
              <div className="text-xs">
                <span className="font-semibold">
                  {activeSessionStats.gridSize}×{activeSessionStats.gridSize}{' '}
                  Points Scored:{' '}
                </span>
                <span className="font-mono-tabular font-bold">
                  {activeSessionStats.score.toLocaleString()} pts
                </span>
                <span className={`mx-1.5 ${theme.textMuted}`} aria-hidden="true">
                  ·
                </span>
                <span className="font-mono-tabular capitalize">
                  Base: {activeSessionStats.easiestDifficultyUsed} (
                  {LETTER_POINTS_PER_DIFFICULTY[
                    activeSessionStats.easiestDifficultyUsed
                  ]}{' '}
                  pts/ltr)
                </span>
                <span className={`mx-1.5 ${theme.textMuted}`} aria-hidden="true">
                  ·
                </span>
                <span className="font-mono-tabular">
                  {activeSessionStats.progressPercent}% Grid
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  maxLength={40}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name to lock score..."
                  className={`px-3 py-1.5 rounded-lg border ${theme.borderSubtle} ${theme.bgSurface} text-xs focus:outline-none`}
                />
                <button
                  type="submit"
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold ${theme.accentBg} ${theme.accentText} whitespace-nowrap shrink-0 cursor-pointer`}
                >
                  {currentUser ? 'Sync Cloud Score' : 'Post Fixed Score'}
                </button>
              </div>
            </form>
          )}

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto p-6 clue-scroll">
          {filteredEntries.length === 0 ? (
            <div className={`text-center py-12 ${theme.textMuted} text-sm`}>
              No leaderboard entries recorded for this filter yet. Solve the
              puzzle to claim the top rank!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr
                    className={`border-b ${theme.borderSubtle} text-xs ${theme.textMuted}`}
                  >
                    <th className="py-2.5 pr-3 font-medium">Rank</th>
                    <th className="py-2.5 px-3 font-medium">Cruciverbalist</th>
                    <th className="py-2.5 px-3 font-medium">
                      Edition, Format &amp; Easiest Base
                    </th>
                    <th className="py-2.5 px-3 font-medium text-right">Time</th>
                    <th className="py-2.5 pl-3 font-medium text-right">
                      Fixed Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-500/15 text-sm">
                  {filteredEntries.map((item, idx) => (
                    <tr key={item.id} className="hover:opacity-95">
                      <td className="py-3 pr-3 font-mono-tabular font-semibold">
                        <span className="inline-flex items-center gap-1">
                          {idx === 0 && (
                            <Award className="w-4 h-4 text-amber-500" />
                          )}
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span>{item.playerName}</span>
                          {item.isCloudSynced && (
                            <span
                              title="Permanently verified Cloud Leaderboard record"
                              className="inline-flex shrink-0"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            </span>
                          )}
                        </div>
                        <div
                          className={`text-xs ${theme.textMuted} font-normal font-mono-tabular`}
                        >
                          {item.completedAt} · {item.accuracy}% Accuracy
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-xs font-medium">
                          <span className="font-mono-tabular font-bold">
                            {item.gridSize}×{item.gridSize}
                          </span>{' '}
                          · {item.themeName}
                        </div>
                        <div className={`text-xs ${theme.textMuted} capitalize`}>
                          Easiest Base:{' '}
                          {item.easiestDifficultyUsed === 'hard'
                            ? 'Hard (Cryptic · 3,000)'
                            : item.easiestDifficultyUsed === 'medium'
                            ? 'Medium (Wordplay · 2,000)'
                            : 'Easy (Direct · 1,000)'}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono-tabular text-xs">
                        {formatDuration(item.timeSeconds)}
                      </td>
                      <td className="py-3 pl-3 text-right font-mono-tabular font-bold">
                        {item.score.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
