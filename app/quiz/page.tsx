'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card as CardType, createDeck, shuffleDeck, RANK_VALUES } from '@/lib/poker';
import { calculatePotOdds, calculateEV } from '@/lib/probability';
import Quiz from '@/components/Quiz';
import Hand from '@/components/Hand';
import Stats from '@/components/Stats';
import { updateQuizStats } from '@/lib/storage';

type QuizType = 'outs' | 'potodds' | 'equity' | 'ev' | 'callfold';
type Difficulty = 'easy' | 'medium' | 'hard';

interface QuizQuestion {
  question: string;
  holeCards?: CardType[];
  communityCards?: CardType[];
  options: { label: string; value: number | string; correct: boolean }[];
  explanation: string;
}

const QUESTIONS_PER_SESSION = 10;

// Scenario generators for different outs types
function generateFlushDrawScenario(deck: CardType[]): { holeCards: CardType[]; communityCards: CardType[]; outs: number; description: string } {
  const suit = deck[0].suit;
  const flushCards = deck.filter(c => c.suit === suit).slice(0, 4);
  const otherCard = deck.find(c => c.suit !== suit)!;
  return {
    holeCards: flushCards.slice(0, 2),
    communityCards: [flushCards[2], flushCards[3], otherCard],
    outs: 9,
    description: '4 carte dello stesso seme → 9 outs per il flush'
  };
}

function generateOESDScenario(deck: CardType[]): { holeCards: CardType[]; communityCards: CardType[]; outs: number; description: string } {
  // Find 4 consecutive cards (e.g., 5-6-7-8)
  const sorted = [...deck].sort((a, b) => RANK_VALUES[a.rank] - RANK_VALUES[b.rank]);
  const startIdx = Math.floor(Math.random() * 6) + 2; // Start from 4 to avoid A-2-3-4
  const targetValues = [startIdx + 2, startIdx + 3, startIdx + 4, startIdx + 5];

  const consecutiveCards = sorted.filter(c => targetValues.includes(RANK_VALUES[c.rank])).slice(0, 4);
  const otherCard = sorted.find(c => !targetValues.includes(RANK_VALUES[c.rank]))!;

  if (consecutiveCards.length < 4) {
    return generateFlushDrawScenario(deck); // Fallback
  }

  return {
    holeCards: consecutiveCards.slice(0, 2),
    communityCards: [consecutiveCards[2], consecutiveCards[3], otherCard],
    outs: 8,
    description: '4 carte consecutive (OESD) → 8 outs (puoi completare su entrambi i lati)'
  };
}

function generateGutshotScenario(deck: CardType[]): { holeCards: CardType[]; communityCards: CardType[]; outs: number; description: string } {
  // Find 4 cards with 1 gap (e.g., 5-6-8-9, missing 7)
  const sorted = [...deck].sort((a, b) => RANK_VALUES[a.rank] - RANK_VALUES[b.rank]);
  const startIdx = Math.floor(Math.random() * 5) + 3;
  const targetValues = [startIdx + 2, startIdx + 3, startIdx + 5, startIdx + 6]; // gap at +4

  const gutshotCards = sorted.filter(c => targetValues.includes(RANK_VALUES[c.rank])).slice(0, 4);
  const otherCard = sorted.find(c => !targetValues.includes(RANK_VALUES[c.rank]))!;

  if (gutshotCards.length < 4) {
    return generateFlushDrawScenario(deck); // Fallback
  }

  return {
    holeCards: gutshotCards.slice(0, 2),
    communityCards: [gutshotCards[2], gutshotCards[3], otherCard],
    outs: 4,
    description: '4 carte con 1 gap (gutshot) → 4 outs'
  };
}

function generateOvercardsScenario(deck: CardType[]): { holeCards: CardType[]; communityCards: CardType[]; outs: number; description: string } {
  // Hole cards: A-K, Board: low cards
  const sorted = [...deck].sort((a, b) => RANK_VALUES[b.rank] - RANK_VALUES[a.rank]);
  const highCards = sorted.filter(c => RANK_VALUES[c.rank] >= 13).slice(0, 2); // A or K
  const lowCards = sorted.filter(c => RANK_VALUES[c.rank] <= 10).slice(0, 3);

  if (highCards.length < 2 || lowCards.length < 3) {
    return generateFlushDrawScenario(deck); // Fallback
  }

  return {
    holeCards: highCards,
    communityCards: lowCards,
    outs: 6,
    description: '2 overcards → 6 outs (3 per ogni carta alta)'
  };
}

function generateOutsQuestion(difficulty: Difficulty): QuizQuestion {
  const deck = shuffleDeck(createDeck());

  // Choose scenario based on difficulty
  let scenario;
  if (difficulty === 'easy') {
    scenario = generateFlushDrawScenario(deck);
  } else if (difficulty === 'medium') {
    const scenarios = [generateFlushDrawScenario, generateOESDScenario];
    scenario = scenarios[Math.floor(Math.random() * scenarios.length)](deck);
  } else {
    const scenarios = [generateFlushDrawScenario, generateOESDScenario, generateGutshotScenario, generateOvercardsScenario];
    scenario = scenarios[Math.floor(Math.random() * scenarios.length)](deck);
  }

  const { holeCards, communityCards, outs, description } = scenario;

  // Generate wrong options
  const wrongOuts = [outs - 2, outs - 1, outs + 1, outs + 2].filter(o => o > 0 && o !== outs);
  const options = [
    { label: `${outs} outs`, value: outs, correct: true },
    ...wrongOuts.slice(0, 3).map(o => ({ label: `${o} outs`, value: o, correct: false }))
  ].sort(() => Math.random() - 0.5);

  return {
    question: 'Quanti outs hai in questa situazione?',
    holeCards,
    communityCards,
    options,
    explanation: description
  };
}

function generatePotOddsQuestion(difficulty: Difficulty): QuizQuestion {
  const potOptions = difficulty === 'easy' ? [100, 200] : difficulty === 'medium' ? [100, 150, 200, 250] : [75, 125, 175, 225, 275];
  const betOptions = difficulty === 'easy' ? [50, 100] : difficulty === 'medium' ? [25, 50, 75, 100] : [30, 45, 60, 85, 110];

  const pot = potOptions[Math.floor(Math.random() * potOptions.length)];
  const bet = betOptions[Math.floor(Math.random() * betOptions.length)];
  const correctOdds = Math.round((bet / (pot + bet)) * 100);

  const wrongOptions = [
    Math.max(5, correctOdds - 10),
    correctOdds + 8,
    correctOdds + 15
  ].filter(o => o !== correctOdds && o > 0 && o < 100);

  return {
    question: `Piatto: €${pot}. Avversario punta €${bet}. Quali sono i tuoi pot odds?`,
    options: [
      { label: `${correctOdds}%`, value: correctOdds, correct: true },
      ...wrongOptions.map(o => ({ label: `${o}%`, value: o, correct: false }))
    ].sort(() => Math.random() - 0.5),
    explanation: `Pot Odds = Bet / (Pot + Bet) = ${bet} / (${pot} + ${bet}) = ${correctOdds}%`
  };
}

function generateEquityQuestion(difficulty: Difficulty): QuizQuestion {
  // Common preflop matchups
  const matchups = [
    { hand: 'AA vs KK', equity: 82, desc: 'AA vs KK: ~82% per AA' },
    { hand: 'AK vs QQ', equity: 43, desc: 'AK vs QQ: ~43% per AK (coin flip)' },
    { hand: 'KK vs AK', equity: 70, desc: 'KK vs AK: ~70% per KK' },
    { hand: 'JJ vs AK', equity: 57, desc: 'JJ vs AK: ~57% per JJ' },
    { hand: '22 vs AK', equity: 52, desc: '22 vs AK: ~52% (small pair vs overcards)' },
  ];

  const matchup = matchups[Math.floor(Math.random() * matchups.length)];
  const wrongEquities = [matchup.equity - 15, matchup.equity - 8, matchup.equity + 10].filter(e => e > 0 && e < 100 && e !== matchup.equity);

  return {
    question: `Qual è approssimativamente l'equity preflop di ${matchup.hand.split(' vs ')[0]} in ${matchup.hand}?`,
    options: [
      { label: `~${matchup.equity}%`, value: matchup.equity, correct: true },
      ...wrongEquities.map(e => ({ label: `~${e}%`, value: e, correct: false }))
    ].sort(() => Math.random() - 0.5),
    explanation: matchup.desc
  };
}

function generateEVQuestion(difficulty: Difficulty): QuizQuestion {
  const pot = [100, 150, 200][Math.floor(Math.random() * 3)];
  const bet = [50, 75, 100][Math.floor(Math.random() * 3)];
  const equity = [30, 35, 40, 45, 50][Math.floor(Math.random() * 5)];

  const ev = calculateEV(equity / 100, pot + bet, bet);
  const isPositive = ev > 0;

  return {
    question: `Piatto: €${pot}. Puntata: €${bet}. Hai ${equity}% equity. Questo call è +EV o -EV?`,
    options: [
      { label: '+EV (profittevole)', value: 'positive', correct: isPositive },
      { label: '-EV (non profittevole)', value: 'negative', correct: !isPositive },
    ],
    explanation: `EV = (${equity}% × €${pot + bet}) - (${100 - equity}% × €${bet}) = €${ev.toFixed(0)}. ${isPositive ? 'Call profittevole!' : 'Fold consigliato.'}`
  };
}

function generateCallFoldQuestion(difficulty: Difficulty): QuizQuestion {
  const pot = [100, 150, 200][Math.floor(Math.random() * 3)];
  const bet = [40, 50, 60, 75][Math.floor(Math.random() * 4)];
  const potOdds = calculatePotOdds(pot, bet) * 100;

  // Sometimes give equity above pot odds, sometimes below
  const isAbove = Math.random() > 0.5;
  const equity = isAbove ? Math.round(potOdds + 5 + Math.random() * 10) : Math.round(potOdds - 5 - Math.random() * 10);

  const shouldCall = equity >= potOdds;

  return {
    question: `Piatto: €${pot}. Puntata: €${bet} (pot odds: ${potOdds.toFixed(0)}%). Hai ${equity}% equity. Cosa fai?`,
    options: [
      { label: 'Call', value: 'call', correct: shouldCall },
      { label: 'Fold', value: 'fold', correct: !shouldCall },
    ],
    explanation: `Pot odds: ${potOdds.toFixed(0)}%. Equity: ${equity}%. ${shouldCall ? `Equity > Pot Odds → CALL profittevole` : `Equity < Pot Odds → FOLD`}`
  };
}

const quizConfig: Record<QuizType, { icon: string; label: string; description: string }> = {
  outs: { icon: '🎯', label: 'Quiz Outs', description: 'Calcola gli outs' },
  potodds: { icon: '💰', label: 'Pot Odds', description: 'Calcola le pot odds' },
  equity: { icon: '📊', label: 'Equity', description: 'Equity preflop' },
  ev: { icon: '📈', label: 'Expected Value', description: '+EV o -EV?' },
  callfold: { icon: '🃏', label: 'Call/Fold', description: 'Decisioni tattiche' },
};

const difficultyConfig: Record<Difficulty, { label: string; color: string }> = {
  easy: { label: 'Facile', color: 'bg-green-100 text-green-800 border-green-300' },
  medium: { label: 'Medio', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  hard: { label: 'Difficile', color: 'bg-red-100 text-red-800 border-red-300' },
};

export default function QuizPage() {
  const [quizType, setQuizType] = useState<QuizType>('outs');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showStart, setShowStart] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);

  const generateQuestion = useCallback(() => {
    switch (quizType) {
      case 'outs':
        setCurrentQuestion(generateOutsQuestion(difficulty));
        break;
      case 'potodds':
        setCurrentQuestion(generatePotOddsQuestion(difficulty));
        break;
      case 'equity':
        setCurrentQuestion(generateEquityQuestion(difficulty));
        break;
      case 'ev':
        setCurrentQuestion(generateEVQuestion(difficulty));
        break;
      case 'callfold':
        setCurrentQuestion(generateCallFoldQuestion(difficulty));
        break;
    }
    setQuestionNumber(prev => prev + 1);
  }, [quizType, difficulty]);

  const startQuiz = () => {
    setShowStart(false);
    setShowStats(false);
    setScore({ correct: 0, total: 0 });
    setQuestionNumber(0);
    generateQuestion();
  };

  const handleAnswer = (correct: boolean) => {
    const newScore = {
      correct: score.correct + (correct ? 1 : 0),
      total: score.total + 1
    };
    setScore(newScore);

    // Check if session complete
    if (newScore.total >= QUESTIONS_PER_SESSION) {
      // Save stats
      updateQuizStats(quizType, newScore.correct, newScore.total);
      setTimeout(() => {
        setShowStats(true);
        setCurrentQuestion(null);
      }, 1500);
    } else {
      setTimeout(() => {
        generateQuestion();
      }, 2000);
    }
  };

  const resetQuiz = () => {
    // Save partial progress if any
    if (score.total > 0) {
      updateQuizStats(quizType, score.correct, score.total);
    }
    setShowStart(true);
    setCurrentQuestion(null);
    setScore({ correct: 0, total: 0 });
    setQuestionNumber(0);
    setShowStats(false);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">Quiz</h1>

      {showStart ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Quiz Type Selection */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Scegli il tipo di quiz</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.entries(quizConfig) as [QuizType, typeof quizConfig[QuizType]][]).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => setQuizType(type)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    quizType === type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{config.icon}</div>
                  <div className="font-semibold text-sm">{config.label}</div>
                  <div className="text-xs text-gray-600">{config.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Difficoltà</h2>
            <div className="flex gap-3">
              {(Object.entries(difficultyConfig) as [Difficulty, typeof difficultyConfig[Difficulty]][]).map(([level, config]) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                    difficulty === level
                      ? config.color + ' border-current'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startQuiz}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 shadow-lg"
          >
            Inizia Quiz ({QUESTIONS_PER_SESSION} domande)
          </button>

          {/* Stats */}
          <Stats />
        </div>
      ) : showStats ? (
        <div className="max-w-xl mx-auto space-y-6">
          {/* Session Results */}
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="text-5xl mb-4">
              {score.correct >= QUESTIONS_PER_SESSION * 0.8 ? '🏆' : score.correct >= QUESTIONS_PER_SESSION * 0.5 ? '👍' : '📚'}
            </div>
            <h2 className="text-2xl font-bold mb-2">Sessione Completata!</h2>
            <p className="text-4xl font-bold text-blue-600 mb-4">
              {score.correct} / {score.total}
            </p>
            <p className="text-gray-600 mb-6">
              {score.correct >= QUESTIONS_PER_SESSION * 0.8
                ? 'Ottimo lavoro!'
                : score.correct >= QUESTIONS_PER_SESSION * 0.5
                  ? 'Buon risultato, continua così!'
                  : 'Continua a praticare!'}
            </p>
            <div className="flex gap-4">
              <button
                onClick={startQuiz}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Riprova
              </button>
              <button
                onClick={resetQuiz}
                className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50"
              >
                Menu
              </button>
            </div>
          </div>

          <Stats />
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="max-w-xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Domanda {questionNumber} di {QUESTIONS_PER_SESSION}
              </span>
              <span className="text-sm font-medium">
                Punteggio: <span className="text-green-600">{score.correct}</span> / {score.total}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${(questionNumber / QUESTIONS_PER_SESSION) * 100}%` }}
              />
            </div>
          </div>

          {/* Back Button */}
          <div className="max-w-xl mx-auto">
            <button
              onClick={resetQuiz}
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              ← Torna al menu
            </button>
          </div>

          {/* Cards Display (for outs quiz) */}
          {currentQuestion?.holeCards && (
            <div className="flex justify-center gap-8 flex-wrap">
              <Hand cards={currentQuestion.holeCards} label="Le tue carte" />
              <Hand cards={currentQuestion.communityCards || []} label="Community" />
            </div>
          )}

          {/* Quiz Component */}
          {currentQuestion && (
            <Quiz
              question={currentQuestion.question}
              options={currentQuestion.options}
              explanation={currentQuestion.explanation}
              onAnswer={handleAnswer}
            />
          )}
        </>
      )}
    </div>
  );
}
