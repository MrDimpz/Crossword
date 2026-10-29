import React, { useState, useMemo } from 'react';
import {
  ClueDifficulty,
  LETTER_POINTS_PER_DIFFICULTY,
  LeaderboardEntry,
  PuzzleDefinition,
  VisualTheme,
  VisualThemeId,
} from '../types/crossword';
import { VISUAL_THEMES } from '../data/themes';
import {
  generateArchivePuzzleForDate,
  generateQuick8x8PuzzleForDate,
  getTodayIsoDate,
  WEEKEND_THEME_BANKS,
} from '../data/puzzles';
import { formatDuration } from '../utils/leaderboard';
import {
  X,
  Calendar,
  Search,
  Play,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Clock,
  Zap,
} from 'lucide-react';

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  puzzles: PuzzleDefinition[];
  selectedPuzzleId: string;
  visualThemeId: VisualThemeId;
  clueDifficulty: ClueDifficulty;
  easiestBaseByPuzzle: Record<string, ClueDifficulty>;
  onChangeClueDifficulty: (diff: ClueDifficulty) => void;
  leaderboard: LeaderboardEntry[];
  onSelectAndPlayPuzzle: (puzzle: PuzzleDefinition) => void;
  londonCountdown: string;
}

export const ArchiveModal: React.FC<ArchiveModalProps> = ({
  isOpen,
  onClose,
  puzzles,
  selectedPuzzleId,
  visualThemeId,
  clueDifficulty,
  easiestBaseByPuzzle,
  onChangeClueDifficulty,
  leaderboard,
  onSelectAndPlayPuzzle,
  londonCountdown,
}) => {
  const theme: VisualTheme = VISUAL_THEMES[visualThemeId];
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');
  const [scheduleFilter, setScheduleFilter] = useState<
    'all' | '20x20-standard' | 'quick-8x8' | 'weekday-general' | 'weekend-themed' | 'solved'
  >('all');

  const todayIso = getTodayIsoDate();

  // Map puzzleId -> highest leaderboard score
  const bestByPuzzleId = useMemo(() => {
    const map = new Map<string, LeaderboardEntry>();
    for (const entry of leaderboard) {
      const existing = map.get(entry.puzzleId);
      if (!existing || entry.score > existing.score) {
        map.set(entry.puzzleId, entry);
      }
    }
    return map;
  }, [leaderboard]);

  // Filter puzzles by date picker, text search (date or theme), and schedule/status filter
  const filteredPuzzles = useMemo(() => {
    return puzzles
      .filter((p) => {
        if (selectedDateFilter && p.archiveDate !== selectedDateFilter) {
          return false;
        }
        if (scheduleFilter === '20x20-standard' && p.gridSize !== 20) {
          return false;
        }
        if (scheduleFilter === 'quick-8x8' && p.gridSize !== 8) {
          return false;
        }
        if (
          scheduleFilter === 'weekday-general' &&
          p.editionType !== 'weekday-general'
        ) {
          return false;
        }
        if (
          scheduleFilter === 'weekend-themed' &&
          p.editionType !== 'weekend-themed'
        ) {
          return false;
        }
        if (scheduleFilter === 'solved' && !bestByPuzzleId.has(p.id)) {
          return false;
        }
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          const matchDate =
            p.archiveDate.toLowerCase().includes(q) ||
            p.editionDate.toLowerCase().includes(q) ||
            p.dayOfWeekName.toLowerCase().includes(q);
          const matchTheme = p.themeName.toLowerCase().includes(q);
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchSize = `${p.gridSize}x${p.gridSize}`.includes(q);
          return matchDate || matchTheme || matchTitle || matchSize;
        }
        return true;
      })
      .sort((a, b) => {
        const cmp = b.archiveDate.localeCompare(a.archiveDate);
        if (cmp !== 0) return cmp;
        return b.gridSize - a.gridSize;
      });
  }, [puzzles, selectedDateFilter, scheduleFilter, searchQuery, bestByPuzzleId]);

  if (!isOpen) return null;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDateFilter('');
    setScheduleFilter('all');
  };

  const handleGenerateForDate = (isoDate: string, gridSize: 8 | 20) => {
    const generated =
      gridSize === 8
        ? generateQuick8x8PuzzleForDate(isoDate)
        : generateArchivePuzzleForDate(isoDate);
    onSelectAndPlayPuzzle(generated);
    onClose();
  };

  const handleLaunchWeekendTheme = (themeBankId: string) => {
    const generated = generateArchivePuzzleForDate(todayIso, themeBankId);
    onSelectAndPlayPuzzle(generated);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65"
      role="dialog"
      aria-modal="true"
      aria-labelledby="archive-modal-title"
    >
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border ${theme.borderSubtle} ${theme.bgSurface} ${theme.textPrimary} shadow-xl overflow-hidden`}
      >
        {/* Top-Right Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} hover:opacity-80 transition-opacity cursor-pointer z-10`}
          aria-label="Close daily archive"
          title="Close daily archive"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div
          className={`px-6 pr-16 py-4 border-b ${theme.borderSubtle} flex flex-wrap items-center justify-between gap-4`}
        >
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5" />
            <div>
              <h2
                id="archive-modal-title"
                className="text-xl font-bold font-display"
              >
                Daily Crossword Archive (20×20 &amp; 8×8 Quick)
              </h2>
              <p className={`text-xs ${theme.textMuted}`}>
                New puzzles generate at 00:00 London, UK time · 20×20 Standard
                (Weekday General / Weekend Themed) &amp; 8×8 Daily Quick
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1.5 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} text-xs font-mono-tabular flex items-center gap-1.5`}
              title="Countdown to 00:00 Europe/London daily puzzle release"
            >
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>00:00 London in {londonCountdown}</span>
            </div>
          </div>
        </div>

        {/* Search & Date Filter Toolbar */}
        <div
          className={`px-6 py-3.5 border-b ${theme.borderSubtle} ${theme.bgCanvas} space-y-3`}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search by Date, Day of Week, Size, or Theme */}
            <div className="md:col-span-5 relative">
              <Search
                className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${theme.textMuted}`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search date, 8x8, Film, Television, Sci-Fi..."
                aria-label="Search archive by date or theme"
                className={`w-full pl-9 pr-3 py-2 rounded-lg border ${theme.borderSubtle} ${theme.bgSurface} ${theme.textPrimary} text-xs focus:outline-none`}
              />
            </div>

            {/* Exact Date Picker */}
            <div className="md:col-span-4 flex items-center gap-2">
              <label
                htmlFor="archive-date-picker"
                className={`text-xs font-medium ${theme.textSecondary} whitespace-nowrap shrink-0`}
              >
                Jump to Date:
              </label>
              <input
                id="archive-date-picker"
                type="date"
                value={selectedDateFilter}
                max={todayIso}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className={`flex-1 px-2.5 py-1.5 rounded-lg border ${theme.borderSubtle} ${theme.bgSurface} ${theme.textPrimary} font-mono-tabular text-xs focus:outline-none`}
              />
            </div>

            {/* Clue Difficulty Base Selector */}
            <div className="md:col-span-3 flex items-center justify-end gap-1">
              {(
                [
                  { id: 'easy', label: 'Easy (1k)' },
                  { id: 'medium', label: 'Med (2k)' },
                  { id: 'hard', label: 'Hard (3k)' },
                ] as const
              ).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onChangeClueDifficulty(d.id)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-mono-tabular font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    clueDifficulty === d.id
                      ? `${theme.accentBg} ${theme.accentText} ${theme.accentBorder}`
                      : `${theme.borderSubtle} ${theme.bgSurface} ${theme.textSecondary}`
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule & Format Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'all', label: `All (${puzzles.length})` },
                  { id: '20x20-standard', label: '20×20 Standard' },
                  { id: 'quick-8x8', label: '8×8 Quick Sprint' },
                  { id: 'weekday-general', label: 'Weekdays (General)' },
                  { id: 'weekend-themed', label: 'Weekends (Themed)' },
                  { id: 'solved', label: 'Completed' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setScheduleFilter(tab.id)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    scheduleFilter === tab.id
                      ? `${theme.accentBg} ${theme.accentText}`
                      : `${theme.textSecondary} hover:${theme.textPrimary}`
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              {(searchQuery ||
                selectedDateFilter ||
                scheduleFilter !== 'all') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className={`px-2.5 py-1 rounded-md text-xs ${theme.textMuted} hover:${theme.textPrimary} flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0`}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            <div className={`text-xs ${theme.textMuted} font-mono-tabular`}>
              Showing {filteredPuzzles.length} of {puzzles.length} editions
            </div>
          </div>
        </div>

        {/* Archive List Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 clue-scroll">
          {/* Weekend Special Theme Catalog (Film, TV, Sci-Fi, Music, Gastronomy, etc.) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Weekend Theme Collection (Film, TV, Sci-Fi &amp; Popular Topics)
              </h3>
              <span className={`text-xs ${theme.textMuted}`}>
                Click any theme to solve a 20×20 edition
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {WEEKEND_THEME_BANKS.map((bank) => (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => handleLaunchWeekendTheme(bank.id)}
                  className={`px-3 py-1.5 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} hover:opacity-90 text-xs font-medium flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0`}
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{bank.themeName}</span>
                </button>
              ))}
            </div>
          </div>

          {filteredPuzzles.length === 0 ? (
            <div
              className={`p-8 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} text-center space-y-4`}
            >
              <div className="text-sm font-semibold">
                No pre-loaded archive puzzle matches your filter.
              </div>
              {selectedDateFilter ? (
                <div className="space-y-3">
                  <p className={`text-xs ${theme.textSecondary} max-w-md mx-auto`}>
                    Compile the daily crossword for{' '}
                    <span className="font-mono-tabular font-semibold">
                      {selectedDateFilter}
                    </span>{' '}
                    in either 20×20 Standard or 8×8 Quick format:
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleGenerateForDate(selectedDateFilter, 20)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-semibold ${theme.accentBg} ${theme.accentText} inline-flex items-center gap-2 cursor-pointer`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Solve 20×20 Standard ({selectedDateFilter})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGenerateForDate(selectedDateFilter, 8)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-semibold border ${theme.borderSubtle} ${theme.bgSurface} inline-flex items-center gap-2 cursor-pointer`}
                    >
                      <Zap className="w-4 h-4 text-emerald-500" />
                      <span>Solve 8×8 Quick ({selectedDateFilter})</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className={`px-4 py-2 rounded-lg border ${theme.borderSubtle} text-xs font-medium cursor-pointer`}
                >
                  Show All Archive Dates
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPuzzles.map((puzzle) => {
                const isCurrent = puzzle.id === selectedPuzzleId;
                const bestEntry = bestByPuzzleId.get(puzzle.id);
                const totalClues =
                  puzzle.clues.across.length + puzzle.clues.down.length;
                const lockedBase =
                  easiestBaseByPuzzle[puzzle.id] || clueDifficulty;

                return (
                  <div
                    key={puzzle.id}
                    className={`p-4 rounded-xl border transition-colors flex flex-col justify-between gap-4 ${
                      isCurrent
                        ? `${theme.accentBorder} ${theme.bgElevated}`
                        : `${theme.borderSubtle} ${theme.bgCanvas}`
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div
                          className={`text-xs ${theme.textMuted} font-mono-tabular flex flex-wrap items-center gap-1.5 mb-1`}
                        >
                          <span className="font-semibold text-amber-500">
                            {puzzle.archiveDate}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{puzzle.dayOfWeekName}</span>
                          <span aria-hidden="true">·</span>
                          <span
                            className={
                              puzzle.gridSize === 8
                                ? 'text-emerald-400 font-semibold'
                                : ''
                            }
                          >
                            {puzzle.gridSize === 8
                              ? '8×8 Quick'
                              : puzzle.editionType === 'weekend-themed'
                              ? '20×20 Weekend Themed'
                              : puzzle.editionType === 'weekday-general'
                              ? '20×20 Weekday General'
                              : 'Custom Theme'}
                          </span>
                          {bestEntry && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                                <CheckCircle2 className="w-3 h-3" />
                                Solved
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-base font-bold font-display truncate">
                          {puzzle.title}
                        </h3>

                        <div className={`text-xs ${theme.textSecondary} mt-1`}>
                          <span className="font-semibold">Theme:</span>{' '}
                          <span>{puzzle.themeName}</span>
                        </div>

                        <div
                          className={`text-xs ${theme.textMuted} font-mono-tabular mt-1`}
                        >
                          <span>
                            {puzzle.gridSize}×{puzzle.gridSize} Grid
                          </span>
                          <span className="mx-1.5" aria-hidden="true">
                            ·
                          </span>
                          <span>{totalClues} Clues</span>
                          <span className="mx-1.5" aria-hidden="true">
                            ·
                          </span>
                          <span>
                            Base:{' '}
                            {LETTER_POINTS_PER_DIFFICULTY[lockedBase].toLocaleString()}{' '}
                            pts ({lockedBase.toUpperCase()})
                          </span>
                        </div>
                      </div>

                      {/* Miniature Grid Topology Thumbnail */}
                      <div
                        className={`p-1 rounded border ${theme.borderSubtle} ${theme.bgSurface} shrink-0`}
                        title={`${puzzle.gridSize}×${puzzle.gridSize} Grid Preview — ${puzzle.themeName}`}
                      >
                        <div
                          className="grid gap-[1px]"
                          style={{
                            gridTemplateColumns: `repeat(${puzzle.gridSize}, minmax(0, 1fr))`,
                            width: '52px',
                            height: '52px',
                          }}
                        >
                          {puzzle.grid.map((r, rIdx) =>
                            r.map((c, cIdx) => (
                              <div
                                key={`${rIdx}-${cIdx}`}
                                className={
                                  c.isBlocked
                                    ? 'bg-current opacity-20'
                                    : puzzle.gridSize === 8
                                    ? 'bg-emerald-400 opacity-90'
                                    : 'bg-amber-400 opacity-85'
                                }
                              />
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Row */}
                    <div
                      className={`pt-3 border-t ${theme.borderSubtle} flex items-center justify-between gap-2`}
                    >
                      {bestEntry ? (
                        <div
                          className={`text-xs ${theme.textSecondary} font-mono-tabular`}
                        >
                          <span>
                            Fixed Score: {bestEntry.score.toLocaleString()} pts (
                            {bestEntry.easiestDifficultyUsed.toUpperCase()})
                          </span>
                          <span className="mx-1.5" aria-hidden="true">
                            ·
                          </span>
                          <span>{formatDuration(bestEntry.timeSeconds)}</span>
                        </div>
                      ) : (
                        <div className={`text-xs ${theme.textMuted}`}>
                          Not yet completed
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          onSelectAndPlayPuzzle(puzzle);
                          onClose();
                        }}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold ${theme.accentBg} ${theme.accentText} flex items-center gap-1.5 hover:opacity-95 cursor-pointer whitespace-nowrap shrink-0`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>
                          {isCurrent ? 'Play Selected' : 'Solve Edition'}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
