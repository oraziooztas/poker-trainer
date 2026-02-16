'use client';

// === SCENARIOS PAGE ===
// Main page for the Scenario Trainer feature.
// Depends on: lib/scenarios, lib/storage, components/ScenarioPlayer

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SCENARIOS,
  SCENARIO_CATEGORIES,
  getScenariosByCategory,
  getScenariosByDifficulty,
  getHomeGameScenarios,
} from '@/lib/scenarios';
import type { ScenarioCategory, Difficulty, OptionQuality, Scenario } from '@/lib/scenarios';
import { recordScenarioResult, loadScenarioStats, ScenarioStats } from '@/lib/storage';
import ScenarioPlayer from '@/components/ScenarioPlayer';

// === TYPES ===

type CategoryFilter = ScenarioCategory | 'all';
type DifficultyFilter = Difficulty | 'all';

// === CONSTANTS ===

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string }> = {
  beginner: { label: 'Principiante', color: 'bg-green-100 text-green-800 border-green-300' },
  intermediate: { label: 'Intermedio', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  advanced: { label: 'Avanzato', color: 'bg-red-100 text-red-800 border-red-300' },
};

// === MAIN COMPONENT ===

export default function ScenariosPage() {
  // Filters
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [homeGameMode, setHomeGameMode] = useState(false);
  const [randomMode, setRandomMode] = useState(false);

  // State
  const [showStart, setShowStart] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<ScenarioStats | null>(null);
  const [sessionResults, setSessionResults] = useState<{ best: number; acceptable: number; mistake: number; disaster: number }>({
    best: 0, acceptable: 0, mistake: 0, disaster: 0,
  });

  // Load stats on mount
  useEffect(() => {
    setStats(loadScenarioStats());
  }, []);

  // Filtered scenarios
  const filteredScenarios = useMemo(() => {
    let list = [...SCENARIOS];

    if (homeGameMode) {
      list = list.filter(s => s.isHomeGame === true);
    }

    if (categoryFilter !== 'all') {
      list = list.filter(s => s.category === categoryFilter);
    }

    if (difficultyFilter !== 'all') {
      list = list.filter(s => s.difficulty === difficultyFilter);
    }

    if (randomMode) {
      // Fisher-Yates shuffle
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
    }

    return list;
  }, [categoryFilter, difficultyFilter, homeGameMode, randomMode]);

  const currentScenario = filteredScenarios[currentIndex] ?? null;
  const totalScenarios = filteredScenarios.length;
  const completedCount = completedIds.size;

  const startSession = useCallback(() => {
    setShowStart(false);
    setCurrentIndex(0);
    setCompletedIds(new Set());
    setSessionResults({ best: 0, acceptable: 0, mistake: 0, disaster: 0 });
  }, []);

  const handleComplete = useCallback((quality: OptionQuality) => {
    if (!currentScenario) return;

    // Record the result
    const chosenOption = currentScenario.options.find(o => o.quality === quality)?.action ?? '';
    const updatedStats = recordScenarioResult(
      currentScenario.id,
      currentScenario.category,
      chosenOption,
      quality
    );
    setStats(updatedStats);

    // Update session results
    setSessionResults(prev => ({ ...prev, [quality]: prev[quality] + 1 }));
    setCompletedIds(prev => new Set(prev).add(currentScenario.id));

    // Move to next
    if (currentIndex < totalScenarios - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Session complete - show start screen
      setShowStart(true);
    }
  }, [currentScenario, currentIndex, totalScenarios]);

  const resetToMenu = useCallback(() => {
    setShowStart(true);
    setCurrentIndex(0);
  }, []);

  // === RENDER ===

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">Scenari</h1>

      {showStart ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Category Filter */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Categoria</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`p-3 rounded-lg border-2 transition-all text-sm ${
                  categoryFilter === 'all'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-lg mb-1">🎲</div>
                <div className="font-semibold">Tutte</div>
                <div className="text-xs text-gray-600">{SCENARIOS.length} scenari</div>
              </button>
              {(Object.entries(SCENARIO_CATEGORIES) as [ScenarioCategory, typeof SCENARIO_CATEGORIES[ScenarioCategory]][]).map(([key, cat]) => {
                const count = getScenariosByCategory(key).length;
                return (
                  <button
                    key={key}
                    onClick={() => setCategoryFilter(key)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      categoryFilter === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{cat.icon}</div>
                    <div className="font-semibold">{cat.label}</div>
                    <div className="text-xs text-gray-600">{count} scenari</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Difficolta</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setDifficultyFilter('all')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all text-sm ${
                  difficultyFilter === 'all'
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                Tutte
              </button>
              {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG[Difficulty]][]).map(([level, config]) => (
                <button
                  key={level}
                  onClick={() => setDifficultyFilter(level)}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all text-sm ${
                    difficultyFilter === level
                      ? config.color + ' border-current'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Opzioni</h2>
            <div className="space-y-4">
              {/* Home Game Mode */}
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900">🏠 Modalita Home Game</div>
                  <div className="text-sm text-gray-500">Solo scenari per partite tra amici</div>
                </div>
                <button
                  onClick={() => setHomeGameMode(!homeGameMode)}
                  className={`
                    relative w-12 h-7 rounded-full transition-colors
                    ${homeGameMode ? 'bg-purple-600' : 'bg-gray-300'}
                  `}
                >
                  <span
                    className={`
                      absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform
                      ${homeGameMode ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </label>

              {/* Random Mode */}
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900">🔀 Ordine casuale</div>
                  <div className="text-sm text-gray-500">Mescola gli scenari ogni volta</div>
                </div>
                <button
                  onClick={() => setRandomMode(!randomMode)}
                  className={`
                    relative w-12 h-7 rounded-full transition-colors
                    ${randomMode ? 'bg-blue-600' : 'bg-gray-300'}
                  `}
                >
                  <span
                    className={`
                      absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform
                      ${randomMode ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </label>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startSession}
            disabled={filteredScenarios.length === 0}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 shadow-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {filteredScenarios.length === 0
              ? 'Nessuno scenario con questi filtri'
              : `Inizia (${filteredScenarios.length} scenari)`}
          </button>

          {/* Session Results (if just finished) */}
          {completedCount > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Ultima sessione</h2>
              <div className="grid grid-cols-4 gap-3">
                <ResultCard label="Ottime" value={sessionResults.best} color="text-green-600 bg-green-50" />
                <ResultCard label="OK" value={sessionResults.acceptable} color="text-yellow-600 bg-yellow-50" />
                <ResultCard label="Errori" value={sessionResults.mistake} color="text-orange-600 bg-orange-50" />
                <ResultCard label="Disastri" value={sessionResults.disaster} color="text-red-600 bg-red-50" />
              </div>
            </div>
          )}

          {/* Global Stats */}
          {stats && stats.totalAttempted > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Statistiche globali</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalAttempted}</div>
                  <div className="text-sm text-blue-800">Scenari tentati</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Object.values(stats.statsByCategory).reduce((sum, c) => sum + c.best, 0)}
                  </div>
                  <div className="text-sm text-green-800">Scelte ottime</div>
                </div>
              </div>

              {Object.keys(stats.statsByCategory).length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-600">Per categoria</h3>
                  {Object.entries(stats.statsByCategory).map(([cat, data]) => {
                    const bestPct = data.total > 0 ? Math.round((data.best / data.total) * 100) : 0;
                    const catInfo = SCENARIO_CATEGORIES[cat as ScenarioCategory];
                    return (
                      <div key={cat} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">
                          {catInfo ? `${catInfo.icon} ${catInfo.label}` : cat}
                        </span>
                        <span className="font-mono text-sm">
                          {data.best}/{data.total} ({bestPct}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Scenario {currentIndex + 1} di {totalScenarios}
              </span>
              <span className="text-sm font-medium">
                Completati: <span className="text-green-600">{completedCount}</span> / {totalScenarios}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalScenarios) * 100}%` }}
              />
            </div>
          </div>

          {/* Back Button */}
          <div className="max-w-2xl mx-auto">
            <button
              onClick={resetToMenu}
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              ← Torna al menu
            </button>
          </div>

          {/* Scenario Player */}
          {currentScenario && (
            <ScenarioPlayer
              key={currentScenario.id}
              scenario={currentScenario}
              onComplete={handleComplete}
            />
          )}
        </>
      )}
    </div>
  );
}

// === SUB-COMPONENTS ===

function ResultCard({ label, value, color }: { label: string; value: number; color: string }) {
  const [bgColor, textColor] = color.split(' ');
  return (
    <div className={`text-center p-3 rounded-lg ${color}`}>
      <div className={`text-2xl font-bold`}>{value}</div>
      <div className="text-xs">{label}</div>
    </div>
  );
}
