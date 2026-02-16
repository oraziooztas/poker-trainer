'use client';

import Link from 'next/link';

interface WeaknessArea {
  type: string;
  label: string;
  accuracy: number;
  total: number;
  suggestion: string;
  link: string;
}

interface WeaknessCardProps {
  statsByType: Record<string, { correct: number; total: number }>;
  threshold?: number;
}

const quizTypeLabels: Record<string, { label: string; link: string; suggestion: string }> = {
  outs: {
    label: 'Outs',
    link: '/quiz',
    suggestion: 'Ripassa la regola del 2 e del 4, poi pratica con il quiz Outs.',
  },
  potodds: {
    label: 'Pot Odds',
    link: '/quiz',
    suggestion: 'Rileggi la formula Bet/(Pot+Bet) e fai almeno 10 quiz Pot Odds.',
  },
  equity: {
    label: 'Equity',
    link: '/quiz',
    suggestion: 'Memorizza le equity dei matchup comuni (AA vs KK, AK vs QQ, ecc.).',
  },
  ev: {
    label: 'Expected Value',
    link: '/quiz',
    suggestion: 'Capire se un call è +EV richiede pratica. Combina pot odds ed equity.',
  },
  callfold: {
    label: 'Call/Fold',
    link: '/quiz',
    suggestion: 'Confronta sempre equity con pot odds prima di decidere.',
  },
};

export default function WeaknessCard({ statsByType, threshold = 70 }: WeaknessCardProps) {
  const weaknesses: WeaknessArea[] = Object.entries(statsByType)
    .filter(([, data]) => data.total >= 5) // Need enough data
    .map(([type, data]) => {
      const accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
      const meta = quizTypeLabels[type] || { label: type, link: '/quiz', suggestion: 'Continua a praticare.' };
      return {
        type,
        label: meta.label,
        accuracy,
        total: data.total,
        suggestion: meta.suggestion,
        link: meta.link,
      };
    })
    .filter(w => w.accuracy < threshold)
    .sort((a, b) => a.accuracy - b.accuracy);

  if (weaknesses.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <span className="text-green-600 font-bold text-lg">Ottimo!</span>
          <span className="text-green-700 text-sm">
            Nessuna area sotto il {threshold}%. Continua cosi!
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Aree da Migliorare</h3>
      {weaknesses.map(w => (
        <div key={w.type} className="bg-white rounded-xl p-4 shadow-sm border border-red-100">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900">{w.label}</span>
            <span className={`text-sm font-mono px-2 py-0.5 rounded ${
              w.accuracy < 50
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {w.accuracy}%
            </span>
          </div>
          {/* Accuracy bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all ${
                w.accuracy < 50 ? 'bg-red-400' : 'bg-yellow-400'
              }`}
              style={{ width: `${w.accuracy}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mb-2">{w.suggestion}</p>
          <Link
            href={w.link}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Pratica ora &rarr;
          </Link>
        </div>
      ))}
    </div>
  );
}
