'use client';

import { Card as CardType } from '@/lib/poker';
import Card from './Card';

interface HandProps {
  cards: CardType[];
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Hand({ cards, label, size = 'md' }: HandProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {label && <span className="text-sm text-gray-600 font-medium">{label}</span>}
      <div className="flex gap-1">
        {cards.map((card, i) => (
          <Card key={`${card.rank}-${card.suit}-${i}`} card={card} size={size} />
        ))}
        {cards.length === 0 && (
          <div className={`
            ${size === 'sm' ? 'w-10 h-14' : size === 'md' ? 'w-14 h-20' : 'w-20 h-28'}
            bg-gray-100 rounded-lg border-2 border-dashed border-gray-300
            flex items-center justify-center text-gray-400
          `}>
            ?
          </div>
        )}
      </div>
    </div>
  );
}
