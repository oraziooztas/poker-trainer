'use client';

import { useState } from 'react';
import { Card as CardType, SUITS, RANKS, SUIT_SYMBOLS, cardsEqual } from '@/lib/poker';
import Card from './Card';

interface CardPickerProps {
  selectedCards: CardType[];
  onSelect: (cards: CardType[]) => void;
  maxCards?: number;
  disabledCards?: CardType[];
}

export default function CardPicker({
  selectedCards,
  onSelect,
  maxCards = 7,
  disabledCards = []
}: CardPickerProps) {
  const toggleCard = (card: CardType) => {
    const isSelected = selectedCards.some(c => cardsEqual(c, card));

    if (isSelected) {
      onSelect(selectedCards.filter(c => !cardsEqual(c, card)));
    } else if (selectedCards.length < maxCards) {
      onSelect([...selectedCards, card]);
    }
  };

  const isDisabled = (card: CardType) => {
    return disabledCards.some(c => cardsEqual(c, card));
  };

  const isSelected = (card: CardType) => {
    return selectedCards.some(c => cardsEqual(c, card));
  };

  return (
    <div className="space-y-2">
      {SUITS.map(suit => (
        <div key={suit} className="flex gap-1 flex-wrap">
          <span className={`w-6 text-xl ${suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-gray-900'}`}>
            {SUIT_SYMBOLS[suit]}
          </span>
          {RANKS.map(rank => {
            const card: CardType = { rank, suit };
            const disabled = isDisabled(card);
            const selected = isSelected(card);

            return (
              <button
                key={`${rank}-${suit}`}
                onClick={() => !disabled && toggleCard(card)}
                disabled={disabled}
                className={`
                  w-10 h-10 md:w-8 md:h-8 text-sm font-medium rounded
                  ${disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : ''}
                  ${selected ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}
                  transition-colors
                `}
              >
                {rank}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
