# DEVLOG

Log cronologico di decisioni, problemi e lezioni per questo progetto.

---

## 2026-02-10 — Setup struttura app e pagine principali

**Cosa fatto:**
- Modificato `layout.tsx` e `page.tsx` (home) con nuova struttura
- Aggiunte 4 nuove route: `/calculator`, `/learn`, `/preflop`, `/quiz`
- Creati componenti: Card, CardPicker, Hand, Navigation, MobileNav, PreflopChart, Quiz, Spinner, Stats
- Creata libreria utility: equity worker, hands, poker logic, probability, storage

**Decisioni prese:**
- Next.js 16 + Tailwind 4 + App Router come stack
- Logica poker separata in `lib/` (poker.ts, probability.ts, hands.ts)
- Equity calculation via Web Worker (`equity.worker.ts`) per non bloccare UI

**Problemi incontrati:**
- Nessuno in questa sessione

---

## 2026-02-16 — Deploy iniziale su Vercel

**Cosa fatto:**
- Verificato app in locale (`npm run dev` + browser check)
- Build di produzione OK — 8 pagine statiche, zero errori
- Deploy su Vercel: `vercel --prod`
- Collegato repo GitHub `oraziooztas/poker-trainer` per auto-deploy

**URL produzione:** https://poker-trainer-rouge.vercel.app

**Decisioni prese:**
- Deploy statico (no SSR) — tutte le pagine prerendered, nessun backend

**Problemi incontrati:**
- Warning su workspace root (doppio lockfile) — ignorabile, non impatta build

---

## 2026-02-16 — Implementazione completa: percorso, scenari, dashboard, navigazione

**Cosa fatto (4 sprint):**

**Sprint 1 — Storage + Dashboard:**
- Esteso `lib/storage.ts` con 4 domini separati (quiz, progress, scenarios, daily)
- Aggiunto export/import JSON per backup dati utente
- Creato `ProgressChart.tsx` — grafico SVG puro accuratezza ultimi 30 giorni
- Creato `WeaknessCard.tsx` — identifica quiz types sotto 70% accuracy
- Creato `app/dashboard/page.tsx` — 4 stat cards, grafico trend, weakness, backup

**Sprint 2 — Scenario Trainer:**
- Creato `lib/scenarios.ts` con 66 scenari hand-crafted in 8 categorie
- 23 scenari flaggati come "home game" (limped pots, calling stations)
- Creato `TableView.tsx` — tavolo poker SVG con posizioni, pot, board
- Creato `ScenarioPlayer.tsx` — flow interattivo scelta → reveal → spiegazione
- Creato `app/scenarios/page.tsx` — filtri categoria/difficoltà, home game mode

**Sprint 3 — Percorso Guidato:**
- Creato `lib/learning-path.ts` con 28 moduli in 6 fasi
- Ogni modulo ha contenuti (text, formula, esempio, tip, warning) + quiz gate
- Creato `LearningPath.tsx` — mappa verticale con stati locked/unlocked/completed
- Creato `LessonViewer.tsx` — renderer contenuti + quiz gate per sblocco
- Creato `app/path/page.tsx` — sidebar + lesson viewer, progresso persistente

**Sprint 4 — Navigazione + Homepage:**
- Ristrutturato `Navigation.tsx` — 8 link, breakpoint `lg:`
- Ristrutturato `MobileNav.tsx` — drawer con sezioni STUDIA/PRATICA/TRACCIA
- Aggiornato `app/page.tsx` — hero con CTA "Inizia il Percorso", 6 feature cards

**Decisioni prese:**
- Zero nuove dipendenze: grafici SVG puro, no Chart.js/Recharts
- Storage keys separate per dominio (evita corruzione a cascata)
- Client-side only: tutto localStorage, ~80KB totale stimato
- Sprint 2 e 3 eseguiti in parallelo con subagent (indipendenti tra loro)

**Numeri:**
- 15 file toccati (8 creati, 3 modificati + DEVLOG/MAP/README)
- 5870 righe aggiunte
- 66 scenari poker, 28 moduli didattici, 6 fasi di apprendimento
- Build: 11 pagine statiche, 0 errori TypeScript

**Deploy:** `npx vercel --prod` — live su https://poker-trainer-rouge.vercel.app
