// === TYPES ===
// Definizioni moduli del Learning Path — 28 moduli in 6 fasi
// Usato da: app/path/page.tsx, components/LearningPath.tsx, components/LessonViewer.tsx

export type ContentBlockType = 'text' | 'formula' | 'example' | 'tip' | 'warning' | 'cards' | 'interactive';

export interface ContentBlock {
  type: ContentBlockType;
  content: string;
  highlight?: string;
  cards?: string;
  interactiveType?: 'preflop-chart' | 'calculator' | 'quiz';
}

export interface QuizGate {
  question: string;
  options: { label: string; correct: boolean }[];
  explanation: string;
}

export interface LearningModule {
  id: string;
  phase: number;
  title: string;
  description: string;
  icon: string;
  content: ContentBlock[];
  quiz?: QuizGate[];
  requiredModules?: string[];
}

export interface PhaseInfo {
  phase: number;
  title: string;
  description: string;
  icon: string;
}

// === PHASES ===

export const PHASES: PhaseInfo[] = [
  {
    phase: 0,
    title: 'Fondamenta',
    description: 'Le basi assolute del Texas Hold\'em: mani, tavolo, azioni e flusso di gioco.',
    icon: '🧱',
  },
  {
    phase: 1,
    title: 'Starting Hands',
    description: 'Quali mani giocare, da quale posizione, e perché la selezione è fondamentale.',
    icon: '🃏',
  },
  {
    phase: 2,
    title: 'Matematica del Poker',
    description: 'Outs, probabilità, pot odds ed equity — i numeri che guidano ogni decisione.',
    icon: '🔢',
  },
  {
    phase: 3,
    title: 'Post-Flop',
    description: 'Come giocare dopo il flop: texture del board, c-bet, value bet e sizing.',
    icon: '🎯',
  },
  {
    phase: 4,
    title: 'Leggere il Gioco',
    description: 'Riconoscere i tipi di giocatori, i pattern di puntata e i tell.',
    icon: '👁️',
  },
  {
    phase: 5,
    title: 'Mettere Tutto Insieme',
    description: 'Gestione sessione, bankroll, tilt e strategia completa per home game.',
    icon: '🏆',
  },
];

// === MODULES ===

export const MODULES: LearningModule[] = [
  // =============================================
  // PHASE 0 — Fondamenta
  // =============================================
  {
    id: 'hand-rankings',
    phase: 0,
    title: 'Ranking delle Mani',
    description: 'Dalla Royal Flush alla High Card: impara l\'ordine di tutte le combinazioni.',
    icon: '👑',
    content: [
      {
        type: 'text',
        content: 'Nel Texas Hold\'em vince chi forma la migliore combinazione di 5 carte tra le 2 in mano e le 5 sul tavolo. Ci sono 10 combinazioni possibili, dalla più forte alla più debole.',
      },
      {
        type: 'example',
        content: 'Royal Flush — la mano più forte in assoluto. Cinque carte consecutive dallo stesso seme, dal 10 all\'Asso.',
        cards: 'A♠ K♠ Q♠ J♠ T♠',
      },
      {
        type: 'example',
        content: 'Straight Flush — cinque carte consecutive dello stesso seme. Es: 5-6-7-8-9 di cuori.',
        cards: '9♥ 8♥ 7♥ 6♥ 5♥',
      },
      {
        type: 'example',
        content: 'Four of a Kind (Poker) — quattro carte dello stesso valore. Es: quattro Re.',
        cards: 'K♠ K♥ K♦ K♣ A♠',
      },
      {
        type: 'example',
        content: 'Full House — un tris più una coppia. Il tris determina la forza del full.',
        cards: 'Q♠ Q♥ Q♦ 7♣ 7♠',
      },
      {
        type: 'example',
        content: 'Flush (Colore) — cinque carte dello stesso seme, non consecutive. Conta la carta più alta.',
        cards: 'A♦ J♦ 8♦ 5♦ 3♦',
      },
      {
        type: 'example',
        content: 'Straight (Scala) — cinque carte consecutive di semi diversi.',
        cards: 'T♠ 9♥ 8♦ 7♣ 6♠',
      },
      {
        type: 'text',
        content: 'Le combinazioni rimanenti in ordine: Three of a Kind (tris), Two Pair (doppia coppia), One Pair (coppia), High Card (carta alta). Memorizza questo ordine — è la base di tutto.',
      },
      {
        type: 'tip',
        content: 'Un trucco per ricordare: Full batte Flush perché è più raro. Straight batte Three of a Kind. La coppia è la mano fatta più comune.',
        highlight: 'Full > Flush > Straight > Tris',
      },
      {
        type: 'warning',
        content: 'Errore comune: pensare che la scala batta il colore. Il Flush (colore) batte SEMPRE la Straight (scala). Memorizzalo!',
      },
    ],
    quiz: [
      {
        question: 'Quale mano batte un Full House?',
        options: [
          { label: 'Flush (Colore)', correct: false },
          { label: 'Four of a Kind (Poker)', correct: true },
          { label: 'Straight (Scala)', correct: false },
          { label: 'Three of a Kind (Tris)', correct: false },
        ],
        explanation: 'Il Four of a Kind (Poker) batte il Full House. L\'ordine è: Royal Flush > Straight Flush > Four of a Kind > Full House.',
      },
      {
        question: 'Tra Flush e Straight, quale vince?',
        options: [
          { label: 'Straight (Scala)', correct: false },
          { label: 'Flush (Colore)', correct: true },
          { label: 'Sono pari', correct: false },
        ],
        explanation: 'Il Flush batte sempre la Straight. Il Flush è più raro e quindi vale di più.',
      },
      {
        question: 'Hai A♠ A♥ e il board è K♦ K♣ 7♠ 3♥ 2♦. Che mano hai?',
        options: [
          { label: 'Due coppie (AA e KK)', correct: true },
          { label: 'Full House', correct: false },
          { label: 'Coppia di Assi', correct: false },
        ],
        explanation: 'Hai due coppie: AA e KK. Per un Full House servirebbero tre carte dello stesso valore più una coppia.',
      },
    ],
  },
  {
    id: 'table-setup',
    phase: 0,
    title: 'Il Tavolo da Poker',
    description: 'Posizioni al tavolo, blinds e il ruolo del dealer button.',
    icon: '🪑',
    content: [
      {
        type: 'text',
        content: 'Un tavolo di Texas Hold\'em ha tipicamente da 2 a 10 giocatori. Ogni mano, un bottone (dealer button) ruota in senso orario, determinando le posizioni e l\'ordine di gioco.',
      },
      {
        type: 'text',
        content: 'I due giocatori a sinistra del dealer devono mettere le puntate obbligatorie: lo Small Blind (SB) e il Big Blind (BB). Queste puntate creano il piatto iniziale e incentivano l\'azione.',
      },
      {
        type: 'formula',
        content: 'Posizioni al tavolo (in senso orario dal dealer):',
        highlight: 'BTN → SB → BB → UTG → UTG+1 → MP → MP+1 → HJ → CO → BTN',
      },
      {
        type: 'tip',
        content: 'Le posizioni si dividono in tre gruppi: Early (UTG, UTG+1), Middle (MP, HJ) e Late (CO, BTN). Le posizioni late sono le migliori perché agisci per ultimo post-flop.',
        highlight: 'Late position = più informazioni = migliore decisione',
      },
      {
        type: 'example',
        content: 'In un home game 1€/2€: lo Small Blind mette 1€, il Big Blind mette 2€. Il minimo per entrare preflop è 2€ (call) o almeno 4-6€ (raise).',
        cards: 'BTN→SB(1€)→BB(2€)',
      },
      {
        type: 'warning',
        content: 'Non confondere il Dealer con lo Small Blind. Il Dealer (BTN) è una posizione, non un compito. Nei casino, il croupier distribuisce le carte ma non gioca.',
      },
    ],
    quiz: [
      {
        question: 'Chi mette la puntata obbligatoria più grande?',
        options: [
          { label: 'Il Dealer (BTN)', correct: false },
          { label: 'Lo Small Blind', correct: false },
          { label: 'Il Big Blind', correct: true },
        ],
        explanation: 'Il Big Blind mette la puntata obbligatoria più grande, tipicamente il doppio dello Small Blind.',
      },
      {
        question: 'Quale posizione è la migliore al tavolo?',
        options: [
          { label: 'UTG (Under The Gun)', correct: false },
          { label: 'BTN (Dealer/Button)', correct: true },
          { label: 'BB (Big Blind)', correct: false },
        ],
        explanation: 'Il BTN è la posizione migliore: agisci per ultimo in tutti i giri post-flop, avendo il massimo delle informazioni sulle azioni avversarie.',
      },
    ],
  },
  {
    id: 'actions',
    phase: 0,
    title: 'Le Azioni',
    description: 'Check, bet, call, raise, fold e all-in — tutte le mosse possibili.',
    icon: '🎬',
    content: [
      {
        type: 'text',
        content: 'In ogni turno di puntata, ogni giocatore può compiere una delle seguenti azioni. La scelta dipende da cosa hanno fatto i giocatori prima di te.',
      },
      {
        type: 'text',
        content: '🔹 CHECK — passare l\'azione al giocatore successivo senza puntare. Possibile solo se nessuno ha puntato prima di te nel turno corrente.\n\n🔹 BET — fare la prima puntata del turno. Se nessuno ha ancora puntato, puoi scegliere tu l\'importo.\n\n🔹 CALL — pareggiare la puntata di un avversario. Metti la stessa cifra per restare in gioco.\n\n🔹 RAISE — rilanciare sopra la puntata corrente. Il rilancio minimo è pari alla puntata/rilancio precedente.\n\n🔹 FOLD — abbandonare la mano. Perdi tutto ciò che hai già messo nel piatto.\n\n🔹 ALL-IN — puntare tutte le tue fiches rimanenti.',
      },
      {
        type: 'tip',
        content: 'Preflop il Big Blind ha già una puntata obbligatoria. Quindi "call" preflop significa pareggiare il BB, e "raise" significa rilanciare sopra il BB.',
        highlight: 'Preflop: Call = BB | Raise = almeno 2× BB',
      },
      {
        type: 'warning',
        content: 'Attenzione al "string bet": in un home game, se dici "call" e poi "raise" è irregolare. Dichiara sempre la tua azione in modo chiaro, oppure metti le fiches in un unico movimento.',
      },
      {
        type: 'example',
        content: 'Blinds 1/2€. UTG raisa a 6€, MP folda, CO calla 6€, BTN ri-raisa a 18€. Lo Small Blind folda, il Big Blind folda, UTG calla 18€, CO folda. Si va al flop con UTG e BTN.',
      },
    ],
    quiz: [
      {
        question: 'Puoi fare check se qualcuno ha già puntato prima di te?',
        options: [
          { label: 'Sì, sempre', correct: false },
          { label: 'No, devi call, raise o fold', correct: true },
          { label: 'Solo se sei il Big Blind', correct: false },
        ],
        explanation: 'Se qualcuno ha già puntato, le tue opzioni sono call (pareggiare), raise (rilanciare) o fold (abbandonare). Check è possibile solo se nessuno ha puntato.',
      },
      {
        question: 'In un gioco 1/2€, qual è il raise minimo preflop?',
        options: [
          { label: '2€ (1× BB)', correct: false },
          { label: '4€ (2× BB)', correct: true },
          { label: '6€ (3× BB)', correct: false },
        ],
        explanation: 'Il raise minimo è il doppio del Big Blind. In un gioco 1/2€, il raise minimo è 4€.',
      },
    ],
  },
  {
    id: 'game-flow',
    phase: 0,
    title: 'Flusso di Gioco',
    description: 'Le fasi di una mano: preflop, flop, turn, river e showdown.',
    icon: '🔄',
    content: [
      {
        type: 'text',
        content: 'Ogni mano di Texas Hold\'em si gioca in fasi ben definite. In ogni fase vengono scoperte carte comuni e c\'è un turno di puntata.',
      },
      {
        type: 'text',
        content: '1️⃣ PREFLOP — Ogni giocatore riceve 2 carte coperte. Primo turno di puntata, partendo da UTG (il giocatore a sinistra del BB).\n\n2️⃣ FLOP — Vengono scoperte 3 carte comuni sul tavolo. Secondo turno di puntata, partendo da SB (o il primo giocatore attivo a sinistra del dealer).\n\n3️⃣ TURN — Viene scoperta la 4ª carta comune. Terzo turno di puntata.\n\n4️⃣ RIVER — Viene scoperta la 5ª e ultima carta comune. Ultimo turno di puntata.\n\n5️⃣ SHOWDOWN — I giocatori rimasti mostrano le carte. Vince la mano migliore.',
      },
      {
        type: 'example',
        content: 'Hai K♥ Q♥. Il flop è J♥ T♥ 3♠. Hai un draw al flush (cuori) e un draw alla scala (9 per fare la scala). Il turn è il 2♦ — niente. Il river è l\'A♥ — hai fatto flush e scala!',
        cards: 'K♥ Q♥ | J♥ T♥ 3♠ | 2♦ | A♥',
      },
      {
        type: 'tip',
        content: 'Se tutti i giocatori foldano tranne uno, quel giocatore vince il piatto senza showdown. Questo succede spesso — non devi sempre arrivare al river!',
        highlight: 'La maggior parte delle mani finisce prima dello showdown',
      },
      {
        type: 'warning',
        content: 'Ricorda: preflop l\'azione parte da UTG, ma dal flop in poi parte dal primo giocatore attivo a sinistra del dealer. L\'ordine di gioco cambia!',
      },
    ],
    quiz: [
      {
        question: 'Quante carte comuni vengono scoperte al Flop?',
        options: [
          { label: '1', correct: false },
          { label: '2', correct: false },
          { label: '3', correct: true },
          { label: '5', correct: false },
        ],
        explanation: 'Al Flop vengono scoperte 3 carte comuni. Poi 1 al Turn e 1 al River, per un totale di 5.',
      },
      {
        question: 'Chi agisce per primo preflop?',
        options: [
          { label: 'Lo Small Blind', correct: false },
          { label: 'Il Big Blind', correct: false },
          { label: 'UTG (Under The Gun)', correct: true },
        ],
        explanation: 'Preflop, l\'azione parte da UTG (il giocatore a sinistra del BB) e prosegue in senso orario. Dal flop in poi, invece, parte dal SB.',
      },
      {
        question: 'È possibile vincere senza arrivare allo showdown?',
        options: [
          { label: 'No, bisogna sempre mostrare le carte', correct: false },
          { label: 'Sì, se tutti gli altri foldano', correct: true },
          { label: 'Solo se hai la mano migliore', correct: false },
        ],
        explanation: 'Se tutti gli avversari foldano, vinci il piatto senza mostrare le carte. Questo è il principio base del bluff!',
      },
    ],
  },

  // =============================================
  // PHASE 1 — Starting Hands
  // =============================================
  {
    id: 'preflop-chart',
    phase: 1,
    title: 'Chart Preflop',
    description: 'Il sistema a tier per selezionare le mani iniziali.',
    icon: '📊',
    requiredModules: ['hand-rankings', 'table-setup', 'actions', 'game-flow'],
    content: [
      {
        type: 'text',
        content: 'Non tutte le mani iniziali sono uguali. Le chart preflop classificano le 169 combinazioni possibili in tier basati sulla forza. Imparare questi tier è il primo passo per giocare in modo profittevole.',
      },
      {
        type: 'formula',
        content: 'Le 169 mani uniche si dividono in:',
        highlight: '13 coppie + 78 suited + 78 offsuit = 169 combinazioni',
      },
      {
        type: 'text',
        content: '🔴 Tier 1 (Premium) — AA, KK, QQ, AKs. Raise SEMPRE da qualsiasi posizione.\n\n🟠 Tier 2 (Forte) — JJ, TT, AKo, AQs, AJs, KQs. Raise dalla maggior parte delle posizioni.\n\n🟡 Tier 3 (Giocabile) — 99, 88, AQo, AJo, ATs, KJs, QJs, JTs. Giocabili da media e late position.\n\n🟢 Tier 4 (Speculativo) — Coppie medie, connectors suited, broadway offsuit. Solo da late position.\n\n🔵 Tier 5 (Marginale) — Coppie basse, suited aces deboli, connectors. Solo dal BTN/SB in situazioni favorevoli.',
      },
      {
        type: 'interactive',
        content: 'Esplora la chart preflop interattiva per vedere il tier di ogni combinazione.',
        interactiveType: 'preflop-chart',
      },
      {
        type: 'tip',
        content: 'Le mani suited (dello stesso seme) valgono circa 2-3% in più di equity rispetto alle offsuit. Per questo AKs è Tier 1 ma AKo è Tier 2.',
        highlight: 'Suited > Offsuit (2-3% equity in più)',
      },
      {
        type: 'warning',
        content: 'Non innamorarti di mani che "sembrano" belle. K♠ 3♠ è suited ma resta spazzatura. "Suited" non trasforma una mano debole in una forte.',
      },
    ],
    quiz: [
      {
        question: 'Quale di queste mani è Tier 1 (Premium)?',
        options: [
          { label: 'JJ', correct: false },
          { label: 'AKs', correct: true },
          { label: 'AKo', correct: false },
          { label: 'TT', correct: false },
        ],
        explanation: 'AKs (Ace-King suited) è Tier 1 insieme ad AA, KK e QQ. AKo (offsuit) è Tier 2 perché le carte suited hanno ~3% equity in più.',
      },
      {
        question: 'Quante combinazioni uniche di mani iniziali esistono?',
        options: [
          { label: '52', correct: false },
          { label: '169', correct: true },
          { label: '1326', correct: false },
        ],
        explanation: '169 combinazioni uniche (13 coppie + 78 suited + 78 offsuit). Le 1326 sono le combinazioni specifiche (considerando i semi).',
      },
    ],
  },
  {
    id: 'position-basics',
    phase: 1,
    title: 'La Posizione',
    description: 'Perché la posizione è il fattore più importante nelle starting hands.',
    icon: '📍',
    requiredModules: ['table-setup', 'preflop-chart'],
    content: [
      {
        type: 'text',
        content: 'La posizione al tavolo determina quante mani puoi giocare profittevolmente. Più sei in late position, più mani puoi giocare perché hai più informazioni.',
      },
      {
        type: 'formula',
        content: 'Range approssimativo per posizione (tavolo da 9):',
        highlight: 'UTG: ~10% | MP: ~15% | CO: ~25% | BTN: ~35% | SB: ~25%',
      },
      {
        type: 'text',
        content: 'Perché la posizione conta così tanto? Tre motivi:\n\n1. Informazione — Vedi cosa fanno gli altri prima di decidere\n2. Controllo del piatto — Puoi controllare la grandezza del pot\n3. Bluff — È più facile bluffare quando agisci per ultimo',
      },
      {
        type: 'example',
        content: 'Hai J♠ T♠ in UTG (primo a parlare). Potresti trovarti raise e re-raise dietro di te. Folda. La stessa mano dal BTN con tutti che foldano? Raise!',
        cards: 'J♠ T♠',
      },
      {
        type: 'tip',
        content: 'Per un principiante: gioca solo Tier 1-2 da early, aggiungi Tier 3 da middle, e Tier 3-4 da late. Imparerai ad allargare il range col tempo.',
        highlight: 'Early = tight | Middle = medio | Late = largo',
      },
      {
        type: 'warning',
        content: 'Lo Small Blind è la posizione PEGGIORE post-flop nonostante sia vicino al BTN. Agisci per primo in tutti i turni dal flop in poi. Non allargare troppo il range dal SB.',
      },
    ],
    quiz: [
      {
        question: 'Da quale posizione dovresti giocare più mani?',
        options: [
          { label: 'UTG', correct: false },
          { label: 'BB (Big Blind)', correct: false },
          { label: 'BTN (Button)', correct: true },
        ],
        explanation: 'Il BTN è la posizione migliore: agisci per ultimo post-flop e hai il massimo delle informazioni. Puoi giocare circa il 35% delle mani dal BTN.',
      },
      {
        question: 'Perché giocare più tight da UTG?',
        options: [
          { label: 'Perché ci sono ancora molti giocatori che possono avere mani forti', correct: true },
          { label: 'Perché le carte sono peggiori da UTG', correct: false },
          { label: 'Non serve giocare tight da UTG', correct: false },
        ],
        explanation: 'Da UTG ci sono 8+ giocatori ancora da agire. La probabilità che qualcuno abbia una mano forte è alta, e sarai fuori posizione post-flop.',
      },
    ],
  },
  {
    id: 'tight-play',
    phase: 1,
    title: 'Giocare Tight',
    description: 'Perché giocare meno mani è la strategia vincente per i principianti.',
    icon: '🔒',
    requiredModules: ['preflop-chart', 'position-basics'],
    content: [
      {
        type: 'text',
        content: 'Il concetto più importante per un principiante: giocare meno mani = vincere di più. Sembra controintuitivo, ma la matematica è chiara.',
      },
      {
        type: 'formula',
        content: 'Percentuale di mani da giocare per un principiante:',
        highlight: '15-20% delle mani totali (circa 25-35 combinazioni su 169)',
      },
      {
        type: 'text',
        content: 'Perché tight è meglio?\n\n1. Entri nei piatti con mani mediamente più forti\n2. Le decisioni post-flop sono più semplici\n3. La tua immagine al tavolo ti dà credibilità (i raise vengono rispettati)\n4. Perdi meno soldi quando le mani non vanno',
      },
      {
        type: 'example',
        content: 'In un home game da 6 giocatori, giochi 2 ore (circa 60 mani). Se giochi il 15% delle mani, entri in circa 9 piatti. Se giochi il 40% entri in 24 piatti — molti dei quali con mani deboli che ti costano soldi.',
      },
      {
        type: 'tip',
        content: 'Usa la "regola del primo livello": se non riesci a spiegare in 3 secondi perché stai giocando quella mano, probabilmente dovresti foldare.',
        highlight: 'Non sai perché giochi? Folda.',
      },
      {
        type: 'warning',
        content: 'Tight NON significa passivo. Gioca poche mani ma giocale con aggressività. Tight-aggressive (TAG) è lo stile più profittevole nei giochi con principianti.',
      },
    ],
    quiz: [
      {
        question: 'Che percentuale di mani dovrebbe giocare un principiante?',
        options: [
          { label: '5-10%', correct: false },
          { label: '15-20%', correct: true },
          { label: '30-40%', correct: false },
          { label: '50%+', correct: false },
        ],
        explanation: 'Un principiante dovrebbe giocare circa il 15-20% delle mani, concentrandosi sulle mani dei Tier 1-3 dalle posizioni giuste.',
      },
      {
        question: 'Cosa significa lo stile "TAG"?',
        options: [
          { label: 'Tight-Aggressive: poche mani, giocate con forza', correct: true },
          { label: 'Tight-And-Good: giocare solo mani buone', correct: false },
          { label: 'Total-Aggressive-Game: puntare sempre', correct: false },
        ],
        explanation: 'TAG = Tight-Aggressive. Giochi poche mani selezionate (tight) ma le giochi con raise e bet, non con call passivi (aggressive).',
      },
    ],
  },
  {
    id: 'raise-vs-call',
    phase: 1,
    title: 'Raise vs Call',
    description: 'Perché raisare è quasi sempre meglio di chiamare.',
    icon: '⬆️',
    requiredModules: ['actions', 'preflop-chart'],
    content: [
      {
        type: 'text',
        content: 'Una delle lezioni più importanti nel poker: quando entri in un piatto, preferisci SEMPRE raisare rispetto a chiamare (limping). Raisare ti dà due modi per vincere.',
      },
      {
        type: 'formula',
        content: 'I due modi per vincere con un raise:',
        highlight: '1. Tutti foldano → vinci il piatto\n2. Vai al flop con il vantaggio di essere l\'aggressore',
      },
      {
        type: 'text',
        content: 'Quando fai solo call (limp), puoi vincere SOLO mostrando la mano migliore. Quando raisi, puoi vincere anche se gli avversari foldano — e questo succede spesso.',
      },
      {
        type: 'example',
        content: 'Hai A♥ Q♥. Limpi (call 2€) e 4 giocatori vedono il flop. Il flop è K♣ 8♦ 3♠ — hai mancato. Difficile vincere contro 4 avversari. Se avessi raisato a 6€ preflop, probabilmente 2-3 avversari avrebbero foldato.',
        cards: 'A♥ Q♥ | K♣ 8♦ 3♠',
      },
      {
        type: 'formula',
        content: 'Sizing standard per il raise preflop:',
        highlight: '3× BB + 1 BB per ogni limper prima di te',
      },
      {
        type: 'tip',
        content: 'L\'open-raise standard in un home game è 3× il Big Blind (es: 6€ in un gioco 1/2€). Se qualcuno ha già limpato, aggiungi 1 BB per ogni limper.',
        highlight: '1/2€ → raise a 6€ (3×BB) | Con 2 limper → raise a 8€',
      },
      {
        type: 'warning',
        content: 'Il "limp" (solo call del BB preflop) è quasi sempre un errore. Dà agli avversari prezzi economici per vedere il flop e non mette pressione su nessuno.',
      },
    ],
    quiz: [
      {
        question: 'In un gioco 1/2€ senza limper, a quanto dovresti raisare standard?',
        options: [
          { label: '4€ (2× BB)', correct: false },
          { label: '6€ (3× BB)', correct: true },
          { label: '10€ (5× BB)', correct: false },
        ],
        explanation: 'L\'open-raise standard è 3× BB. In un gioco 1/2€, il raise è 6€. Aggiungi 1 BB (2€) per ogni limper.',
      },
      {
        question: 'Perché raisare è meglio di limpare?',
        options: [
          { label: 'Perché metti più soldi nel piatto', correct: false },
          { label: 'Perché puoi vincere senza showdown e ridurre il numero di avversari', correct: true },
          { label: 'Perché intimidisci gli avversari', correct: false },
        ],
        explanation: 'Raisare dà fold equity (puoi vincere se gli altri foldano) e riduce il numero di avversari, rendendo più facile vincere con la tua mano.',
      },
    ],
  },
  {
    id: 'preflop-mistakes',
    phase: 1,
    title: 'Errori Preflop Comuni',
    description: 'I 5 errori preflop più frequenti nei principianti.',
    icon: '❌',
    requiredModules: ['preflop-chart', 'position-basics', 'raise-vs-call'],
    content: [
      {
        type: 'text',
        content: 'Il preflop è dove si perdono più soldi nel lungo periodo — non per singole mani grosse, ma per piccole decisioni sbagliate ripetute centinaia di volte.',
      },
      {
        type: 'warning',
        content: 'Errore #1: GIOCARE TROPPE MANI. Il nemico numero uno. Se giochi più del 25% delle mani in un tavolo pieno, stai perdendo soldi. Ogni mano "in più" che giochi costa EV nel lungo termine.',
      },
      {
        type: 'warning',
        content: 'Errore #2: LIMPING. Entrare con un semplice call del BB è quasi sempre sbagliato. O la mano merita un raise, o merita un fold. Il limp è la via di mezzo che non funziona.',
      },
      {
        type: 'warning',
        content: 'Errore #3: IGNORARE LA POSIZIONE. Giocare J♠ T♦ da UTG come lo giocheresti dal BTN è un errore costoso. La stessa mano cambia valore radicalmente in base alla posizione.',
      },
      {
        type: 'warning',
        content: 'Errore #4: OVERVALUTARE MANI SUITED. K♠ 4♠ non diventa giocabile solo perché è suited. Il valore aggiuntivo dello suited è circa 2-3%, non abbastanza per trasformare spazzatura in oro.',
      },
      {
        type: 'warning',
        content: 'Errore #5: NON FOLDARE AI RE-RAISE. Se raisi con A♠ T♦ e qualcuno ri-raisa, devi quasi sempre foldare. Il range di re-raise è molto stretto e la tua mano è dominata.',
      },
      {
        type: 'tip',
        content: 'Regola pratica: se non ti senti sicuro di come giocare post-flop con una mano, non giocarla preflop. La complessità post-flop amplifica gli errori.',
        highlight: 'Dubbio preflop = fold',
      },
    ],
    quiz: [
      {
        question: 'Qual è l\'errore preflop più costoso nel lungo termine?',
        options: [
          { label: 'Non bluffare abbastanza', correct: false },
          { label: 'Giocare troppe mani', correct: true },
          { label: 'Raisare troppo', correct: false },
        ],
        explanation: 'Giocare troppe mani è l\'errore più costoso perché si ripete in ogni sessione e ogni mano debole giocata costa EV.',
      },
      {
        question: 'Hai K♦ 5♦ da UTG. Cosa dovresti fare?',
        options: [
          { label: 'Limpare perché è suited', correct: false },
          { label: 'Raisare perché hai un Re', correct: false },
          { label: 'Foldare senza pensarci', correct: true },
        ],
        explanation: 'K5s è una mano debole, soprattutto da UTG. Il fatto che sia suited aggiunge poco valore. Fold immediato.',
      },
      {
        question: 'Quando è accettabile limpare preflop?',
        options: [
          { label: 'Quando hai una mano media', correct: false },
          { label: 'Quasi mai — meglio raise o fold', correct: true },
          { label: 'Quando vuoi vedere il flop economico', correct: false },
        ],
        explanation: 'Il limp è quasi sempre un errore. L\'unica eccezione rara è dal SB con una mano marginale quando nessuno ha raisato, ma anche in quel caso un raise è spesso meglio.',
      },
    ],
  },

  // =============================================
  // PHASE 2 — Matematica del Poker
  // =============================================
  {
    id: 'outs-basics',
    phase: 2,
    title: 'Contare gli Outs',
    description: 'Come calcolare le carte che migliorano la tua mano.',
    icon: '🔢',
    requiredModules: ['hand-rankings', 'game-flow'],
    content: [
      {
        type: 'text',
        content: 'Gli "outs" sono le carte rimaste nel mazzo che completano la tua mano (draw) e ti fanno probabilmente vincere. Contarli è la base della matematica del poker.',
      },
      {
        type: 'formula',
        content: 'Outs comuni da memorizzare:',
        highlight: 'Flush draw: 9 outs\nOpen-ended straight draw (OESD): 8 outs\nGutshot straight draw: 4 outs\nOvercards (2): 6 outs\nSet (coppia → tris): 2 outs',
      },
      {
        type: 'example',
        content: 'Hai A♥ 8♥ e il board è K♥ 5♥ 2♠. Hai un flush draw a cuori — ti servono 9 cuori rimanenti per completare (13 cuori totali - 4 già visibili = 9 outs).',
        cards: 'A♥ 8♥ | K♥ 5♥ 2♠',
      },
      {
        type: 'example',
        content: 'Hai J♦ T♦ e il board è Q♠ 9♣ 3♥. Hai un OESD: un 8 o un K completano la tua scala. 4 otto + 4 re = 8 outs.',
        cards: 'J♦ T♦ | Q♠ 9♣ 3♥',
      },
      {
        type: 'tip',
        content: 'I draw combo (flush draw + straight draw) sono molto forti! Con un flush draw + OESD hai fino a 15 outs e sei spesso favorito anche contro una coppia top.',
        highlight: 'Flush draw + OESD = fino a 15 outs (favorito vs top pair!)',
      },
      {
        type: 'warning',
        content: 'Attenzione ai "dirty outs" — carte che completano la tua mano ma danno all\'avversario una mano migliore. Se il board è Q♥ J♥ 3♣ e hai T♠ 9♠, il K♥ completa la tua scala ma anche un possibile flush per l\'avversario.',
      },
    ],
    quiz: [
      {
        question: 'Quanti outs ha un flush draw?',
        options: [
          { label: '4', correct: false },
          { label: '8', correct: false },
          { label: '9', correct: true },
          { label: '13', correct: false },
        ],
        explanation: 'Un flush draw ha 9 outs. Ci sono 13 carte di ogni seme nel mazzo. Con 4 carte dello stesso seme (2 in mano + 2 sul board), restano 9.',
      },
      {
        question: 'Hai 6♣ 5♣ su un board Q♠ 7♦ 4♥. Che draw hai e quanti outs?',
        options: [
          { label: 'OESD — 8 outs', correct: true },
          { label: 'Gutshot — 4 outs', correct: false },
          { label: 'Flush draw — 9 outs', correct: false },
        ],
        explanation: 'Hai 4-5-6-7, serve un 3 o un 8 per la scala. È un OESD (open-ended straight draw) con 8 outs.',
      },
      {
        question: 'Un gutshot straight draw ha quanti outs?',
        options: [
          { label: '2', correct: false },
          { label: '4', correct: true },
          { label: '6', correct: false },
          { label: '8', correct: false },
        ],
        explanation: 'Un gutshot (scala interna, es: serve solo un valore specifico nel mezzo) ha 4 outs.',
      },
    ],
  },
  {
    id: 'rule-of-2-4',
    phase: 2,
    title: 'Regola del 2 e del 4',
    description: 'Il metodo rapido per stimare le probabilità al tavolo.',
    icon: '⚡',
    requiredModules: ['outs-basics'],
    content: [
      {
        type: 'text',
        content: 'Non puoi usare una calcolatrice al tavolo, ma esiste un metodo semplice per stimare velocemente la probabilità di completare il tuo draw: la Regola del 2 e del 4.',
      },
      {
        type: 'formula',
        content: 'La regola:',
        highlight: 'Outs × 4 = % dal flop al river (2 carte da venire)\nOuts × 2 = % dal turn al river (1 carta da venire)',
      },
      {
        type: 'example',
        content: 'Flush draw (9 outs):\n→ Al flop: 9 × 4 = 36% (reale: 35%)\n→ Al turn: 9 × 2 = 18% (reale: 19.6%)\n\nOESD (8 outs):\n→ Al flop: 8 × 4 = 32% (reale: 31.5%)\n→ Al turn: 8 × 2 = 16% (reale: 17.4%)',
      },
      {
        type: 'formula',
        content: 'Tabella rapida delle probabilità:',
        highlight: '2 outs → 8% / 4%\n4 outs → 16% / 8%\n6 outs → 24% / 12%\n8 outs → 32% / 16%\n9 outs → 36% / 18%\n12 outs → 48% / 24%\n15 outs → 60% / 30%',
      },
      {
        type: 'interactive',
        content: 'Prova il calcolatore di equity per verificare le tue stime mentali.',
        interactiveType: 'calculator',
      },
      {
        type: 'tip',
        content: 'La regola è leggermente ottimistica per molti outs al flop. Per 12+ outs, usa la formula corretta: 1 - (non-outs/mazzo)². Ma per il tavolo, la regola del 2 e 4 è più che sufficiente.',
        highlight: 'Imprecisione massima: ~2% (trascurabile al tavolo)',
      },
    ],
    quiz: [
      {
        question: 'Hai un flush draw al flop. Qual è la probabilità approssimata di chiuderlo entro il river?',
        options: [
          { label: '18%', correct: false },
          { label: '27%', correct: false },
          { label: '36%', correct: true },
          { label: '45%', correct: false },
        ],
        explanation: 'Flush draw = 9 outs. Al flop (2 carte da venire): 9 × 4 = 36%.',
      },
      {
        question: 'Hai un gutshot al turn. Qual è la probabilità di chiuderlo al river?',
        options: [
          { label: '4%', correct: false },
          { label: '8%', correct: true },
          { label: '16%', correct: false },
        ],
        explanation: 'Gutshot = 4 outs. Al turn (1 carta): 4 × 2 = 8%.',
      },
    ],
  },
  {
    id: 'pot-odds',
    phase: 2,
    title: 'Pot Odds',
    description: 'Come calcolare il prezzo offerto dal piatto per la tua decisione.',
    icon: '💰',
    requiredModules: ['outs-basics', 'rule-of-2-4'],
    content: [
      {
        type: 'text',
        content: 'Le Pot Odds sono il rapporto tra la puntata che devi chiamare e il piatto totale (inclusa la puntata). Ti dicono il "prezzo" che stai pagando per continuare a giocare.',
      },
      {
        type: 'formula',
        content: 'Formula delle Pot Odds:',
        highlight: 'Pot Odds % = Bet da chiamare / (Pot + Bet da chiamare) × 100',
      },
      {
        type: 'example',
        content: 'Il pot è 20€ e l\'avversario punta 10€. Il pot totale ora è 30€ e devi chiamare 10€.\nPot Odds = 10 / (30 + 10) = 10/40 = 25%\nDevi avere almeno il 25% di probabilità di vincere per callare profittevolmente.',
      },
      {
        type: 'example',
        content: 'Il pot è 50€ e l\'avversario punta 50€ (pot-size bet). Pot Odds = 50 / (100 + 50) = 50/150 = 33%\nServe il 33% per callare. Un flush draw (36%) rende il call profittevole!',
      },
      {
        type: 'formula',
        content: 'Pot Odds comuni da memorizzare:',
        highlight: '1/4 pot bet → 17% needed\n1/3 pot bet → 20% needed\n1/2 pot bet → 25% needed\n2/3 pot bet → 29% needed\nPot-size bet → 33% needed\n2× pot bet → 40% needed',
      },
      {
        type: 'tip',
        content: 'Più piccola è la puntata rispetto al pot, migliore è il "prezzo" che ricevi. Una bet di 1/3 del pot richiede solo il 20% di equity per callare.',
        highlight: 'Bet piccola = prezzo buono | Bet grande = prezzo caro',
      },
    ],
    quiz: [
      {
        question: 'Il pot è 30€ e l\'avversario punta 10€. Quali sono le pot odds?',
        options: [
          { label: '20%', correct: false },
          { label: '25%', correct: true },
          { label: '33%', correct: false },
        ],
        explanation: 'Pot Odds = 10 / (30 + 10) = 10/40 = 25%. Devi avere almeno il 25% di probabilità di vincere.',
      },
      {
        question: 'L\'avversario punta il pot (pot-size bet). Di quanta equity hai bisogno per callare?',
        options: [
          { label: '25%', correct: false },
          { label: '33%', correct: true },
          { label: '50%', correct: false },
        ],
        explanation: 'Con una pot-size bet, le pot odds sono sempre 33%. Se il pot è X e la bet è X: X/(X+X+X) = X/3X = 33%.',
      },
    ],
  },
  {
    id: 'equity-basics',
    phase: 2,
    title: 'Equity',
    description: 'Capire la tua percentuale di vittoria contro le mani avversarie.',
    icon: '📊',
    requiredModules: ['outs-basics'],
    content: [
      {
        type: 'text',
        content: 'L\'equity è la tua percentuale di vittoria contro la mano (o il range) dell\'avversario in un dato momento. Se hai il 60% di equity, vincerai mediamente 6 volte su 10.',
      },
      {
        type: 'formula',
        content: 'Matchup classici preflop (equity approssimata):',
        highlight: 'Coppia vs coppia più bassa: ~80% vs 20%\nCoppia vs 2 overcards: ~55% vs 45%\nOverpair vs underpair: ~80% vs 20%\nAKs vs QQ: ~46% vs 54%\nAKo vs 22: ~48% vs 52%',
      },
      {
        type: 'example',
        content: 'A♠ A♥ vs K♣ K♦ preflop: gli Assi hanno ~82% di equity. Sembra "sicuro", ma il 18% significa che perderai quasi 1 volta su 5 — ed è normale.',
        cards: 'A♠ A♥ vs K♣ K♦',
      },
      {
        type: 'text',
        content: 'L\'equity cambia drasticamente con il board. AA vs 7♠ 6♠ preflop: AA ha ~77%. Ma se il flop è 8♠ 5♠ 4♣, improvvisamente 76s ha un OESD + flush draw e ha ~55% di equity!',
      },
      {
        type: 'interactive',
        content: 'Usa il calcolatore di equity per confrontare mani specifiche.',
        interactiveType: 'calculator',
      },
      {
        type: 'tip',
        content: 'Non confondere equity con EV. L\'equity ti dice quanto spesso vinci, ma l\'EV (valore atteso) considera anche quanto vinci o perdi. Puoi avere 60% equity ma un call negativo se il sizing è sfavorevole.',
        highlight: 'Equity = quanto spesso vinci | EV = quanto guadagni',
      },
    ],
    quiz: [
      {
        question: 'AA vs KK preflop: qual è l\'equity approssimata di AA?',
        options: [
          { label: '65%', correct: false },
          { label: '75%', correct: false },
          { label: '82%', correct: true },
          { label: '95%', correct: false },
        ],
        explanation: 'AA vs KK ha circa l\'82% di equity per gli Assi. È un grande vantaggio ma non una certezza.',
      },
      {
        question: 'Una coppia contro due overcards (es: 88 vs AK): chi è favorito?',
        options: [
          { label: 'AK è molto favorito (~70%)', correct: false },
          { label: 'È quasi un coin flip, la coppia è leggermente favorita (~55%)', correct: true },
          { label: 'La coppia domina (~80%)', correct: false },
        ],
        explanation: 'È il famoso "coin flip" del poker. La coppia è leggermente favorita ~55% vs 45%, ma è vicino al 50/50.',
      },
    ],
  },
  {
    id: 'call-fold-decisions',
    phase: 2,
    title: 'Call o Fold?',
    description: 'Come confrontare equity e pot odds per prendere la decisione giusta.',
    icon: '⚖️',
    requiredModules: ['pot-odds', 'equity-basics'],
    content: [
      {
        type: 'text',
        content: 'Ora che sai calcolare pot odds e equity, puoi combinare i due concetti per la decisione più importante del poker: call o fold?',
      },
      {
        type: 'formula',
        content: 'La regola decisionale:',
        highlight: 'Se Equity > Pot Odds → CALL (profittevole)\nSe Equity < Pot Odds → FOLD (perdi soldi)\nSe Equity ≈ Pot Odds → borderline (altri fattori)',
      },
      {
        type: 'example',
        content: 'Hai un flush draw (36% equity al flop). L\'avversario punta metà pot (pot odds = 25%). 36% > 25% → CALL profittevole! Nel lungo termine guadagni.',
      },
      {
        type: 'example',
        content: 'Hai un gutshot (8% equity al turn). L\'avversario punta il pot (pot odds = 33%). 8% < 33% → FOLD. Stai pagando troppo per le probabilità che hai.',
      },
      {
        type: 'text',
        content: 'Caso pratico completo:\nHai J♥ T♥ su un board di A♥ 7♥ 2♣ 4♠ (turn).\nDraw: flush draw → 9 outs → 9 × 2 = 18% equity\nPot: 40€. Avversario punta 20€.\nPot Odds: 20/(60+20) = 25%.\n18% < 25% → FOLD.',
      },
      {
        type: 'tip',
        content: 'Quando l\'equity è vicina alle pot odds, considera le "implied odds": soldi extra che vincerai se colpisci il draw. Con implied odds buone, puoi callare anche quando l\'equity è leggermente sotto le pot odds.',
        highlight: 'Implied odds = soldi futuri se completi il draw',
      },
      {
        type: 'warning',
        content: 'Non usare le implied odds come scusa per call sbagliati. Le implied odds funzionano solo se l\'avversario pagherà una grossa bet al river quando colpisci. Contro avversari tight, le implied odds sono basse.',
      },
    ],
    quiz: [
      {
        question: 'Hai un flush draw al flop (36%). L\'avversario punta il pot (33%). Cosa fai?',
        options: [
          { label: 'Fold — è troppo rischioso', correct: false },
          { label: 'Call — l\'equity supera le pot odds', correct: true },
          { label: 'Non si può decidere senza altre info', correct: false },
        ],
        explanation: '36% equity > 33% pot odds → call profittevole. Nel lungo termine questa decisione ti fa guadagnare soldi.',
      },
      {
        question: 'Hai un gutshot al turn (8%). L\'avversario punta metà pot (25%). Cosa fai?',
        options: [
          { label: 'Call — le implied odds compensano', correct: false },
          { label: 'Fold — 8% è molto meno del 25%', correct: true },
          { label: 'Raise per bluffare', correct: false },
        ],
        explanation: '8% << 25%. Il gap è troppo grande anche per le implied odds. Fold chiaro.',
      },
      {
        question: 'Cosa sono le "implied odds"?',
        options: [
          { label: 'Le odds calcolate con la regola del 2 e 4', correct: false },
          { label: 'I soldi extra che prevedi di vincere se completi il draw', correct: true },
          { label: 'Le odds che tiene in conto il bluff', correct: false },
        ],
        explanation: 'Le implied odds sono i soldi aggiuntivi che l\'avversario metterà nel pot nelle street future se tu completi il tuo draw.',
      },
    ],
  },

  // =============================================
  // PHASE 3 — Post-Flop
  // =============================================
  {
    id: 'board-texture',
    phase: 3,
    title: 'Board Texture',
    description: 'Leggere il board: texture dry vs wet e come influenzano la strategia.',
    icon: '🎨',
    requiredModules: ['hand-rankings', 'game-flow', 'outs-basics'],
    content: [
      {
        type: 'text',
        content: 'La "texture" del board descrive quanto il flop/turn/river può aver collegato le mani degli avversari. Esistono due estremi: board dry (asciutti) e board wet (bagnati).',
      },
      {
        type: 'example',
        content: 'Board DRY — poche connessioni possibili, pochi draw. Es: K♠ 7♦ 2♣. Semi diversi, carte scollegate. Poche mani collegano con questo board.',
        cards: 'K♠ 7♦ 2♣',
      },
      {
        type: 'example',
        content: 'Board WET — molte connessioni, molti draw possibili. Es: J♥ T♥ 9♣. Scala possibile, flush draw, molte carte che collegano.',
        cards: 'J♥ T♥ 9♣',
      },
      {
        type: 'text',
        content: 'Come adattare la strategia:\n\n🔸 Board dry: puoi puntare più piccolo (l\'avversario ha meno mani che collegano, meno draw). La tua mano è relativamente sicura.\n\n🔸 Board wet: devi puntare più grande per far pagare i draw, oppure procedere con cautela se non hai una mano forte.',
      },
      {
        type: 'formula',
        content: 'Classificazione rapida:',
        highlight: 'DRY = carte sparse, semi diversi (es: K-7-2 rainbow)\nWET = carte connesse, stesso seme (es: J-T-9 con 2 cuori)\nMEDIO = via di mezzo (es: Q-8-3 con 2 picche)',
      },
      {
        type: 'tip',
        content: 'Su board dry, il c-bet funziona molto bene perché l\'avversario folda spesso (ha mancato il board). Su board wet, sii più selettivo con le c-bet.',
        highlight: 'Dry = c-bet spesso | Wet = c-bet selettivo',
      },
    ],
    quiz: [
      {
        question: 'Quale board è il più "dry"?',
        options: [
          { label: 'J♥ T♥ 8♣', correct: false },
          { label: 'A♠ 7♦ 2♣', correct: true },
          { label: 'Q♠ J♠ 9♦', correct: false },
        ],
        explanation: 'A♠ 7♦ 2♣ è il board più dry: semi diversi (rainbow), carte molto separate, pochi draw possibili.',
      },
      {
        question: 'Su un board wet, cosa dovresti fare con una mano forte?',
        options: [
          { label: 'Puntare grosso per proteggere la mano dai draw', correct: true },
          { label: 'Fare check per intrappolare l\'avversario', correct: false },
          { label: 'Puntare piccolo per tenerlo nel piatto', correct: false },
        ],
        explanation: 'Su board wet ci sono molti draw. Puntare grosso nega le pot odds corrette ai draw e protegge la tua mano.',
      },
    ],
  },
  {
    id: 'continuation-bet',
    phase: 3,
    title: 'Continuation Bet',
    description: 'Quando e perché puntare al flop come aggressore preflop.',
    icon: '🎯',
    requiredModules: ['board-texture', 'raise-vs-call'],
    content: [
      {
        type: 'text',
        content: 'La Continuation Bet (c-bet) è una puntata al flop fatta dal giocatore che ha raisato preflop. L\'idea: hai mostrato forza preflop, continui a mostrare forza al flop, indipendentemente da cosa è uscito.',
      },
      {
        type: 'formula',
        content: 'Sizing standard per la c-bet:',
        highlight: 'Board dry: 25-33% del pot\nBoard medio: 50% del pot\nBoard wet: 66-75% del pot',
      },
      {
        type: 'text',
        content: 'Quando fare c-bet:\n✅ Board dry (K-7-2, A-8-3) — quasi sempre\n✅ Hai colpito il board (top pair, overpair)\n✅ Un solo avversario (heads-up)\n✅ Hai overcards + backdoor draw\n\nQuando NON fare c-bet:\n❌ Board wet che non ti collega affatto\n❌ Più di 2 avversari\n❌ L\'avversario è un calling station noto',
      },
      {
        type: 'example',
        content: 'Hai raisato preflop con A♠ K♦, un avversario ha callato. Flop: J♣ 7♠ 3♦ (dry). Fai c-bet di 1/3 pot. L\'avversario con 9♠ 8♠ folderà, e tu vinci senza avere nulla.',
        cards: 'A♠ K♦ | J♣ 7♠ 3♦',
      },
      {
        type: 'tip',
        content: 'La c-bet funziona perché l\'avversario manca il flop circa il 66% delle volte. Se fai c-bet di 1/3 pot, l\'avversario deve difendere ~70% delle volte per renderla non profittevole — e la maggior parte non lo fa.',
        highlight: 'Il flop è mancato il 66% delle volte',
      },
      {
        type: 'warning',
        content: 'Non fare c-bet automaticamente in OGNI piatto. I giocatori esperti riconoscono chi fa c-bet il 100% delle volte e inizieranno a check-raisare. Sii selettivo.',
      },
    ],
    quiz: [
      {
        question: 'Quanto spesso l\'avversario manca il flop (approssimativamente)?',
        options: [
          { label: '33%', correct: false },
          { label: '50%', correct: false },
          { label: '66%', correct: true },
        ],
        explanation: 'Un giocatore manca il flop circa il 66% delle volte (non fa coppia né draw). Per questo la c-bet è così efficace.',
      },
      {
        question: 'Su un board dry (K♠ 7♦ 2♣), quale sizing di c-bet è appropriato?',
        options: [
          { label: '25-33% del pot', correct: true },
          { label: '75-100% del pot', correct: false },
          { label: 'Non fare c-bet su board dry', correct: false },
        ],
        explanation: 'Su board dry una c-bet piccola (25-33%) è sufficiente. L\'avversario ha poche mani che collegano, quindi una bet piccola ottiene lo stesso risultato di una grossa.',
      },
    ],
  },
  {
    id: 'value-betting',
    phase: 3,
    title: 'Value Bet',
    description: 'Come estrarre il massimo valore quando hai la mano migliore.',
    icon: '💎',
    requiredModules: ['continuation-bet', 'pot-odds'],
    content: [
      {
        type: 'text',
        content: 'Una value bet è una puntata fatta con l\'obiettivo di essere chiamata da una mano peggiore. È il modo principale per guadagnare al poker. Il principio: se credi di avere la mano migliore, punta.',
      },
      {
        type: 'text',
        content: 'La domanda chiave prima di ogni bet: "Cosa mi chiama che è peggio di me?"\n\nSe riesci a identificare almeno 3-4 combinazioni che ti chiamano con mani peggiori, è una value bet. Se nessuna mano peggiore ti chiamerebbe, è un bluff (o una bet inutile).',
      },
      {
        type: 'example',
        content: 'Hai A♠ K♦ su un board A♥ 8♣ 3♦ 5♠ 2♣. Top pair top kicker. Punti al river. Cosa ti chiama peggio? AQ, AJ, AT, A9... tante mani! Value bet chiara.',
        cards: 'A♠ K♦ | A♥ 8♣ 3♦ 5♠ 2♣',
      },
      {
        type: 'formula',
        content: 'Sizing delle value bet:',
        highlight: 'Avversario debole (calling station): bet grande (66-100% pot)\nAvversario medio: bet media (50-66% pot)\nAvversario tight: bet piccola (33-50% pot) per ottenere il call',
      },
      {
        type: 'tip',
        content: 'Nei home game, la maggior parte dei giocatori chiama troppo. Contro i calling station, fai value bet grosse con mani forti. Dimentica i bluff elaborati — punta per valore!',
        highlight: 'Contro chi chiama troppo → value bet grossa, zero bluff',
      },
      {
        type: 'warning',
        content: 'Non confondere "ho una mano decente" con "ho una mano da value bet". Una coppia bassa su un board coordinato non è una value bet — poche mani peggiori ti chiamano.',
      },
    ],
    quiz: [
      {
        question: 'Cos\'è una value bet?',
        options: [
          { label: 'Una puntata fatta per far foldare l\'avversario', correct: false },
          { label: 'Una puntata fatta per essere chiamata da mani peggiori', correct: true },
          { label: 'Una puntata piccola per controllare il piatto', correct: false },
        ],
        explanation: 'Una value bet è una puntata mirata a ottenere call da mani peggiori. Vuoi che l\'avversario chiami, non che foldi.',
      },
      {
        question: 'Contro un calling station, come dovresti dimensionare le value bet?',
        options: [
          { label: 'Piccole, per non spaventarlo', correct: false },
          { label: 'Grandi, perché chiamerà comunque', correct: true },
          { label: 'Non fare bet, usa il check-raise', correct: false },
        ],
        explanation: 'I calling station chiamano con troppo. Approfitta di questo facendo bet grandi con le mani forti — otterrai call che non dovresti ottenere.',
      },
    ],
  },
  {
    id: 'bet-sizing-basics',
    phase: 3,
    title: 'Bet Sizing',
    description: 'Quanto puntare: la guida al dimensionamento delle puntate.',
    icon: '📏',
    requiredModules: ['value-betting', 'board-texture'],
    content: [
      {
        type: 'text',
        content: 'Il sizing (dimensionamento) della puntata è uno degli aspetti più sottovalutati del poker. Non basta decidere SE puntare, bisogna decidere QUANTO.',
      },
      {
        type: 'formula',
        content: 'Range standard di sizing:',
        highlight: '25-33% pot → bet piccola (dry board, thin value)\n50-66% pot → bet standard (default per la maggior parte delle situazioni)\n75-100% pot → bet grossa (wet board, protezione, polarizzazione)\n100%+ pot → overbet (mani monster, bluff grossi)',
      },
      {
        type: 'text',
        content: 'Principi del sizing:\n\n1. Usa lo STESSO sizing per value bet e bluff (non dare informazioni)\n2. Bet grossa = range polarizzato (mani molto forti o bluff)\n3. Bet piccola = range ampio (molte mani medie)\n4. Considera cosa vuoi che l\'avversario faccia: call? fold?',
      },
      {
        type: 'example',
        content: 'Pot: 30€. Board: A♠ K♣ 7♦ 2♣ (dry-medium).\n→ Con AQ (value): bet 15-20€ (50-66%)\n→ Con QJ (bluff): bet 15-20€ (stesso sizing!)\nL\'avversario non può distinguere la bet di valore dal bluff.',
      },
      {
        type: 'tip',
        content: 'Errore comune nel home game: puntare sempre la stessa cifra fissa (es: 5€ sempre). Il sizing deve essere proporzionale al pot, non un numero fisso.',
        highlight: 'Punta in % del pot, non in cifre fisse',
      },
      {
        type: 'warning',
        content: 'Mai fare min-bet (il minimo possibile) con mani forti — "telegraf" la tua mano. E mai fare overbet con mani medie — paghi troppo quando sei battuto.',
      },
    ],
    quiz: [
      {
        question: 'Qual è il sizing standard per una c-bet su un board medio?',
        options: [
          { label: '10-20% del pot', correct: false },
          { label: '50-66% del pot', correct: true },
          { label: '100%+ del pot', correct: false },
        ],
        explanation: 'Il sizing standard è 50-66% del pot per la maggior parte delle situazioni. È sufficiente per proteggere e estrarre valore.',
      },
      {
        question: 'Perché è importante usare lo stesso sizing per value bet e bluff?',
        options: [
          { label: 'Per risparmiare fiches', correct: false },
          { label: 'Per non dare informazioni sulla forza della mano', correct: true },
          { label: 'Non è importante, cambia in base alla mano', correct: false },
        ],
        explanation: 'Se punti sempre 50% del pot sia con mani forti sia con bluff, l\'avversario non può dedurre la tua mano dal sizing.',
      },
    ],
  },
  {
    id: 'playing-draws',
    phase: 3,
    title: 'Giocare i Draw',
    description: 'Semi-bluff, pot odds e come massimizzare il valore dei tuoi draw.',
    icon: '🎰',
    requiredModules: ['outs-basics', 'pot-odds', 'board-texture'],
    content: [
      {
        type: 'text',
        content: 'Un draw (progetto) è una mano incompleta che può diventare forte con le carte giuste. La chiave per giocare i draw: non limitarti a callare e sperare — usa il semi-bluff!',
      },
      {
        type: 'text',
        content: 'Il semi-bluff è un raise o una bet con un draw. Hai due modi per vincere:\n1. L\'avversario folda → vinci subito\n2. L\'avversario chiama → puoi ancora completare il draw\n\nÈ lo stesso principio del "raise vs call" applicato post-flop.',
      },
      {
        type: 'example',
        content: 'Hai A♥ J♥ su Q♥ 8♥ 3♣. Flush draw con nut flush. L\'avversario fa c-bet. Invece di solo callare, puoi check-raisare! Se folda, vinci. Se chiama, hai 9 outs per il flush più forte possibile.',
        cards: 'A♥ J♥ | Q♥ 8♥ 3♣',
      },
      {
        type: 'formula',
        content: 'Quando semi-bluffare vs callare:',
        highlight: 'Semi-bluff se: draw forte (9+ outs) + avversario può foldare\nCall se: draw debole (4-5 outs) o avversario non folda\nFold se: pot odds sfavorevoli e niente implied odds',
      },
      {
        type: 'tip',
        content: 'I draw combo (flush draw + coppia, o flush + straight draw) sono mani da semi-bluff aggressive. Con 12-15 outs sei spesso favorito anche contro una mano fatta — non aver paura di mettere soldi nel pot.',
        highlight: '12+ outs = spesso favorito anche vs mano fatta',
      },
      {
        type: 'warning',
        content: 'Mai semi-bluffare al river! Al river il draw non può più completarsi. Un bluff al river è un bluff puro, non un semi-bluff. Valutalo separatamente.',
      },
    ],
    quiz: [
      {
        question: 'Cos\'è un semi-bluff?',
        options: [
          { label: 'Un bluff con una mano che non può migliorare', correct: false },
          { label: 'Una puntata con un draw che può ancora completarsi', correct: true },
          { label: 'Una puntata piccola per vedere la carta successiva', correct: false },
        ],
        explanation: 'Il semi-bluff è una bet/raise con un draw. Puoi vincere se l\'avversario folda O se completi il draw.',
      },
      {
        question: 'Quando NON dovresti semi-bluffare?',
        options: [
          { label: 'Al flop con un flush draw', correct: false },
          { label: 'Al river quando hai mancato il draw', correct: true },
          { label: 'Al turn con un OESD', correct: false },
        ],
        explanation: 'Al river il draw non può più completarsi. Un "bluff" al river è un bluff puro, non un semi-bluff.',
      },
    ],
  },

  // =============================================
  // PHASE 4 — Leggere il Gioco
  // =============================================
  {
    id: 'player-types',
    phase: 4,
    title: 'Tipi di Giocatori',
    description: 'Riconoscere calling station, nit, maniac e TAG per adattare il tuo gioco.',
    icon: '🎭',
    requiredModules: ['tight-play', 'value-betting'],
    content: [
      {
        type: 'text',
        content: 'Ogni giocatore ha uno stile. Riconoscerlo ti permette di adattare la tua strategia e sfruttare i loro punti deboli. Ci sono 4 archetipi principali.',
      },
      {
        type: 'text',
        content: '🐟 CALLING STATION (Loose-Passive)\nGioca troppe mani, chiama troppo, raramente raisa. Non bluffa quasi mai.\n→ Strategia: zero bluff, value bet grosse con mani forti, non provare a farlo foldare.\n\n🐢 NIT (Tight-Passive)\nGioca pochissime mani, solo premium. Quando punta, ha sempre il nuts.\n→ Strategia: rubagliela i piatti con c-bet. Quando raisa, folda tutto tranne mani monster.\n\n🔥 MANIAC (Loose-Aggressive)\nGioca tutto, raisa sempre, bluffa troppo. Imprevedibile.\n→ Strategia: allarga il range di call, lascia che si impicchi. Non provare a out-bluffarlo.\n\n🦈 TAG (Tight-Aggressive)\nGioca poche mani ma le gioca forte. Stile profittevole.\n→ Strategia: il più difficile da battere. Rispetta i suoi raise, cerca spot per bluffare in posizione.',
      },
      {
        type: 'formula',
        content: 'Matrice degli stili:',
        highlight: 'Loose + Passive = Calling Station (exploit: value bet)\nTight + Passive = Nit (exploit: ruba piatti)\nLoose + Aggressive = Maniac (exploit: chiama di più)\nTight + Aggressive = TAG (exploit: bluff selettivo in posizione)',
      },
      {
        type: 'tip',
        content: 'In un home game tipico, la maggioranza dei giocatori sono calling station. La strategia ottimale è semplice: gioca tight, value betta grosse, non bluffare.',
        highlight: 'Home game = calling station → value bet, no bluff',
      },
      {
        type: 'warning',
        content: 'Non incasellare un giocatore dopo 2 mani. Servono almeno 20-30 mani per iniziare a capire lo stile. E ricorda: i giocatori possono cambiare stile durante la sessione (tilt, alcol, stanchezza).',
      },
    ],
    quiz: [
      {
        question: 'Contro un calling station, qual è la strategia migliore?',
        options: [
          { label: 'Bluffare spesso perché non se ne accorge', correct: false },
          { label: 'Value bet grosse con mani forti, zero bluff', correct: true },
          { label: 'Giocare passivo e aspettare mani monster', correct: false },
        ],
        explanation: 'Il calling station chiama troppo, quindi i bluff non funzionano. Approfitta di questo facendo value bet grosse — ti pagherà con mani peggiori.',
      },
      {
        question: 'Un giocatore Tight-Passive (nit) raisa al turn. Cosa fai con coppia top?',
        options: [
          { label: 'Call — potrebbe bluffare', correct: false },
          { label: 'Fold — probabilmente ha una mano monster', correct: true },
          { label: 'Re-raise per testare la sua mano', correct: false },
        ],
        explanation: 'Un nit raisa raramente e solo con mani fortissime. Se raisa al turn, ha quasi certamente set, two pair o meglio. Coppia top non basta.',
      },
    ],
  },
  {
    id: 'betting-patterns',
    phase: 4,
    title: 'Pattern di Puntata',
    description: 'Cosa rivelano le puntate dell\'avversario sulla sua mano.',
    icon: '📈',
    requiredModules: ['player-types', 'bet-sizing-basics'],
    content: [
      {
        type: 'text',
        content: 'Ogni azione dell\'avversario racconta una storia. Le dimensioni delle puntate, la velocità e la sequenza di azioni forniscono informazioni preziose.',
      },
      {
        type: 'text',
        content: 'Pattern comuni da osservare:\n\n🔹 Min-raise (rilancio minimo): spesso indica una mano forte che vuole tenerti nel piatto, o un giocatore insicuro.\n\n🔹 Overbet (puntata più grande del pot): tipicamente polarizzata — mano fortissima o bluff. Raramente una mano media.\n\n🔹 Bet-bet-check: l\'avversario punta flop e turn, poi checka al river. Spesso ha un draw mancato o una mano media che ha perso fiducia.\n\n🔹 Check-raise: azione molto forte. Generalmente indica una mano fatta forte o un semi-bluff con un big draw.',
      },
      {
        type: 'example',
        content: 'L\'avversario raisa preflop, fa c-bet al flop, fa c-bet al turn, poi fa un\'overbet al river. Questa è la "linea del valore" — probabilmente ha una mano molto forte e vuole massimizzare il piatto.',
      },
      {
        type: 'formula',
        content: 'Timing tells (velocità di decisione):',
        highlight: 'Azione istantanea = decisione facile (mano molto forte o molto debole)\nPausa lunga poi bet = spesso bluff (sta decidendo se bluffare)\nPausa lunga poi check = mano media (sta decidendo se puntare per valore)\nPausa lunga poi raise = mano molto forte (sta pensando a quanto rilanciare)',
      },
      {
        type: 'tip',
        content: 'In un home game dal vivo, presta attenzione alla "storia" che le puntate raccontano. Se non ha senso (es: check flop, check turn, overbet river su un board che non cambia), probabilmente è un bluff.',
        highlight: 'Se la storia non ha senso → spesso bluff',
      },
      {
        type: 'warning',
        content: 'Questi pattern sono tendenze generali, non regole assolute. Un giocatore esperto userà i pattern contro di te. Usa queste letture come un fattore tra tanti, non come unico criterio.',
      },
    ],
    quiz: [
      {
        question: 'L\'avversario fa bet-bet-check (punta flop e turn, checka river). Cosa suggerisce?',
        options: [
          { label: 'Ha una mano molto forte', correct: false },
          { label: 'Ha probabilmente un draw mancato o una mano media', correct: true },
          { label: 'Sta preparando un check-raise', correct: false },
        ],
        explanation: 'Bet-bet-check spesso indica che l\'avversario ha perso fiducia nella sua mano. Potrebbe avere un draw mancato o una mano media che non vuole value bettare al river.',
      },
      {
        question: 'Cosa suggerisce un check-raise al flop?',
        options: [
          { label: 'Una mano debole', correct: false },
          { label: 'Una mano molto forte o un semi-bluff con un draw forte', correct: true },
          { label: 'L\'avversario ha mancato il flop', correct: false },
        ],
        explanation: 'Il check-raise è un\'azione molto forte. Di solito indica set, two pair, o un draw combo (flush draw + straight draw) usato come semi-bluff.',
      },
    ],
  },
  {
    id: 'basic-tells',
    phase: 4,
    title: 'Tell Fisici Base',
    description: 'Segnali fisici inconsci che rivelano la forza della mano.',
    icon: '👀',
    requiredModules: ['player-types'],
    content: [
      {
        type: 'text',
        content: 'I "tell" sono segnali involontari che i giocatori danno attraverso il linguaggio del corpo, la voce o il comportamento. Nei home game dal vivo, sono una fonte preziosa di informazioni.',
      },
      {
        type: 'text',
        content: 'Il principio fondamentale dei tell (Mike Caro): "I giocatori deboli AGISCONO. Chi sembra forte è debole, chi sembra debole è forte."\n\n→ Chi sbatte le fiches con forza spesso sta bluffando (vuole sembrare forte)\n→ Chi mette le fiches piano e tranquillo spesso ha una mano forte (finge disinteresse)',
      },
      {
        type: 'text',
        content: 'Tell comuni nel home game:\n\n🔹 Mani tremanti → quasi sempre mano forte (adrenalina)\n🔹 Sguardo al piatto dopo le carte → mano forte (valuta quanto può vincere)\n🔹 Copre la bocca → spesso bluff (inconsciamente nasconde la "bugia")\n🔹 Parlantina aumentata → generalmente rilassato, mano forte\n🔹 Silenzio improvviso → spesso concentrato su un bluff',
      },
      {
        type: 'tip',
        content: 'Il tell più affidabile nei home game: guarda cosa fa il giocatore PRIMA che sia il suo turno. Se guarda le fiches quando vede il flop, probabilmente ha colpito e sta pianificando la puntata.',
        highlight: 'Occhiata alle fiches dopo il flop = ha colpito',
      },
      {
        type: 'warning',
        content: 'Non basare MAI una decisione importante solo sui tell fisici. I tell sono un\'informazione aggiuntiva, non sostitutiva. La matematica e i pattern di puntata sono sempre più affidabili.',
      },
      {
        type: 'text',
        content: 'Consiglio pratico: concentrati su UN tell alla volta. Osserva come un giocatore specifico si comporta quando vince (mostra le carte) e quando perde. Dopo qualche sessione, avrai una baseline per quel giocatore.',
      },
    ],
    quiz: [
      {
        question: 'Un giocatore ha le mani che tremano quando punta. Cosa suggerisce di solito?',
        options: [
          { label: 'È nervoso perché sta bluffando', correct: false },
          { label: 'Ha una mano molto forte (adrenalina)', correct: true },
          { label: 'Non ha esperienza', correct: false },
        ],
        explanation: 'Le mani tremanti sono quasi sempre un segno di adrenalina per una mano forte, non di nervosismo per un bluff. È uno dei tell più affidabili.',
      },
      {
        question: 'Qual è il principio base di Mike Caro sui tell?',
        options: [
          { label: 'Chi parla tanto sta bluffando', correct: false },
          { label: 'Chi sembra forte è debole, chi sembra debole è forte', correct: true },
          { label: 'I tell non sono affidabili', correct: false },
        ],
        explanation: 'I giocatori inconsciamente RECITANO. Chi vuole sembrare forte (gesti aggressivi, sguardo fisso) spesso è debole, e viceversa.',
      },
    ],
  },
  {
    id: 'multi-way-pots',
    phase: 4,
    title: 'Piatti Multi-Way',
    description: 'Come adattare il gioco quando ci sono 3 o più giocatori nel piatto.',
    icon: '👥',
    requiredModules: ['board-texture', 'value-betting'],
    content: [
      {
        type: 'text',
        content: 'Un piatto multi-way (3+ giocatori) è fondamentalmente diverso da un piatto heads-up. Le strategie cambiano drasticamente.',
      },
      {
        type: 'formula',
        content: 'Regola chiave multi-way:',
        highlight: 'Più giocatori = serve una mano più forte per vincere\nBluff → quasi inutile (qualcuno chiamerà)\nDraw → più valore (pot più grosso)\nMani medie → meno valore (qualcuno ha meglio)',
      },
      {
        type: 'text',
        content: 'Adattamenti principali:\n\n1. TIGHTEN UP: gioca solo mani forti. La coppia top potrebbe non bastare.\n2. NO BLUFF: con 3+ giocatori, la probabilità che tutti foldino è bassissima.\n3. VALUE BET PIÙ GRANDE: il pot è più grosso, le mani che pagano sono di più.\n4. DRAW PIÙ PROFITTEVOLI: i pot multi-way offrono pot odds migliori per i draw.',
      },
      {
        type: 'example',
        content: 'Hai A♠ Q♠ in un piatto a 4 giocatori. Flop: A♣ 8♦ 5♣. Hai top pair, buon kicker. In un heads-up punteresti con sicurezza. In un piatto a 4? Punti ma sii pronto a foldare a un raise — qualcuno potrebbe avere AK, set, o two pair.',
        cards: 'A♠ Q♠ | A♣ 8♦ 5♣',
      },
      {
        type: 'tip',
        content: 'I piatti multi-way favoriscono le mani "nutted" (le più forti possibili) e i draw grossi. Le mani marginali perdono molto valore. Gioca fit-or-fold.',
        highlight: 'Multi-way = fit-or-fold (colpisci forte o abbandona)',
      },
    ],
    quiz: [
      {
        question: 'In un piatto a 4 giocatori, dovresti bluffare?',
        options: [
          { label: 'Sì, la pressione funziona di più', correct: false },
          { label: 'Quasi mai — qualcuno chiamerà quasi sempre', correct: true },
          { label: 'Solo con mani medie', correct: false },
        ],
        explanation: 'In un pot multi-way, la probabilità che tutti foldino è bassissima. Con 3 avversari, anche se ognuno folda il 60%, la probabilità che tutti foldino è solo 0.6³ = 21.6%.',
      },
      {
        question: 'I draw in un piatto multi-way sono:',
        options: [
          { label: 'Meno profittevoli — troppa concorrenza', correct: false },
          { label: 'Più profittevoli — pot più grossi e pot odds migliori', correct: true },
          { label: 'Ugualmente profittevoli', correct: false },
        ],
        explanation: 'I pot multi-way sono più grandi, quindi le pot odds per i draw sono migliori. Un flush draw che non varrebbe un call in un pot heads-up può essere molto profittevole multi-way.',
      },
    ],
  },
  {
    id: 'home-game-reads',
    phase: 4,
    title: 'Leggere gli Amici',
    description: 'Come tracciare le tendenze dei giocatori abituali del tuo home game.',
    icon: '📝',
    requiredModules: ['player-types', 'betting-patterns', 'basic-tells'],
    content: [
      {
        type: 'text',
        content: 'Il vantaggio più grande nel tuo home game: giochi contro le STESSE persone ogni volta. Puoi costruire un profilo dettagliato di ogni giocatore sessione dopo sessione.',
      },
      {
        type: 'text',
        content: 'Cosa annotare (mentalmente o su note):\n\n📋 Preflop: quante mani gioca? Raisa o limpa? Da che posizioni allarga?\n📋 Post-flop: fa c-bet spesso? Check-raisa? Scommette al river?\n📋 Showdown: con che mani mostra? Il range corrisponde alle aspettative?\n📋 Emotivo: come reagisce alle bad beat? Gioca diversamente da davanti/dietro?',
      },
      {
        type: 'example',
        content: 'Profilo esempio — "Marco":\n→ Tipo: Calling station (chiama troppo, raramente raisa)\n→ Preflop: gioca 40% delle mani, mai fold ai raise piccoli\n→ Post-flop: chiama 2 street con qualsiasi coppia, folda al river solo se ha aria\n→ Exploit: value bet 3 street con top pair o meglio, mai bluffare',
      },
      {
        type: 'tip',
        content: 'Dopo ogni sessione, pensa ai 2-3 piatti più importanti. Cosa hai imparato su ogni avversario? Questo "debriefing" mentale è più prezioso di qualsiasi studio teorico.',
        highlight: 'Debrief post-sessione = l\'arma segreta del home game',
      },
      {
        type: 'warning',
        content: 'Non assumere che gli amici giochino sempre allo stesso modo. L\'alcol, il tilt, il fatto di essere avanti o dietro possono cambiare drasticamente il loro stile. Aggiorna le letture in tempo reale.',
      },
      {
        type: 'text',
        content: 'Ricorda: nel home game l\'aspetto sociale è importante. Puoi raccogliere informazioni attraverso la conversazione — domande casuali sul poker ("avresti callato?", "avevi la scala?") rivelano molto sul modo di pensare del giocatore.',
      },
    ],
    quiz: [
      {
        question: 'Qual è il vantaggio principale del home game rispetto al casino?',
        options: [
          { label: 'I piatti sono più grandi', correct: false },
          { label: 'Giochi contro gli stessi giocatori e accumuli informazioni', correct: true },
          { label: 'Le regole sono più rilassate', correct: false },
        ],
        explanation: 'Nel home game giochi contro le stesse persone. Sessione dopo sessione puoi costruire profili dettagliati che ti danno un enorme vantaggio.',
      },
      {
        question: 'Cosa dovresti fare dopo ogni sessione di home game?',
        options: [
          { label: 'Contare le vincite e stop', correct: false },
          { label: 'Analizzare mentalmente i piatti importanti e aggiornare i profili', correct: true },
          { label: 'Non pensarci per evitare il tilt', correct: false },
        ],
        explanation: 'Il debrief post-sessione è fondamentale. Ripensa ai piatti chiave e a cosa hai imparato su ogni avversario.',
      },
    ],
  },

  // =============================================
  // PHASE 5 — Mettere Tutto Insieme
  // =============================================
  {
    id: 'session-management',
    phase: 5,
    title: 'Gestione della Sessione',
    description: 'Quando giocare, quando smettere e come massimizzare le sessioni.',
    icon: '⏱️',
    requiredModules: ['tight-play', 'player-types'],
    content: [
      {
        type: 'text',
        content: 'Saper gestire la sessione è importante quanto saper giocare le carte. Un buon giocatore con cattiva gestione della sessione perde soldi nel lungo termine.',
      },
      {
        type: 'text',
        content: 'Quando SMETTERE di giocare:\n\n🚫 Sei in tilt (arrabbiato, frustrato, vendicativo)\n🚫 Sei stanco o non riesci a concentrarti\n🚫 Hai bevuto troppo\n🚫 Stai facendo call/bluff che sai essere sbagliati\n🚫 Stai cercando di "rifarti" dopo una perdita',
      },
      {
        type: 'text',
        content: 'Quando CONTINUARE a giocare:\n\n✅ Il tavolo è profittevole (molti calling station, giocatori deboli)\n✅ Sei concentrato e giochi bene\n✅ Ti senti a tuo agio emotivamente\n✅ Il tuo bankroll può gestire le oscillazioni',
      },
      {
        type: 'formula',
        content: 'Regola pratica per la durata:',
        highlight: 'Home game casual: 3-5 ore max\nQuando sei in tilt: STOP immediato\nQuando sei stanco: STOP (gli errori costano più di ciò che puoi vincere)',
      },
      {
        type: 'tip',
        content: 'Prepara un "trigger di uscita" prima di sederti: "Se perdo X, o se sento Y emozione, mi alzo". Decidere prima è più facile che decidere durante una serie negativa.',
        highlight: 'Decidi PRIMA della sessione quando smettere',
      },
      {
        type: 'warning',
        content: 'Mai giocare per "rifarti". La mentalità "devo recuperare" porta a decisioni disperate. Ogni sessione è indipendente dalla precedente. Le fiches perse ieri non tornano giocando male oggi.',
      },
    ],
    quiz: [
      {
        question: 'Quale NON è un buon motivo per smettere di giocare?',
        options: [
          { label: 'Sei in tilt', correct: false },
          { label: 'Stai perdendo', correct: true },
          { label: 'Sei stanco e non riesci a concentrarti', correct: false },
        ],
        explanation: '"Sto perdendo" non è un motivo per smettere se stai giocando bene. Le perdite a breve termine sono normali. Smetti se non giochi al meglio, non perché stai perdendo.',
      },
      {
        question: 'Cosa dovresti preparare PRIMA di ogni sessione?',
        options: [
          { label: 'Un obiettivo di vincita minimo', correct: false },
          { label: 'Un trigger di uscita (condizioni per smettere)', correct: true },
          { label: 'Una lista di bluff da provare', correct: false },
        ],
        explanation: 'Prepara le condizioni di uscita prima di sederti (es: "se perdo 3 buy-in, smetto" o "se mi sento frustrato, smetto"). È più facile decidere a freddo.',
      },
    ],
  },
  {
    id: 'bankroll-basics',
    phase: 5,
    title: 'Bankroll Management',
    description: 'Come gestire i soldi dedicati al poker per sopravvivere alle oscillazioni.',
    icon: '🏦',
    requiredModules: ['session-management'],
    content: [
      {
        type: 'text',
        content: 'Il bankroll è il budget dedicato esclusivamente al poker. La regola fondamentale: non giocare mai con soldi che non puoi permetterti di perdere. Il bankroll management ti protegge dalla varianza.',
      },
      {
        type: 'formula',
        content: 'Regole del bankroll per home game:',
        highlight: 'Minimo: 20 buy-in per il livello che giochi\nConservativo: 30 buy-in\nRegola del 5%: mai rischiare più del 5% del bankroll in una sessione',
      },
      {
        type: 'example',
        content: 'Se giochi un home game con buy-in di 50€:\n→ Bankroll minimo: 20 × 50€ = 1.000€\n→ Bankroll conservativo: 30 × 50€ = 1.500€\n→ Max rischio per sessione: 5% di 1.000€ = 50€ (1 buy-in)',
      },
      {
        type: 'text',
        content: 'Perché serve un bankroll così grande?\n\nAnche i migliori giocatori hanno sessioni negative. La varianza nel poker è ENORME. Puoi giocare perfettamente e perdere 5 sessioni di fila. Un bankroll adeguato ti permette di sopravvivere queste oscillazioni senza andare in rovina.',
      },
      {
        type: 'tip',
        content: 'Se il tuo bankroll scende sotto i 15 buy-in, considera di scendere di livello (giocare a stakes più bassi) fino a ricostruirlo. L\'ego è il nemico del bankroll.',
        highlight: 'Scendi di livello se il bankroll si riduce — l\'ego costa caro',
      },
      {
        type: 'warning',
        content: 'Mai usare soldi dell\'affitto, delle bollette o del conto corrente come bankroll. Il poker per soldi deve usare SOLO fondi dedicati che puoi permetterti di perdere al 100%.',
      },
    ],
    quiz: [
      {
        question: 'Quanti buy-in minimi servono per un bankroll adeguato?',
        options: [
          { label: '5', correct: false },
          { label: '10', correct: false },
          { label: '20', correct: true },
          { label: '50', correct: false },
        ],
        explanation: 'Il minimo raccomandato è 20 buy-in. Questo ti permette di sopravvivere le oscillazioni normali della varianza.',
      },
      {
        question: 'Il tuo bankroll è 1.000€. Qual è il livello massimo che dovresti giocare?',
        options: [
          { label: 'Buy-in 100€', correct: false },
          { label: 'Buy-in 50€', correct: true },
          { label: 'Buy-in 25€', correct: false },
        ],
        explanation: '1.000€ / 20 buy-in = 50€ massimo per buy-in. Con 25€ saresti ancora più protetto (40 buy-in).',
      },
    ],
  },
  {
    id: 'tilt-control',
    phase: 5,
    title: 'Controllo del Tilt',
    description: 'Come riconoscere e gestire le emozioni che sabotano il tuo gioco.',
    icon: '🧘',
    requiredModules: ['session-management'],
    content: [
      {
        type: 'text',
        content: 'Il "tilt" è lo stato emotivo che ti porta a giocare peggio del solito. È il più grande distruttore di bankroll nel poker. Anche il miglior giocatore al mondo in tilt diventa un pesce.',
      },
      {
        type: 'text',
        content: 'Tipi di tilt:\n\n😤 Tilt da bad beat: perdi un piatto grosso con una bad beat e vuoi "vendicarti"\n😤 Tilt da perdita: sei sotto e vuoi recuperare a tutti i costi\n😤 Tilt da noia: non ricevi carte, inizi a giocare mani spazzatura\n😤 Tilt da vittoria: stai vincendo tanto, ti senti invincibile e allarghi troppo\n😤 Tilt esterno: problemi personali, stanchezza, litigio → cattive decisioni',
      },
      {
        type: 'text',
        content: 'Segnali che sei in tilt:\n• Giochi mani che normalmente folderesti\n• Fai call "per curiosità" o "per principio"\n• Pensi "devo recuperare" o "questo non è giusto"\n• Fai raise per frustrazione, non per strategia\n• Ti rendi conto di aver fatto un errore e continui lo stesso',
      },
      {
        type: 'formula',
        content: 'Protocollo anti-tilt:',
        highlight: '1. RICONOSCI → accetta che sei in tilt\n2. PAUSA → alzati dal tavolo per 5-10 minuti\n3. RESPIRA → 5 respiri profondi, rilassa le spalle\n4. VALUTA → puoi tornare a giocare il tuo A-game?\n5. DECIDI → sì → torna | no → vai a casa',
      },
      {
        type: 'tip',
        content: 'Trucco mentale: ogni decisione al tavolo è un evento isolato. Non stai "recuperando" — stai prendendo la decisione migliore con le informazioni di ADESSO. Il passato è irrilevante.',
        highlight: 'Ogni mano è una nuova decisione. Il passato non conta.',
      },
      {
        type: 'warning',
        content: 'Il tilt peggiore è quello silenzioso: non ti rendi conto di essere in tilt. Il tuo gioco si deteriora gradualmente senza che tu lo noti. Per questo i "trigger di uscita" pre-sessione sono essenziali.',
      },
    ],
    quiz: [
      {
        question: 'Qual è la PRIMA cosa da fare quando riconosci di essere in tilt?',
        options: [
          { label: 'Giocare più tight per compensare', correct: false },
          { label: 'Alzarti dal tavolo e fare una pausa', correct: true },
          { label: 'Provare a vincere un piatto grosso per tornare in pari', correct: false },
        ],
        explanation: 'La prima cosa è fare una pausa. Alzati, prendi aria, respira. Non puoi prendere buone decisioni in stato emotivo alterato.',
      },
      {
        question: 'Quale di questi NON è un tipo di tilt?',
        options: [
          { label: 'Tilt da bad beat', correct: false },
          { label: 'Tilt da vittoria', correct: false },
          { label: 'Tilt strategico', correct: true },
        ],
        explanation: '"Tilt strategico" non esiste. Il tilt è sempre emotivo, non razionale. Anche il "tilt da vittoria" è emotivo: l\'euforia porta a decisioni sconsiderate.',
      },
    ],
  },
  {
    id: 'home-game-strategy',
    phase: 5,
    title: 'Strategia Home Game Finale',
    description: 'La strategia completa per dominare il tuo home game — unendo tutto ciò che hai imparato.',
    icon: '🏆',
    requiredModules: ['session-management', 'bankroll-basics', 'tilt-control'],
    content: [
      {
        type: 'text',
        content: 'Hai completato il percorso! Ora hai tutti gli strumenti per giocare un poker solido e profittevole nel tuo home game. Mettiamo tutto insieme in una strategia coerente.',
      },
      {
        type: 'formula',
        content: 'La strategia TAG per home game in 5 principi:',
        highlight: '1. Gioca 15-20% delle mani (tight selection)\n2. Raisa sempre quando entri (aggressive entry)\n3. C-bet i board dry, check i board wet se hai mancato\n4. Value bet grosse vs calling station\n5. Non bluffare quasi mai',
      },
      {
        type: 'text',
        content: 'Perché questa strategia funziona?\n\nI home game sono pieni di giocatori che giocano troppe mani e chiamano troppo. La strategia TAG sfrutta esattamente questi errori:\n\n→ Entri con mani forti → hai quasi sempre la mano migliore\n→ Raisi → riduci il campo, vinci molti piatti preflop\n→ Value betti grosso → i calling station pagano con mani peggiori\n→ Non bluffi → perché bluffare contro chi non folda?',
      },
      {
        type: 'example',
        content: 'Sessione tipo: 60 mani in 3 ore. Giochi 10-12 mani (~18%). Vinci 3-4 piatti piccoli preflop con raise. Vinci 2-3 piatti medi post-flop con c-bet. Vinci 1-2 piatti grossi con value bet. Perdi 2-3 piatti quando sei battuto. Risultato netto: positivo.',
      },
      {
        type: 'text',
        content: 'Adattamenti per situazioni specifiche:\n\n🎯 Tavolo loose (tutti giocano): ancora più tight, value bet enormi\n🎯 Tavolo tight (pochi giocano): allarga un po\', rubagliela i piatti\n🎯 Short-stacked (poche fiches): gioca push-or-fold, cerca spot di all-in preflop\n🎯 Deep-stacked (molte fiches): gioca più speculative hands (suited connectors), cerca piatti grossi',
      },
      {
        type: 'tip',
        content: 'Ricorda l\'aspetto sociale! Nel home game l\'obiettivo è anche divertirsi. Non essere il "robot" che rovina l\'atmosfera. Sii un buon giocatore E un buon compagno di tavolo — così gli amici continueranno a invitarti!',
        highlight: 'Vinci con stile → gli amici continuano a invitarti',
      },
      {
        type: 'warning',
        content: 'Non aspettarti risultati immediati. Il poker ha enorme varianza nel breve termine. Puoi giocare perfettamente e perdere per 5 sessioni. La strategia funziona nel LUNGO termine (50+ sessioni). Abbi pazienza e fiducia nel processo.',
      },
      {
        type: 'interactive',
        content: 'Metti alla prova le tue conoscenze con il quiz finale!',
        interactiveType: 'quiz',
      },
    ],
    quiz: [
      {
        question: 'Qual è la strategia ottimale per un home game con molti calling station?',
        options: [
          { label: 'Bluffare spesso — non se ne accorgono', correct: false },
          { label: 'Tight selection + value bet grosse + zero bluff', correct: true },
          { label: 'Giocare loose per non sembrare noioso', correct: false },
        ],
        explanation: 'Contro calling station la strategia è semplice: mani forti + value bet grosse. I bluff non funzionano contro chi chiama tutto.',
      },
      {
        question: 'Quante mani dovresti giocare approssimativamente in un tavolo pieno?',
        options: [
          { label: '5-10%', correct: false },
          { label: '15-20%', correct: true },
          { label: '30-40%', correct: false },
          { label: '50%+', correct: false },
        ],
        explanation: '15-20% è il range ottimale per uno stile TAG. Abbastanza tight da avere mani forti, abbastanza largo da non essere prevedibile.',
      },
      {
        question: 'Cosa unisce tutti i concetti che hai imparato?',
        options: [
          { label: 'Vincere più soldi possibile', correct: false },
          { label: 'Prendere la decisione matematicamente migliore in ogni situazione', correct: true },
          { label: 'Leggere gli avversari meglio di chiunque altro', correct: false },
        ],
        explanation: 'Il poker si riduce a: prendere decisioni migliori degli avversari, basate su matematica, posizione, lettura e disciplina emotiva. Nel lungo termine, le buone decisioni = profitto.',
      },
    ],
  },
];

// === HELPER FUNCTIONS ===

export function getModulesByPhase(phase: number): LearningModule[] {
  return MODULES.filter(m => m.phase === phase);
}

export function getModule(id: string): LearningModule | undefined {
  return MODULES.find(m => m.id === id);
}

export function isModuleUnlocked(
  moduleId: string,
  completedModules: Record<string, { completed: boolean }>
): boolean {
  const mod = getModule(moduleId);
  if (!mod) return false;

  // Modules without requirements are always unlocked
  if (!mod.requiredModules || mod.requiredModules.length === 0) return true;

  // All required modules must be completed
  return mod.requiredModules.every(reqId => completedModules[reqId]?.completed);
}

export function getNextModule(currentModuleId: string): LearningModule | undefined {
  const currentIndex = MODULES.findIndex(m => m.id === currentModuleId);
  if (currentIndex === -1 || currentIndex >= MODULES.length - 1) return undefined;
  return MODULES[currentIndex + 1];
}
