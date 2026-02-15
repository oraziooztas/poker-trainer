# Poker Trainer

Interactive Texas Hold'em training web application featuring a Monte Carlo equity calculator with Web Worker parallelism, real-time outs detection, pot odds analysis, and adaptive quiz system with progress tracking.

## Features

- **Monte Carlo Equity Calculator** -- Runs configurable simulations (default 10,000) to calculate win/tie/loss probabilities against 1-9 opponents. Offloads computation to a Web Worker to keep the UI responsive, with real-time progress reporting every 1,000 iterations
- **Automatic Outs Detection** -- Analyzes hole cards + community cards to identify flush draws (9 outs), open-ended straight draws (8 outs), gutshot draws (4 outs), double gutshots, overcards (3-6 outs), and combo draws (flush + straight). Handles edge cases including wheel straights (A-2-3-4-5)
- **Pot Odds Calculator** -- Real-time pot odds computation with call/fold suggestions. Compares calculated equity against pot odds and displays the edge percentage to help evaluate call profitability
- **Rule of 2 and 4** -- Instant probability approximation using the standard shortcut: multiply outs by 2 for turn probability, by 4 for flop-to-river probability
- **Expected Value Analysis** -- Computes EV for betting decisions based on win probability, pot size, and risk amount to determine whether a play is +EV or -EV
- **Interactive Quiz System** -- Five quiz categories (Outs, Pot Odds, Equity, Expected Value, Call/Fold decisions) with three difficulty levels. 10-question sessions with visual card rendering, progress tracking, and persistent statistics via localStorage
- **Preflop Hand Chart** -- Color-coded 13x13 matrix showing relative hand strength for all 169 starting hand combinations, with suited/offsuit/pair distinctions and tier classification from Premium to Fold
- **Hand Evaluation Engine** -- Complete 7-card hand evaluator supporting all hand rankings from High Card through Royal Flush, with proper kicker handling and tiebreaker logic
- **Visual Card Picker** -- Interactive card selection interface with suit-grouped display and mutual exclusion between hole cards and community cards

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS v4 |
| Computation | Web Workers (Monte Carlo simulation) |
| Storage | localStorage (quiz statistics) |

## Getting Started

### Prerequisites

- Node.js 20+

### Installation

```bash
git clone https://github.com/yourusername/poker-trainer.git
cd poker-trainer
npm install
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Project Structure

```
poker-trainer/
├── app/
│   ├── layout.tsx                # Root layout with navigation
│   ├── page.tsx                  # Home page with key poker formulas
│   ├── calculator/page.tsx       # Equity calculator + outs detection + pot odds
│   ├── quiz/page.tsx             # Adaptive quiz system (5 types x 3 difficulties)
│   ├── preflop/page.tsx          # 13x13 preflop hand strength chart
│   └── learn/page.tsx            # Hand rankings reference guide
├── components/
│   ├── Card.tsx                  # Single card display with suit symbols and colors
│   ├── CardPicker.tsx            # Interactive card selection grid
│   ├── Hand.tsx                  # Card group display (hole cards, community)
│   ├── PreflopChart.tsx          # 13x13 preflop strength matrix
│   ├── Quiz.tsx                  # Quiz question renderer with answer feedback
│   ├── Stats.tsx                 # Session and cumulative statistics display
│   ├── Navigation.tsx            # Desktop navigation bar
│   ├── MobileNav.tsx             # Mobile navigation
│   └── Spinner.tsx               # Loading indicator for Monte Carlo calculations
├── lib/
│   ├── poker.ts                  # Card types, deck creation, shuffle, parse/serialize
│   ├── hands.ts                  # 7-card hand evaluator (all 10 hand rankings)
│   ├── probability.ts            # Outs counter, pot odds, EV, Monte Carlo equity, Rule of 2/4
│   ├── equity.worker.ts          # Web Worker for non-blocking Monte Carlo simulation
│   ├── useEquityWorker.ts        # React hook wrapping the Web Worker lifecycle
│   └── storage.ts                # localStorage persistence for quiz statistics
├── package.json
└── tsconfig.json
```

## Technical Details

**Hand Evaluation.** The evaluator processes all 7 available cards (2 hole + 5 community) and returns the best 5-card hand with a numeric value for comparison. It handles all standard rankings: Royal Flush, Straight Flush, Four of a Kind, Full House, Flush, Straight (including wheel), Three of a Kind, Two Pair, One Pair, and High Card. Kickers are incorporated into the value for proper tiebreaking.

**Monte Carlo Simulation.** The equity calculator uses Fisher-Yates shuffle for uniform random distribution, evaluates each player's best hand from 7 cards, and aggregates win/tie/loss counts. The Web Worker posts progress updates every 1,000 iterations for a responsive progress bar. A simplified hand evaluator is duplicated inside the worker since Web Workers operate in an isolated JavaScript context.

**Outs Detection.** The outs counter analyzes the current board state to identify draw types. It checks suit counts for flush draws, consecutive value runs for open-ended and gutshot straight draws, double gutshot patterns, and overcard counts. Combo draws (flush + straight overlapping) are detected and capped at 15 to account for shared outs.

**Quiz Generation.** Quiz scenarios are generated procedurally from shuffled decks to ensure variety. Flush draw, OESD, gutshot, and overcard scenarios are constructed by selecting cards matching specific structural constraints, with fallback logic if a scenario cannot be generated from the current shuffle.

## Notes

- This is a client-side application with no backend dependencies. All computation happens in the browser.
- The Monte Carlo simulation defaults to 10,000 iterations, which provides approximately +/- 1% accuracy and completes in under 2 seconds on modern hardware.
- Quiz statistics persist across sessions via localStorage.

## License

MIT
