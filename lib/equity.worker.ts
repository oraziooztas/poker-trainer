// Web Worker for Monte Carlo equity calculation
import { Card, createDeck, removeCards, RANK_VALUES, Rank, Suit } from './poker';

// Re-define necessary functions for worker context (workers don't share modules well)
interface HandResult {
  rank: string;
  value: number;
}

const RANKS_ORDER: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function getRankValue(rank: Rank): number {
  return RANK_VALUES[rank];
}

function shuffleDeckFast(deck: Card[]): Card[] {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Simplified hand evaluation for worker
function evaluateHandSimple(cards: Card[]): HandResult {
  const rankCounts = new Map<number, number>();
  const suitCounts = new Map<Suit, Card[]>();

  for (const card of cards) {
    const rv = getRankValue(card.rank);
    rankCounts.set(rv, (rankCounts.get(rv) || 0) + 1);
    if (!suitCounts.has(card.suit)) suitCounts.set(card.suit, []);
    suitCounts.get(card.suit)!.push(card);
  }

  // Check flush
  let flushCards: Card[] | null = null;
  for (const [, suited] of suitCounts) {
    if (suited.length >= 5) {
      flushCards = suited.sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank)).slice(0, 5);
      break;
    }
  }

  // Check straight
  const uniqueValues = [...new Set(cards.map(c => getRankValue(c.rank)))].sort((a, b) => b - a);
  // Add low ace for wheel
  if (uniqueValues.includes(14)) uniqueValues.push(1);

  let straightHigh = 0;
  for (let i = 0; i <= uniqueValues.length - 5; i++) {
    if (uniqueValues[i] - uniqueValues[i + 4] === 4) {
      straightHigh = uniqueValues[i];
      break;
    }
  }

  // Count ranks
  const counts = [...rankCounts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  const maxCount = counts[0]?.[1] || 0;
  const secondCount = counts[1]?.[1] || 0;

  // Determine hand rank
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

// Worker message handler
self.onmessage = function(e: MessageEvent) {
  const { holeCards, communityCards, numOpponents, simulations } = e.data;

  const usedCards = [...holeCards, ...communityCards];
  let wins = 0;
  let ties = 0;
  let losses = 0;

  for (let i = 0; i < simulations; i++) {
    const deck = removeCards(createDeck(), usedCards);
    const shuffled = shuffleDeckFast(deck);

    const cardsNeeded = 5 - communityCards.length;
    const finalCommunity = [...communityCards, ...shuffled.slice(0, cardsNeeded)];
    let deckIndex = cardsNeeded;

    const opponentHands: Card[][] = [];
    for (let j = 0; j < numOpponents; j++) {
      opponentHands.push([shuffled[deckIndex], shuffled[deckIndex + 1]]);
      deckIndex += 2;
    }

    const myHand = evaluateHandSimple([...holeCards, ...finalCommunity]);
    const opponentResults = opponentHands.map(hand =>
      evaluateHandSimple([...hand, ...finalCommunity])
    );

    const maxOpponent = Math.max(...opponentResults.map(r => r.value));

    if (myHand.value > maxOpponent) {
      wins++;
    } else if (myHand.value === maxOpponent) {
      ties++;
    } else {
      losses++;
    }

    // Send progress every 1000 simulations
    if (i % 1000 === 0 && i > 0) {
      self.postMessage({
        type: 'progress',
        progress: i / simulations
      });
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
