'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Card } from './poker';
import { OddsResult, calculateEquity } from './probability';

interface UseEquityWorkerReturn {
  calculate: (holeCards: Card[], communityCards: Card[], numOpponents: number) => void;
  result: OddsResult | null;
  isCalculating: boolean;
  progress: number;
  error: string | null;
}

export function useEquityWorker(): UseEquityWorkerReturn {
  const [result, setResult] = useState<OddsResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const calculate = useCallback((holeCards: Card[], communityCards: Card[], numOpponents: number) => {
    setIsCalculating(true);
    setProgress(0);
    setError(null);
    setResult(null);

    // Try to use Web Worker, fallback to main thread
    if (typeof Worker !== 'undefined') {
      try {
        // Terminate previous worker if exists
        workerRef.current?.terminate();

        // Create inline worker using Blob
        const workerCode = `
          const RANK_VALUES = {
            '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
            'J': 11, 'Q': 12, 'K': 13, 'A': 14
          };
          const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
          const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

          function createDeck() {
            const deck = [];
            for (const suit of SUITS) {
              for (const rank of RANKS) {
                deck.push({ rank, suit });
              }
            }
            return deck;
          }

          function cardsEqual(a, b) {
            return a.rank === b.rank && a.suit === b.suit;
          }

          function removeCards(deck, toRemove) {
            return deck.filter(card => !toRemove.some(r => cardsEqual(card, r)));
          }

          function shuffleDeckFast(deck) {
            const arr = [...deck];
            for (let i = arr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
          }

          function getRankValue(rank) {
            return RANK_VALUES[rank];
          }

          function evaluateHandSimple(cards) {
            const rankCounts = new Map();
            const suitCounts = new Map();

            for (const card of cards) {
              const rv = getRankValue(card.rank);
              rankCounts.set(rv, (rankCounts.get(rv) || 0) + 1);
              if (!suitCounts.has(card.suit)) suitCounts.set(card.suit, []);
              suitCounts.get(card.suit).push(card);
            }

            let flushCards = null;
            for (const [, suited] of suitCounts) {
              if (suited.length >= 5) {
                flushCards = suited.sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank)).slice(0, 5);
                break;
              }
            }

            const uniqueValues = [...new Set(cards.map(c => getRankValue(c.rank)))].sort((a, b) => b - a);
            if (uniqueValues.includes(14)) uniqueValues.push(1);

            let straightHigh = 0;
            for (let i = 0; i <= uniqueValues.length - 5; i++) {
              if (uniqueValues[i] - uniqueValues[i + 4] === 4) {
                straightHigh = uniqueValues[i];
                break;
              }
            }

            const counts = [...rankCounts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
            const maxCount = counts[0]?.[1] || 0;
            const secondCount = counts[1]?.[1] || 0;

            const isStraightFlush = flushCards && straightHigh > 0;
            if (isStraightFlush && straightHigh === 14) return { rank: 'royal-flush', value: 1000 };
            if (isStraightFlush) return { rank: 'straight-flush', value: 900 + straightHigh };
            if (maxCount === 4) return { rank: 'four-of-a-kind', value: 800 + counts[0][0] };
            if (maxCount === 3 && secondCount >= 2) return { rank: 'full-house', value: 700 + counts[0][0] * 10 + counts[1][0] };
            if (flushCards) return { rank: 'flush', value: 600 + flushCards.reduce((s, c, i) => s + getRankValue(c.rank) * Math.pow(0.1, i), 0) };
            if (straightHigh > 0) return { rank: 'straight', value: 500 + straightHigh };
            if (maxCount === 3) return { rank: 'three-of-a-kind', value: 400 + counts[0][0] };
            if (maxCount === 2 && secondCount === 2) return { rank: 'two-pair', value: 300 + counts[0][0] * 10 + counts[1][0] };
            if (maxCount === 2) return { rank: 'one-pair', value: 200 + counts[0][0] };
            return { rank: 'high-card', value: 100 + counts[0][0] };
          }

          self.onmessage = function(e) {
            const { holeCards, communityCards, numOpponents, simulations } = e.data;

            const usedCards = [...holeCards, ...communityCards];
            let wins = 0, ties = 0, losses = 0;

            for (let i = 0; i < simulations; i++) {
              const deck = removeCards(createDeck(), usedCards);
              const shuffled = shuffleDeckFast(deck);

              const cardsNeeded = 5 - communityCards.length;
              const finalCommunity = [...communityCards, ...shuffled.slice(0, cardsNeeded)];
              let deckIndex = cardsNeeded;

              const opponentHands = [];
              for (let j = 0; j < numOpponents; j++) {
                opponentHands.push([shuffled[deckIndex], shuffled[deckIndex + 1]]);
                deckIndex += 2;
              }

              const myHand = evaluateHandSimple([...holeCards, ...finalCommunity]);
              const opponentResults = opponentHands.map(hand => evaluateHandSimple([...hand, ...finalCommunity]));
              const maxOpponent = Math.max(...opponentResults.map(r => r.value));

              if (myHand.value > maxOpponent) wins++;
              else if (myHand.value === maxOpponent) ties++;
              else losses++;

              if (i % 2000 === 0 && i > 0) {
                self.postMessage({ type: 'progress', progress: i / simulations });
              }
            }

            self.postMessage({
              type: 'result',
              result: {
                winProbability: wins / simulations,
                tieProbability: ties / simulations,
                lossProbability: losses / simulations,
                simulations
              }
            });
          };
        `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const worker = new Worker(URL.createObjectURL(blob));
        workerRef.current = worker;

        worker.onmessage = (e: MessageEvent) => {
          if (e.data.type === 'progress') {
            setProgress(e.data.progress);
          } else if (e.data.type === 'result') {
            setResult(e.data.result);
            setIsCalculating(false);
            setProgress(1);
            worker.terminate();
          }
        };

        worker.onerror = () => {
          // Fallback to main thread
          fallbackCalculation(holeCards, communityCards, numOpponents);
          worker.terminate();
        };

        worker.postMessage({
          holeCards,
          communityCards,
          numOpponents,
          simulations: 10000
        });
      } catch {
        fallbackCalculation(holeCards, communityCards, numOpponents);
      }
    } else {
      fallbackCalculation(holeCards, communityCards, numOpponents);
    }

    function fallbackCalculation(holeCards: Card[], communityCards: Card[], numOpponents: number) {
      setTimeout(() => {
        try {
          const result = calculateEquity(holeCards, communityCards, numOpponents, 10000);
          setResult(result);
        } catch (err) {
          setError('Errore nel calcolo');
        } finally {
          setIsCalculating(false);
          setProgress(1);
        }
      }, 50);
    }
  }, []);

  return { calculate, result, isCalculating, progress, error };
}
