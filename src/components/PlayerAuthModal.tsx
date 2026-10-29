import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  LeaderboardEntry,
  PlayerProfile,
  VisualThemeId,
} from '../types/crossword';
import { VISUAL_THEMES } from '../data/themes';
import { formatDuration } from '../utils/leaderboard';
import {
  UserCheck,
  LogIn,
  LogOut,
  ShieldCheck,
  Trophy,
  X,
  Check,
  Cloud,
} from 'lucide-react';

interface PlayerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  visualThemeId: VisualThemeId;
  currentUser: User | null;
  playerProfile: PlayerProfile | null;
  authLoading: boolean;
  authError: string | null;
  onSignInWithGoogle: () => Promise<void>;
  onSignOut: () => Promise<void>;
  onUpdateDisplayName: (newName: string) => Promise<void>;
  leaderboard: LeaderboardEntry[];
}

export const PlayerAuthModal: React.FC<PlayerAuthModalProps> = ({
  isOpen,
  onClose,
  visualThemeId,
  currentUser,
  playerProfile,
  authLoading,
  authError,
  onSignInWithGoogle,
  onSignOut,
  onUpdateDisplayName,
  leaderboard,
}) => {
  const [callsignInput, setCallsignInput] = useState<string>('');
  const [savingName, setSavingName] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  useEffect(() => {
    if (playerProfile?.displayName) {
      setCallsignInput(playerProfile.displayName);
    } else if (currentUser?.displayName) {
      setCallsignInput(currentUser.displayName);
    }
  }, [playerProfile, currentUser]);

  if (!isOpen) return null;

  const theme = VISUAL_THEMES[visualThemeId];

  const myCloudEntries = currentUser
    ? leaderboard.filter(
        (entry) =>
          entry.uid === currentUser.uid ||
          (playerProfile &&
            entry.playerName.trim().toLowerCase() ===
              playerProfile.displayName.trim().toLowerCase())
      )
    : [];

  const handleSaveCallsign = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = callsignInput.trim().slice(0, 40);
    if (!cleaned || savingName) return;
    setSavingName(true);
    setSavedNotice(false);
    try {
      await onUpdateDisplayName(cleaned);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    } finally {
      setSavingName(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="player-auth-modal-title"
    >
      <div
        className={`relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border ${theme.borderSubtle} ${theme.bgSurface} ${theme.textPrimary} shadow-2xl overflow-hidden`}
      >
        {/* Top-Right Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} hover:opacity-80 transition-opacity cursor-pointer z-10`}
          aria-label="Close account modal"
          title="Close account modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div
          className={`px-6 pr-16 py-4 border-b ${theme.borderSubtle} flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-emerald-500" />
            <div>
              <h2
                id="player-auth-modal-title"
                className="text-xl font-bold font-display"
              >
                {currentUser
                  ? 'Cruciverbalist Cloud Account'
                  : 'Register & Sign In'}
              </h2>
              <p className={`text-xs ${theme.textSecondary}`}>
                Permanently track your fixed scores, easiest clue bases, and
                global leaderboard standings across 20×20 and 8×8 daily puzzles.
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {authError && (
            <div className="p-3 rounded-xl border border-red-500/40 bg-red-500/10 text-xs text-red-400">
              {authError}
            </div>
          )}

          {!currentUser ? (
            <div className="space-y-5">
              <div
                className={`p-5 rounded-xl border ${theme.borderSubtle} ${theme.bgElevated} space-y-3`}
              >
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Cloud className="w-4 h-4 text-emerald-500" />
                  <span>Permanent Cloud Scoreboard &amp; Career Profile</span>
                </div>
                <p className={`text-xs ${theme.textSecondary} leading-relaxed`}>
                  Create your permanent Cruciverbalist account or sign in with
                  Google in one click. Once signed in, your fixed daily scores
                  (1,000 Easy · 2,000 Medium · 3,000 Hard) and locked clue bases
                  for both the <strong>20×20 Standard Edition</strong> and the{' '}
                  <strong>8×8 Daily Quick Crossword</strong> are permanently
                  saved to the cloud leaderboard.
                </p>

                <button
                  type="button"
                  disabled={authLoading}
                  onClick={onSignInWithGoogle}
                  className={`w-full py-3 px-5 rounded-xl font-semibold text-sm ${theme.accentBg} ${theme.accentText} flex items-center justify-center gap-2.5 shadow-sm hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-50`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>
                    {authLoading
                      ? 'Connecting Account...'
                      : 'Register / Sign In with Google'}
                  </span>
                </button>
              </div>

              <div
                className={`p-4 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} text-xs ${theme.textSecondary} space-y-1.5`}
              >
                <div className="font-semibold text-emerald-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Fair-Play Scoring</span>
                </div>
                <p>
                  Registered accounts lock in the easiest clue difficulty tier
                  chosen on each puzzle directly in Firestore, ensuring fair
                  permanent rankings across all devices.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Signed-In Profile Banner & Career Stats */}
              <div
                className={`p-4 rounded-xl border ${theme.borderSubtle} ${theme.bgElevated} flex flex-wrap items-center justify-between gap-4`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {playerProfile?.photoURL || currentUser.photoURL ? (
                    <img
                      src={playerProfile?.photoURL || currentUser.photoURL || ''}
                      alt={playerProfile?.displayName || 'Player'}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover border border-emerald-500/40 shrink-0"
                    />
                  ) : (
                    <div
                      className={`w-11 h-11 rounded-full ${theme.accentBg} ${theme.accentText} flex items-center justify-center font-bold text-base shrink-0`}
                    >
                      {(playerProfile?.displayName || 'C')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-base truncate">
                        {playerProfile?.displayName ||
                          currentUser.displayName ||
                          'Cruciverbalist'}
                      </span>
                      <span
                        title="Verified Cloud Account"
                        className="inline-flex shrink-0"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      </span>
                    </div>
                    <div className={`text-xs ${theme.textMuted}`}>
                      Permanent Cloud Sync Active
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onSignOut}
                  className={`px-3 py-1.5 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} text-xs font-medium flex items-center gap-1.5 hover:opacity-85 cursor-pointer`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Career Totals */}
              <div className="grid grid-cols-3 gap-3 font-mono-tabular text-center">
                <div
                  className={`p-3.5 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas}`}
                >
                  <div className={`text-[11px] ${theme.textMuted}`}>
                    CAREER SCORE
                  </div>
                  <div className="text-lg font-bold mt-0.5">
                    {(playerProfile?.totalScore || 0).toLocaleString()}
                  </div>
                </div>
                <div
                  className={`p-3.5 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas}`}
                >
                  <div className={`text-[11px] ${theme.textMuted}`}>
                    PUZZLES SOLVED
                  </div>
                  <div className="text-lg font-bold mt-0.5">
                    {playerProfile?.puzzlesSolved || myCloudEntries.length}
                  </div>
                </div>
                <div
                  className={`p-3.5 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas}`}
                >
                  <div className={`text-[11px] ${theme.textMuted}`}>
                    CLOUD RECORDS
                  </div>
                  <div className="text-lg font-bold mt-0.5">
                    {myCloudEntries.length}
                  </div>
                </div>
              </div>

              {/* Customize Leaderboard Callsign */}
              <form
                onSubmit={handleSaveCallsign}
                className={`p-4 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} space-y-2.5`}
              >
                <label className="block text-xs font-semibold">
                  Leaderboard Callsign / Display Handle (1–40 chars)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    minLength={1}
                    maxLength={40}
                    value={callsignInput}
                    onChange={(e) => setCallsignInput(e.target.value)}
                    placeholder="Your public leaderboard handle..."
                    className={`flex-1 px-3 py-2 rounded-lg border ${theme.borderSubtle} ${theme.bgSurface} text-xs focus:outline-none`}
                  />
                  <button
                    type="submit"
                    disabled={savingName || !callsignInput.trim()}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold ${theme.accentBg} ${theme.accentText} flex items-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0`}
                  >
                    {savedNotice ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <span>Update Handle</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Player's Permanent Cloud Score History */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>Your Recorded Cloud Scores</span>
                  </h3>
                  <span className={`text-xs ${theme.textMuted} font-mono-tabular`}>
                    {myCloudEntries.length} Entries
                  </span>
                </div>

                {myCloudEntries.length === 0 ? (
                  <div
                    className={`p-4 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} text-xs ${theme.textMuted} text-center`}
                  >
                    Complete any 20×20 Standard or 8×8 Quick Crossword to
                    permanently record your first cloud score!
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {myCloudEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className={`p-2.5 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} flex items-center justify-between gap-2 text-xs font-mono-tabular`}
                      >
                        <div className="min-w-0">
                          <div className="font-sans font-semibold truncate">
                            {entry.puzzleTitle}
                          </div>
                          <div className={`text-[11px] ${theme.textMuted}`}>
                            {entry.gridSize}×{entry.gridSize} Grid ·{' '}
                            {entry.easiestDifficultyUsed.toUpperCase()} Base ·{' '}
                            {formatDuration(entry.timeSeconds)}
                          </div>
                        </div>
                        <div className="font-bold text-sm shrink-0">
                          {entry.score.toLocaleString()} pts
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
