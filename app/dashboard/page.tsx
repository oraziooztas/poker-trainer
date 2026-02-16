'use client';

import { useState, useEffect, useRef } from 'react';
import {
  loadProgress,
  loadUserProgress,
  loadScenarioStats,
  loadDailyStats,
  exportAllData,
  importAllData,
  getAccuracyPercentage,
  QuizStats,
  UserProgress,
  ScenarioStats,
  DailyStats,
  ExportData,
} from '@/lib/storage';
import ProgressChart from '@/components/ProgressChart';
import WeaknessCard from '@/components/WeaknessCard';

export default function DashboardPage() {
  const [quiz, setQuiz] = useState<QuizStats | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioStats | null>(null);
  const [daily, setDaily] = useState<DailyStats | null>(null);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuiz(loadProgress());
    setProgress(loadUserProgress());
    setScenarios(loadScenarioStats());
    setDaily(loadDailyStats());
  }, []);

  if (!quiz || !progress || !scenarios || !daily) return null;

  const accuracy = getAccuracyPercentage(quiz.totalCorrect, quiz.totalQuestions);
  const modulesCompleted = Object.values(progress.modules).filter(m => m.completed).length;

  // Calculate streak: consecutive days with activity (looking back from today)
  const streak = (() => {
    if (daily.entries.length === 0) return 0;
    let count = 0;
    const now = new Date();
    for (let i = 0; i <= 90; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const entry = daily.entries.find(e => e.date === key);
      const hasActivity = entry && (entry.quizTotal > 0 || entry.scenariosAttempted > 0 || entry.modulesCompleted > 0);
      if (hasActivity) {
        count++;
      } else if (i > 0) {
        // Allow missing today (haven't played yet)
        break;
      }
    }
    return count;
  })();

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poker-trainer-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as ExportData;
        const success = importAllData(data);
        if (success) {
          setImportMsg('Dati importati con successo!');
          // Reload all data
          setQuiz(loadProgress());
          setProgress(loadUserProgress());
          setScenarios(loadScenarioStats());
          setDaily(loadDailyStats());
        } else {
          setImportMsg('Errore: formato file non valido.');
        }
      } catch {
        setImportMsg('Errore: impossibile leggere il file.');
      }
      setTimeout(() => setImportMsg(null), 3000);
    };
    reader.readAsText(file);
    // Reset input so same file can be re-imported
    e.target.value = '';
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Domande Quiz"
          value={quiz.totalQuestions}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Accuratezza"
          value={`${accuracy}%`}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          label="Streak"
          value={`${streak}g`}
          color="bg-yellow-50 text-yellow-600"
        />
        <StatCard
          label="Moduli Completati"
          value={modulesCompleted}
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Progress Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Accuratezza Quiz (30 giorni)</h2>
        <ProgressChart entries={daily.entries} days={30} />
      </div>

      {/* Weakness Areas */}
      <WeaknessCard statsByType={quiz.statsByType} />

      {/* Scenario Stats */}
      {scenarios.totalAttempted > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Scenari</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{scenarios.totalAttempted}</div>
              <div className="text-sm text-blue-800">Tentati</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(scenarios.statsByCategory).reduce((sum, c) => sum + c.best, 0)}
              </div>
              <div className="text-sm text-green-800">Scelte Ottime</div>
            </div>
          </div>

          {Object.keys(scenarios.statsByCategory).length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">Per Categoria</h3>
              {Object.entries(scenarios.statsByCategory).map(([cat, data]) => {
                const bestPct = data.total > 0 ? Math.round((data.best / data.total) * 100) : 0;
                return (
                  <div key={cat} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="capitalize text-sm">{cat.replace(/-/g, ' ')}</span>
                    <span className="font-mono text-sm">
                      {data.best}/{data.total} ({bestPct}% ottime)
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Export/Import */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Backup Dati</h2>
        <p className="text-sm text-gray-600 mb-4">
          Esporta i tuoi progressi per salvarli o importali su un altro dispositivo.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Esporta JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Importa JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
        {importMsg && (
          <p className={`mt-3 text-sm ${importMsg.includes('successo') ? 'text-green-600' : 'text-red-600'}`}>
            {importMsg}
          </p>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-lg">
      <div className={`text-3xl font-bold ${color.split(' ')[1]} mb-1`}>{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
