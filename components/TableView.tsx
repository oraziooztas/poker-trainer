'use client';

// === TABLE VIEW ===
// Pure SVG poker table visualization component.
// Used by: components/ScenarioPlayer.tsx

interface TableViewProps {
  position: string;
  potSize?: number;
  board?: string;
  numPlayers?: number;
  compact?: boolean;
}

// === SEAT LAYOUT ===

const SEAT_POSITIONS_6: { x: number; y: number; label: string }[] = [
  { x: 50, y: 90, label: 'BTN' },
  { x: 88, y: 62, label: 'SB' },
  { x: 88, y: 32, label: 'BB' },
  { x: 50, y: 8, label: 'UTG' },
  { x: 12, y: 32, label: 'MP' },
  { x: 12, y: 62, label: 'CO' },
];

const SEAT_POSITIONS_9: { x: number; y: number; label: string }[] = [
  { x: 50, y: 92, label: 'BTN' },
  { x: 82, y: 82, label: 'SB' },
  { x: 92, y: 55, label: 'BB' },
  { x: 82, y: 18, label: 'UTG' },
  { x: 62, y: 8, label: 'UTG+1' },
  { x: 38, y: 8, label: 'MP' },
  { x: 18, y: 18, label: 'MP2' },
  { x: 8, y: 55, label: 'HJ' },
  { x: 18, y: 82, label: 'CO' },
];

// Alias mapping: allow matching alternate position names
const POSITION_ALIASES: Record<string, string[]> = {
  'BTN': ['BTN', 'BU', 'BUTTON', 'D'],
  'SB': ['SB', 'SMALL BLIND'],
  'BB': ['BB', 'BIG BLIND'],
  'UTG': ['UTG', 'UNDER THE GUN'],
  'UTG+1': ['UTG+1', 'UTG1'],
  'MP': ['MP', 'MIDDLE', 'MP1'],
  'MP2': ['MP2', 'LJ', 'LOJACK'],
  'HJ': ['HJ', 'HIJACK'],
  'CO': ['CO', 'CUTOFF', 'CUT-OFF'],
};

function matchesPosition(seatLabel: string, targetPosition: string): boolean {
  const target = targetPosition.toUpperCase().trim();
  const aliases = POSITION_ALIASES[seatLabel];
  if (aliases) {
    return aliases.includes(target);
  }
  return seatLabel.toUpperCase() === target;
}

// === CARD RENDERING ===

function parseCardString(cardStr: string): { rank: string; suit: string; color: string }[] {
  // Parse strings like "A♠ K♥" or "J♠ T♥ 2♣"
  const cards: { rank: string; suit: string; color: string }[] = [];
  const parts = cardStr.trim().split(/\s+/);
  for (const part of parts) {
    const match = part.match(/^(.+?)([♠♥♦♣])$/);
    if (match) {
      const suit = match[2];
      const isRed = suit === '♥' || suit === '♦';
      cards.push({
        rank: match[1],
        suit,
        color: isRed ? '#dc2626' : '#1f2937',
      });
    }
  }
  return cards;
}

export default function TableView({ position, potSize, board, numPlayers = 6, compact = false }: TableViewProps) {
  const seats = numPlayers === 9 ? SEAT_POSITIONS_9 : SEAT_POSITIONS_6;
  const boardCards = board ? parseCardString(board) : [];

  const viewBox = compact ? '0 0 100 80' : '0 0 100 100';
  const tableRy = compact ? 24 : 30;
  const tableCy = compact ? 40 : 50;

  return (
    <div className="w-full max-w-md mx-auto">
      <svg
        viewBox={viewBox}
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Table felt */}
        <ellipse
          cx="50"
          cy={tableCy}
          rx="40"
          ry={tableRy}
          fill="#166534"
          stroke="#14532d"
          strokeWidth="2"
        />
        {/* Inner rail */}
        <ellipse
          cx="50"
          cy={tableCy}
          rx="37"
          ry={tableRy - 3}
          fill="none"
          stroke="#15803d"
          strokeWidth="0.5"
          opacity="0.6"
        />

        {/* Pot size */}
        {potSize !== undefined && potSize > 0 && (
          <g>
            <rect
              x="38"
              y={tableCy - 6}
              width="24"
              height="10"
              rx="3"
              fill="rgba(0,0,0,0.5)"
            />
            <text
              x="50"
              y={tableCy + 1}
              textAnchor="middle"
              fill="#fbbf24"
              fontSize="4.5"
              fontWeight="bold"
            >
              Pot {potSize}
            </text>
          </g>
        )}

        {/* Board cards */}
        {boardCards.length > 0 && (
          <g>
            {boardCards.map((card, i) => {
              const totalWidth = boardCards.length * 7.5;
              const startX = 50 - totalWidth / 2 + 1;
              const cardX = startX + i * 7.5;
              const cardY = tableCy + (potSize ? 6 : -4);
              return (
                <g key={i}>
                  <rect
                    x={cardX}
                    y={cardY}
                    width="6.5"
                    height="9"
                    rx="1"
                    fill="white"
                    stroke="#d1d5db"
                    strokeWidth="0.3"
                  />
                  <text
                    x={cardX + 3.25}
                    y={cardY + 4}
                    textAnchor="middle"
                    fill={card.color}
                    fontSize="3"
                    fontWeight="bold"
                  >
                    {card.rank}
                  </text>
                  <text
                    x={cardX + 3.25}
                    y={cardY + 7.5}
                    textAnchor="middle"
                    fill={card.color}
                    fontSize="3"
                  >
                    {card.suit}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* Seats */}
        {seats.map((seat, i) => {
          const isPlayer = matchesPosition(seat.label, position);
          return (
            <g key={i}>
              {/* Seat circle */}
              <circle
                cx={seat.x}
                cy={seat.y}
                r={isPlayer ? 5.5 : 4.5}
                fill={isPlayer ? '#2563eb' : '#374151'}
                stroke={isPlayer ? '#1d4ed8' : '#4b5563'}
                strokeWidth={isPlayer ? '1' : '0.5'}
              />
              {/* Position label */}
              <text
                x={seat.x}
                y={seat.y + 1.2}
                textAnchor="middle"
                fill="white"
                fontSize={isPlayer ? '3.2' : '2.8'}
                fontWeight={isPlayer ? 'bold' : 'normal'}
              >
                {seat.label}
              </text>
              {/* "Sei qui" indicator */}
              {isPlayer && (
                <text
                  x={seat.x}
                  y={seat.y + 9}
                  textAnchor="middle"
                  fill="#2563eb"
                  fontSize="2.5"
                  fontWeight="bold"
                >
                  Sei qui
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
