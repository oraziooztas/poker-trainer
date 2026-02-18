# MAP — Poker Trainer

> App Next.js per imparare poker da zero: percorso guidato, scenari interattivi, quiz, calcolatore equity, chart preflop, dashboard progressi.

## Struttura

```
poker-trainer/
├── app/
│   ├── layout.tsx              # layout globale + navigazione
│   ├── page.tsx                # homepage con CTA percorso + griglia feature
│   ├── globals.css             # stili globali Tailwind
│   ├── calculator/page.tsx     # calcolatore equity mani
│   ├── dashboard/page.tsx      # dashboard progressi + grafico + backup
│   ├── learn/page.tsx          # lezioni e teoria poker
│   ├── path/page.tsx           # percorso guidato (28 moduli, 6 fasi)
│   ├── preflop/page.tsx        # chart preflop interattiva
│   ├── quiz/page.tsx           # quiz matematici (5 tipi × 3 difficoltà)
│   └── scenarios/page.tsx      # scenari "what would you do?" (66 scenari)
├── components/
│   ├── Card.tsx                # singola carta da poker
│   ├── CardPicker.tsx          # selettore carte
│   ├── Hand.tsx                # mano di carte
│   ├── LearningPath.tsx        # mappa progressione verticale moduli
│   ├── LessonViewer.tsx        # renderer lezioni + quiz gate
│   ├── MobileNav.tsx           # drawer mobile con sezioni (STUDIA/PRATICA/TRACCIA)
│   ├── Navigation.tsx          # navigazione desktop (8 link)
│   ├── PreflopChart.tsx        # griglia 13×13 chart preflop
│   ├── ProgressChart.tsx       # grafico SVG accuratezza ultimi 30 giorni
│   ├── Quiz.tsx                # componente singola domanda quiz
│   ├── ScenarioPlayer.tsx      # UI interattiva scenario: scelta → reveal → spiegazione
│   ├── Spinner.tsx             # loading spinner
│   ├── Stats.tsx               # statistiche quiz
│   ├── TableView.tsx           # tavolo poker SVG con posizioni e pot
│   └── WeaknessCard.tsx        # identifica aree quiz sotto 70%
├── lib/
│   ├── equity.worker.ts        # Web Worker per calcolo equity Monte Carlo
│   ├── hands.ts                # definizioni e valutazione mani poker
│   ├── learning-path.ts        # 28 moduli in 6 fasi con contenuti e quiz gate
│   ├── poker.ts                # tipi core, deck, carte, utilità
│   ├── probability.ts          # outs, pot odds, EV, regola 2/4
│   ├── scenarios.ts            # 66 scenari hand-crafted (8 categorie)
│   ├── storage.ts              # persistenza localStorage (4 domini separati + export/import)
│   └── useEquityWorker.ts      # hook React per equity worker
├── public/                     # asset statici
├── package.json
└── tsconfig.json
```

## File chiave

| File | Cosa fa |
|------|---------|
| `lib/storage.ts` | 4 domini storage: quiz, progress, scenarios, daily + export/import JSON |
| `lib/learning-path.ts` | 28 moduli didattici (6 fasi: fondamenta → strategia home game) |
| `lib/scenarios.ts` | 66 scenari con opzioni quality-rated (best/acceptable/mistake/disaster) |
| `lib/poker.ts` | Tipi core (Card, Suit, Rank), deck, shuffle |
| `lib/probability.ts` | Calcoli: outs, pot odds, EV, equity Monte Carlo |
| `components/ScenarioPlayer.tsx` | Flow interattivo: situazione → scelta → reveal + spiegazione |
| `components/LessonViewer.tsx` | Renderer blocchi contenuto + quiz gate per sblocco moduli |
| `components/PreflopChart.tsx` | Chart 13×13 con tier di forza mani |

## Flussi principali

| Flusso | Pagine coinvolte |
|--------|-----------------|
| Imparare da zero | `/path` → LearningPath + LessonViewer → quiz gate → modulo successivo |
| Pratica scenari | `/scenarios` → filtri → ScenarioPlayer → risultato → storage |
| Quiz matematici | `/quiz` → tipo + difficoltà → 10 domande → risultato → storage |
| Tracking progressi | `/dashboard` → stat cards + grafico SVG + weakness + backup |

## Entry Points

| Azione | Comando |
|--------|---------|
| Dev | `npm run dev` |
| Build | `npm run build` |
| Start | `npm run start` |
| Lint | `npm run lint` |
| Deploy | `npx vercel --prod` |

## Convenzioni

- **Linguaggio:** TypeScript
- **Framework:** Next.js 16 (App Router)
- **Stile:** Tailwind CSS 4
- **Database:** nessuno — localStorage via `lib/storage.ts` (4 chiavi separate)
- **Dipendenze esterne:** zero (grafici SVG puro, no Chart.js)
- **Deploy:** Vercel — [poker-trainer-rouge.vercel.app](https://poker-trainer-rouge.vercel.app)
- **UI:** italiano (`lang="it"`)
