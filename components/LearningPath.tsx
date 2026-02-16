'use client';

// === LEARNING PATH COMPONENT ===
// Vertical progression map — mostra fasi e moduli in una timeline verticale
// Usato da: app/path/page.tsx

import { PHASES, MODULES, getModulesByPhase, isModuleUnlocked } from '@/lib/learning-path';

interface LearningPathProps {
  completedModules: Record<string, { completed: boolean; quizPassed?: boolean }>;
  currentModule: string;
  onSelectModule: (moduleId: string) => void;
}

export default function LearningPath({ completedModules, currentModule, onSelectModule }: LearningPathProps) {
  function getPhaseCompletion(phase: number): { completed: number; total: number; percent: number } {
    const modules = getModulesByPhase(phase);
    const completed = modules.filter(m => completedModules[m.id]?.completed).length;
    const total = modules.length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { completed, total, percent };
  }

  function getModuleState(moduleId: string): 'locked' | 'unlocked' | 'current' | 'completed' {
    if (completedModules[moduleId]?.completed) return 'completed';
    if (moduleId === currentModule) return 'current';
    if (isModuleUnlocked(moduleId, completedModules)) return 'unlocked';
    return 'locked';
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Percorso di Apprendimento</h2>

      {PHASES.map((phase) => {
        const { completed, total, percent } = getPhaseCompletion(phase.phase);
        const phaseModules = getModulesByPhase(phase.phase);

        return (
          <div key={phase.phase} className="space-y-3">
            {/* Phase Header */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{phase.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">
                      Fase {phase.phase}: {phase.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {completed}/{total}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{phase.description}</p>
                  {/* Progress bar */}
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modules */}
            <div className="ml-4 space-y-0">
              {phaseModules.map((mod, idx) => {
                const state = getModuleState(mod.id);
                const isLast = idx === phaseModules.length - 1;

                return (
                  <div key={mod.id} className="flex gap-3">
                    {/* Vertical line + dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`
                          w-4 h-4 rounded-full border-2 flex-shrink-0 z-10
                          ${state === 'completed'
                            ? 'bg-green-500 border-green-500'
                            : state === 'current'
                              ? 'bg-blue-500 border-blue-500'
                              : state === 'unlocked'
                                ? 'bg-white border-gray-400'
                                : 'bg-gray-200 border-gray-300'
                          }
                        `}
                      >
                        {state === 'completed' && (
                          <svg className="w-3 h-3 text-white m-auto" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className={`
                            w-0.5 flex-1 min-h-[16px]
                            ${state === 'completed' ? 'bg-green-300' : 'bg-gray-200'}
                          `}
                        />
                      )}
                    </div>

                    {/* Module Card */}
                    <button
                      onClick={() => {
                        if (state !== 'locked') onSelectModule(mod.id);
                      }}
                      disabled={state === 'locked'}
                      className={`
                        flex-1 mb-3 p-3 rounded-lg text-left transition-all duration-200
                        ${state === 'completed'
                          ? 'bg-green-50 border border-green-200 hover:bg-green-100 cursor-pointer'
                          : state === 'current'
                            ? 'bg-white border-2 border-blue-500 shadow-md hover:shadow-lg cursor-pointer'
                            : state === 'unlocked'
                              ? 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer'
                              : 'bg-gray-100 border border-gray-200 opacity-60 cursor-not-allowed'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{mod.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4
                              className={`
                                font-semibold text-sm truncate
                                ${state === 'locked' ? 'text-gray-400' : 'text-gray-900'}
                              `}
                            >
                              {mod.title}
                            </h4>
                            {state === 'completed' && completedModules[mod.id]?.quizPassed && (
                              <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                Quiz superato
                              </span>
                            )}
                          </div>
                          <p
                            className={`
                              text-xs mt-0.5 line-clamp-1
                              ${state === 'locked' ? 'text-gray-300' : 'text-gray-500'}
                            `}
                          >
                            {mod.description}
                          </p>
                        </div>
                        {state === 'locked' && (
                          <svg className="w-4 h-4 text-gray-300 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                          </svg>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
