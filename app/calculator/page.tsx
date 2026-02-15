'use client';

import { useState, useMemo } from 'react';
import { Card as CardType } from '@/lib/poker';
import { countOuts, calculatePotOdds, ruleOf2And4 } from '@/lib/probability';
import { useEquityWorker } from '@/lib/useEquityWorker';
import CardPicker from '@/components/CardPicker';
import Hand from '@/components/Hand';
import Spinner from '@/components/Spinner';

export default function CalculatorPage() {
  const [holeCards, setHoleCards] = useState<CardType[]>([]);
  const [communityCards, setCommunityCards] = useState<CardType[]>([]);
  const [opponents, setOpponents] = useState(1);
  const [pot, setPot] = useState(100);
  const [bet, setBet] = useState(50);

  // Use Web Worker hook for equity calculation
  const { calculate, result: equity, isCalculating, progress } = useEquityWorker();

  const allSelected = [...holeCards, ...communityCards];
  const outs = useMemo(() => {
    if (holeCards.length === 2 && communityCards.length >= 3) {
      return countOuts(holeCards, communityCards);
    }
    return [];
  }, [holeCards, communityCards]);

  const potOdds = calculatePotOdds(pot, bet);

  const handleCalculate = () => {
    if (holeCards.length !== 2) return;
    calculate(holeCards, communityCards, opponents);
  };

  const reset = () => {
    setHoleCards([]);
    setCommunityCards([]);
  };

  // Calculate call/fold suggestion based on equity vs pot odds
  const getSuggestion = () => {
    if (!equity) return null;

    const totalEquity = equity.winProbability + (equity.tieProbability / 2);
    const isCallProfitable = totalEquity > potOdds;
    const edgePercent = ((totalEquity - potOdds) * 100).toFixed(1);

    return {
      action: isCallProfitable ? 'CALL' : 'FOLD',
      isProfitable: isCallProfitable,
      edge: edgePercent,
      equity: (totalEquity * 100).toFixed(1),
      potOdds: (potOdds * 100).toFixed(1)
    };
  };

  const suggestion = getSuggestion();

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">Calcolatore Odds</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Card Selection */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Le Tue Carte (2)</h2>
            <Hand cards={holeCards} label="Hole Cards" />
            <div className="mt-4">
              <CardPicker
                selectedCards={holeCards}
                onSelect={setHoleCards}
                maxCards={2}
                disabledCards={communityCards}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Carte Comuni (0-5)</h2>
            <Hand cards={communityCards} label="Community Cards" />
            <div className="mt-4">
              <CardPicker
                selectedCards={communityCards}
                onSelect={setCommunityCards}
                maxCards={5}
                disabledCards={holeCards}
              />
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-6">
          {/* Equity Calculator */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Equity vs Avversari</h2>

            <div className="flex items-center gap-4 mb-4">
              <label className="text-gray-600">Avversari:</label>
              <select
                value={opponents}
                onChange={(e) => setOpponents(Number(e.target.value))}
                className="border rounded-lg px-3 py-2"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleCalculate}
                disabled={holeCards.length !== 2 || isCalculating}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCalculating ? (
                  <>
                    <Spinner size="sm" />
                    <span>Calcolo...</span>
                  </>
                ) : (
                  'Calcola Equity'
                )}
              </button>
              <button
                onClick={reset}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Reset
              </button>
            </div>

            {/* Progress Bar */}
            {isCalculating && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Simulazione Monte Carlo...</span>
                  <span>{Math.round(progress * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-150"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </div>
            )}

            {equity && (
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-100 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-700">
                    {(equity.winProbability * 100).toFixed(1)}%
                  </div>
                  <div className="text-green-600">Win</div>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-700">
                    {(equity.tieProbability * 100).toFixed(1)}%
                  </div>
                  <div className="text-yellow-600">Tie</div>
                </div>
                <div className="bg-red-100 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-red-700">
                    {(equity.lossProbability * 100).toFixed(1)}%
                  </div>
                  <div className="text-red-600">Lose</div>
                </div>
              </div>
            )}

            {/* Call/Fold Suggestion */}
            {suggestion && (
              <div className={`mt-6 p-4 rounded-lg border-2 ${
                suggestion.isProfitable
                  ? 'bg-green-50 border-green-500'
                  : 'bg-red-50 border-red-500'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-2xl font-bold ${
                      suggestion.isProfitable ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {suggestion.action}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Equity: {suggestion.equity}% vs Pot Odds: {suggestion.potOdds}%
                    </div>
                  </div>
                  <div className={`text-right ${
                    suggestion.isProfitable ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <div className="text-sm">Edge</div>
                    <div className="text-xl font-bold">
                      {suggestion.isProfitable ? '+' : ''}{suggestion.edge}%
                    </div>
                  </div>
                </div>
                <p className={`text-sm mt-2 ${
                  suggestion.isProfitable ? 'text-green-700' : 'text-red-700'
                }`}>
                  {suggestion.isProfitable
                    ? 'La tua equity supera le pot odds: chiamata profittevole nel lungo termine.'
                    : 'La tua equity non copre le pot odds: folda o trova una situazione migliore.'}
                </p>
              </div>
            )}
          </div>

          {/* Outs Display */}
          {outs.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Outs Rilevati</h2>
              <div className="space-y-3">
                {outs.map((out, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{out.description}</span>
                    <span className="font-mono text-blue-600">
                      {(out.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Regola del 2 e 4</h3>
                {outs[0] && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-800">Turn - River:</span>
                      <span className="ml-2 font-mono">{(ruleOf2And4(outs[0].outs, false) * 100).toFixed(0)}%</span>
                    </div>
                    <div>
                      <span className="text-blue-800">Flop - River:</span>
                      <span className="ml-2 font-mono">{(ruleOf2And4(outs[0].outs, true) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pot Odds */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Pot Odds</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Piatto (EUR)</label>
                <input
                  type="number"
                  value={pot}
                  onChange={(e) => setPot(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Puntata da call (EUR)</label>
                <input
                  type="number"
                  value={bet}
                  onChange={(e) => setBet(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2"
                  min={0}
                />
              </div>
            </div>

            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <div className="text-3xl font-bold text-gray-900">
                {(potOdds * 100).toFixed(1)}%
              </div>
              <div className="text-gray-600">Pot Odds</div>
              <p className="text-sm text-gray-500 mt-2">
                Devi avere almeno {(potOdds * 100).toFixed(1)}% equity per chiamare profittevolmente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
