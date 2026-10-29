import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  LeaderboardEntry,
  PlayerProfile,
  VisualThemeId,
} from '../types/crossword';
import { VISUAL_THEMES } from '../data/themes';
import { formatDuration } from '../utils/leaderboard';
import { FormattedAuthError } from '../firebase';
import {
  UserCheck,
  LogIn,
  LogOut,
  ShieldCheck,
  Trophy,
  X,
  Check,
  Cloud,
  Mail,
  Lock,
  UserPlus,
  Copy,
  AlertTriangle,
  KeyRound,
} from 'lucide-react';

interface PlayerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  visualThemeId: VisualThemeId;
  currentUser: User | null;
  playerProfile: PlayerProfile | null;
  authLoading: boolean;
  authError: string | null;
  authErrorDetails?: FormattedAuthError | null;
  onSignInWithGoogle: () => Promise<void>;
  onRegisterWithEmail: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  onSignInWithEmail: (email: string, password: string) => Promise<void>;
  onResetPassword?: (email: string) => Promise<void>;
  onActivateDeviceAccount?: (email: string, displayName: string) => void;
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
  authErrorDetails,
  onSignInWithGoogle,
  onRegisterWithEmail,
  onSignInWithEmail,
  onResetPassword,
  onActivateDeviceAccount,
  onSignOut,
  onUpdateDisplayName,
  leaderboard,
}) => {
  const [authMode, setAuthMode] = useState<'register' | 'signin'>('register');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [registerHandleInput, setRegisterHandleInput] = useState<string>('');
  const [callsignInput, setCallsignInput] = useState<string>('');
  const [savingName, setSavingName] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [copiedDomain, setCopiedDomain] = useState<boolean>(false);
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false);
  const [localFormError, setLocalFormError] = useState<string | null>(null);

  useEffect(() => {
    if (playerProfile?.displayName) {
      setCallsignInput(playerProfile.displayName);
    } else if (currentUser?.displayName) {
      setCallsignInput(currentUser.displayName);
    }
  }, [playerProfile, currentUser]);

  if (!isOpen) return null;

  const theme = VISUAL_THEMES[visualThemeId];
  const isSignedIn = Boolean(currentUser || playerProfile);
  const currentHostname =
    typeof window !== 'undefined' && window.location?.hostname
      ? window.location.hostname
      : 'your-domain.com';

  const myCloudEntries = isSignedIn
    ? leaderboard.filter(
        (entry) =>
          (currentUser && entry.uid === currentUser.uid) ||
          (playerProfile &&
            (entry.uid === playerProfile.uid ||
              entry.playerName.trim().toLowerCase() ===
                playerProfile.displayName.trim().toLowerCase()))
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

  const handleEmailFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalFormError(null);
    setResetEmailSent(false);

    const trimmedEmail = emailInput.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setLocalFormError('Please enter a valid email address.');
      return;
    }
    if (passwordInput.length < 6) {
      setLocalFormError('Password must be at least 6 characters.');
      return;
    }

    if (authMode === 'register') {
      const handleToUse =
        registerHandleInput.trim() ||
        trimmedEmail.split('@')[0] ||
        'Cruciverbalist';
      await onRegisterWithEmail(trimmedEmail, passwordInput, handleToUse);
    } else {
      await onSignInWithEmail(trimmedEmail, passwordInput);
    }
  };

  const handlePasswordResetClick = async () => {
    setLocalFormError(null);
    setResetEmailSent(false);
    const trimmedEmail = emailInput.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setLocalFormError(
        'Enter your email address above first, then click Reset Password.'
      );
      return;
    }
    if (onResetPassword) {
      await onResetPassword(trimmedEmail);
      setResetEmailSent(true);
    }
  };

  const handleCopyHostname = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentHostname).catch(() => {});
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75"
      role="dialog"
      aria-modal="true"
      aria-labelledby="player-auth-modal-title"
    >
      <div
        className={`relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl border ${theme.borderSubtle} ${theme.bgSurface} ${theme.textPrimary} shadow-2xl overflow-hidden`}
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
          className={`px-5 sm:px-6 pr-16 py-4 border-b ${theme.borderSubtle} flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <h2
                id="player-auth-modal-title"
                className="text-lg sm:text-xl font-bold font-display"
              >
                {isSignedIn
                  ? 'Cruciverbalist Player Account'
                  : 'Register & Sign In'}
              </h2>
              <p className={`text-xs ${theme.textSecondary}`}>
                Register or sign in with Email or Google to track your scores,
                easiest clue bases, and leaderboard standings.
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {(authError || localFormError) && (
            <div className="p-3.5 rounded-xl border border-red-500/40 bg-red-500/10 text-xs text-red-300 space-y-2.5">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  {localFormError || authError}
                </div>
              </div>

              {/* Actionable Fix Panel when custom domain or provider is not yet enabled in Firebase Console */}
              {(authErrorDetails?.isUnauthorizedDomain ||
                authErrorDetails?.isProviderDisabled) && (
                <div
                  className={`p-3 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} ${theme.textPrimary} space-y-2`}
                >
                  <div className="font-semibold text-amber-400 text-xs">
                    Quick Setup for Custom Domain ({currentHostname}):
                  </div>
                  <ol
                    className={`list-decimal list-inside space-y-1 text-[11px] ${theme.textSecondary}`}
                  >
                    {authErrorDetails?.isUnauthorizedDomain && (
                      <li>
                        In Firebase Console (
                        <span className="font-mono-tabular">
                          {authErrorDetails.projectId}
                        </span>
                        ), open{' '}
                        <strong>
                          Authentication → Settings → Authorized domains
                        </strong>{' '}
                        and add{' '}
                        <code className="px-1 py-0.5 rounded bg-black/30 font-mono-tabular text-amber-300">
                          {currentHostname}
                        </code>
                        .
                      </li>
                    )}
                    <li>
                      To use Email &amp; Password cloud login, open{' '}
                      <strong>
                        Authentication → Sign-in method → Email/Password
                      </strong>{' '}
                      in Firebase Console and toggle <strong>Enable</strong>.
                    </li>
                  </ol>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCopyHostname}
                      className={`px-2.5 py-1.5 rounded-lg border ${theme.borderSubtle} ${theme.bgElevated} text-[11px] font-mono-tabular font-semibold flex items-center gap-1.5 cursor-pointer hover:opacity-90`}
                    >
                      <Copy className="w-3 h-3" />
                      <span>
                        {copiedDomain
                          ? 'Copied Domain!'
                          : `Copy "${currentHostname}"`}
                      </span>
                    </button>

                    {onActivateDeviceAccount && (
                      <button
                        type="button"
                        onClick={() => {
                          const fallbackName =
                            registerHandleInput.trim() ||
                            emailInput.trim().split('@')[0] ||
                            'Cruciverbalist';
                          onActivateDeviceAccount(
                            emailInput.trim() || 'player@local',
                            fallbackName
                          );
                        }}
                        className={`px-3 py-1.5 rounded-lg ${theme.accentBg} ${theme.accentText} text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer hover:opacity-95`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Continue Now with Instant Profile</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {resetEmailSent && (
            <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Password reset instructions have been sent to{' '}
                <strong>{emailInput.trim()}</strong>.
              </span>
            </div>
          )}

          {!isSignedIn ? (
            <div className="space-y-5">
              {/* Option 1: Register or Sign In with Email & Password */}
              <div
                className={`p-4 sm:p-5 rounded-xl border ${theme.borderSubtle} ${theme.bgElevated} space-y-4`}
              >
                {/* Mode Tabs: Register with Email vs Sign In with Email */}
                <div
                  className={`grid grid-cols-2 p-1 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas}`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setLocalFormError(null);
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      authMode === 'register'
                        ? `${theme.accentBg} ${theme.accentText}`
                        : `${theme.textSecondary}`
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register with Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setLocalFormError(null);
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      authMode === 'signin'
                        ? `${theme.accentBg} ${theme.accentText}`
                        : `${theme.textSecondary}`
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Sign In with Email</span>
                  </button>
                </div>

                <form onSubmit={handleEmailFormSubmit} className="space-y-3">
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Public Leaderboard Callsign / Name
                      </label>
                      <input
                        type="text"
                        maxLength={40}
                        value={registerHandleInput}
                        onChange={(e) => setRegisterHandleInput(e.target.value)}
                        placeholder="e.g., CruciverbalistPro"
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} text-xs sm:text-sm focus:outline-none`}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${theme.textMuted}`}
                      />
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="you@example.com"
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} text-xs sm:text-sm focus:outline-none`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold">
                        Password
                      </label>
                      {authMode === 'signin' && onResetPassword && (
                        <button
                          type="button"
                          onClick={handlePasswordResetClick}
                          className={`text-[11px] ${theme.textSecondary} hover:underline flex items-center gap-1 cursor-pointer`}
                        >
                          <KeyRound className="w-3 h-3" />
                          <span>Reset password</span>
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock
                        className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${theme.textMuted}`}
                      />
                      <input
                        type="password"
                        required
                        minLength={6}
                        autoComplete={
                          authMode === 'register'
                            ? 'new-password'
                            : 'current-password'
                        }
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="At least 6 characters..."
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} text-xs sm:text-sm focus:outline-none`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className={`w-full py-2.5 px-5 rounded-xl font-semibold text-xs sm:text-sm ${theme.accentBg} ${theme.accentText} flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-50`}
                  >
                    {authMode === 'register' ? (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>
                          {authLoading
                            ? 'Creating Account...'
                            : 'Create Account with Email'}
                        </span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>
                          {authLoading
                            ? 'Signing In...'
                            : 'Sign In with Email'}
                        </span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className={`w-full border-t ${theme.borderSubtle}`} />
                <span
                  className={`px-3 text-[11px] uppercase tracking-wider font-mono-tabular ${theme.bgSurface} ${theme.textMuted}`}
                >
                  OR
                </span>
                <div className={`w-full border-t ${theme.borderSubtle}`} />
              </div>

              {/* Option 2: Register / Sign In with Google */}
              <div
                className={`p-4 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} space-y-3`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Cloud className="w-4 h-4 text-emerald-500" />
                    <span>One-Click Google Account</span>
                  </div>
                  <span className={`text-[11px] ${theme.textMuted}`}>
                    Instant OAuth Sync
                  </span>
                </div>

                <button
                  type="button"
                  disabled={authLoading}
                  onClick={onSignInWithGoogle}
                  className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm border ${theme.borderSubtle} ${theme.bgElevated} ${theme.textPrimary} flex items-center justify-center gap-2.5 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50`}
                >
                  <LogIn className="w-4 h-4 text-amber-400" />
                  <span>
                    {authLoading
                      ? 'Connecting Google...'
                      : 'Continue with Google'}
                  </span>
                </button>
              </div>

              <div
                className={`p-3.5 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} text-xs ${theme.textSecondary} space-y-1`}
              >
                <div className="font-semibold text-emerald-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Fair-Play Scoring</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Registered accounts lock in the easiest clue difficulty tier
                  chosen on each puzzle (1,000 Easy · 2,000 Medium · 3,000 Hard)
                  minus 25 points per 60 seconds taken.
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
                  {playerProfile?.photoURL || currentUser?.photoURL ? (
                    <img
                      src={
                        playerProfile?.photoURL || currentUser?.photoURL || ''
                      }
                      alt={playerProfile?.displayName || 'Player'}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover border border-emerald-500/40 shrink-0"
                    />
                  ) : (
                    <div
                      className={`w-11 h-11 rounded-full ${theme.accentBg} ${theme.accentText} flex items-center justify-center font-bold text-base shrink-0`}
                    >
                      {(
                        playerProfile?.displayName ||
                        currentUser?.displayName ||
                        'C'
                      )[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-base truncate">
                        {playerProfile?.displayName ||
                          currentUser?.displayName ||
                          'Cruciverbalist'}
                      </span>
                      <span
                        title={
                          currentUser
                            ? 'Verified Cloud Account'
                            : 'Verified Device Account'
                        }
                        className="inline-flex shrink-0"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      </span>
                    </div>
                    <div className={`text-xs ${theme.textMuted} truncate`}>
                      {currentUser?.email
                        ? `${currentUser.email} · Cloud Sync Active`
                        : 'Profile Active · Scoreboard Sync Enabled'}
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
                    RECORDED SCORES
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

              {/* Player's Recorded Score History */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>Your Recorded Scores</span>
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
                    permanently record your first score!
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
