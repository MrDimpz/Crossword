import React, { useState, useEffect } from 'react';
import {
  GridSizeOption,
  PuzzleDefinition,
  VisualTheme,
  VisualThemeId,
} from '../types/crossword';
import { VISUAL_THEMES } from '../data/themes';
import { createCustomThemePuzzle } from '../data/puzzles';
import { X, Lock, Key, Trash2, Plus, Sparkles, ShieldAlert, CheckCircle2, Database, Compass, RefreshCw } from 'lucide-react';
import { soundFX } from '../utils/sound';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  visualThemeId: VisualThemeId;
  puzzles: PuzzleDefinition[];
  onAddPuzzle: (puzzle: PuzzleDefinition, theme: VisualThemeId) => void;
  onResetLeaderboard: () => void;
  onDeletePuzzle: (puzzleId: string) => void;
}

interface CustomWordDraft {
  answer: string;
  standardClue: string;
  crypticClue: string;
}

const ADMIN_PASS_KEY = 'cruciverbalist_admin_password_v1';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  visualThemeId,
  puzzles,
  onAddPuzzle,
  onResetLeaderboard,
  onDeletePuzzle,
}) => {
  const theme: VisualTheme = VISUAL_THEMES[visualThemeId];
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'setup' | 'dashboard'>('login');
  const [enteredPassword, setEnteredPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Custom Studio state inside admin
  const [customTitle, setCustomTitle] = useState<string>('Custom Admin Thematic Puzzle');
  const [selectedPalette, setSelectedPalette] = useState<VisualThemeId>('observatory');
  const [selectedGridSize, setSelectedGridSize] = useState<GridSizeOption>(20);
  const [customEntries, setCustomEntries] = useState<CustomWordDraft[]>([
    { answer: 'CRUCIVERBALIST', standardClue: 'A writer of crossword puzzles or crossword enthusiast', crypticClue: 'Crossword lover cruci verbalist (14)' },
    { answer: 'ENIGMA', standardClue: 'A person or thing that is mysterious or difficult to understand', crypticClue: 'Puzzling game maiden rearrangement (6)' },
    { answer: 'SYMMETRY', standardClue: 'Quality of being made up of exactly similar parts facing each other', crypticClue: 'Balanced symmetry my try rearrangement (8)' },
    { answer: 'LEXICON', standardClue: 'The vocabulary of a person, language, or branch of knowledge', crypticClue: 'Dictionary nice ox let mix (7)' },
  ]);

  const [activeTab, setActiveTab] = useState<'custom' | 'catalog' | 'leaderboard' | 'security' | 'logo'>('custom');
  const [customLogoInput, setCustomLogoInput] = useState<string>(() => {
    try {
      return localStorage.getItem('cruciverbalist_victory_logo_url') || '';
    } catch {
      return '';
    }
  });

  const handleSaveCustomLogo = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('cruciverbalist_victory_logo_url', customLogoInput.trim());
      soundFX.playVictory();
      setSuccessMsg('Custom animated GIF / logo successfully updated!');
      window.dispatchEvent(new Event('storage'));
    } catch {
      setErrorMsg('Failed to save custom logo.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const res = uploadEvent.target?.result as string;
      if (res) {
        setCustomLogoInput(res);
        try {
          localStorage.setItem('cruciverbalist_victory_logo_url', res);
          soundFX.playVictory();
          setSuccessMsg('Animated GIF uploaded and applied successfully!');
          window.dispatchEvent(new Event('storage'));
        } catch {
          setErrorMsg('Failed to store uploaded GIF.');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setSuccessMsg(null);
      setEnteredPassword('');
      const stored = localStorage.getItem(ADMIN_PASS_KEY);
      if (!stored) {
        setAuthMode('setup');
      } else {
        setAuthMode('login');
        setIsAdminLoggedIn(false);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSetupPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      setErrorMsg('Admin password must be at least 4 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    try {
      localStorage.setItem(ADMIN_PASS_KEY, newPassword);
      setIsAdminLoggedIn(true);
      setAuthMode('dashboard');
      soundFX.playVictory();
      setSuccessMsg('Admin credentials successfully created and logged in!');
    } catch {
      setErrorMsg('Failed to save admin password.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem(ADMIN_PASS_KEY) || 'admin123';
    if (enteredPassword === stored) {
      setIsAdminLoggedIn(true);
      setAuthMode('dashboard');
      soundFX.playClick();
      setSuccessMsg('Admin login successful.');
    } else {
      soundFX.playError();
      setErrorMsg('Incorrect admin password. (Default is admin123 if never set)');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      setErrorMsg('New password must be at least 4 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    try {
      localStorage.setItem(ADMIN_PASS_KEY, newPassword);
      soundFX.playVictory();
      setSuccessMsg('Admin password successfully updated!');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setErrorMsg('Failed to update password.');
    }
  };

  const handleCreateCustomPuzzle = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = customEntries.filter((x) => x.answer.replace(/[^a-zA-Z]/g, '').length >= 3);
    if (valid.length < 3) {
      setErrorMsg('Please provide at least 3 valid words (3+ letters each) for puzzle generation.');
      return;
    }
    try {
      const compiled = createCustomThemePuzzle(
        customTitle.trim() || 'Admin Custom Puzzle',
        valid,
        selectedPalette,
        selectedGridSize
      );
      onAddPuzzle(compiled, selectedPalette);
      soundFX.playVictory();
      setSuccessMsg(`Successfully compiled and added "${compiled.title}" to puzzle catalog!`);
      setActiveTab('catalog');
    } catch (err) {
      soundFX.playError();
      setErrorMsg('Failed to compile crossword layout. Ensure words intersect correctly.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-panel-title"
    >
      <div
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border ${theme.borderSubtle} ${theme.bgSurface} ${theme.textPrimary} shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b ${theme.borderSubtle} flex items-center justify-between bg-black/10`}
        >
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-amber-500" />
            <div>
              <h2 id="admin-panel-title" className="text-lg font-bold font-display">
                Cruciverbalist Admin Console &amp; Settings
              </h2>
              <p className={`text-xs ${theme.textMuted}`}>
                Restricted backend management for puzzle catalog, leaderboard resets, and custom studio.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} hover:opacity-80 cursor-pointer`}
            aria-label="Close admin panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {!isAdminLoggedIn && authMode === 'setup' && (
            <div className="max-w-md mx-auto py-8 space-y-5 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
                <Key className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Set Admin Credentials</h3>
                <p className={`text-xs ${theme.textMuted}`}>
                  No admin password is configured yet. Please set your secure admin PIN or password below.
                </p>
              </div>
              <form onSubmit={handleSetupPassword} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold mb-1">New Admin Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 4 characters..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} text-sm focus:outline-none`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} text-sm focus:outline-none`}
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl font-bold text-xs ${theme.accentBg} ${theme.accentText} cursor-pointer`}
                >
                  Save Password &amp; Enter Console
                </button>
              </form>
            </div>
          )}

          {!isAdminLoggedIn && authMode === 'login' && (
            <div className="max-w-md mx-auto py-8 space-y-5 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Admin Authentication Required</h3>
                <p className={`text-xs ${theme.textMuted}`}>
                  Enter your admin password to access the backend control panel. (Default: <code className="font-mono text-amber-400">admin123</code>)
                </p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold mb-1">Admin Password</label>
                  <input
                    type="password"
                    required
                    value={enteredPassword}
                    onChange={(e) => setEnteredPassword(e.target.value)}
                    placeholder="Enter admin password..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} text-sm focus:outline-none`}
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl font-bold text-xs ${theme.accentBg} ${theme.accentText} cursor-pointer`}
                >
                  Authenticate &amp; Open Admin Console
                </button>
              </form>
            </div>
          )}

          {isAdminLoggedIn && (
            <div className="space-y-6">
              {/* Admin Navigation Tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b pb-4 border-slate-500/20">
                <button
                  type="button"
                  onClick={() => setActiveTab('custom')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'custom'
                      ? `${theme.accentBg} ${theme.accentText}`
                      : `${theme.bgElevated} border ${theme.borderSubtle}`
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Custom Crossword Studio</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'catalog'
                      ? `${theme.accentBg} ${theme.accentText}`
                      : `${theme.bgElevated} border ${theme.borderSubtle}`
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Puzzle Catalog ({puzzles.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('leaderboard')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'leaderboard'
                      ? `${theme.accentBg} ${theme.accentText}`
                      : `${theme.bgElevated} border ${theme.borderSubtle}`
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Leaderboard Management</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('security')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'security'
                      ? `${theme.accentBg} ${theme.accentText}`
                      : `${theme.bgElevated} border ${theme.borderSubtle}`
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Admin Credentials</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('logo')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'logo'
                      ? `${theme.accentBg} ${theme.accentText}`
                      : `${theme.bgElevated} border ${theme.borderSubtle}`
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Custom Animated GIF</span>
                </button>
              </div>

              {/* Tab 1: Custom Crossword Studio */}
              {activeTab === 'custom' && (
                <form onSubmit={handleCreateCustomPuzzle} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Puzzle / Theme Title</label>
                      <input
                        type="text"
                        required
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} text-xs focus:outline-none`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Grid Size</label>
                      <select
                        value={selectedGridSize}
                        onChange={(e) => setSelectedGridSize(Number(e.target.value) as GridSizeOption)}
                        className={`w-full px-3 py-2 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} text-xs focus:outline-none`}
                      >
                        <option value={20}>20×20 Standard Grid</option>
                        <option value={8}>8×8 Quick Sprint Grid</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Visual Palette</label>
                      <select
                        value={selectedPalette}
                        onChange={(e) => setSelectedPalette(e.target.value as VisualThemeId)}
                        className={`w-full px-3 py-2 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} text-xs focus:outline-none`}
                      >
                        <option value="observatory">Observatory (Deep navy &amp; gold)</option>
                        <option value="editorial">Editorial (Parchment &amp; ink)</option>
                        <option value="botanical">Botanical (Sage green &amp; ivory)</option>
                        <option value="mahogany">Mahogany (Deep espresso &amp; brass)</option>
                        <option value="missing-piece">The Missing Piece (Royal purple &amp; gold)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider">Words &amp; Clues Builder</span>
                      <button
                        type="button"
                        onClick={() => setCustomEntries((prev) => [...prev, { answer: '', standardClue: '', crypticClue: '' }])}
                        className={`px-3 py-1.5 rounded-lg border ${theme.borderSubtle} ${theme.bgElevated} text-xs font-semibold flex items-center gap-1 cursor-pointer`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Word Row</span>
                      </button>
                    </div>

                    <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                      {customEntries.map((row, idx) => (
                        <div key={idx} className={`p-3 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} flex flex-col gap-2`}>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              required
                              maxLength={20}
                              value={row.answer}
                              onChange={(e) => {
                                const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                                setCustomEntries((curr) => curr.map((c, i) => i === idx ? { ...c, answer: val } : c));
                              }}
                              placeholder="ANSWER (3-15 letters)"
                              className={`w-40 px-2.5 py-1.5 rounded-lg border ${theme.borderSubtle} ${theme.bgSurface} font-mono text-xs uppercase font-bold focus:outline-none`}
                            />
                            <input
                              type="text"
                              required
                              value={row.standardClue}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCustomEntries((curr) => curr.map((c, i) => i === idx ? { ...c, standardClue: val } : c));
                              }}
                              placeholder="Standard / easy / medium clue..."
                              className={`flex-1 px-2.5 py-1.5 rounded-lg border ${theme.borderSubtle} ${theme.bgSurface} text-xs focus:outline-none`}
                            />
                            {customEntries.length > 3 && (
                              <button
                                type="button"
                                onClick={() => setCustomEntries((curr) => curr.filter((_, i) => i !== idx))}
                                className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer"
                                title="Remove row"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={row.crypticClue}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCustomEntries((curr) => curr.map((c, i) => i === idx ? { ...c, crypticClue: val } : c));
                            }}
                            placeholder="Cryptic or hard clue (optional)..."
                            className={`w-full px-2.5 py-1.5 rounded-lg border ${theme.borderSubtle} ${theme.bgSurface} text-xs italic focus:outline-none`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 rounded-xl font-bold text-xs ${theme.accentBg} ${theme.accentText} cursor-pointer flex items-center justify-center gap-2`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Compile &amp; Add Custom Puzzle to Active Catalog</span>
                  </button>
                </form>
              )}

              {/* Tab 2: Puzzle Catalog Management */}
              {activeTab === 'catalog' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider">Active Puzzles in Catalog ({puzzles.length})</span>
                  </div>
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {puzzles.map((p) => (
                      <div key={p.id} className={`p-3.5 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} flex items-center justify-between gap-3`}>
                        <div>
                          <div className="text-sm font-bold">{p.title}</div>
                          <div className={`text-xs ${theme.textMuted} mt-0.5`}>
                            {p.themeName} · {p.gridSize}×{p.gridSize} Grid · {p.archiveDate || 'Custom'} · {p.totalWhiteCells} Words
                          </div>
                        </div>
                        {p.id.startsWith('custom-') && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete custom puzzle "${p.title}"?`)) {
                                onDeletePuzzle(p.id);
                                soundFX.playClick();
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Leaderboard Management */}
              {activeTab === 'leaderboard' && (
                <div className="max-w-md mx-auto py-8 text-center space-y-5">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">Reset Scoreboard &amp; Leaderboard</h3>
                    <p className={`text-xs ${theme.textMuted}`}>
                      Clear all local leaderboard scores and reset to default seed rankings.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to reset the leaderboard entries?')) {
                        onResetLeaderboard();
                        soundFX.playVictory();
                        setSuccessMsg('Leaderboard successfully reset to default records.');
                      }
                    }}
                    className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs cursor-pointer shadow-md"
                  >
                    Reset Leaderboard Now
                  </button>
                </div>
              )}

              {/* Tab 4: Security Settings */}
              {activeTab === 'security' && (
                <form onSubmit={handleChangePassword} className="max-w-md mx-auto py-4 space-y-4 text-left">
                  <h3 className="text-sm font-bold mb-2">Change Admin Password</h3>
                  <div>
                    <label className="block text-xs font-semibold mb-1">New Admin Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 4 characters..."
                      className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} text-sm focus:outline-none`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password..."
                      className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} text-sm focus:outline-none`}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full py-3 rounded-xl font-bold text-xs ${theme.accentBg} ${theme.accentText} cursor-pointer`}
                  >
                    Update Admin Password
                  </button>
                </form>
              )}

              {/* Tab 5: Custom Animated GIF / Logo */}
              {activeTab === 'logo' && (
                <div className="max-w-md mx-auto py-4 space-y-5 text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold">Custom Animated GIF or Logo</h3>
                    <p className={`text-xs ${theme.textMuted}`}>
                      Upload any animated GIF file or paste an image/GIF URL to use as the spinning 3D logo in the puzzle completed popup.
                    </p>
                  </div>
                  <form onSubmit={handleSaveCustomLogo} className="space-y-4 text-left">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Upload GIF / Image File</label>
                      <input
                        type="file"
                        accept="image/*,.gif"
                        onChange={handleFileUpload}
                        className={`w-full px-3 py-2 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} text-xs file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500/20 file:text-amber-400 hover:file:bg-amber-500/30 cursor-pointer`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Or Paste Image / GIF URL</label>
                      <input
                        type="url"
                        value={customLogoInput}
                        onChange={(e) => setCustomLogoInput(e.target.value)}
                        placeholder="https://example.com/animation.gif"
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} text-xs focus:outline-none`}
                      />
                    </div>
                    {customLogoInput && (
                      <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 animate-spin-3d">
                          <img src={customLogoInput} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-semibold text-amber-400">Preview (Spinning 3D)</span>
                      </div>
                    )}
                    <button
                      type="submit"
                      className={`w-full py-3 rounded-xl font-bold text-xs ${theme.accentBg} ${theme.accentText} cursor-pointer`}
                    >
                      Save &amp; Apply Custom Animated GIF
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
