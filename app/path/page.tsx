'use client';

// === LEARNING PATH PAGE ===
// Pagina principale del percorso di apprendimento
// Layout: sidebar (LearningPath) + main area (LessonViewer)
// Usato da: navigazione /path

import { useState, useEffect, useCallback } from 'react';
import LearningPath from '@/components/LearningPath';
import LessonViewer from '@/components/LessonViewer';
import { getModule, getNextModule, MODULES } from '@/lib/learning-path';
import { loadUserProgress, completeModule, updateCurrentModule } from '@/lib/storage';
import type { UserProgress } from '@/lib/storage';

export default function PathPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [showLesson, setShowLesson] = useState(false);

  // Load progress on mount
  useEffect(() => {
    const p = loadUserProgress();
    setProgress(p);
  }, []);

  const selectedModule = selectedModuleId ? getModule(selectedModuleId) : null;

  const handleSelectModule = useCallback((moduleId: string) => {
    setSelectedModuleId(moduleId);
    setShowLesson(true);

    const mod = getModule(moduleId);
    if (mod) {
      const updated = updateCurrentModule(moduleId, mod.phase);
      setProgress(updated);
    }
  }, []);

  const handleComplete = useCallback((quizPassed: boolean) => {
    if (!selectedModuleId) return;

    const updated = completeModule(selectedModuleId, quizPassed);

    // Auto-advance to next module
    const next = getNextModule(selectedModuleId);
    if (next) {
      const withNext = updateCurrentModule(next.id, next.phase);
      setProgress(withNext);
    } else {
      setProgress(updated);
    }
  }, [selectedModuleId]);

  const handleBack = useCallback(() => {
    setShowLesson(false);
  }, []);

  if (!progress) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const completedCount = Object.values(progress.modules).filter(m => m.completed).length;
  const totalCount = MODULES.length;
  const overallPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🗺️ Percorso di Studio</h1>
          <p className="text-gray-500 mt-1">
            Impara il poker passo dopo passo — dalle basi alla strategia completa.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-lg">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{overallPercent}%</div>
            <div className="text-xs text-gray-500">{completedCount}/{totalCount} moduli</div>
          </div>
          <div className="w-12 h-12 relative">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-green-500"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${overallPercent}, 100`}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Desktop: Side-by-side layout */}
      <div className="hidden md:grid md:grid-cols-[360px_1fr] gap-6">
        {/* Sidebar */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-thin">
          <LearningPath
            completedModules={progress.modules}
            currentModule={progress.currentModule}
            onSelectModule={handleSelectModule}
          />
        </div>

        {/* Main area */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          {selectedModule ? (
            <LessonViewer
              key={selectedModule.id}
              module={selectedModule}
              onComplete={handleComplete}
              onBack={handleBack}
            />
          ) : (
            <WelcomeMessage
              completedCount={completedCount}
              totalCount={totalCount}
              currentModule={progress.currentModule}
              onStart={() => handleSelectModule(progress.currentModule)}
            />
          )}
        </div>
      </div>

      {/* Mobile: Toggle between path and lesson */}
      <div className="md:hidden">
        {showLesson && selectedModule ? (
          <LessonViewer
            key={selectedModule.id}
            module={selectedModule}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        ) : (
          <div className="space-y-4">
            {/* Quick start button on mobile */}
            {completedCount < totalCount && (
              <button
                onClick={() => handleSelectModule(progress.currentModule)}
                className="w-full bg-blue-600 text-white rounded-xl p-4 font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>Continua: {getModule(progress.currentModule)?.title || 'Prossimo Modulo'}</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {/* Mobile progress bar */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progresso Totale</span>
                <span className="text-sm font-bold text-gray-900">{overallPercent}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{completedCount} di {totalCount} moduli completati</p>
            </div>

            <LearningPath
              completedModules={progress.modules}
              currentModule={progress.currentModule}
              onSelectModule={handleSelectModule}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// === WELCOME MESSAGE ===

function WelcomeMessage({
  completedCount,
  totalCount,
  currentModule,
  onStart,
}: {
  completedCount: number;
  totalCount: number;
  currentModule: string;
  onStart: () => void;
}) {
  const mod = getModule(currentModule);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
      <div className="text-6xl">🎓</div>

      {completedCount === 0 ? (
        <>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Benvenuto nel Percorso di Studio!
            </h2>
            <p className="text-gray-500 max-w-md">
              28 moduli organizzati in 6 fasi ti guideranno dalle basi del poker
              fino a una strategia completa per il tuo home game.
            </p>
          </div>
          <button
            onClick={onStart}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg"
          >
            Inizia il Percorso
          </button>
        </>
      ) : completedCount === totalCount ? (
        <>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Percorso Completato! 🏆
            </h2>
            <p className="text-gray-500 max-w-md">
              Hai completato tutti i {totalCount} moduli. Ora hai le conoscenze
              per giocare un poker solido e profittevole. Buona fortuna ai tavoli!
            </p>
          </div>
          <button
            onClick={onStart}
            className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            Rivedi i Moduli
          </button>
        </>
      ) : (
        <>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Continua il tuo Percorso
            </h2>
            <p className="text-gray-500 max-w-md">
              Hai completato {completedCount} di {totalCount} moduli.
              Seleziona un modulo dalla lista a sinistra o continua dal punto in cui ti eri fermato.
            </p>
          </div>
          {mod && (
            <button
              onClick={onStart}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>Continua: {mod.title}</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </>
      )}
    </div>
  );
}
