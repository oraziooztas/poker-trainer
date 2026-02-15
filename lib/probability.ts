import { Card, createDeck, removeCards, RANK_VALUES } from './poker';
import { evaluateHand } from './hands';

export interface OutsResult {
  outs: number;
  probability: number;
  description: string;
}

export interface OddsResult {
  winProbability: number;
  tieProbability: number;
  lossProbability: number;
  simulations: number;
}

// Count outs for common draws
export function countOuts(holeCards: Card[], communityCards: Card[]): OutsResult[] {
  const results: OutsResult[] = [];
  const allCards = [...holeCards, ...communityCards];
  const remainingDeck = removeCards(createDeck(), allCards);
  const remainingCount = remainingDeck.length;

  // Helper: check if card improves hand
  const getCardValues = (cards: Card[]) => cards.map(c => RANK_VALUES[c.rank]);
  const getSuitCounts = (cards: Card[]) => {
    const counts = new Map<string, number>();
    for (const card of cards) {
      counts.set(card.suit, (counts.get(card.suit) || 0) + 1);
    }
    return counts;
  };

  // 1. FLUSH DRAW (4 cards same suit = 9 outs)
  const suitCounts = getSuitCounts(allCards);
  let hasFlushDraw = false;
  for (const [suit, count] of suitCounts) {
    if (count === 4) {
      const flushOuts = remainingDeck.filter(c => c.suit === suit).length;
      results.push({
        outs: flushOuts,
        probability: flushOuts / remainingCount,
        description: `Flush draw (${flushOuts} outs)`
      });
      hasFlushDraw = true;
    }
  }

  // 2. STRAIGHT DRAWS
  const values = [...new Set(getCardValues(allCards))].sort((a, b) => a - b);
  // Add low Ace for wheel straights
  if (values.includes(14)) values.unshift(1);

  let hasStraightDraw = false;

  // Check for OESD (open-ended: 4 consecutive, can complete on both ends)
  for (let i = 0; i <= values.length - 4; i++) {
    const slice = values.slice(i, i + 4);
    // Check if 4 consecutive
    if (slice[1] - slice[0] === 1 && slice[2] - slice[1] === 1 && slice[3] - slice[2] === 1) {
      const low = slice[0];
      const high = slice[3];
      // Open-ended if we can complete on both sides
      if (low > 1 && high < 14) {
        results.push({
          outs: 8,
          probability: 8 / remainingCount,
          description: 'Open-ended straight draw (8 outs)'
        });
        hasStraightDraw = true;
        break;
      }
    }
  }

  // Check for GUTSHOT (4 cards with 1 gap)
  if (!hasStraightDraw) {
    for (let target = 5; target <= 14; target++) {
      const straightCards = target === 5
        ? [1, 2, 3, 4, 5] // Wheel with Ace as 1
        : [target - 4, target - 3, target - 2, target - 1, target];

      const have = straightCards.filter(v => values.includes(v));
      const missing = straightCards.filter(v => !values.includes(v));

      if (have.length === 4 && missing.length === 1) {
        const missingValue = missing[0] === 1 ? 14 : missing[0]; // Convert low Ace back
        const gutshotOuts = remainingDeck.filter(c => RANK_VALUES[c.rank] === missingValue).length;
        if (gutshotOuts > 0) {
          results.push({
            outs: gutshotOuts,
            probability: gutshotOuts / remainingCount,
            description: `Gutshot straight draw (${gutshotOuts} outs)`
          });
          hasStraightDraw = true;
          break;
        }
      }
    }
  }

  // Check for DOUBLE GUTSHOT (e.g., 5-7-8-10 can complete with 6 or 9)
  if (!hasStraightDraw) {
    for (let target = 6; target <= 14; target++) {
      // Check pattern like X-_-X-X-_-X (two gaps, 8 outs)
      const pattern1 = [target - 5, target - 3, target - 2, target]; // missing target-4 and target-1
      const pattern2 = [target - 4, target - 3, target - 1, target]; // missing target-2 (single gutshot covered above)

      const have1 = pattern1.filter(v => v > 0 && values.includes(v));
      if (have1.length === 4) {
        const missing1 = target - 4;
        const missing2 = target - 1;
        const outs1 = remainingDeck.filter(c => RANK_VALUES[c.rank] === missing1).length;
        const outs2 = remainingDeck.filter(c => RANK_VALUES[c.rank] === missing2).length;
        if (outs1 > 0 && outs2 > 0) {
          results.push({
            outs: outs1 + outs2,
            probability: (outs1 + outs2) / remainingCount,
            description: `Double gutshot (${outs1 + outs2} outs)`
          });
          hasStraightDraw = true;
          break;
        }
      }
    }
  }

  // 3. OVERCARDS (hole cards higher than board)
  if (communityCards.length >= 3 && holeCards.length === 2) {
    const boardMax = Math.max(...getCardValues(communityCards));
    const holeValues = getCardValues(holeCards);
    const overcards = holeValues.filter(v => v > boardMax);

    if (overcards.length === 2) {
      // 6 outs (3 for each overcard)
      const overOuts = overcards.length * 3;
      results.push({
        outs: overOuts,
        probability: overOuts / remainingCount,
        description: `Overcards (${overOuts} outs)`
      });
    } else if (overcards.length === 1) {
      results.push({
        outs: 3,
        probability: 3 / remainingCount,
        description: 'One overcard (3 outs)'
      });
    }
  }

  // 4. COMBO DRAW (flush + straight)
  if (hasFlushDraw && hasStraightDraw) {
    // Note: some outs overlap, so we don't just add them
    // Typical combo: 15 outs (9 flush + 8 straight - 2 overlap)
    const comboOuts = results.reduce((sum, r) => sum + r.outs, 0);
    // Replace with combined description
    const flushIdx = results.findIndex(r => r.description.includes('Flush'));
    const straightIdx = results.findIndex(r => r.description.includes('straight'));
    if (flushIdx !== -1 && straightIdx !== -1) {
      // Mark as combo draw
      results.push({
        outs: Math.min(comboOuts, 15), // Cap at 15 for typical combo
        probability: Math.min(comboOuts, 15) / remainingCount,
        description: 'Combo draw (flush + straight)'
      });
    }
  }

  return results;
}

// Calculate pot odds
export function calculatePotOdds(potSize: number, betToCall: number): number {
  return betToCall / (potSize + betToCall);
}

// Determine if call is profitable
export function isCallProfitable(potOdds: number, winProbability: number): boolean {
  return winProbability > potOdds;
}

// Calculate expected value
export function calculateEV(
  winProbability: number,
  potSizeIfWin: number,
  amountToRisk: number
): number {
  const lossProbability = 1 - winProbability;
  return (winProbability * potSizeIfWin) - (lossProbability * amountToRisk);
}

// Monte Carlo simulation for equity
export function calculateEquity(
  holeCards: Card[],
  communityCards: Card[],
  numOpponents: number = 1,
  simulations: number = 10000
): OddsResult {
  const usedCards = [...holeCards, ...communityCards];
  let wins = 0;
  let ties = 0;
  let losses = 0;

  for (let i = 0; i < simulations; i++) {
    const deck = removeCards(createDeck(), usedCards);
    const shuffled = shuffleDeckFast(deck);

    // Deal remaining community cards
    const cardsNeeded = 5 - communityCards.length;
    const finalCommunity = [...communityCards, ...shuffled.slice(0, cardsNeeded)];
    let deckIndex = cardsNeeded;

    // Deal opponent hands
    const opponentHands: Card[][] = [];
    for (let j = 0; j < numOpponents; j++) {
      opponentHands.push([shuffled[deckIndex], shuffled[deckIndex + 1]]);
      deckIndex += 2;
    }

    // Evaluate all hands
    const myHand = evaluateHand([...holeCards, ...finalCommunity]);
    const opponentResults = opponentHands.map(hand =>
      evaluateHand([...hand, ...finalCommunity])
    );

    const maxOpponent = Math.max(...opponentResults.map(r => r.value));

    if (myHand.value > maxOpponent) {
      wins++;
    } else if (myHand.value === maxOpponent) {
      ties++;
    } else {
      losses++;
    }
  }

  return {
    winProbability: wins / simulations,
    tieProbability: ties / simulations,
    lossProbability: losses / simulations,
    simulations
  };
}

// Fast shuffle for Monte Carlo
function shuffleDeckFast(deck: Card[]): Card[] {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Rule of 2 and 4
export function ruleOf2And4(outs: number, toRiver: boolean): number {
  const multiplier = toRiver ? 4 : 2;
  return Math.min(outs * multiplier, 100) / 100;
}
