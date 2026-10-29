/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  calculatePuzzleScore,
  calculateTimePenalty,
  ClueDifficulty,
  Direction,
  LETTER_POINTS_PER_DIFFICULTY,
  GameState,
  getEasierDifficulty,
  GridSizeOption,
  LeaderboardEntry,
  PlacedClue,
  PlayerProfile,
  PuzzleDefinition,
  VisualTheme,
  VisualThemeId,
} from './types/crossword';
import {
  CURATED_PUZZLES,
  generateArchivePuzzleForDate,
  generateQuick8x8PuzzleForDate,
  getLondonDateTimeParts,
} from './data/puzzles';
import { VISUAL_THEMES } from './data/themes';
import {
  addLeaderboardEntry,
  formatDuration,
  getLeaderboard,
  getStoredEasiestBaseMap,
  mergeCloudAndLocalLeaderboards,
  recordEasiestBaseForPuzzle,
  resetLeaderboard,
} from './utils/leaderboard';
import {
  auth,
  ensureUserPublicProfile,
  formatFirebaseAuthError,
  FormattedAuthError,
  recordCloudLeaderboardScore,
  registerWithEmailAccount,
  resetEmailPassword,
  signInWithEmailAccount,
  signInWithGoogleAccount,
  signOutPlayerAccount,
  subscribeToCloudLeaderboard,
  subscribeToUserPuzzleProgress,
  syncPuzzleProgressToCloud,
  updatePlayerCallsign,
} from './firebase';
import { soundFX } from './utils/sound';
import {
  calculateDailyStreak,
  getStoredSolvedDates,
  recordDailyPuzzleSolvedDate,
} from './utils/streak';
import { TitleScreen } from './components/TitleScreen';
import { LeaderboardModal } from './components/LeaderboardModal';
import { ArchiveModal } from './components/ArchiveModal';
import { PlayerAuthModal } from './components/PlayerAuthModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import {
  Lightbulb,
  CheckCircle2,
  Eye,
  Trophy,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  ArrowLeftRight,
  Sparkles,
  Home,
  BookOpen,
  Calendar,
  UserCheck,
  LogIn,
  Zap,
  Grid,
  ShieldCheck,
  X,
  Keyboard,
  ChevronLeft,
  ChevronRight,
  FastForward,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

export default function App() {
  // Rolling 21-day daily catalog (20x20 Standard & 8x8 Quick Crosswords, generated at 00:00 London UK time)
  const [puzzles, setPuzzles] = useState<PuzzleDefinition[]>(CURATED_PUZZLES);
  const [selectedPuzzleId, setSelectedPuzzleId] = useState<string>(
    CURATED_PUZZLES[0].id
  );
  // Player Grid Values (sized dynamically to activePuzzle.gridSize: 20x20 or 8x8)
  const [userGrid, setUserGrid] = useState<string[][]>(() =>
    Array.from({ length: 20 }, () => Array.from({ length: 20 }, () => ''))
  );

  // Check if user has started solving by entering any letters
  const hasUserStartedSolving = useMemo(() => {
    return userGrid.some((row) => row.some((cell) => cell !== ''));
  }, [userGrid]);
  const [visualThemeId, setVisualThemeId] =
    useState<VisualThemeId>('observatory');
  const [clueDifficulty, setClueDifficulty] =
    useState<ClueDifficulty>('medium');
  // Track easiest difficulty viewed for each clue id
  const [clueViewedDifficulties, setClueViewedDifficulties] = useState<
    Record<string, ClueDifficulty>
  >({});

  // Track 00:00 Europe/London date & live countdown
  const [londonClock, setLondonClock] = useState(() =>
    getLondonDateTimeParts()
  );

  useEffect(() => {
    const tick = window.setInterval(() => {
      const parts = getLondonDateTimeParts();
      setLondonClock((prev) => {
        if (prev.isoDate !== parts.isoDate) {
          const new20x20 = generateArchivePuzzleForDate(parts.isoDate);
          const new8x8 = generateQuick8x8PuzzleForDate(parts.isoDate);
          setPuzzles((curr) => {
            const next = [...curr];
            if (!next.some((p) => p.id === new8x8.id)) {
              next.unshift(new8x8);
            }
            if (!next.some((p) => p.id === new20x20.id)) {
              next.unshift(new20x20);
            }
            return next;
          });
        }
        return parts;
      });
    }, 1000);
    return () => window.clearInterval(tick);
  }, []);

  // Firebase Auth & Player Profile state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(
    () => {
      try {
        const stored = localStorage.getItem('cruciverbalist_device_profile');
        return stored ? (JSON.parse(stored) as PlayerProfile) : null;
      } catch {
        return null;
      }
    }
  );
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authErrorDetails, setAuthErrorDetails] =
    useState<FormattedAuthError | null>(null);

  // Skip already filled boxes option (persisted in localStorage, defaults to true)
  const [skipFilledCells, setSkipFilledCells] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('cruciverbalist_skip_filled_cells');
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  const handleToggleSkipFilled = useCallback(() => {
    soundFX.playClick();
    setSkipFilledCells((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('cruciverbalist_skip_filled_cells', String(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  // Mobile native keyboard & responsive grid zoom state
  const mobileKeyboardInputRef = useRef<HTMLInputElement | null>(null);
  const lastKeyHandledTimestampRef = useRef<number>(0);
  const [isNativeKeyboardFocused, setIsNativeKeyboardFocused] =
    useState<boolean>(false);
  const [showOnScreenKeys, setShowOnScreenKeys] = useState<boolean>(true);

  // Mobile & Touch Grid Zoom state (scale from 1.0 to 3.0 without affecting any other part of the page)
  const [gridZoom, setGridZoom] = useState<number>(1.0);
  const [isPinching, setIsPinching] = useState<boolean>(false);

  const handleZoomIn = useCallback(() => {
    soundFX.playClick();
    setGridZoom((prev) => {
      if (prev < 1.35) return 1.5;
      if (prev < 1.85) return 2.0;
      if (prev < 2.35) return 2.5;
      return Math.min(3.0, Math.round((prev + 0.5) * 10) / 10);
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    soundFX.playClick();
    setGridZoom((prev) => {
      if (prev <= 1.55) return 1.0;
      if (prev <= 2.05) return 1.5;
      if (prev <= 2.55) return 2.0;
      return Math.max(1.0, Math.round((prev - 0.5) * 10) / 10);
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    soundFX.playClick();
    setGridZoom(1.0);
  }, []);

  const focusNativeKeyboard = useCallback(() => {
    if (mobileKeyboardInputRef.current) {
      try {
        mobileKeyboardInputRef.current.focus({ preventScroll: true });
      } catch {
        mobileKeyboardInputRef.current.focus();
      }
    }
  }, []);

  // Persisted map of puzzleId -> easiest clue difficulty base chosen by the player on that puzzle
  const [easiestBaseByPuzzle, setEasiestBaseByPuzzle] = useState<
    Record<string, ClueDifficulty>
  >(() => getStoredEasiestBaseMap());

  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');

  // Modals
  const [isArchiveOpen, setIsArchiveOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Audio state
  const [isMuted, setIsMuted] = useState<boolean>(() => soundFX.isMuted());

  // Load main background wallpaper first on page load/refresh, then fade game elements in over 5 seconds
  const [areElementsVisible, setAreElementsVisible] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    let raf1 = 0;
    let raf2 = 0;

    const startFiveSecondFadeIn = () => {
      if (cancelled) return;
      raf1 = window.requestAnimationFrame(() => {
        raf2 = window.requestAnimationFrame(() => {
          if (!cancelled) {
            setAreElementsVisible(true);
          }
        });
      });
    };

    const bgImg = new Image();
    bgImg.src =
      '/assets/aistudio/Gemini_Generated_Image_zd4wjizd4wjizd4w_30ba3baf.jpg';

    if (bgImg.complete) {
      startFiveSecondFadeIn();
    } else {
      bgImg.onload = startFiveSecondFadeIn;
      bgImg.onerror = startFiveSecondFadeIn;
    }

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, []);

  // Local + Cloud Leaderboard state
  const [localLeaderboard, setLocalLeaderboard] = useState<LeaderboardEntry[]>(
    () => getLeaderboard()
  );
  const [cloudLeaderboard, setCloudLeaderboard] = useState<LeaderboardEntry[]>(
    []
  );

  const leaderboard = useMemo(
    () => mergeCloudAndLocalLeaderboards(cloudLeaderboard, localLeaderboard),
    [cloudLeaderboard, localLeaderboard]
  );

  // Daily Streak state (anchored to 00:00 Europe/London)
  const [localSolvedDates, setLocalSolvedDates] = useState<string[]>(() =>
    getStoredSolvedDates()
  );

  const streakSummary = useMemo(
    () =>
      calculateDailyStreak(
        localSolvedDates,
        leaderboard,
        currentUser?.uid,
        playerProfile?.displayName,
        londonClock.isoDate
      ),
    [
      localSolvedDates,
      leaderboard,
      currentUser?.uid,
      playerProfile?.displayName,
      londonClock.isoDate,
    ]
  );

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthReady(true);
      if (user) {
        try {
          const prof = await ensureUserPublicProfile(user);
          setPlayerProfile(prof);
          setVictoryPlayerName(prof.displayName);
          try {
            localStorage.setItem(
              'cruciverbalist_device_profile',
              JSON.stringify(prof)
            );
          } catch {
            // ignore storage errors
          }
        } catch (err) {
          console.error('Failed to initialize player profile:', err);
        }
      }
    });
    return () => unsub();
  }, []);

  // Subscribe to permanent Cloud Leaderboard once auth is initialized
  useEffect(() => {
    if (!authReady) return;
    const unsubScores = subscribeToCloudLeaderboard((entries) => {
      setCloudLeaderboard(entries);
    });
    return () => unsubScores();
  }, [authReady]);

  // Subscribe to signed-in player's per-puzzle easiest difficulty progress in Firestore
  useEffect(() => {
    if (!authReady || !currentUser) return;
    const unsubProgress = subscribeToUserPuzzleProgress(
      currentUser.uid,
      (cloudMap) => {
        setEasiestBaseByPuzzle((prev) => {
          const merged = { ...prev };
          for (const [pid, cloudDiff] of Object.entries(cloudMap)) {
            merged[pid] = merged[pid]
              ? getEasierDifficulty(merged[pid], cloudDiff)
              : cloudDiff;
          }
          return merged;
        });
      }
    );
    return () => unsubProgress();
  }, [authReady, currentUser]);

  // Active Puzzle state
  const activePuzzle = useMemo(
    () => puzzles.find((p) => p.id === selectedPuzzleId) || puzzles[0],
    [puzzles, selectedPuzzleId]
  );
  const gridSize = activePuzzle.gridSize;
  const theme: VisualTheme = VISUAL_THEMES[visualThemeId];

  // Easiest clue base chosen for the currently active puzzle
  const easiestBaseForActivePuzzle: ClueDifficulty = useMemo(() => {
    return easiestBaseByPuzzle[activePuzzle.id] || clueDifficulty;
  }, [easiestBaseByPuzzle, activePuzzle.id, clueDifficulty]);

  // Update difficulty and lock in the easiest base chosen for the active puzzle (both locally and in Cloud if signed in)
  const handleChangeClueDifficulty = useCallback(
    (newDiff: ClueDifficulty, targetPuzzleId?: string) => {
      if (hasUserStartedSolving) {
        setHintBannerMessage(
          'Clue difficulty cannot be changed after you have started entering letters to prevent cheating!'
        );
        soundFX.playError();
        return;
      }
      soundFX.playClick();
      setClueDifficulty(newDiff);
      const pid = targetPuzzleId || activePuzzle.id;
      const updatedEasiest = recordEasiestBaseForPuzzle(pid, newDiff);
      setEasiestBaseByPuzzle((prev) => ({
        ...prev,
        [pid]: updatedEasiest,
      }));
      if (currentUser) {
        syncPuzzleProgressToCloud(currentUser, pid, updatedEasiest, false).catch(
          (err) => console.error('Cloud progress sync error:', err)
        );
      }
    },
    [activePuzzle.id, currentUser, hasUserStartedSolving]
  );

  const [revealedCells, setRevealedCells] = useState<Set<string>>(new Set());
  const [errorCells, setErrorCells] = useState<Set<string>>(new Set());
  const [unlockedBreakdowns, setUnlockedBreakdowns] = useState<Set<string>>(
    new Set()
  );
  const [completedClueIds, setCompletedClueIds] = useState<Set<string>>(
    new Set()
  );

  // Cursor & Direction
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number }>({
    row: 0,
    col: 0,
  });
  const [direction, setDirection] = useState<Direction>('across');

  // Telemetry & Scoring
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [checkErrorsCount, setCheckErrorsCount] = useState<number>(0);
  const [hintBannerMessage, setHintBannerMessage] = useState<string | null>(
    null
  );
  const [clueSearchQuery, setClueSearchQuery] = useState<string>('');
  const [victoryPlayerName, setVictoryPlayerName] = useState<string>(
    () => localStorage.getItem('cruciverbalist_last_player_name') || 'Guest Solver'
  );
  const [victorySubmitted, setVictorySubmitted] = useState<boolean>(false);
  const [isVictoryPopupDismissed, setIsVictoryPopupDismissed] =
    useState<boolean>(false);

  const gridContainerRef = useRef<HTMLDivElement | null>(null);

  // Initialize or reset board for a puzzle (preserving the easiest base chosen that day!)
  const initializeBoardForPuzzle = useCallback(
    (puzzle: PuzzleDefinition) => {
      const dim = puzzle.gridSize;
      setUserGrid(
        Array.from({ length: dim }, () => Array.from({ length: dim }, () => ''))
      );
      setRevealedCells(new Set());
      setErrorCells(new Set());
      setUnlockedBreakdowns(new Set());
      setCompletedClueIds(new Set());
      setElapsedSeconds(0);
      setHintsUsed(0);
      setCheckErrorsCount(0);
      setHintBannerMessage(null);
      setVictorySubmitted(false);
      setIsVictoryPopupDismissed(false);
      setGridZoom(1.0);
      setClueViewedDifficulties({});

      // Record initial difficulty base for this puzzle if not yet recorded
      const updatedEasiest = recordEasiestBaseForPuzzle(
        puzzle.id,
        clueDifficulty
      );
      setEasiestBaseByPuzzle((prev) => ({
        ...prev,
        [puzzle.id]: updatedEasiest,
      }));

      if (currentUser) {
        syncPuzzleProgressToCloud(
          currentUser,
          puzzle.id,
          updatedEasiest,
          false
        ).catch((err) => console.error('Cloud progress init error:', err));
      }

      const firstClue =
        puzzle.clues.across[0] ||
        puzzle.clues.down[0] || {
          row: 0,
          col: 0,
          direction: 'across' as Direction,
        };
      setFocusedCell({ row: firstClue.row, col: firstClue.col });
      setDirection(firstClue.direction);
    },
    [clueDifficulty, currentUser]
  );

  // Select puzzle handler
  const handleSelectPuzzle = useCallback(
    (id: string) => {
      soundFX.playClick();
      setSelectedPuzzleId(id);
      const found = puzzles.find((p) => p.id === id);
      if (found) {
        initializeBoardForPuzzle(found);
      }
    },
    [puzzles, initializeBoardForPuzzle]
  );

  // Switch between 20x20 Standard and 8x8 Quick Crossword on the current date
  const handleSwitchFormatInPlay = useCallback(
    (targetSize: GridSizeOption) => {
      if (activePuzzle.gridSize === targetSize) return;
      soundFX.playClick();
      const sameDateMatch =
        puzzles.find(
          (p) =>
            p.archiveDate === activePuzzle.archiveDate &&
            p.gridSize === targetSize
        ) || puzzles.find((p) => p.gridSize === targetSize);

      if (sameDateMatch) {
        setSelectedPuzzleId(sameDateMatch.id);
        initializeBoardForPuzzle(sameDateMatch);
      }
    },
    [activePuzzle, puzzles, initializeBoardForPuzzle]
  );

  // Select and immediately start an archived or newly generated dated puzzle
  const handleSelectAndPlayArchivePuzzle = useCallback(
    (puzzle: PuzzleDefinition) => {
      soundFX.playClick();
      setPuzzles((prev) => {
        if (prev.some((p) => p.id === puzzle.id)) return prev;
        return [puzzle, ...prev];
      });
      setSelectedPuzzleId(puzzle.id);
      initializeBoardForPuzzle(puzzle);
      setGameState('PLAYING');
    },
    [initializeBoardForPuzzle]
  );

  const handleStartGame = useCallback(() => {
    soundFX.playClick();
    initializeBoardForPuzzle(activePuzzle);
    setGameState('PLAYING');
  }, [activePuzzle, initializeBoardForPuzzle]);

  // Timer interval while PLAYING
  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [gameState]);

  // Return the clue text corresponding to the user's selected difficulty ('easy' | 'medium' | 'hard')
  const getClueTextForDifficulty = useCallback(
    (clue: PlacedClue): string => {
      if (clueDifficulty === 'easy') return clue.easyClue;
      if (clueDifficulty === 'medium') return clue.mediumClue;
      return clue.hardClue;
    },
    [clueDifficulty]
  );

  const getDifficultyDescriptor = useCallback((diff: ClueDifficulty): string => {
    if (diff === 'easy') return 'Easy · Straightforward Definition';
    if (diff === 'medium') return 'Medium · Wordplay & Allusion';
    return 'Hard · Cryptic Wordplay';
  }, []);

  // Find active clue based on focusedCell and direction
  const activeClue: PlacedClue | null = useMemo(() => {
    const cell = activePuzzle.grid[focusedCell.row]?.[focusedCell.col];
    if (!cell || cell.isBlocked) return null;

    const primaryClueId =
      direction === 'across' ? cell.acrossClueId : cell.downClueId;
    const fallbackClueId =
      direction === 'across' ? cell.downClueId : cell.acrossClueId;
    const targetId = primaryClueId || fallbackClueId;
    if (!targetId) return null;

    return (
      activePuzzle.clues.across.find((c) => c.id === targetId) ||
      activePuzzle.clues.down.find((c) => c.id === targetId) ||
      null
    );
  }, [activePuzzle, focusedCell, direction]);

  // Track easiest difficulty viewed for each active clue
  useEffect(() => {
    if (!activeClue) return;
    setClueViewedDifficulties((prev) => {
      const existing = prev[activeClue.id];
      const updated = existing
        ? getEasierDifficulty(existing, clueDifficulty)
        : clueDifficulty;
      if (existing === updated) return prev;
      return { ...prev, [activeClue.id]: updated };
    });
  }, [activeClue, clueDifficulty]);

  // Keep direction synced if focused cell only has one valid direction
  useEffect(() => {
    const cell = activePuzzle.grid[focusedCell.row]?.[focusedCell.col];
    if (!cell || cell.isBlocked) return;
    if (direction === 'across' && !cell.acrossClueId && cell.downClueId) {
      setDirection('down');
    } else if (direction === 'down' && !cell.downClueId && cell.acrossClueId) {
      setDirection('across');
    }
  }, [activePuzzle, focusedCell, direction]);

  // Compute set of cells belonging to the active clue for highlighting
  const activeWordCells = useMemo(() => {
    const set = new Set<string>();
    if (!activeClue) return set;
    for (let i = 0; i < activeClue.length; i++) {
      const r =
        activeClue.direction === 'across'
          ? activeClue.row
          : activeClue.row + i;
      const c =
        activeClue.direction === 'across'
          ? activeClue.col + i
          : activeClue.col;
      set.add(`${r},${c}`);
    }
    return set;
  }, [activeClue]);

  // Compute live progress & fixed score based strictly on the easiest clue base chosen that day
  const stats = useMemo(() => {
    let filledCount = 0;
    let correctCount = 0;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cell = activePuzzle.grid[r]?.[c];
        if (cell && !cell.isBlocked) {
          const val = userGrid[r]?.[c] || '';
          if (val) {
            filledCount++;
            if (val === cell.solution) {
              correctCount++;
            }
          }
        }
      }
    }

    const allClues = [
      ...activePuzzle.clues.across,
      ...activePuzzle.clues.down,
    ];
    let solvedWords = 0;
    let totalWordPoints = 0;
    let maxPossibleWordPoints = 0;

    for (const clue of allClues) {
      const viewedDiff = clueViewedDifficulties[clue.id] || easiestBaseForActivePuzzle;
      const ptsPerLetter = LETTER_POINTS_PER_DIFFICULTY[viewedDiff] || 10;
      maxPossibleWordPoints += clue.length * 15; // 15 pts/letter on hard

      let wordCorrect = true;
      for (let i = 0; i < clue.length; i++) {
        const r = clue.direction === 'across' ? clue.row : clue.row + i;
        const c = clue.direction === 'across' ? clue.col + i : clue.col;
        if ((userGrid[r]?.[c] || '') !== activePuzzle.grid[r]?.[c]?.solution) {
          wordCorrect = false;
          break;
        }
      }
      if (wordCorrect) {
        solvedWords++;
        totalWordPoints += clue.length * ptsPerLetter;
      }
    }

    const timePenalty = calculateTimePenalty(elapsedSeconds); // 10 pts per minute
    const finalScore = Math.max(0, totalWordPoints - timePenalty);
    const maxPossibleScore = Math.max(0, maxPossibleWordPoints - timePenalty);
    const baseScore = totalWordPoints;

    const progressPercent =
      activePuzzle.totalWhiteCells > 0
        ? Math.round((filledCount / activePuzzle.totalWhiteCells) * 100)
        : 0;

    const accuracy =
      filledCount > 0
        ? Math.max(
            50,
            Math.min(
              100,
              Math.round(
                ((correctCount - checkErrorsCount * 0.5) / filledCount) * 100
              )
            )
          )
        : 100;

    const isComplete =
      activePuzzle.totalWhiteCells > 0 &&
      correctCount === activePuzzle.totalWhiteCells;

    return {
      filledCount,
      correctCount,
      solvedWords,
      totalWords: allClues.length,
      baseScore,
      timePenalty,
      score: finalScore,
      maxPossibleScore,
      progressPercent,
      accuracy,
      isComplete,
    };
  }, [
    activePuzzle,
    gridSize,
    userGrid,
    easiestBaseForActivePuzzle,
    elapsedSeconds,
    checkErrorsCount,
    clueViewedDifficulties,
  ]);

  // Record score locally and to Cloud Firestore if player is signed in
  const handleRecordScore = useCallback(
    async (playerName: string) => {
      const updatedLocal = addLeaderboardEntry({
        playerName,
        puzzleId: activePuzzle.id,
        puzzleTitle: activePuzzle.title,
        themeName: activePuzzle.themeName,
        gridSize: activePuzzle.gridSize,
        timeSeconds: Math.max(1, elapsedSeconds),
        hintsUsed,
        easiestDifficultyUsed: easiestBaseForActivePuzzle,
        clueDifficulty,
        accuracy: stats.accuracy,
      });
      setLocalLeaderboard(updatedLocal);
      setLocalSolvedDates(recordDailyPuzzleSolvedDate(londonClock.isoDate));
      soundFX.playWordComplete();

      if (currentUser) {
        try {
          const updatedProf = await recordCloudLeaderboardScore(currentUser, {
            playerName,
            puzzleId: activePuzzle.id,
            puzzleTitle: activePuzzle.title,
            themeName: activePuzzle.themeName,
            gridSize: activePuzzle.gridSize,
            timeSeconds: Math.max(1, elapsedSeconds),
            hintsUsed,
            easiestDifficultyUsed: easiestBaseForActivePuzzle,
            clueDifficulty,
            accuracy: stats.accuracy,
            completedAt: londonClock.isoDate,
          });
          setPlayerProfile(updatedProf);
          try {
            localStorage.setItem(
              'cruciverbalist_device_profile',
              JSON.stringify(updatedProf)
            );
          } catch {
            // ignore
          }
        } catch (err) {
          console.error('Failed to record score to cloud leaderboard:', err);
        }
      } else if (playerProfile) {
        const myEntries = updatedLocal.filter(
          (e) =>
            e.playerName.trim().toLowerCase() ===
            playerProfile.displayName.trim().toLowerCase()
        );
        const totalScore = myEntries.reduce((acc, item) => acc + item.score, 0);
        const updatedDeviceProf: PlayerProfile = {
          ...playerProfile,
          displayName: playerName,
          puzzlesSolved: Math.max(1, myEntries.length),
          totalScore,
        };
        setPlayerProfile(updatedDeviceProf);
        try {
          localStorage.setItem(
            'cruciverbalist_device_profile',
            JSON.stringify(updatedDeviceProf)
          );
        } catch {
          // ignore
        }
      }
    },
    [
      activePuzzle,
      elapsedSeconds,
      hintsUsed,
      easiestBaseForActivePuzzle,
      clueDifficulty,
      stats.accuracy,
      currentUser,
      playerProfile,
      londonClock.isoDate,
    ]
  );

  // Check if any newly solved clue should play the harmonic word completion chime
  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const allClues = [
      ...activePuzzle.clues.across,
      ...activePuzzle.clues.down,
    ];
    const newlySolved: string[] = [];

    for (const clue of allClues) {
      let complete = true;
      for (let i = 0; i < clue.length; i++) {
        const r = clue.direction === 'across' ? clue.row : clue.row + i;
        const c = clue.direction === 'across' ? clue.col + i : clue.col;
        if ((userGrid[r]?.[c] || '') !== activePuzzle.grid[r]?.[c]?.solution) {
          complete = false;
          break;
        }
      }
      if (complete && !completedClueIds.has(clue.id)) {
        newlySolved.push(clue.id);
      }
    }

    if (newlySolved.length > 0) {
      setCompletedClueIds((prev) => {
        const next = new Set(prev);
        newlySolved.forEach((id) => next.add(id));
        return next;
      });
      if (!stats.isComplete) {
        soundFX.playWordComplete();
      }
    }
  }, [
    userGrid,
    activePuzzle,
    completedClueIds,
    gameState,
    stats.isComplete,
  ]);

  // Multi-stage celebratory confetti burst using canvas-confetti (guaranteed high z-index & reduced-motion override)
  const triggerVictoryConfetti = useCallback(() => {
    const palette = [
      '#f59e0b',
      '#10b981',
      '#38bdf8',
      '#f43f5e',
      '#a855f7',
      '#eab308',
    ];

    try {
      confetti({
        particleCount: 110,
        spread: 90,
        origin: { x: 0.5, y: 0.5 },
        colors: palette,
        zIndex: 9999,
        disableForReducedMotion: false,
      });

      const durationMs = 2600;
      const endTimestamp = Date.now() + durationMs;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.65 },
          colors: palette,
          zIndex: 9999,
          disableForReducedMotion: false,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.65 },
          colors: palette,
          zIndex: 9999,
          disableForReducedMotion: false,
        });

        if (Date.now() < endTimestamp) {
          window.requestAnimationFrame(frame);
        }
      };

      window.requestAnimationFrame(frame);
    } catch (err) {
      console.error('Confetti error:', err);
    }
  }, []);

  // Reliable puzzle completion detector: triggers whenever all white cells match the solution while in PLAYING state
  useEffect(() => {
    if (gameState !== 'PLAYING' || !stats.isComplete) return;

    soundFX.playVictory();
    setIsVictoryPopupDismissed(false);
    setGameState('VICTORY');
    setLocalSolvedDates(recordDailyPuzzleSolvedDate(londonClock.isoDate));
    triggerVictoryConfetti();

    const resolvedName =
      playerProfile?.displayName ||
      currentUser?.displayName ||
      victoryPlayerName.trim() ||
      'Guest Solver';
    setVictoryPlayerName(resolvedName);
    handleRecordScore(resolvedName);
    setVictorySubmitted(true);
  }, [
    gameState,
    stats.isComplete,
    londonClock.isoDate,
    triggerVictoryConfetti,
    playerProfile,
    currentUser,
    victoryPlayerName,
    handleRecordScore,
  ]);

  // Helper to locate the first empty cell in a clue when skipFilledCells is active
  const getTargetCellForClue = useCallback(
    (
      clue: PlacedClue,
      gridData: string[][],
      skipFilled: boolean
    ): { row: number; col: number } => {
      if (skipFilled) {
        for (let i = 0; i < clue.length; i++) {
          const r = clue.direction === 'across' ? clue.row : clue.row + i;
          const c = clue.direction === 'across' ? clue.col + i : clue.col;
          if ((gridData[r]?.[c] || '') === '') {
            return { row: r, col: c };
          }
        }
      }
      return { row: clue.row, col: clue.col };
    },
    []
  );

  // Touch Pinch-to-Zoom handler specifically for the crossword board container
  // Intercepts 2-finger pinch so the browser never zooms the rest of the page, smoothly scaling only the crossword grid
  useEffect(() => {
    const container = gridContainerRef.current;
    if (!container) return;

    let initialDist = 0;
    let initialZoomLevel = 1.0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Prevent default browser whole-page pinch zoom
        e.preventDefault();
        initialDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialZoomLevel = gridZoom;
        setIsPinching(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialDist > 0) {
        // Prevent default browser whole-page pinch zoom
        e.preventDefault();
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const scale = currentDist / initialDist;
        // Smooth continuous scaling without stepped increments
        const targetZoom = Math.min(3.0, Math.max(1.0, initialZoomLevel * scale));
        setGridZoom(targetZoom);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        initialDist = 0;
        setIsPinching(false);
      }
    };

    // Trackpad / Wheel zoom with Ctrl or Meta key on the grid container
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.08 : -0.08;
        setGridZoom((prev) =>
          Math.min(3.0, Math.max(1.0, prev + delta))
        );
      }
    };

    container.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    container.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [gridZoom]);

  // When grid is zoomed in, smoothly keep the focused cell in view within the crossword container
  useEffect(() => {
    if (gridZoom > 1.05 && gridContainerRef.current) {
      const cellEl = document.getElementById(
        `grid-cell-${focusedCell.row}-${focusedCell.col}`
      );
      if (cellEl) {
        cellEl.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }
    }
  }, [focusedCell, gridZoom]);

  // Move cursor helper along active word (optionally skipping already-filled cells)
  const advanceCursorInWord = useCallback(
    (
      step: 1 | -1,
      justTypedCell?: { row: number; col: number },
      overrideSkipFilled?: boolean
    ) => {
      if (!activeClue) return;
      const idx =
        activeClue.direction === 'across'
          ? focusedCell.col - activeClue.col
          : focusedCell.row - activeClue.row;

      const useSkip =
        overrideSkipFilled !== undefined ? overrideSkipFilled : skipFilledCells;

      if (step === 1 && useSkip) {
        // 1. Scan forward after current cell for the next empty cell in activeClue
        for (let i = idx + 1; i < activeClue.length; i++) {
          const r =
            activeClue.direction === 'across'
              ? activeClue.row
              : activeClue.row + i;
          const c =
            activeClue.direction === 'across'
              ? activeClue.col + i
              : activeClue.col;
          const isJustTyped =
            justTypedCell &&
            justTypedCell.row === r &&
            justTypedCell.col === c;
          const isEmpty = !isJustTyped && (userGrid[r]?.[c] || '') === '';
          if (isEmpty && !revealedCells.has(`${r},${c}`)) {
            setFocusedCell({ row: r, col: c });
            return;
          }
        }
        // 2. Wrap around from the start of activeClue up to idx - 1 if earlier cells in this word are still empty
        for (let i = 0; i < idx; i++) {
          const r =
            activeClue.direction === 'across'
              ? activeClue.row
              : activeClue.row + i;
          const c =
            activeClue.direction === 'across'
              ? activeClue.col + i
              : activeClue.col;
          const isJustTyped =
            justTypedCell &&
            justTypedCell.row === r &&
            justTypedCell.col === c;
          const isEmpty = !isJustTyped && (userGrid[r]?.[c] || '') === '';
          if (isEmpty && !revealedCells.has(`${r},${c}`)) {
            setFocusedCell({ row: r, col: c });
            return;
          }
        }
      }

      const nextIdx = idx + step;
      if (nextIdx >= 0 && nextIdx < activeClue.length) {
        const nextR =
          activeClue.direction === 'across'
            ? activeClue.row
            : activeClue.row + nextIdx;
        const nextC =
          activeClue.direction === 'across'
            ? activeClue.col + nextIdx
            : activeClue.col;
        setFocusedCell({ row: nextR, col: nextC });
      }
    },
    [activeClue, focusedCell, skipFilledCells, userGrid, revealedCells]
  );

  // Input a letter into the currently focused cell
  const handleLetterInput = useCallback(
    (char: string) => {
      if (gameState !== 'PLAYING') return;
      const { row, col } = focusedCell;
      const cell = activePuzzle.grid[row]?.[col];
      if (!cell || cell.isBlocked) return;

      const key = `${row},${col}`;
      if (revealedCells.has(key)) {
        advanceCursorInWord(1, { row, col });
        return;
      }

      soundFX.playKeyPress();
      const upper = char.toUpperCase();
      setUserGrid((prev) => {
        const next = prev.map((r) => [...r]);
        if (next[row]) {
          next[row][col] = upper;
        }
        return next;
      });
      setErrorCells((prev) => {
        if (!prev.has(key)) return prev;
        const next = new Set(prev);
        next.delete(key);
        return next;
      });

      advanceCursorInWord(1, { row, col });
    },
    [
      gameState,
      focusedCell,
      activePuzzle,
      revealedCells,
      advanceCursorInWord,
    ]
  );

  // Handle Backspace
  const handleBackspace = useCallback(() => {
    if (gameState !== 'PLAYING') return;
    const { row, col } = focusedCell;
    const cell = activePuzzle.grid[row]?.[col];
    if (!cell || cell.isBlocked) return;

    const key = `${row},${col}`;
    soundFX.playBackspace();

    if ((userGrid[row]?.[col] || '') !== '' && !revealedCells.has(key)) {
      setUserGrid((prev) => {
        const next = prev.map((r) => [...r]);
        if (next[row]) {
          next[row][col] = '';
        }
        return next;
      });
      setErrorCells((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    } else {
      if (!activeClue) return;
      const idx =
        activeClue.direction === 'across'
          ? col - activeClue.col
          : row - activeClue.row;
      if (idx > 0) {
        // When stepping back on an empty cell, step to the previous non-revealed cell
        let targetIdx = idx - 1;
        while (targetIdx > 0) {
          const checkR =
            activeClue.direction === 'across'
              ? activeClue.row
              : activeClue.row + targetIdx;
          const checkC =
            activeClue.direction === 'across'
              ? activeClue.col + targetIdx
              : activeClue.col;
          if (!revealedCells.has(`${checkR},${checkC}`)) {
            break;
          }
          targetIdx--;
        }
        const prevR =
          activeClue.direction === 'across'
            ? activeClue.row
            : activeClue.row + targetIdx;
        const prevC =
          activeClue.direction === 'across'
            ? activeClue.col + targetIdx
            : activeClue.col;
        const prevKey = `${prevR},${prevC}`;
        setFocusedCell({ row: prevR, col: prevC });
        if (!revealedCells.has(prevKey)) {
          setUserGrid((prev) => {
            const next = prev.map((r) => [...r]);
            if (next[prevR]) {
              next[prevR][prevC] = '';
            }
            return next;
          });
        }
      }
    }
  }, [
    gameState,
    focusedCell,
    activePuzzle,
    userGrid,
    revealedCells,
    activeClue,
  ]);

  // Jump to next or previous clue via Tab / Shift+Tab or Mobile Prev/Next buttons
  const handleCycleClue = useCallback(
    (delta: 1 | -1) => {
      const ordered = [
        ...activePuzzle.clues.across,
        ...activePuzzle.clues.down,
      ];
      if (ordered.length === 0) return;
      const currentIdx = activeClue
        ? ordered.findIndex((c) => c.id === activeClue.id)
        : 0;
      const nextIdx = (currentIdx + delta + ordered.length) % ordered.length;
      const nextClue = ordered[nextIdx];
      soundFX.playClick();
      setDirection(nextClue.direction);
      const targetCell = getTargetCellForClue(nextClue, userGrid, skipFilledCells);
      setFocusedCell(targetCell);

      // On mobile when going to the next clue, centre the clue on the screen
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        window.setTimeout(() => {
          const clueSpotlightEl = document.getElementById('active-clue-spotlight');
          if (clueSpotlightEl) {
            clueSpotlightEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 40);
      }
    },
    [activePuzzle, activeClue, getTargetCellForClue, userGrid, skipFilledCells]
  );

  // Move focus with arrow keys across playable white squares (respecting gridSize 8 or 20)
  const handleArrowMove = useCallback(
    (dRow: number, dCol: number) => {
      let r = focusedCell.row;
      let c = focusedCell.col;
      const totalCells = gridSize * gridSize;
      for (let step = 0; step < totalCells; step++) {
        r = (r + dRow + gridSize) % gridSize;
        c = (c + dCol + gridSize) % gridSize;
        if (!activePuzzle.grid[r]?.[c]?.isBlocked) {
          soundFX.playClick();
          setFocusedCell({ row: r, col: c });
          return;
        }
      }
    },
    [focusedCell, activePuzzle, gridSize]
  );

  // Native mobile keyboard <input> handlers (works across iOS Safari, Android Gboard, Samsung Keyboard, and desktop)
  const handleMobileInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (gameState !== 'PLAYING') return;
      if (isArchiveOpen || isLeaderboardOpen || isAuthModalOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        soundFX.playClick();
        setGameState('PAUSED');
        return;
      }

      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        lastKeyHandledTimestampRef.current = Date.now();
        handleCycleClue(e.shiftKey ? -1 : 1);
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        lastKeyHandledTimestampRef.current = Date.now();
        const cell = activePuzzle.grid[focusedCell.row]?.[focusedCell.col];
        if (cell && cell.acrossClueId && cell.downClueId) {
          soundFX.playClick();
          setDirection((prev) => (prev === 'across' ? 'down' : 'across'));
        }
        return;
      }

      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        lastKeyHandledTimestampRef.current = Date.now();
        handleBackspace();
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        lastKeyHandledTimestampRef.current = Date.now();
        handleArrowMove(0, 1);
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        lastKeyHandledTimestampRef.current = Date.now();
        handleArrowMove(0, -1);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        lastKeyHandledTimestampRef.current = Date.now();
        handleArrowMove(1, 0);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        lastKeyHandledTimestampRef.current = Date.now();
        handleArrowMove(-1, 0);
        return;
      }

      if (/^[a-zA-Z]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        lastKeyHandledTimestampRef.current = Date.now();
        handleLetterInput(e.key);
      }
    },
    [
      gameState,
      isArchiveOpen,
      isLeaderboardOpen,
      isAuthModalOpen,
      activePuzzle,
      focusedCell,
      handleCycleClue,
      handleBackspace,
      handleArrowMove,
      handleLetterInput,
    ]
  );

  const handleMobileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (gameState !== 'PLAYING') return;
      // Avoid double-triggering if onKeyDown already handled this keystroke within the last 35ms
      if (Date.now() - lastKeyHandledTimestampRef.current < 35) {
        return;
      }
      const rawVal = e.target.value;
      // Sentinel value is a single space " ". If length became 0, the user pressed Backspace on a mobile keyboard!
      if (rawVal.length === 0) {
        handleBackspace();
        return;
      }
      const stripped = rawVal.replace(/\s+/g, '');
      if (stripped.length > 0) {
        const lastChar = stripped.slice(-1);
        if (/^[a-zA-Z]$/.test(lastChar)) {
          handleLetterInput(lastChar);
        }
      } else if (rawVal.length > 1) {
        // User pressed Spacebar on mobile virtual keyboard -> toggle Across/Down
        const cell = activePuzzle.grid[focusedCell.row]?.[focusedCell.col];
        if (cell && cell.acrossClueId && cell.downClueId) {
          soundFX.playClick();
          setDirection((prev) => (prev === 'across' ? 'down' : 'across'));
        }
      }
    },
    [gameState, handleBackspace, handleLetterInput, activePuzzle, focusedCell]
  );

  // Keyboard listener during active gameplay (when focus is not inside an <input>)
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (isArchiveOpen || isLeaderboardOpen || isAuthModalOpen) {
        return;
      }
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        soundFX.playClick();
        setGameState('PAUSED');
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        const cell = activePuzzle.grid[focusedCell.row]?.[focusedCell.col];
        if (cell && cell.acrossClueId && cell.downClueId) {
          soundFX.playClick();
          setDirection((prev) => (prev === 'across' ? 'down' : 'across'));
        }
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        handleCycleClue(e.shiftKey ? -1 : 1);
        return;
      }

      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        handleBackspace();
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleArrowMove(0, 1);
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleArrowMove(0, -1);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleArrowMove(1, 0);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleArrowMove(-1, 0);
        return;
      }

      if (/^[a-zA-Z]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        handleLetterInput(e.key);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    gameState,
    isArchiveOpen,
    isLeaderboardOpen,
    isAuthModalOpen,
    activePuzzle,
    focusedCell,
    handleCycleClue,
    handleBackspace,
    handleArrowMove,
    handleLetterInput,
  ]);

  // 4-Tier User-Friendly Hint System Actions
  const handleHintTier1Breakdown = () => {
    if (!activeClue) return;
    soundFX.playHintUsed();
    if (!unlockedBreakdowns.has(activeClue.id)) {
      setUnlockedBreakdowns((prev) => new Set(prev).add(activeClue.id));
      setHintsUsed((h) => h + 1);
    }
    setHintBannerMessage(
      `Wordplay & Context (${activeClue.number} ${activeClue.direction.toUpperCase()}): ${
        activeClue.crypticBreakdown
      } — ${activeClue.etymologyOrContext}`
    );
  };

  const handleHintTier2AnchorLetter = () => {
    if (!activeClue) return;
    for (let i = 0; i < activeClue.length; i++) {
      const r =
        activeClue.direction === 'across'
          ? activeClue.row
          : activeClue.row + i;
      const c =
        activeClue.direction === 'across'
          ? activeClue.col + i
          : activeClue.col;
      const sol = activePuzzle.grid[r][c].solution;
      if ((userGrid[r]?.[c] || '') !== sol) {
        soundFX.playHintUsed();
        const key = `${r},${c}`;
        setUserGrid((prev) => {
          const next = prev.map((rowArr) => [...rowArr]);
          if (next[r]) {
            next[r][c] = sol;
          }
          return next;
        });
        setRevealedCells((prev) => new Set(prev).add(key));
        setErrorCells((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
        setHintsUsed((h) => h + 1);
        setFocusedCell({ row: r, col: c });
        setHintBannerMessage(
          `Revealed letter #${i + 1} ('${sol}') for ${activeClue.number} ${activeClue.direction.toUpperCase()}.`
        );
        return;
      }
    }
    setHintBannerMessage(
      `${activeClue.number} ${activeClue.direction.toUpperCase()} is already accurately completed!`
    );
  };

  const handleHintTier3CheckWord = () => {
    if (!activeClue) return;
    const newErrors = new Set(errorCells);
    let foundWrong = 0;
    let filledInWord = 0;

    for (let i = 0; i < activeClue.length; i++) {
      const r =
        activeClue.direction === 'across'
          ? activeClue.row
          : activeClue.row + i;
      const c =
        activeClue.direction === 'across'
          ? activeClue.col + i
          : activeClue.col;
      const val = userGrid[r]?.[c] || '';
      if (val) {
        filledInWord++;
        if (val !== activePuzzle.grid[r][c].solution) {
          newErrors.add(`${r},${c}`);
          foundWrong++;
        }
      }
    }

    setErrorCells(newErrors);
    if (foundWrong > 0) {
      soundFX.playError();
      setCheckErrorsCount((c) => c + foundWrong);
      setHintBannerMessage(
        `Found ${foundWrong} incorrect ${
          foundWrong === 1 ? 'letter' : 'letters'
        } in ${activeClue.number} ${activeClue.direction.toUpperCase()} (marked with a diagonal slash).`
      );
    } else if (filledInWord === 0) {
      soundFX.playClick();
      setHintBannerMessage(
        `No letters entered yet in ${activeClue.number} ${activeClue.direction.toUpperCase()}. Try Tier 1 or Tier 2 for a nudge!`
      );
    } else {
      soundFX.playHintUsed();
      setHintBannerMessage(
        `All ${filledInWord} entered ${
          filledInWord === 1 ? 'letter is' : 'letters are'
        } verified correct in ${activeClue.number} ${activeClue.direction.toUpperCase()}!`
      );
    }
  };

  const handleHintTier4RevealWord = () => {
    if (!activeClue) return;
    soundFX.playHintUsed();
    const nextRevealed = new Set(revealedCells);
    const nextErrors = new Set(errorCells);

    setUserGrid((prev) => {
      const next = prev.map((rowArr) => [...rowArr]);
      for (let i = 0; i < activeClue.length; i++) {
        const r =
          activeClue.direction === 'across'
            ? activeClue.row
            : activeClue.row + i;
        const c =
          activeClue.direction === 'across'
            ? activeClue.col + i
            : activeClue.col;
        if (next[r]) {
          next[r][c] = activePuzzle.grid[r][c].solution;
        }
        nextRevealed.add(`${r},${c}`);
        nextErrors.delete(`${r},${c}`);
      }
      return next;
    });

    setRevealedCells(nextRevealed);
    setErrorCells(nextErrors);
    setHintsUsed((h) => h + 2);
    setHintBannerMessage(
      `Revealed solution "${activeClue.answer}" for ${activeClue.number} ${activeClue.direction.toUpperCase()}.`
    );
  };

  const handleToggleMute = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
  };

  const handleVictorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = victoryPlayerName.trim();
    if (!trimmed) return;
    try {
      localStorage.setItem('cruciverbalist_last_player_name', trimmed);
    } catch {
      // ignore storage errors
    }
    handleRecordScore(trimmed);
    setVictorySubmitted(true);
    triggerVictoryConfetti();
  };

  // Auth Handlers (Google OAuth, Email/Password Registration & Sign-In, Password Reset, and Device Profile Fallback)
  const handleSignInWithGoogle = async () => {
    setAuthLoading(true);
    setAuthError(null);
    setAuthErrorDetails(null);
    try {
      const user = await signInWithGoogleAccount();
      const prof = await ensureUserPublicProfile(user);
      setPlayerProfile(prof);
      setVictoryPlayerName(prof.displayName);
      try {
        localStorage.setItem(
          'cruciverbalist_device_profile',
          JSON.stringify(prof)
        );
      } catch {
        // ignore
      }
      soundFX.playWordComplete();
    } catch (err) {
      const formatted = formatFirebaseAuthError(err);
      setAuthError(formatted.message);
      setAuthErrorDetails(formatted);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegisterWithEmail = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    setAuthLoading(true);
    setAuthError(null);
    setAuthErrorDetails(null);
    try {
      const user = await registerWithEmailAccount(email, password, displayName);
      const prof = await ensureUserPublicProfile(user, displayName);
      setPlayerProfile(prof);
      setVictoryPlayerName(prof.displayName);
      try {
        localStorage.setItem(
          'cruciverbalist_device_profile',
          JSON.stringify(prof)
        );
      } catch {
        // ignore
      }
      soundFX.playWordComplete();
    } catch (err) {
      const formatted = formatFirebaseAuthError(err);
      setAuthError(formatted.message);
      setAuthErrorDetails(formatted);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignInWithEmail = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    setAuthErrorDetails(null);
    try {
      const user = await signInWithEmailAccount(email, password);
      const prof = await ensureUserPublicProfile(user);
      setPlayerProfile(prof);
      setVictoryPlayerName(prof.displayName);
      try {
        localStorage.setItem(
          'cruciverbalist_device_profile',
          JSON.stringify(prof)
        );
      } catch {
        // ignore
      }
      soundFX.playWordComplete();
    } catch (err) {
      const formatted = formatFirebaseAuthError(err);
      setAuthError(formatted.message);
      setAuthErrorDetails(formatted);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setAuthLoading(true);
    setAuthError(null);
    setAuthErrorDetails(null);
    try {
      await resetEmailPassword(email);
    } catch (err) {
      const formatted = formatFirebaseAuthError(err);
      setAuthError(formatted.message);
      setAuthErrorDetails(formatted);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleActivateDeviceAccount = (email: string, displayName: string) => {
    const cleanName = displayName.trim().slice(0, 40) || 'Cruciverbalist';
    const myEntries = leaderboard.filter(
      (e) => e.playerName.trim().toLowerCase() === cleanName.toLowerCase()
    );
    const totalScore = myEntries.reduce((acc, item) => acc + item.score, 0);
    const deviceProf: PlayerProfile = {
      uid: `device_${email.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40)}`,
      displayName: cleanName,
      photoURL: '',
      puzzlesSolved: myEntries.length,
      totalScore,
    };
    setPlayerProfile(deviceProf);
    setVictoryPlayerName(cleanName);
    setAuthError(null);
    setAuthErrorDetails(null);
    try {
      localStorage.setItem(
        'cruciverbalist_device_profile',
        JSON.stringify(deviceProf)
      );
      localStorage.setItem('cruciverbalist_last_player_name', cleanName);
    } catch {
      // ignore
    }
    soundFX.playWordComplete();
  };

  const handleSignOut = async () => {
    setAuthError(null);
    setAuthErrorDetails(null);
    try {
      await signOutPlayerAccount();
    } catch {
      // ignore if device-only
    }
    setPlayerProfile(null);
    try {
      localStorage.removeItem('cruciverbalist_device_profile');
    } catch {
      // ignore
    }
  };

  const handleUpdateDisplayName = async (newName: string) => {
    if (currentUser) {
      const updated = await updatePlayerCallsign(currentUser, newName);
      setPlayerProfile(updated);
      setVictoryPlayerName(updated.displayName);
      try {
        localStorage.setItem(
          'cruciverbalist_device_profile',
          JSON.stringify(updated)
        );
      } catch {
        // ignore
      }
    } else if (playerProfile) {
      const cleanName = newName.trim().slice(0, 40) || 'Cruciverbalist';
      const updated: PlayerProfile = {
        ...playerProfile,
        displayName: cleanName,
      };
      setPlayerProfile(updated);
      setVictoryPlayerName(cleanName);
      try {
        localStorage.setItem(
          'cruciverbalist_device_profile',
          JSON.stringify(updated)
        );
      } catch {
        // ignore
      }
    }
  };

  const handleAddPuzzleFromAdmin = (puzzle: PuzzleDefinition, themeId: VisualThemeId) => {
    setPuzzles((prev) => [puzzle, ...prev]);
    setSelectedPuzzleId(puzzle.id);
    setVisualThemeId(themeId);
    initializeBoardForPuzzle(puzzle);
  };

  const handleResetLeaderboardFromAdmin = () => {
    const refreshed = resetLeaderboard();
    setLocalLeaderboard(refreshed);
  };

  const handleDeletePuzzleFromAdmin = (puzzleId: string) => {
    setPuzzles((prev) => prev.filter((p) => p.id !== puzzleId));
    if (selectedPuzzleId === puzzleId) {
      const remaining = puzzles.filter((p) => p.id !== puzzleId);
      if (remaining.length > 0) {
        setSelectedPuzzleId(remaining[0].id);
      }
    }
  };

  // Render Title Screen when in TITLE_MENU
  if (gameState === 'TITLE_MENU') {
    return (
      <>
        <TitleScreen
          puzzles={puzzles}
          selectedPuzzleId={selectedPuzzleId}
          onSelectPuzzle={handleSelectPuzzle}
          visualThemeId={visualThemeId}
          onSelectVisualTheme={(id) => {
            soundFX.playClick();
            setVisualThemeId(id);
          }}
          clueDifficulty={clueDifficulty}
          easiestBaseForSelected={easiestBaseForActivePuzzle}
          onSelectClueDifficulty={(diff) =>
            handleChangeClueDifficulty(diff, activePuzzle.id)
          }
          onStartGame={handleStartGame}
          onOpenArchive={() => {
            soundFX.playClick();
            setIsArchiveOpen(true);
          }}
          onOpenLeaderboard={() => {
            soundFX.playClick();
            setIsLeaderboardOpen(true);
          }}
          onOpenAuthModal={() => {
            soundFX.playClick();
            setIsAuthModalOpen(true);
          }}
          onOpenAdminModal={() => {
            soundFX.playClick();
            setIsAdminModalOpen(true);
          }}
          currentUser={currentUser}
          playerProfile={playerProfile}
          areElementsVisible={areElementsVisible}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          topScores={leaderboard}
          londonCountdown={londonClock.countdownToMidnight}
          streakSummary={streakSummary}
        />

        <ArchiveModal
          isOpen={isArchiveOpen}
          onClose={() => setIsArchiveOpen(false)}
          puzzles={puzzles}
          selectedPuzzleId={selectedPuzzleId}
          visualThemeId={visualThemeId}
          clueDifficulty={clueDifficulty}
          easiestBaseByPuzzle={easiestBaseByPuzzle}
          onChangeClueDifficulty={(diff) =>
            handleChangeClueDifficulty(diff, activePuzzle.id)
          }
          leaderboard={leaderboard}
          onSelectAndPlayPuzzle={handleSelectAndPlayArchivePuzzle}
          londonCountdown={londonClock.countdownToMidnight}
        />

        <LeaderboardModal
          isOpen={isLeaderboardOpen}
          onClose={() => setIsLeaderboardOpen(false)}
          entries={leaderboard}
          puzzles={puzzles}
          visualThemeId={visualThemeId}
          currentUser={currentUser}
          playerProfile={playerProfile}
          onOpenAuthModal={() => {
            setIsLeaderboardOpen(false);
            setIsAuthModalOpen(true);
          }}
        />

        <PlayerAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          visualThemeId={visualThemeId}
          currentUser={currentUser}
          playerProfile={playerProfile}
          authLoading={authLoading}
          authError={authError}
          authErrorDetails={authErrorDetails}
          onSignInWithGoogle={handleSignInWithGoogle}
          onRegisterWithEmail={handleRegisterWithEmail}
          onSignInWithEmail={handleSignInWithEmail}
          onResetPassword={handleResetPassword}
          onActivateDeviceAccount={handleActivateDeviceAccount}
          onSignOut={handleSignOut}
          onUpdateDisplayName={handleUpdateDisplayName}
          leaderboard={leaderboard}
        />

        <AdminPanelModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          visualThemeId={visualThemeId}
          puzzles={puzzles}
          onAddPuzzle={handleAddPuzzleFromAdmin}
          onResetLeaderboard={handleResetLeaderboardFromAdmin}
          onDeletePuzzle={handleDeletePuzzleFromAdmin}
        />
      </>
    );
  }

  // Filter clues for sidebar display by search query
  const filterClueList = (list: PlacedClue[]) => {
    if (!clueSearchQuery.trim()) return list;
    const q = clueSearchQuery.toLowerCase().trim();
    return list.filter(
      (c) =>
        String(c.number).includes(q) ||
        getClueTextForDifficulty(c).toLowerCase().includes(q)
    );
  };

  const filteredAcross = filterClueList(activePuzzle.clues.across);
  const filteredDown = filterClueList(activePuzzle.clues.down);

  return (
    <div
      className={`min-h-screen w-full app-main-bg ${theme.textPrimary} flex flex-col justify-between relative transition-colors duration-200 select-none`}
    >
      <div
        className={`min-h-screen w-full flex flex-col justify-between relative game-elements-fade ${
          areElementsVisible ? 'game-elements-fade-visible' : 'pointer-events-none'
        }`}
      >
        {/* Subtle Ambient Veil to harmonize chosen board surface palette with the main background image */}
        <div
          className={`pointer-events-none fixed inset-0 ${
            visualThemeId === 'editorial' ? 'bg-white/15' : 'bg-black/25'
          } transition-colors duration-200 z-0`}
          aria-hidden="true"
        />

        {/* Top Perimeter HUD Bar */}
        <header
          className={`relative z-10 w-full border-b ${theme.borderSubtle} ${theme.bgSurface} px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5`}
        >
          <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
            {/* Left: Return to Title, Format Switcher (20x20 vs 8x8), Date & Edition Name */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setGameState('TITLE_MENU');
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} text-xs font-medium flex items-center gap-1.5 hover:opacity-85 cursor-pointer whitespace-nowrap shrink-0`}
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">Title</span>
              </button>

              {/* Quick Format Toggle: 20x20 Standard vs 8x8 Quick (Visible on Mobile & Desktop) */}
              <div
                className={`flex items-center p-0.5 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} shrink-0`}
              >
                <button
                  type="button"
                  onClick={() => handleSwitchFormatInPlay(20)}
                  className={`px-2 sm:px-2.5 py-1 rounded-md text-xs font-mono-tabular font-semibold flex items-center gap-1 cursor-pointer ${
                    gridSize === 20
                      ? `${theme.accentBg} ${theme.accentText}`
                      : `${theme.textSecondary}`
                  }`}
                  title="Switch to 20×20 Standard Edition"
                >
                  <Grid className="w-3 h-3" />
                  <span>20×20</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchFormatInPlay(8)}
                  className={`px-2 sm:px-2.5 py-1 rounded-md text-xs font-mono-tabular font-semibold flex items-center gap-1 cursor-pointer ${
                    gridSize === 8
                      ? `${theme.accentBg} ${theme.accentText}`
                      : `${theme.textSecondary}`
                  }`}
                  title="Switch to 8×8 Daily Quick Crossword"
                >
                  <Zap className="w-3 h-3" />
                  <span>8×8</span>
                </button>
              </div>

              <div className="min-w-0 hidden md:block">
                <div className="text-sm font-bold font-display truncate">
                  {activePuzzle.title}
                </div>
                <div
                  className={`text-xs ${theme.textMuted} truncate font-mono-tabular`}
                >
                  <span>
                    {activePuzzle.archiveDate} ({activePuzzle.dayOfWeekName})
                  </span>
                  <span className="mx-1.5" aria-hidden="true">
                    ·
                  </span>
                  <span>
                    {activePuzzle.editionType === 'quick-8x8'
                      ? '8×8 Quick Sprint'
                      : activePuzzle.editionType === 'weekend-themed'
                      ? `Weekend Theme: ${activePuzzle.themeName}`
                      : activePuzzle.editionType === 'weekday-general'
                      ? '20×20 Weekday General'
                      : `Custom Theme: ${activePuzzle.themeName}`}
                  </span>
                  <span className="mx-1.5" aria-hidden="true">
                    ·
                  </span>
                  <span title="New daily crosswords generate at 00:00 London, UK time">
                    00:00 London in {londonClock.countdownToMidnight}
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Tabular Game Telemetry Cluster with Base Score & -25 pts / 60s Time Deduction */}
            <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono-tabular">
              <div title="Current score / maximum possible score based on viewed difficulty tiers and time penalty">
                <span className={theme.textMuted}>SCORE </span>
                <span className="font-bold text-xs sm:text-sm">
                  {stats.score.toLocaleString()} / {stats.maxPossibleScore.toLocaleString()}
                </span>
                <span
                  className={`hidden sm:inline ml-1 text-[11px] ${theme.textMuted}`}
                >
                  pts
                </span>
              </div>
              <span className={theme.textMuted} aria-hidden="true">
                ·
              </span>
              <div className="hidden sm:block">
                <span className={theme.textMuted}>WORDS </span>
                <span className="font-bold text-sm">
                  {stats.solvedWords}/{stats.totalWords}
                </span>
              </div>
              <span
                className={`hidden sm:inline ${theme.textMuted}`}
                aria-hidden="true"
              >
                ·
              </span>
              <div>
                <span className={theme.textMuted}>GRID </span>
                <span className="font-bold text-xs sm:text-sm">
                  {stats.progressPercent}%
                </span>
              </div>
              <span className={theme.textMuted} aria-hidden="true">
                ·
              </span>
              <div>
                <span className={theme.textMuted}>TIME </span>
                <span className="font-bold text-xs sm:text-sm">
                  {formatDuration(elapsedSeconds)}
                </span>
              </div>
            </div>

            {/* Gameplay Quick Controls: Skip Filled, Fit, Own Keyboard */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Skip Already Filled Boxes Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={skipFilledCells}
                onClick={handleToggleSkipFilled}
                className={`px-2 sm:px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  skipFilledCells
                    ? `${theme.accentBorder} ${theme.bgElevated} text-emerald-400`
                    : `${theme.borderSubtle} ${theme.bgCanvas} ${theme.textSecondary}`
                }`}
                title="When enabled, typing a letter automatically skips over boxes that are already filled"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Skip Filled: {skipFilledCells ? 'ON' : 'OFF'}</span>
              </button>

              {/* Fit / Zoom Reset Button */}
              <button
                type="button"
                onClick={handleResetZoom}
                className={`px-2 sm:px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                  gridZoom > 1.05
                    ? `${theme.accentBg} ${theme.accentText}`
                    : `${theme.borderSubtle} ${theme.bgCanvas} ${theme.textSecondary} hover:${theme.textPrimary}`
                }`}
                title="Reset crossword grid zoom to Fit"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>
                  {gridZoom > 1.05 ? `Fit (${Math.round(gridZoom * 100)}%)` : 'Fit'}
                </span>
              </button>

              {/* Use Device's Own Keyboard Button */}
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  focusNativeKeyboard();
                }}
                className={`px-2 sm:px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                  isNativeKeyboardFocused
                    ? `${theme.accentBg} ${theme.accentText}`
                    : `${theme.borderSubtle} ${theme.bgElevated} ${theme.textPrimary}`
                }`}
                title="Open your device's native keyboard to type directly into the crossword"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>
                  {isNativeKeyboardFocused ? 'Keyboard Active' : 'Own Keyboard'}
                </span>
              </button>
            </div>

            {/* Right: Player Account, Archive, Scoreboard, Palette, Pause, Mute */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {gameState === 'VICTORY' && isVictoryPopupDismissed && (
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playVictory();
                    setIsVictoryPopupDismissed(false);
                    triggerVictoryConfetti();
                  }}
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-400 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Solved</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setIsAuthModalOpen(true);
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg border ${
                  currentUser || playerProfile
                    ? `${theme.accentBorder} ${theme.bgElevated}`
                    : `${theme.accentBg} ${theme.accentText}`
                } text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0`}
              >
                {currentUser || playerProfile ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="max-w-[95px] sm:max-w-[110px] truncate">
                      {playerProfile?.displayName ||
                        currentUser?.displayName ||
                        'Account'}
                    </span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setIsArchiveOpen(true);
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} text-xs font-medium flex items-center gap-1.5 hover:opacity-85 cursor-pointer whitespace-nowrap shrink-0`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Archive</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setIsLeaderboardOpen(true);
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} text-xs font-medium flex items-center gap-1.5 hover:opacity-85 cursor-pointer whitespace-nowrap shrink-0`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Scoreboard</span>
              </button>

              <select
                aria-label="Board visual palette"
                value={visualThemeId}
                onChange={(e) => {
                  soundFX.playClick();
                  setVisualThemeId(e.target.value as VisualThemeId);
                }}
                className={`hidden sm:block px-2.5 py-1.5 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} ${theme.textPrimary} text-xs font-medium cursor-pointer focus:outline-none`}
              >
                {(Object.keys(VISUAL_THEMES) as VisualThemeId[]).map((k) => (
                  <option key={k} value={k}>
                    {VISUAL_THEMES[k].name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setGameState((prev) =>
                    prev === 'PAUSED' ? 'PLAYING' : 'PAUSED'
                  );
                }}
                className={`p-1.5 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} hover:opacity-85 cursor-pointer`}
                aria-label={gameState === 'PAUSED' ? 'Resume game' : 'Pause game'}
              >
                {gameState === 'PAUSED' ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={handleToggleMute}
                className={`p-1.5 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} hover:opacity-85 cursor-pointer`}
                aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main 1440px Playfield Workspace */}
        <main className="relative z-10 flex-1 w-full max-w-[1440px] mx-auto px-2.5 sm:px-4 lg:px-6 py-2.5 sm:py-4 grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 items-start">
          {/* Left/Center Column (7 cols on XL): Active Clue Banner + 20x20 or 8x8 Grid + On-Screen Key Strip */}
          <div className="xl:col-span-7 flex flex-col items-center w-full">
            {/* Active Clue Spotlight Bar + Mobile/Desktop Gameplay Controls directly above the Grid */}
            <div
              id="active-clue-spotlight"
              className={`w-[calc(100%-20px)] mb-0 p-3 sm:p-3.5 rounded-t-xl border border-b-0 ${theme.borderSubtle} ${theme.bgSurface} flex flex-col gap-2.5`}
            >
              <div className="flex items-start justify-between gap-2">
                {/* Previous Clue Button for Quick Mobile/Touch Navigation */}
                <button
                  type="button"
                  onClick={() => {
                    handleCycleClue(-1);
                    focusNativeKeyboard();
                  }}
                  className={`p-2 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} hover:opacity-85 cursor-pointer shrink-0 mt-0.5`}
                  title="Previous Clue (Shift+Tab)"
                  aria-label="Previous clue"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {activeClue ? (
                  <div
                    onClick={focusNativeKeyboard}
                    className="min-w-0 flex-1 px-1 cursor-pointer"
                  >
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs mb-0.5">
                      <span className="font-mono-tabular font-bold uppercase text-amber-400">
                        {activeClue.number} {activeClue.direction}
                      </span>
                      <span className={theme.textMuted} aria-hidden="true">
                        ·
                      </span>
                      <span className="font-mono-tabular">
                        {activeClue.length} Letters
                      </span>
                      <span
                        className={`hidden sm:inline ${theme.textMuted}`}
                        aria-hidden="true"
                      >
                        ·
                      </span>
                      <span className="hidden sm:inline font-semibold">
                        {getDifficultyDescriptor(clueDifficulty)}
                      </span>
                    </div>
                    <div className="text-xs sm:text-base font-medium leading-snug">
                      {getClueTextForDifficulty(activeClue)}
                    </div>
                    {unlockedBreakdowns.has(activeClue.id) && (
                      <div
                        className={`mt-1 text-xs ${theme.textSecondary} italic`}
                      >
                        Hint Breakdown: {activeClue.crypticBreakdown} (
                        {activeClue.etymologyOrContext})
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm flex-1 px-1">
                    Tap any numbered white cell on the {gridSize}×{gridSize}{' '}
                    grid to begin solving.
                  </div>
                )}

                {/* Next Clue Button for Quick Mobile/Touch Navigation */}
                <button
                  type="button"
                  onClick={() => {
                    handleCycleClue(1);
                    focusNativeKeyboard();
                  }}
                  className={`p-2 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} hover:opacity-85 cursor-pointer shrink-0 mt-0.5`}
                  title="Next Clue (Tab)"
                  aria-label="Next clue"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Action Strip: Direction Toggle */}
              <div
                className={`pt-2 border-t ${theme.borderSubtle} flex items-center justify-between gap-2`}
              >
                {/* Switch Across / Down */}
                <button
                  type="button"
                  onClick={() => {
                    const cell =
                      activePuzzle.grid[focusedCell.row]?.[focusedCell.col];
                    if (cell && cell.acrossClueId && cell.downClueId) {
                      soundFX.playClick();
                      setDirection((prev) =>
                        prev === 'across' ? 'down' : 'across'
                      );
                    }
                    focusNativeKeyboard();
                  }}
                  className={`px-3 py-1.5 rounded-lg border ${theme.borderSubtle} ${theme.bgElevated} text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0`}
                  title="Switch between Across and Down (Spacebar)"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Direction: {direction === 'across' ? 'Across' : 'Down'}</span>
                </button>

                <div className={`text-[11px] ${theme.textMuted} font-mono-tabular truncate`}>
                  {activeClue ? `${activeClue.direction.toUpperCase()} · ${activeClue.length} Letters` : ''}
                </div>
              </div>
            </div>

            {/* Interactive Crossword Board (20x20 Standard or 8x8 Quick) with Solid Black Crossword Background & 100% Boxes */}
            <div
              ref={gridContainerRef}
              className={`relative w-[calc(100%-20px)] mt-0 aspect-square max-h-[78vh] ${
                gridZoom > 1.0
                  ? 'overflow-auto touch-pan-x touch-pan-y overscroll-contain block'
                  : 'overflow-hidden flex items-center justify-center'
              } p-1.5 sm:p-2 rounded-b-xl border ${theme.borderSubtle} bg-black shadow-sm select-none`}
              style={{
                WebkitOverflowScrolling: 'touch',
                touchAction: gridZoom > 1.0 ? 'pan-x pan-y' : 'none',
              }}
            >
              {/* Floating Zoom & Pan Indicator Badge when zoomed (hidden on mobile view) */}
              {gridZoom > 1.05 && (
                <div className="hidden sm:inline-flex sticky top-2 left-2 z-30 items-center gap-1.5 px-2 py-1 rounded-lg bg-black/85 border border-amber-500/50 text-amber-300 text-[11px] font-mono-tabular backdrop-blur-sm pointer-events-none shadow-lg">
                  <ZoomIn className="w-3 h-3 text-amber-400" />
                  <span>{Math.round(gridZoom * 100)}%</span>
                  <span className="text-[10px] opacity-75">· Drag to pan</span>
                </div>
              )}

              {/* Hidden Native OS Keyboard Input for Mobile (iOS / Android) & Touch Devices */}
              <input
                ref={mobileKeyboardInputRef}
                type="text"
                inputMode="text"
                enterKeyHint="next"
                autoCapitalize="characters"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                aria-label="Crossword grid native keyboard input"
                value=" "
                onChange={handleMobileInputChange}
                onKeyDown={handleMobileInputKeyDown}
                onFocus={() => setIsNativeKeyboardFocused(true)}
                onBlur={() => setIsNativeKeyboardFocused(false)}
                className="fixed top-1/3 left-1/2 -translate-x-1/2 w-1 h-1 opacity-0 pointer-events-none"
              />

              {/* Solid Black Crossword Background */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-black crossword-board-bg"
              />

              {/* 3D Logo Background between solid black background and grid (10% opacity) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-[15px] flex items-center justify-center select-none"
              >
                <img
                  src="/assets/aistudio/Gemini_Generated_Image_wsrnmwsrnmwsrnmw_7fed61a6.jpg"
                  alt=""
                  className="w-full h-full object-cover opacity-10 pointer-events-none select-none"
                />
              </div>

              <div
                className={`relative z-10 grid border border-slate-700/60 m-auto shrink-0 ${
                  isPinching
                    ? 'transition-none'
                    : 'transition-[width,height] duration-150 ease-out'
                }`}
                style={{
                  width:
                    gridZoom > 1.0
                      ? `${Math.round(gridZoom * 100)}%`
                      : '100%',
                  height:
                    gridZoom > 1.0
                      ? `${Math.round(gridZoom * 100)}%`
                      : '100%',
                  minWidth: '100%',
                  minHeight: '100%',
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
                }}
                role="grid"
                aria-label={`${gridSize} by ${gridSize} Crossword Grid`}
              >
                {activePuzzle.grid.map((rowArr, rIdx) =>
                  rowArr.map((cell, cIdx) => {
                    if (cell.isBlocked) {
                      return (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className="relative w-full h-full bg-transparent border-transparent pointer-events-none overflow-hidden"
                          role="gridcell"
                          aria-disabled="true"
                        />
                      );
                    }

                    const cellKey = `${rIdx},${cIdx}`;
                    const isFocused =
                      focusedCell.row === rIdx && focusedCell.col === cIdx;
                    const isInActiveWord = activeWordCells.has(cellKey);
                    const isRevealed = revealedCells.has(cellKey);
                    const hasError = errorCells.has(cellKey);
                    const val = userGrid[rIdx]?.[cIdx] || '';

                    let bgClass = theme.gridCellBg;
                    let textClass = theme.gridCellText;
                    if (isFocused) {
                      bgClass = theme.gridCellFocused;
                      textClass = theme.gridCellFocusedText;
                    } else if (isInActiveWord) {
                      bgClass = theme.gridCellActiveWord;
                    }

                    return (
                      <button
                        key={`${rIdx}-${cIdx}`}
                        id={`grid-cell-${rIdx}-${cIdx}`}
                        type="button"
                        role="gridcell"
                        aria-label={`Row ${rIdx + 1} Column ${cIdx + 1}${
                          cell.number ? `, Clue ${cell.number}` : ''
                        }${val ? `, Letter ${val}` : ', Empty'}`}
                        onClick={() => {
                          soundFX.playClick();
                          if (
                            focusedCell.row === rIdx &&
                            focusedCell.col === cIdx
                          ) {
                            if (cell.acrossClueId && cell.downClueId) {
                              setDirection((prev) =>
                                prev === 'across' ? 'down' : 'across'
                              );
                            }
                          } else {
                            setFocusedCell({ row: rIdx, col: cIdx });
                          }
                          // Focus native mobile keyboard synchronously on cell tap
                          focusNativeKeyboard();
                        }}
                        className={`relative w-full h-full ${bgClass} ${textClass} border-[0.5px] border-slate-500/35 flex items-center justify-center font-mono-tabular font-bold transition-colors duration-75 focus:outline-none cursor-pointer overflow-hidden touch-manipulation`}
                      >
                        {cell.number !== undefined && (
                          <span
                            className={`pointer-events-none absolute z-20 ${
                              gridSize === 8
                                ? 'top-[2px] left-[3.5px] text-[10px] sm:text-xs'
                                : 'top-[1px] left-[1.5px] text-[7px] sm:text-[9px]'
                            } leading-none font-mono-tabular font-semibold ${
                              isFocused ? 'opacity-95' : 'opacity-80'
                            }`}
                          >
                            {cell.number}
                          </span>
                        )}

                        {isRevealed && (
                          <span
                            className="pointer-events-none absolute z-20 top-0 right-0 w-0 h-0 border-t-[6px] border-t-emerald-500 border-l-[6px] border-l-transparent"
                            title="Anchor letter revealed"
                          />
                        )}

                        {hasError && (
                          <span
                            className="pointer-events-none absolute z-20 inset-0 border-b-2 border-red-500 rotate-45 scale-125"
                            aria-hidden="true"
                          />
                        )}

                        {/* Letter scaled to exactly 80% of box size via viewBox text */}
                        {val ? (
                          <svg
                            viewBox="0 0 100 100"
                            className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
                            aria-hidden="true"
                          >
                            <text
                              x="50"
                              y="54"
                              textAnchor="middle"
                              dominantBaseline="central"
                              fontSize="80"
                              fontWeight="700"
                              fontFamily="JetBrains Mono, monospace"
                              fill="currentColor"
                            >
                              {val}
                            </text>
                          </svg>
                        ) : null}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Compact On-Screen Keyboard Strip for Touch / Mouse Input (with option to hide when using device keyboard) */}
            <div className="w-[calc(100%-20px)] mt-2.5">
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className={`text-[11px] ${theme.textMuted}`}>
                  Tap any grid box to use your own keyboard, or tap keys below:
                </span>
                <button
                  type="button"
                  onClick={() => setShowOnScreenKeys((s) => !s)}
                  className={`text-[11px] font-semibold ${theme.textSecondary} hover:underline cursor-pointer`}
                >
                  {showOnScreenKeys ? 'Hide On-Screen Keys' : 'Show On-Screen Keys'}
                </button>
              </div>

              {showOnScreenKeys && (
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => handleLetterInput(letter)}
                      className={`w-7 h-8 sm:w-8 sm:h-8 rounded border ${theme.borderSubtle} ${theme.bgSurface} ${theme.textPrimary} font-mono-tabular text-xs font-bold hover:opacity-85 active:scale-95 transition-transform cursor-pointer touch-manipulation`}
                    >
                      {letter}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleBackspace}
                    className={`px-2.5 h-8 rounded border ${theme.borderSubtle} ${theme.bgElevated} ${theme.textPrimary} font-mono-tabular text-xs font-semibold hover:opacity-85 cursor-pointer whitespace-nowrap shrink-0 touch-manipulation`}
                  >
                    ⌫ Back
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (5 cols on XL): 4-Tier Hint System + Clue Difficulty Selector + Across/Down Lists */}
          <div className="xl:col-span-5 flex flex-col gap-4 w-full">
            {/* 4-Tier User-Friendly Hint System Card */}
            <section
              className={`p-4 rounded-xl border ${theme.borderSubtle} ${theme.bgSurface}`}
              aria-label="Multi-tier hint system"
            >
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <h2 className="text-sm font-bold tracking-tight">
                    4-Tier Cruciverbalist Hint System
                  </h2>
                </div>
                <span className={`text-xs ${theme.textMuted} font-mono-tabular`}>
                  Hints Used: {hintsUsed}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={handleHintTier1Breakdown}
                  className={`p-2.5 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} hover:opacity-90 text-left transition-opacity cursor-pointer flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span>1. Wordplay</span>
                    <BookOpen className="w-3.5 h-3.5 opacity-70" />
                  </div>
                  <div className={`text-[11px] ${theme.textMuted} leading-tight`}>
                    Cryptic &amp; context guide
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleHintTier2AnchorLetter}
                  className={`p-2.5 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} hover:opacity-90 text-left transition-opacity cursor-pointer flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span>2. Letter</span>
                    <Sparkles className="w-3.5 h-3.5 opacity-70" />
                  </div>
                  <div className={`text-[11px] ${theme.textMuted} leading-tight`}>
                    Reveal next letter
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleHintTier3CheckWord}
                  className={`p-2.5 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} hover:opacity-90 text-left transition-opacity cursor-pointer flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span>3. Verify</span>
                    <CheckCircle2 className="w-3.5 h-3.5 opacity-70" />
                  </div>
                  <div className={`text-[11px] ${theme.textMuted} leading-tight`}>
                    Check active word
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleHintTier4RevealWord}
                  className={`p-2.5 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} hover:opacity-90 text-left transition-opacity cursor-pointer flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span>4. Solve</span>
                    <Eye className="w-3.5 h-3.5 opacity-70" />
                  </div>
                  <div className={`text-[11px] ${theme.textMuted} leading-tight`}>
                    Reveal full entry
                  </div>
                </button>
              </div>

              {hintBannerMessage && (
                <div
                  className={`mt-3 p-2.5 rounded-lg border ${theme.borderSubtle} ${theme.bgElevated} text-xs leading-relaxed`}
                >
                  {hintBannerMessage}
                </div>
              )}
            </section>

            {/* Clue Difficulty Selector & Clue List Card */}
            <section
              className={`p-4 rounded-xl border ${theme.borderSubtle} ${theme.bgSurface} flex flex-col gap-3`}
            >
              {/* Clue Difficulty Selector with Easiest Base Lock Explanation */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold">
                    Clue Difficulty · Easiest Base Today:{' '}
                    <span className="uppercase font-mono-tabular">
                      {easiestBaseForActivePuzzle} (
                      {stats.score.toLocaleString()} pts)
                    </span>
                  </div>
                  <div className={`text-[11px] ${theme.textMuted}`}>
                    Selecting an easier tier sets your fixed score base for this
                    puzzle.
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 p-1 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas}`}
                >
                  {(
                    [
                      { id: 'easy', label: 'Easy (1,000)' },
                      { id: 'medium', label: 'Med (2,000)' },
                      { id: 'hard', label: 'Hard (3,000)' },
                    ] as const
                  ).map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() =>
                        handleChangeClueDifficulty(mode.id, activePuzzle.id)
                      }
                      className={`px-2.5 py-1 rounded text-xs font-mono-tabular font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        clueDifficulty === mode.id
                          ? `${theme.accentBg} ${theme.accentText}`
                          : `${theme.textSecondary} hover:${theme.textPrimary}`
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Clue List by keyword or clue number */}
              <div className="pt-2 border-t border-slate-500/15">
                <input
                  type="text"
                  value={clueSearchQuery}
                  onChange={(e) => setClueSearchQuery(e.target.value)}
                  placeholder="Filter clues by number or text..."
                  className={`w-full px-3 py-1.5 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} text-xs focus:outline-none`}
                />
              </div>

              {/* Dual Scrollable Clue Columns: Across & Down */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Across Column */}
                <div className="flex flex-col">
                  <div
                    className={`pb-2 mb-2 border-b ${theme.borderSubtle} flex items-center justify-between`}
                  >
                    <h3 className="text-sm font-bold font-display">Across</h3>
                    <span
                      className={`text-xs ${theme.textMuted} font-mono-tabular`}
                    >
                      {filteredAcross.length} Clues
                    </span>
                  </div>
                  <div className="h-[260px] sm:h-[340px] overflow-y-auto pr-1 space-y-1.5 clue-scroll">
                    {filteredAcross.map((clue) => {
                      const isCurrent = activeClue?.id === clue.id;
                      const isDone = completedClueIds.has(clue.id);
                      return (
                        <button
                          key={clue.id}
                          type="button"
                          onClick={() => {
                            soundFX.playClick();
                            setDirection('across');
                            setFocusedCell(
                              getTargetCellForClue(
                                clue,
                                userGrid,
                                skipFilledCells
                              )
                            );
                            focusNativeKeyboard();
                          }}
                          className={`w-full text-left p-2.5 rounded-lg border transition-colors cursor-pointer ${
                            isCurrent
                              ? `${theme.accentBorder} ${theme.bgElevated}`
                              : `${theme.borderSubtle} hover:opacity-90`
                          } ${isDone ? 'opacity-60' : ''}`}
                        >
                          <div className="flex items-center justify-between text-[11px] mb-0.5">
                            <span className="font-mono-tabular font-bold">
                              {clue.number}. ({clue.length})
                            </span>
                            <span className={`${theme.textMuted} capitalize`}>
                              {clueDifficulty}
                              {isDone ? ' · Solved' : ''}
                            </span>
                          </div>
                          <div
                            className={`text-xs leading-snug ${
                              isDone ? 'line-through' : ''
                            }`}
                          >
                            {getClueTextForDifficulty(clue)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Down Column */}
                <div className="flex flex-col">
                  <div
                    className={`pb-2 mb-2 border-b ${theme.borderSubtle} flex items-center justify-between`}
                  >
                    <h3 className="text-sm font-bold font-display">Down</h3>
                    <span
                      className={`text-xs ${theme.textMuted} font-mono-tabular`}
                    >
                      {filteredDown.length} Clues
                    </span>
                  </div>
                  <div className="h-[260px] sm:h-[340px] overflow-y-auto pr-1 space-y-1.5 clue-scroll">
                    {filteredDown.map((clue) => {
                      const isCurrent = activeClue?.id === clue.id;
                      const isDone = completedClueIds.has(clue.id);
                      return (
                        <button
                          key={clue.id}
                          type="button"
                          onClick={() => {
                            soundFX.playClick();
                            setDirection('down');
                            setFocusedCell(
                              getTargetCellForClue(
                                clue,
                                userGrid,
                                skipFilledCells
                              )
                            );
                            focusNativeKeyboard();
                          }}
                          className={`w-full text-left p-2.5 rounded-lg border transition-colors cursor-pointer ${
                            isCurrent
                              ? `${theme.accentBorder} ${theme.bgElevated}`
                              : `${theme.borderSubtle} hover:opacity-90`
                          } ${isDone ? 'opacity-60' : ''}`}
                        >
                          <div className="flex items-center justify-between text-[11px] mb-0.5">
                            <span className="font-mono-tabular font-bold">
                              {clue.number}. ({clue.length})
                            </span>
                            <span className={`${theme.textMuted} capitalize`}>
                              {clueDifficulty}
                              {isDone ? ' · Solved' : ''}
                            </span>
                          </div>
                          <div
                            className={`text-xs leading-snug ${
                              isDone ? 'line-through' : ''
                            }`}
                          >
                            {getClueTextForDifficulty(clue)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Pause Modal */}
        {gameState === 'PAUSED' && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/70"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pause-modal-title"
          >
            <div
              className={`relative w-full max-w-md p-6 pt-8 rounded-2xl border ${theme.borderSubtle} ${theme.bgSurface} ${theme.textPrimary} text-center space-y-5 shadow-xl`}
            >
              {/* Top-Right Close Button */}
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setGameState('PLAYING');
                }}
                aria-label="Close pause popup"
                title="Close and resume solving"
                className={`absolute top-4 right-4 p-2 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} hover:opacity-80 transition-opacity cursor-pointer z-10`}
              >
                <X className="w-4 h-4" />
              </button>

              <h2
                id="pause-modal-title"
                className="text-2xl font-bold font-display"
              >
                Puzzle Paused
              </h2>
              <p className={`text-sm ${theme.textSecondary}`}>
                {activePuzzle.title} ({activePuzzle.archiveDate}) ·{' '}
                {stats.progressPercent}% Completed
              </p>
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setGameState('PLAYING');
                  }}
                  className={`w-full py-3 rounded-xl font-semibold text-sm ${theme.accentBg} ${theme.accentText} cursor-pointer`}
                >
                  Resume Solving
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setIsArchiveOpen(true);
                  }}
                  className={`w-full py-2.5 rounded-xl font-medium text-xs border ${theme.borderSubtle} ${theme.bgElevated} flex items-center justify-center gap-2 cursor-pointer`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Browse Past Daily Archive (20×20 &amp; 8×8)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    initializeBoardForPuzzle(activePuzzle);
                    setGameState('PLAYING');
                  }}
                  className={`w-full py-2.5 rounded-xl font-medium text-xs border ${theme.borderSubtle} ${theme.bgElevated} flex items-center justify-center gap-2 cursor-pointer`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>
                    Reset {gridSize}×{gridSize} Grid
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setGameState('TITLE_MENU');
                  }}
                  className={`w-full py-2.5 rounded-xl font-medium text-xs border ${theme.borderSubtle} hover:opacity-85 cursor-pointer`}
                >
                  Return to Title Screen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Victory / Puzzle Solved End Game Popup */}
        {gameState === 'VICTORY' && !isVictoryPopupDismissed && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75"
            role="dialog"
            aria-modal="true"
            aria-labelledby="victory-modal-title"
          >
            <div
              className={`relative w-full max-w-lg p-7 rounded-2xl border ${theme.borderSubtle} ${theme.bgSurface} ${theme.textPrimary} space-y-6 shadow-2xl overflow-hidden`}
            >
              {/* Top-Right Close Button */}
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setIsVictoryPopupDismissed(true);
                }}
                aria-label="Close end game popup"
                title="Close popup and view solved grid"
                className={`absolute top-4 right-4 p-2 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} hover:opacity-80 transition-opacity cursor-pointer z-10`}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Animated Celebration Header */}
              <div className="text-center space-y-2 relative">
                <div className="inline-flex items-center justify-center relative">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-amber-400/25 animate-ping"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playVictory();
                      triggerVictoryConfetti();
                    }}
                    title="Replay celebratory confetti"
                    className="relative inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-amber-500/20 text-amber-400 mb-1 hover:bg-amber-500/30 transition-colors cursor-pointer"
                  >
                    <Trophy className="w-7 h-7 animate-bounce" />
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
                <h2
                  id="victory-modal-title"
                  className="text-3xl font-bold font-display"
                >
                  Puzzle Solved!
                </h2>
                <p className={`text-sm ${theme.textSecondary}`}>
                  {activePuzzle.title} · {activePuzzle.archiveDate} ·{' '}
                  {activePuzzle.themeName}
                </p>
              </div>

              {/* Key Summary: User Name, Time Taken, Points Scored */}
              <div
                className={`p-4 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} space-y-3`}
              >
                <div className="grid grid-cols-3 gap-3 text-center font-mono-tabular">
                  <div className="px-2">
                    <div className={`text-xs ${theme.textMuted}`}>
                      USER NAME
                    </div>
                    <div
                      className="text-base sm:text-lg font-bold mt-1 truncate font-sans"
                      title={
                        playerProfile?.displayName ||
                        currentUser?.displayName ||
                        victoryPlayerName ||
                        'Guest Solver'
                      }
                    >
                      {playerProfile?.displayName ||
                        currentUser?.displayName ||
                        victoryPlayerName ||
                        'Guest Solver'}
                    </div>
                  </div>
                  <div className={`px-2 border-x ${theme.borderSubtle}`}>
                    <div className={`text-xs ${theme.textMuted}`}>
                      TIME TAKEN
                    </div>
                    <div className="text-xl font-bold mt-0.5">
                      {formatDuration(elapsedSeconds)}
                    </div>
                  </div>
                  <div className="px-2">
                    <div className={`text-xs ${theme.textMuted}`}>
                      POINTS SCORED
                    </div>
                    <div className="text-xl font-bold mt-0.5 text-amber-500">
                      {stats.score.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Transparent Scoring Breakdown (-25 pts per 60s taken) */}
                <div
                  className={`pt-2.5 border-t ${theme.borderSubtle} flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-mono-tabular ${theme.textSecondary}`}
                >
                  <span>
                    Base ({easiestBaseForActivePuzzle}):{' '}
                    <strong>{stats.baseScore.toLocaleString()} pts</strong>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Time Penalty:{' '}
                    <strong>
                      −{stats.timePenalty.toLocaleString()} pts
                    </strong>{' '}
                    ({Math.floor(elapsedSeconds / 60)} × 60s @ −25 pts/60s)
                  </span>
                </div>
              </div>

              {/* Player Name Customization & Cloud Sync Status */}
              <form onSubmit={handleVictorySubmit} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold">
                    {currentUser || playerProfile
                      ? 'Verified Player Name on Scoreboard'
                      : 'Player Name on Scoreboard'}
                  </label>
                  {!(currentUser || playerProfile) && (
                    <button
                      type="button"
                      onClick={() => setIsAuthModalOpen(true)}
                      className="text-xs font-semibold text-emerald-500 underline cursor-pointer"
                    >
                      Register / Sign In (Email or Google) →
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    maxLength={40}
                    value={victoryPlayerName}
                    onChange={(e) => setVictoryPlayerName(e.target.value)}
                    placeholder="Your name or callsign..."
                    className={`flex-1 px-3.5 py-2 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} text-sm focus:outline-none`}
                  />
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-xl font-semibold text-xs ${theme.accentBg} ${theme.accentText} whitespace-nowrap shrink-0 cursor-pointer`}
                  >
                    Update Name
                  </button>
                </div>
                {victorySubmitted && (
                  <div
                    className={`p-2.5 rounded-xl border ${theme.borderSubtle} ${theme.bgElevated} text-center text-xs font-semibold flex items-center justify-center gap-2`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>
                      {stats.score.toLocaleString()} pts recorded for{' '}
                      <strong>
                        {playerProfile?.displayName ||
                          currentUser?.displayName ||
                          victoryPlayerName}
                      </strong>{' '}
                      in {formatDuration(elapsedSeconds)}!
                    </span>
                  </div>
                )}
              </form>

              {/* Footer Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      setIsLeaderboardOpen(true);
                    }}
                    className={`px-3.5 py-2.5 rounded-xl border ${theme.borderSubtle} ${theme.bgElevated} text-xs font-semibold flex items-center gap-1.5 cursor-pointer`}
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Scoreboard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playVictory();
                      triggerVictoryConfetti();
                    }}
                    className={`px-3.5 py-2.5 rounded-xl border ${theme.borderSubtle} ${theme.bgElevated} text-xs font-semibold flex items-center gap-1.5 cursor-pointer`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Celebrate</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      initializeBoardForPuzzle(activePuzzle);
                      setGameState('PLAYING');
                    }}
                    className={`px-4 py-2.5 rounded-xl ${theme.accentBg} ${theme.accentText} text-xs font-semibold cursor-pointer`}
                  >
                    Play Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Daily Archive Browser Modal */}
        <ArchiveModal
          isOpen={isArchiveOpen}
          onClose={() => setIsArchiveOpen(false)}
          puzzles={puzzles}
          selectedPuzzleId={selectedPuzzleId}
          visualThemeId={visualThemeId}
          clueDifficulty={clueDifficulty}
          easiestBaseByPuzzle={easiestBaseByPuzzle}
          onChangeClueDifficulty={(diff) =>
            handleChangeClueDifficulty(diff, activePuzzle.id)
          }
          leaderboard={leaderboard}
          onSelectAndPlayPuzzle={handleSelectAndPlayArchivePuzzle}
          londonCountdown={londonClock.countdownToMidnight}
        />

        {/* Permanent Cloud & Local Leaderboard Modal */}
        <LeaderboardModal
          isOpen={isLeaderboardOpen}
          onClose={() => setIsLeaderboardOpen(false)}
          entries={leaderboard}
          puzzles={puzzles}
          visualThemeId={visualThemeId}
          currentUser={currentUser}
          playerProfile={playerProfile}
          onOpenAuthModal={() => {
            setIsLeaderboardOpen(false);
            setIsAuthModalOpen(true);
          }}
          activeSessionStats={{
            puzzleId: activePuzzle.id,
            puzzleTitle: activePuzzle.title,
            themeName: activePuzzle.themeName,
            gridSize: activePuzzle.gridSize,
            score: stats.score,
            timeSeconds: elapsedSeconds,
            hintsUsed,
            easiestDifficultyUsed: easiestBaseForActivePuzzle,
            clueDifficulty,
            accuracy: stats.accuracy,
            progressPercent: stats.progressPercent,
          }}
          onRecordCurrentScore={handleRecordScore}
        />

        {/* Player Account Registration & Login Modal */}
        <PlayerAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          visualThemeId={visualThemeId}
          currentUser={currentUser}
          playerProfile={playerProfile}
          authLoading={authLoading}
          authError={authError}
          authErrorDetails={authErrorDetails}
          onSignInWithGoogle={handleSignInWithGoogle}
          onRegisterWithEmail={handleRegisterWithEmail}
          onSignInWithEmail={handleSignInWithEmail}
          onResetPassword={handleResetPassword}
          onActivateDeviceAccount={handleActivateDeviceAccount}
          onSignOut={handleSignOut}
          onUpdateDisplayName={handleUpdateDisplayName}
          leaderboard={leaderboard}
        />

        <AdminPanelModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          visualThemeId={visualThemeId}
          puzzles={puzzles}
          onAddPuzzle={handleAddPuzzleFromAdmin}
          onResetLeaderboard={handleResetLeaderboardFromAdmin}
          onDeletePuzzle={handleDeletePuzzleFromAdmin}
        />
      </div>
    </div>
  );
}
