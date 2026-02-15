'use client';

import { Card as CardType, SUIT_SYMBOLS } from '@/lib/poker';

interface CardProps {
  card: CardType;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-10 h-14 text-sm',
  md: 'w-14 h-20 text-lg',
  lg: 'w-20 h-28 text-2xl'
};

export default function Card({ card, size = 'md', selected = false, onClick }: CardProps) {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`
        ${sizeClasses[size]}
        bg-white rounded-lg border-2
        ${selected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'}
        ${onClick ? 'hover:border-blue-400 hover:scale-105 active:scale-95 cursor-pointer' : 'cursor-default'}
        ${isRed ? 'text-red-600' : 'text-gray-900'}
        flex flex-col items-center justify-center
        font-bold shadow-sm
        transition-all duration-150
      `}
    >
      <span>{card.rank}</span>
      <span>{SUIT_SYMBOLS[card.suit]}</span>
    </button>
  );
}
