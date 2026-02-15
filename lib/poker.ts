// Types
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  rank: Rank;
  suit: Suit;
}

// Constants
export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
export const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠'
};

export const RANK_VALUES: Record<Rank, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

// Functions
export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function cardToString(card: Card): string {
  return `${card.rank}${SUIT_SYMBOLS[card.suit]}`;
}

export function parseCard(str: string): Card | null {
  // Parse strings like "As", "Kh", "10d", "2c"
  const match = str.match(/^(10|[2-9]|[JQKA])([shdc])$/i);
  if (!match) return null;

  const rankMap: Record<string, Rank> = {
    '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '10': '10',
    'J': 'J', 'Q': 'Q', 'K': 'K', 'A': 'A'
  };
  const suitMap: Record<string, Suit> = {
    's': 'spades', 'h': 'hearts', 'd': 'diamonds', 'c': 'clubs'
  };

  const rank = rankMap[match[1].toUpperCase()];
  const suit = suitMap[match[2].toLowerCase()];

  if (!rank || !suit) return null;
  return { rank, suit };
}

export function cardsEqual(a: Card, b: Card): boolean {
  return a.rank === b.rank && a.suit === b.suit;
}

export function removeCards(deck: Card[], toRemove: Card[]): Card[] {
  return deck.filter(card => !toRemove.some(r => cardsEqual(card, r)));
}
