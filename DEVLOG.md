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
- Deploy su Vercel
