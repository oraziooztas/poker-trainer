import { Card, RANK_VALUES } from './poker';

export type HandRank =
  | 'royal-flush'
  | 'straight-flush'
  | 'four-of-a-kind'
  | 'full-house'
  | 'flush'
  | 'straight'
  | 'three-of-a-kind'
  | 'two-pair'
  | 'one-pair'
  | 'high-card';

export interface HandResult {
  rank: HandRank;
  name: string;
  cards: Card[];  // Best 5 cards
  value: number;  // Numeric value for comparison
}

export const HAND_RANKINGS: Record<HandRank, { name: string; value: number; description: string }> = {
  'royal-flush': { name: 'Royal Flush', value: 10, description: 'A K Q J 10 dello stesso seme' },
  'straight-flush': { name: 'Straight Flush', value: 9, description: '5 carte consecutive dello stesso seme' },
  'four-of-a-kind': { name: 'Four of a Kind', value: 8, description: '4 carte dello stesso valore' },
  'full-house': { name: 'Full House', value: 7, description: 'Tris + coppia' },
  'flush': { name: 'Flush', value: 6, description: '5 carte dello stesso seme' },
  'straight': { name: 'Straight', value: 5, description: '5 carte consecutive' },
  'three-of-a-kind': { name: 'Three of a Kind', value: 4, description: '3 carte dello stesso valore' },
  'two-pair': { name: 'Two Pair', value: 3, description: '2 coppie' },
  'one-pair': { name: 'One Pair', value: 2, description: '1 coppia' },
  'high-card': { name: 'High Card', value: 1, description: 'Carta più alta' }
};

function getRankCounts(cards: Card[]): Map<number, Card[]> {
  const counts = new Map<number, Card[]>();
  for (const card of cards) {
    const value = RANK_VALUES[card.rank];
    if (!counts.has(value)) counts.set(value, []);
    counts.get(value)!.push(card);
  }
  return counts;
}

function getSuitCounts(cards: Card[]): Map<string, Card[]> {
  const counts = new Map<string, Card[]>();
  for (const card of cards) {
    if (!counts.has(card.suit)) counts.set(card.suit, []);
    counts.get(card.suit)!.push(card);
  }
  return counts;
}

function findStraight(cards: Card[]): Card[] | null {
  const uniqueValues = [...new Set(cards.map(c => RANK_VALUES[c.rank]))].sort((a, b) => b - a);

  // Check for wheel (A-2-3-4-5)
  if (uniqueValues.includes(14) && uniqueValues.includes(2) && uniqueValues.includes(3) &&
      uniqueValues.includes(4) && uniqueValues.includes(5)) {
    const wheelCards: Card[] = [];
    for (const v of [14, 5, 4, 3, 2]) {
      const card = cards.find(c => RANK_VALUES[c.rank] === v);
      if (card) wheelCards.push(card);
    }
    if (wheelCards.length === 5) return wheelCards;
  }

  // Check for regular straight
  for (let i = 0; i <= uniqueValues.length - 5; i++) {
    const slice = uniqueValues.slice(i, i + 5);
    if (slice[0] - slice[4] === 4) {
      const straightCards: Card[] = [];
      for (const v of slice) {
        const card = cards.find(c => RANK_VALUES[c.rank] === v);
        if (card) straightCards.push(card);
      }
      if (straightCards.length === 5) return straightCards;
    }
  }

  return null;
}

export function evaluateHand(allCards: Card[]): HandResult {
  if (allCards.length < 5) {
    throw new Error('Need at least 5 cards to evaluate');
  }

  const suitCounts = getSuitCounts(allCards);
  const rankCounts = getRankCounts(allCards);

  // Find flush suit if any
  let flushSuit: string | null = null;
  let flushCards: Card[] = [];
  for (const [suit, cards] of suitCounts) {
    if (cards.length >= 5) {
      flushSuit = suit;
      flushCards = cards.sort((a, b) => RANK_VALUES[b.rank] - RANK_VALUES[a.rank]).slice(0, 5);
      break;
    }
  }

  // Check for straight flush / royal flush
  if (flushSuit) {
    const suitCards = suitCounts.get(flushSuit)!;
    const straightFlush = findStraight(suitCards);
    if (straightFlush) {
      const isRoyal = straightFlush.every(c => RANK_VALUES[c.rank] >= 10);
      return {
        rank: isRoyal ? 'royal-flush' : 'straight-flush',
        name: isRoyal ? 'Royal Flush' : 'Straight Flush',
        cards: straightFlush,
        value: isRoyal ? 1000 : 900 + RANK_VALUES[straightFlush[0].rank]
      };
    }
  }

  // Sort by count then by rank value
  const sortedCounts = [...rankCounts.entries()].sort((a, b) => {
    if (b[1].length !== a[1].length) return b[1].length - a[1].length;
    return b[0] - a[0];
  });

  // Four of a kind
  if (sortedCounts[0][1].length === 4) {
    const fourCards = sortedCounts[0][1];
    const kicker = allCards.filter(c => RANK_VALUES[c.rank] !== sortedCounts[0][0])
      .sort((a, b) => RANK_VALUES[b.rank] - RANK_VALUES[a.rank])[0];
    return {
      rank: 'four-of-a-kind',
      name: 'Four of a Kind',
      cards: [...fourCards, kicker],
      value: 800 + sortedCounts[0][0]
    };
  }

  // Full house
  if (sortedCounts[0][1].length === 3 && sortedCounts.length > 1 && sortedCounts[1][1].length >= 2) {
    return {
      rank: 'full-house',
      name: 'Full House',
      cards: [...sortedCounts[0][1], ...sortedCounts[1][1].slice(0, 2)],
      value: 700 + sortedCounts[0][0] * 15 + sortedCounts[1][0]
    };
  }

  // Flush
  if (flushSuit) {
    return {
      rank: 'flush',
      name: 'Flush',
      cards: flushCards,
      value: 600 + RANK_VALUES[flushCards[0].rank]
    };
  }

  // Straight
  const straight = findStraight(allCards);
  if (straight) {
    return {
      rank: 'straight',
      name: 'Straight',
      cards: straight,
      value: 500 + RANK_VALUES[straight[0].rank]
    };
  }

  // Three of a kind
  if (sortedCounts[0][1].length === 3) {
    const threeCards = sortedCounts[0][1];
    const kickers = allCards.filter(c => RANK_VALUES[c.rank] !== sortedCounts[0][0])
      .sort((a, b) => RANK_VALUES[b.rank] - RANK_VALUES[a.rank]).slice(0, 2);
    return {
      rank: 'three-of-a-kind',
      name: 'Three of a Kind',
      cards: [...threeCards, ...kickers],
      value: 400 + sortedCounts[0][0]
    };
  }

  // Two pair
  if (sortedCounts[0][1].length === 2 && sortedCounts.length > 1 && sortedCounts[1][1].length === 2) {
    const kicker = allCards.filter(c =>
      RANK_VALUES[c.rank] !== sortedCounts[0][0] && RANK_VALUES[c.rank] !== sortedCounts[1][0]
    ).sort((a, b) => RANK_VALUES[b.rank] - RANK_VALUES[a.rank])[0];
    return {
      rank: 'two-pair',
      name: 'Two Pair',
      cards: [...sortedCounts[0][1], ...sortedCounts[1][1], kicker],
      value: 300 + sortedCounts[0][0] * 15 + sortedCounts[1][0]
    };
  }

  // One pair
  if (sortedCounts[0][1].length === 2) {
    const pairCards = sortedCounts[0][1];
    const kickers = allCards.filter(c => RANK_VALUES[c.rank] !== sortedCounts[0][0])
      .sort((a, b) => RANK_VALUES[b.rank] - RANK_VALUES[a.rank]).slice(0, 3);
    return {
      rank: 'one-pair',
      name: 'One Pair',
      cards: [...pairCards, ...kickers],
      value: 200 + sortedCounts[0][0]
    };
  }

  // High card
  const highCards = [...allCards].sort((a, b) => RANK_VALUES[b.rank] - RANK_VALUES[a.rank]).slice(0, 5);
  return {
    rank: 'high-card',
    name: 'High Card',
    cards: highCards,
    value: 100 + RANK_VALUES[highCards[0].rank]
  };
}

export function compareHands(a: HandResult, b: HandResult): number {
  return a.value - b.value;
}
