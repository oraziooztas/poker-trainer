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

**Lezioni apprese:**
- Nessuna specifica

**Prossimi passi:**
- Testare tutte le pagine e componenti
- Aggiungere persistenza score/stats con `lib/storage.ts`
- ~~Deploy su Vercel~~ DONE

---

## 2026-02-16 — Deploy su Vercel

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

**Prossimi passi:**
- Custom domain (opzionale)
- Migliorare UX mobile
- Aggiungere più quiz e scenari
