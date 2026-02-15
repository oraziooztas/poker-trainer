'use client';

import { useEffect, useState } from 'react';
import { loadProgress, getAccuracyPercentage, resetProgress, QuizStats } from '@/lib/storage';

interface StatsProps {
  onReset?: () => void;
}

export default function Stats({ onReset }: StatsProps) {
  const [stats, setStats] = useState<QuizStats | null>(null);

  useEffect(() => {
    setStats(loadProgress());
  }, []);

  if (!stats || stats.totalQuestions === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
        Nessuna statistica disponibile. Inizia un quiz!
      </div>
    );
  }

  const accuracy = getAccuracyPercentage(stats.totalCorrect, stats.totalQuestions);

  const handleReset = () => {
    if (confirm('Sei sicuro di voler cancellare tutte le statistiche?')) {
      resetProgress();
      setStats(null);
      onReset?.();
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Le Tue Statistiche</h3>
        <button
          onClick={handleReset}
          className="text-sm text-gray-500 hover:text-red-600"
        >
          Reset
        </button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.totalQuestions}</div>
          <div className="text-sm text-blue-800">Domande</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.totalCorrect}</div>
          <div className="text-sm text-green-800">Corrette</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{accuracy}%</div>
          <div className="text-sm text-purple-800">Precisione</div>
        </div>
      </div>

      {/* Stats by Type */}
      {Object.keys(stats.statsByType).length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600">Per Tipo di Quiz</h4>
          {Object.entries(stats.statsByType).map(([type, data]) => (
            <div key={type} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="capitalize">{type}</span>
              <span className="font-mono text-sm">
                {data.correct}/{data.total} ({getAccuracyPercentage(data.correct, data.total)}%)
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Recent Sessions */}
      {stats.sessions.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Ultime Sessioni</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {stats.sessions.slice(-5).reverse().map((session, i) => (
              <div key={i} className="flex justify-between text-sm text-gray-600">
                <span>{new Date(session.date).toLocaleDateString('it-IT')}</span>
                <span className="capitalize">{session.quizType}</span>
                <span>{session.correct}/{session.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
