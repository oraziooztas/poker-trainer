# MAP — Poker Trainer

> App Next.js per allenarsi al poker: quiz, chart preflop, calcolatore equity, lezioni.

## Struttura

```
poker-trainer/
├── app/
│   ├── layout.tsx          # layout globale + navigazione
│   ├── page.tsx            # homepage con overview
│   ├── globals.css         # stili globali Tailwind
│   ├── calculator/page.tsx # calcolatore equity mani
│   ├── learn/page.tsx      # lezioni e teoria poker
│   ├── preflop/page.tsx    # chart preflop interattiva
│   └── quiz/page.tsx       # quiz per testare conoscenze
├── components/
│   ├── Card.tsx            # singola carta da poker
│   ├── CardPicker.tsx      # selettore carte
│   ├── Hand.tsx            # mano di carte
│   ├── MobileNav.tsx       # navigazione mobile
│   ├── Navigation.tsx      # navigazione desktop
│   ├── PreflopChart.tsx    # griglia chart preflop
│   ├── Quiz.tsx            # componente quiz
│   ├── Spinner.tsx         # loading spinner
│   └── Stats.tsx           # statistiche utente
├── lib/
│   ├── equity.worker.ts    # Web Worker per calcolo equity
│   ├── hands.ts            # definizioni mani poker
│   ├── poker.ts            # logica core poker
│   ├── probability.ts      # calcoli probabilità
│   ├── storage.ts          # persistenza locale (localStorage)
│   └── useEquityWorker.ts  # hook React per equity worker
├── public/                 # asset statici (SVG)
├── package.json
└── tsconfig.json
```

## File chiave

| File | Cosa fa |
|------|---------|
| `app/page.tsx` | Homepage con navigazione alle sezioni |
| `lib/poker.ts` | Logica core: valutazione mani, ranking |
| `lib/probability.ts` | Calcoli probabilità e odds |
| `lib/equity.worker.ts` | Web Worker per calcolo equity (non blocca UI) |
| `components/PreflopChart.tsx` | Chart interattiva decisioni preflop |
| `components/Quiz.tsx` | Engine quiz con domande e score |

## Entry Points

| Azione | Comando |
|--------|---------|
| Dev | `npm run dev` |
| Build | `npm run build` |
| Start | `npm run start` |
| Lint | `npm run lint` |

## Convenzioni

- **Linguaggio:** TypeScript
- **Framework:** Next.js 16 (App Router)
- **Stile:** Tailwind CSS 4
- **Database:** nessuno (localStorage via `lib/storage.ts`)
- **Deploy:** Vercel (previsto)
