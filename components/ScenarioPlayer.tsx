'use client';

// === SCENARIO PLAYER ===
// Interactive scenario UI: shows a poker situation, lets the player choose, reveals results.
// Used by: app/scenarios/page.tsx
// Depends on: Scenario types from lib/scenarios, TableView component

import { useState } from 'react';
import type { Scenario, ScenarioOption, OptionQuality } from '@/lib/scenarios';
import TableView from '@/components/TableView';

interface ScenarioPlayerProps {
  scenario: Scenario;
  onComplete: (quality: OptionQuality) => void;
}

// === QUALITY CONFIG ===

const QUALITY_CONFIG: Record<OptionQuality, { label: string; color: string; bgColor: string; borderColor: string; emoji: string }> = {
  best: {
    label: 'Scelta ottima',
    color: 'text-green-800',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-500',
    emoji: '✓',
  },
  acceptable: {
    label: 'Accettabile',
    color: 'text-yellow-800',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-500',
    emoji: '~',
  },
  mistake: {
    label: 'Errore',
    color: 'text-orange-800',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-500',
    emoji: '!',
  },
  disaster: {
    label: 'Disastro',
    color: 'text-red-800',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-500',
    emoji: 'X',
  },
};

// === MAIN COMPONENT ===

export default function ScenarioPlayer({ scenario, onComplete }: ScenarioPlayerProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (index: number) => {
    if (revealed) return;
    setSelectedIndex(index);
    setRevealed(true);
  };

  const chosenOption = selectedIndex !== null ? scenario.options[selectedIndex] : null;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Scenario Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <span className={`
            px-2.5 py-0.5 rounded-full text-xs font-medium
            ${scenario.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : ''}
            ${scenario.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : ''}
            ${scenario.difficulty === 'advanced' ? 'bg-red-100 text-red-800' : ''}
          `}>
            {scenario.difficulty === 'beginner' ? 'Principiante' : scenario.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzato'}
          </span>
          {scenario.isHomeGame && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Home Game
            </span>
          )}
          <span className="text-xs text-gray-500 ml-auto">{scenario.position}</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{scenario.title}</h2>
        <p className="text-gray-700">{scenario.description}</p>

        {/* Action history */}
        {scenario.actionHistory && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-xs font-medium text-gray-500 block mb-1">Azione precedente:</span>
            <span className="text-sm text-gray-800">{scenario.actionHistory}</span>
          </div>
        )}
      </div>

      {/* Table View + Hole Cards */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <TableView
          position={scenario.position}
          potSize={scenario.potSize}
          board={scenario.board}
          numPlayers={scenario.numPlayers}
          compact
        />

        {/* Hole Cards */}
        <div className="mt-4 text-center">
          <div className="text-xs font-medium text-gray-500 mb-2">Le tue carte</div>
          <div className="inline-flex gap-2">
            {parseHoleCards(scenario.holeCards).map((card, i) => (
              <div
                key={i}
                className="w-14 h-20 bg-white rounded-lg border-2 border-gray-300 flex flex-col items-center justify-center font-bold shadow-sm"
              >
                <span className={`text-lg ${card.isRed ? 'text-red-600' : 'text-gray-900'}`}>
                  {card.rank}
                </span>
                <span className={`text-lg ${card.isRed ? 'text-red-600' : 'text-gray-900'}`}>
                  {card.suit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bet to call info */}
        {scenario.betToCall !== undefined && scenario.betToCall > 0 && (
          <div className="mt-3 text-center text-sm text-gray-600">
            Da chiamare: <span className="font-bold text-gray-900">{scenario.betToCall}</span>
            {scenario.potSize ? ` (piatto: ${scenario.potSize})` : ''}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          {revealed ? 'Risultato' : 'Cosa fai?'}
        </h3>
        <div className="space-y-3">
          {scenario.options.map((option, i) => {
            const isChosen = selectedIndex === i;
            const config = QUALITY_CONFIG[option.quality];

            if (revealed) {
              return (
                <div
                  key={i}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-300
                    ${config.bgColor} ${config.borderColor}
                    ${isChosen ? 'ring-2 ring-offset-1 ring-blue-400' : ''}
                  `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-semibold ${config.color}`}>
                      {isChosen ? '→ ' : ''}{option.action}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${config.bgColor} ${config.color}`}>
                      {config.emoji} {config.label}
                    </span>
                  </div>
                  {/* Show explanation for chosen option always, for others when revealed */}
                  <p className={`text-sm mt-1 ${config.color} opacity-90`}>
                    {option.explanation}
                  </p>
                </div>
              );
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className="
                  w-full p-4 rounded-lg text-left font-medium
                  bg-gray-100 hover:bg-gray-200 border-2 border-transparent
                  transition-all duration-200 hover:border-blue-300
                  active:scale-[0.98]
                "
              >
                {option.action}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation + Home Game Tip (shown after reveal) */}
      {revealed && chosenOption && (
        <div className="space-y-4">
          {/* Chosen option detailed explanation */}
          <div className={`rounded-xl p-5 shadow-lg ${QUALITY_CONFIG[chosenOption.quality].bgColor}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-lg font-bold ${QUALITY_CONFIG[chosenOption.quality].color}`}>
                {QUALITY_CONFIG[chosenOption.quality].emoji}
              </span>
              <span className={`font-bold ${QUALITY_CONFIG[chosenOption.quality].color}`}>
                La tua scelta: {QUALITY_CONFIG[chosenOption.quality].label}
              </span>
            </div>
            <p className={`text-sm ${QUALITY_CONFIG[chosenOption.quality].color}`}>
              Hai scelto: &quot;{chosenOption.action}&quot;
            </p>
          </div>

          {/* Home Game Tip */}
          {scenario.homeGameTip && (
            <div className="bg-purple-50 rounded-xl p-5 shadow-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🏠</span>
                <span className="font-bold text-purple-800">Consiglio Home Game</span>
              </div>
              <p className="text-sm text-purple-700">{scenario.homeGameTip}</p>
            </div>
          )}

          {/* Next button */}
          <button
            onClick={() => onComplete(chosenOption.quality)}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 shadow-lg transition-colors active:scale-[0.98]"
          >
            Prossimo →
          </button>
        </div>
      )}
    </div>
  );
}

// === HELPERS ===

function parseHoleCards(cardStr: string): { rank: string; suit: string; isRed: boolean }[] {
  const cards: { rank: string; suit: string; isRed: boolean }[] = [];
  const parts = cardStr.trim().split(/\s+/);
  for (const part of parts) {
    const match = part.match(/^(.+?)([♠♥♦♣])$/);
    if (match) {
      const suit = match[2];
      cards.push({
        rank: match[1],
        suit,
        isRed: suit === '♥' || suit === '♦',
      });
    }
  }
  return cards;
}
