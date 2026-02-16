'use client';

import { useMemo } from 'react';
import { DailyEntry } from '@/lib/storage';

interface ProgressChartProps {
  entries: DailyEntry[];
  days?: number;
}

export default function ProgressChart({ entries, days = 30 }: ProgressChartProps) {
  const chartData = useMemo(() => {
    // Fill missing days with zeros for the last N days
    const now = new Date();
    const filled: { date: string; accuracy: number; hasData: boolean }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const entry = entries.find(e => e.date === key);

      if (entry && entry.quizTotal > 0) {
        filled.push({
          date: key,
          accuracy: Math.round((entry.quizCorrect / entry.quizTotal) * 100),
          hasData: true,
        });
      } else {
        filled.push({ date: key, accuracy: 0, hasData: false });
      }
    }

    return filled;
  }, [entries, days]);

  const maxAccuracy = 100;
  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Only plot days with data
  const dataPoints = chartData.filter(d => d.hasData);

  if (dataPoints.length < 2) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500 text-sm">
        Completa almeno 2 sessioni di quiz in giorni diversi per vedere il grafico.
      </div>
    );
  }

  // Build SVG path for data points
  const xStep = chartW / (chartData.length - 1);
  const points = chartData
    .map((d, i) => {
      if (!d.hasData) return null;
      const x = padding.left + i * xStep;
      const y = padding.top + chartH - (d.accuracy / maxAccuracy) * chartH;
      return { x, y, accuracy: d.accuracy, date: d.date };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // Area fill path
  const areaPath = linePath
    + ` L ${points[points.length - 1].x} ${padding.top + chartH}`
    + ` L ${points[0].x} ${padding.top + chartH} Z`;

  // Y axis labels
  const yLabels = [0, 25, 50, 75, 100];

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full min-w-[400px]"
        role="img"
        aria-label="Grafico accuratezza quiz ultimi 30 giorni"
      >
        {/* Grid lines */}
        {yLabels.map(val => {
          const y = padding.top + chartH - (val / maxAccuracy) * chartH;
          return (
            <g key={val}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + chartW}
                y2={y}
                stroke="#e5e7eb"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                className="text-[10px] fill-gray-400"
              >
                {val}%
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#gradient)" opacity={0.3} />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3}
            fill="#3b82f6"
            stroke="white"
            strokeWidth={1.5}
          >
            <title>{p.date}: {p.accuracy}%</title>
          </circle>
        ))}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* X axis: show first and last date */}
        <text
          x={padding.left}
          y={height - 5}
          textAnchor="start"
          className="text-[10px] fill-gray-400"
        >
          {chartData[0].date.slice(5)}
        </text>
        <text
          x={padding.left + chartW}
          y={height - 5}
          textAnchor="end"
          className="text-[10px] fill-gray-400"
        >
          {chartData[chartData.length - 1].date.slice(5)}
        </text>
      </svg>
    </div>
  );
}
