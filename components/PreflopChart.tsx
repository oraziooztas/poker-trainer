'use client';

import { useState } from 'react';

type Position = 'early' | 'middle' | 'late' | 'blinds';

// Hand strength tiers
const TIER_1 = ['AA', 'KK', 'QQ', 'AKs']; // Premium
const TIER_2 = ['JJ', 'TT', 'AKo', 'AQs', 'AJs', 'KQs']; // Strong
const TIER_3 = ['99', '88', 'AQo', 'AJo', 'ATs', 'KJs', 'QJs', 'JTs']; // Playable
const TIER_4 = ['77', '66', 'ATo', 'KQo', 'KJo', 'QJo', 'KTs', 'QTs', 'JTo', 'T9s', '98s', '87s']; // Speculative
const TIER_5 = ['55', '44', '33', '22', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'K9s', 'Q9s', 'J9s', 'T8s', '97s', '86s', '76s', '65s', '54s']; // Marginal

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

function getHandNotation(row: number, col: number): { hand: string; suited: boolean; pair: boolean } {
  const r1 = RANKS[row];
  const r2 = RANKS[col];

  if (row === col) {
    return { hand: `${r1}${r2}`, suited: false, pair: true };
  } else if (row < col) {
    // Above diagonal = suited
    return { hand: `${r1}${r2}s`, suited: true, pair: false };
  } else {
    // Below diagonal = offsuit
    return { hand: `${r2}${r1}o`, suited: false, pair: false };
  }
}

function getTier(hand: string): number {
  const baseHand = hand.replace('o', '').replace('s', '');

  // Check suited version first, then offsuit
  if (TIER_1.includes(hand) || TIER_1.includes(baseHand)) return 1;
  if (TIER_2.includes(hand) || TIER_2.includes(baseHand)) return 2;
  if (TIER_3.includes(hand) || TIER_3.includes(baseHand)) return 3;
  if (TIER_4.includes(hand) || TIER_4.includes(baseHand)) return 4;
  if (TIER_5.includes(hand) || TIER_5.includes(baseHand)) return 5;
  return 6; // Fold
}

const tierColors: Record<number, string> = {
  1: 'bg-red-500 text-white', // Premium - Red
  2: 'bg-orange-400 text-white', // Strong - Orange
  3: 'bg-yellow-400 text-gray-900', // Playable - Yellow
  4: 'bg-green-400 text-gray-900', // Speculative - Green
  5: 'bg-blue-300 text-gray-900', // Marginal - Blue
  6: 'bg-gray-200 text-gray-500', // Fold - Gray
};

const tierLabels: Record<number, string> = {
  1: 'Premium',
  2: 'Forte',
  3: 'Giocabile',
  4: 'Speculativo',
  5: 'Marginale',
  6: 'Fold',
};

interface PreflopChartProps {
  onSelect?: (hand: string) => void;
  compact?: boolean;
}

export default function PreflopChart({ onSelect, compact = false }: PreflopChartProps) {
  const [selectedHand, setSelectedHand] = useState<string | null>(null);
  const [hoveredHand, setHoveredHand] = useState<string | null>(null);

  const handleClick = (hand: string) => {
    setSelectedHand(hand === selectedHand ? null : hand);
    onSelect?.(hand);
  };

  const cellSize = compact ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs md:w-10 md:h-10 md:text-sm';

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[1, 2, 3, 4, 5, 6].map(tier => (
          <div key={tier} className="flex items-center gap-1">
            <div className={`w-4 h-4 rounded ${tierColors[tier]}`} />
            <span>{tierLabels[tier]}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Header row */}
          <div className="flex">
            <div className={`${cellSize} flex items-center justify-center font-bold text-gray-400`} />
            {RANKS.map(rank => (
              <div key={rank} className={`${cellSize} flex items-center justify-center font-bold text-gray-600`}>
                {rank}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          {RANKS.map((_, row) => (
            <div key={row} className="flex">
              {/* Row header */}
              <div className={`${cellSize} flex items-center justify-center font-bold text-gray-600`}>
                {RANKS[row]}
              </div>

              {/* Cells */}
              {RANKS.map((_, col) => {
                const { hand, suited, pair } = getHandNotation(row, col);
                const tier = getTier(hand);
                const isSelected = selectedHand === hand;
                const isHovered = hoveredHand === hand;
                const displayHand = pair ? hand.slice(0, 2) : hand;

                return (
                  <button
                    key={`${row}-${col}`}
                    onClick={() => handleClick(hand)}
                    onMouseEnter={() => setHoveredHand(hand)}
                    onMouseLeave={() => setHoveredHand(null)}
                    className={`
                      ${cellSize}
                      ${tierColors[tier]}
                      ${isSelected ? 'ring-2 ring-blue-600 ring-offset-1' : ''}
                      ${isHovered ? 'opacity-80' : ''}
                      flex items-center justify-center font-medium
                      border border-white/20
                      transition-all duration-100
                      hover:z-10 hover:scale-110
                    `}
                    title={`${hand} - ${tierLabels[tier]}`}
                  >
                    {displayHand}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Selected hand info */}
      {selectedHand && (
        <div className="p-3 bg-white rounded-lg border shadow-sm">
          <div className="font-bold text-lg">{selectedHand}</div>
          <div className={`inline-block px-2 py-1 rounded text-sm ${tierColors[getTier(selectedHand)]}`}>
            {tierLabels[getTier(selectedHand)]}
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {selectedHand.includes('s')
              ? 'Suited - le due carte sono dello stesso seme'
              : selectedHand.includes('o')
                ? 'Offsuit - le due carte sono di semi diversi'
                : 'Coppia - due carte dello stesso valore'}
          </p>
        </div>
      )}

      {/* Diagonal explanation */}
      <div className="text-xs text-gray-500">
        <p>Sopra la diagonale: suited (s) | Sotto: offsuit (o) | Diagonale: coppie</p>
      </div>
    </div>
  );
}
