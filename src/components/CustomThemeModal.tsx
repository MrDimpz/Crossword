import React, { useState } from 'react';
import {
  GridSizeOption,
  PuzzleDefinition,
  VisualTheme,
  VisualThemeId,
} from '../types/crossword';
import { VISUAL_THEMES } from '../data/themes';
import { createCustomThemePuzzle } from '../data/puzzles';
import { X, Plus, Trash2, Compass } from 'lucide-react';

interface CustomThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  visualThemeId: VisualThemeId;
  onCreatePuzzle: (puzzle: PuzzleDefinition, chosenVisualTheme: VisualThemeId) => void;
}

interface CustomWordDraft {
  answer: string;
  standardClue: string;
  crypticClue: string;
}

const PRESET_TEMPLATES: Record<
  string,
  {
    title: string;
    visual: VisualThemeId;
    words: CustomWordDraft[];
  }
> = {
  mythic: {
    title: 'Mythic Architecture & Wonders',
    visual: 'mahogany',
    words: [
      {
        answer: 'LABYRINTH',
        standardClue: 'Intricate combination of paths in which it is difficult to find the exit',
        crypticClue: 'Minotaur’s maze built by tiny halberd without ed (9)',
      },
      {
        answer: 'OBELISK',
        standardClue: 'Tall, four-sided, narrow tapering monument ending in a pyramid-like shape',
        crypticClue: 'Stone pillar likes bo rearrangement (7)',
      },
      {
        answer: 'CITADEL',
        standardClue: 'Core fortified area of a town or city',
        crypticClue: 'Fortress dialect rewritten (7)',
      },
      {
        answer: 'ACROPOLIS',
        standardClue: 'Ancient Greek citadel located on a rocky outcrop above a city',
        crypticClue: 'High fortress oil crops a mix (9)',
      },
      {
        answer: 'PANTHEON',
        standardClue: 'Temple dedicated to all the gods of a polytheistic religion',
        crypticClue: 'Temple of gods on the pan cooked (8)',
      },
      {
        answer: 'COLONNADE',
        standardClue: 'Long sequence of columns joined by their entablature',
        crypticClue: 'Row of pillars can noodle around (9)',
      },
    ],
  },
  gastronomy: {
    title: 'Artisanal Gastronomy',
    visual: 'editorial',
    words: [
      {
        answer: 'SAFFRON',
        standardClue: 'Crimson stigma threads of Crocus sativus prized as a golden spice',
        crypticClue: 'Precious spice raffs on backwards (7)',
      },
      {
        answer: 'TRUFFLE',
        standardClue: 'Subterranean ascomycete fungus prized in haute cuisine',
        crypticClue: 'Subterranean delicacy flutter around f (7)',
      },
      {
        answer: 'CARDAMOM',
        standardClue: 'Aromatic seed pod used in both sweet and savory spice blends',
        crypticClue: 'Aromatic pod drama com staged (8)',
      },
      {
        answer: 'ESPRESSO',
        standardClue: 'Concentrated coffee brewed by forcing hot water through finely ground beans',
        crypticClue: 'Strong roast prose ses mixed (8)',
      },
      {
        answer: 'TARRAGON',
        standardClue: 'Perennial aromatic herb in the sunflower family used in French sauces',
        crypticClue: 'French herb arrogant rearranged! (8)',
      },
      {
        answer: 'COMPOTE',
        standardClue: 'Dessert originating from medieval Europe made of whole or pieces of fruit in sugar syrup',
        crypticClue: 'Stewed fruit met poco rearrangement (7)',
      },
    ],
  },
};

export const CustomThemeModal: React.FC<CustomThemeModalProps> = ({
  isOpen,
  onClose,
  visualThemeId,
  onCreatePuzzle,
}) => {
  const theme: VisualTheme = VISUAL_THEMES[visualThemeId];
  const [customTitle, setCustomTitle] = useState(PRESET_TEMPLATES.mythic.title);
  const [selectedPalette, setSelectedPalette] = useState<VisualThemeId>(
    PRESET_TEMPLATES.mythic.visual
  );
  const [selectedGridSize, setSelectedGridSize] = useState<GridSizeOption>(20);
  const [entries, setEntries] = useState<CustomWordDraft[]>(
    PRESET_TEMPLATES.mythic.words
  );

  if (!isOpen) return null;

  const handleLoadPreset = (key: 'mythic' | 'gastronomy') => {
    const preset = PRESET_TEMPLATES[key];
    setCustomTitle(preset.title);
    setSelectedPalette(preset.visual);
    setEntries(preset.words.map((w) => ({ ...w })));
  };

  const handleAddRow = () => {
    setEntries((prev) => [
      ...prev,
      { answer: '', standardClue: '', crypticClue: '' },
    ]);
  };

  const handleRemoveRow = (idx: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateRow = (
    idx: number,
    field: keyof CustomWordDraft,
    value: string
  ) => {
    setEntries((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validEntries = entries.filter(
      (x) => x.answer.replace(/[^a-zA-Z]/g, '').length >= 3
    );
    const compiled = createCustomThemePuzzle(
      customTitle.trim() || 'Custom Thematic Puzzle',
      validEntries,
      selectedPalette,
      selectedGridSize
    );
    onCreatePuzzle(compiled, selectedPalette);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65"
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-theme-modal-title"
    >
      <div
        className={`w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border ${theme.borderSubtle} ${theme.bgSurface} ${theme.textPrimary} shadow-xl overflow-hidden`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b ${theme.borderSubtle} flex items-center justify-between`}
        >
          <div>
            <h2
              id="custom-theme-modal-title"
              className="text-xl font-bold font-display"
            >
              Custom 20×20 &amp; 8×8 Theme Studio
            </h2>
            <p className={`text-xs ${theme.textMuted} mt-0.5`}>
              Define your custom theme words and standard/cryptic clues. Our
              compiler interlocks them across a 20×20 Standard or 8×8 Quick grid.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-lg border ${theme.borderSubtle} hover:opacity-80 cursor-pointer`}
            aria-label="Close custom theme studio"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-5 clue-scroll"
        >
          {/* Quick Presets */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`text-xs font-medium ${theme.textSecondary}`}>
              Starter Theme Templates:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleLoadPreset('mythic')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${theme.borderSubtle} ${theme.bgElevated} hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0`}
              >
                Load Mythic Architecture
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('gastronomy')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${theme.borderSubtle} ${theme.bgElevated} hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0`}
              >
                Load Artisanal Gastronomy
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Custom Edition Title
              </label>
              <input
                type="text"
                required
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g., Ancient Wonders & Myth"
                className={`w-full px-3.5 py-2 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} ${theme.textPrimary} text-sm focus:outline-none`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Grid Dimensions
              </label>
              <select
                value={selectedGridSize}
                onChange={(e) =>
                  setSelectedGridSize(Number(e.target.value) as GridSizeOption)
                }
                className={`w-full px-3.5 py-2 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} ${theme.textPrimary} text-sm focus:outline-none`}
              >
                <option value={20}>20×20 Standard Edition</option>
                <option value={8}>8×8 Quick Crossword</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Preferred Board Palette
              </label>
              <select
                value={selectedPalette}
                onChange={(e) =>
                  setSelectedPalette(e.target.value as VisualThemeId)
                }
                className={`w-full px-3.5 py-2 rounded-lg border ${theme.borderSubtle} ${theme.bgCanvas} ${theme.textPrimary} text-sm focus:outline-none`}
              >
                {(Object.keys(VISUAL_THEMES) as VisualThemeId[]).map((k) => (
                  <option key={k} value={k}>
                    {VISUAL_THEMES[k].name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Seed Words Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold">
                Featured Thematic Words (Auto-Interlocked with{' '}
                {selectedGridSize}×{selectedGridSize} Bridge Lexicon)
              </span>
              <button
                type="button"
                onClick={handleAddRow}
                className={`px-3 py-1 text-xs font-medium rounded-lg border ${theme.borderSubtle} ${theme.bgElevated} flex items-center gap-1.5 hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Theme Word</span>
              </button>
            </div>

            <div className="space-y-3">
              {entries.map((entry, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border ${theme.borderSubtle} ${theme.bgCanvas} grid grid-cols-1 sm:grid-cols-12 gap-3 items-start`}
                >
                  <div className="sm:col-span-3">
                    <label className={`block text-[11px] ${theme.textMuted} mb-1`}>
                      Answer (3–{selectedGridSize} letters)
                    </label>
                    <input
                      type="text"
                      value={entry.answer}
                      onChange={(e) =>
                        handleUpdateRow(
                          idx,
                          'answer',
                          e.target.value.toUpperCase()
                        )
                      }
                      placeholder="OBELISK"
                      className={`w-full px-2.5 py-1.5 rounded border ${theme.borderSubtle} ${theme.bgSurface} font-mono-tabular text-xs font-bold uppercase`}
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className={`block text-[11px] ${theme.textMuted} mb-1`}>
                      Standard Clue
                    </label>
                    <input
                      type="text"
                      value={entry.standardClue}
                      onChange={(e) =>
                        handleUpdateRow(idx, 'standardClue', e.target.value)
                      }
                      placeholder="Direct editorial definition..."
                      className={`w-full px-2.5 py-1.5 rounded border ${theme.borderSubtle} ${theme.bgSurface} text-xs`}
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className={`block text-[11px] ${theme.textMuted} mb-1`}>
                      Cryptic Clue (Optional)
                    </label>
                    <input
                      type="text"
                      value={entry.crypticClue}
                      onChange={(e) =>
                        handleUpdateRow(idx, 'crypticClue', e.target.value)
                      }
                      placeholder="Wordplay + definition..."
                      className={`w-full px-2.5 py-1.5 rounded border ${theme.borderSubtle} ${theme.bgSurface} text-xs`}
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end pt-5">
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(idx)}
                      disabled={entries.length <= 1}
                      className={`p-1.5 rounded border ${theme.borderSubtle} hover:opacity-80 disabled:opacity-30 cursor-pointer`}
                      aria-label="Remove word"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`pt-4 border-t ${theme.borderSubtle} flex items-center justify-end gap-3`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-medium rounded-lg border ${theme.borderSubtle} hover:opacity-80 cursor-pointer whitespace-nowrap shrink-0`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 text-xs font-semibold rounded-lg ${theme.accentBg} ${theme.accentText} flex items-center gap-2 hover:opacity-95 cursor-pointer whitespace-nowrap shrink-0`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>
                Compile &amp; Launch {selectedGridSize}×{selectedGridSize} Grid
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
