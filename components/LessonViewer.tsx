'use client';

// === LESSON VIEWER COMPONENT ===
// Renderizza il contenuto delle lezioni con formattazione ricca e quiz gate
// Usato da: app/path/page.tsx

import { useState, useCallback } from 'react';
import Link from 'next/link';
import type { LearningModule, ContentBlock, QuizGate } from '@/lib/learning-path';

interface LessonViewerProps {
  module: LearningModule;
  onComplete: (quizPassed: boolean) => void;
  onBack: () => void;
}

// === CONTENT BLOCK RENDERERS ===

function TextBlock({ block }: { block: ContentBlock }) {
  return (
    <div className="prose max-w-none text-gray-700">
      {block.content.split('\n').map((paragraph, i) => (
        <p key={i} className="mb-3 last:mb-0 whitespace-pre-line leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function FormulaBlock({ block }: { block: ContentBlock }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-blue-900 font-medium mb-2">{block.content}</p>
      {block.highlight && (
        <div className="bg-blue-100 rounded-md p-3 font-mono text-sm text-blue-800 whitespace-pre-line">
          {block.highlight}
        </div>
      )}
    </div>
  );
}

function CardDisplay({ cards }: { cards: string }) {
  // Parse card strings like "A♠ K♥" and render them inline
  const suitColors: Record<string, string> = {
    '\u2660': 'text-gray-900', // spades
    '\u2663': 'text-gray-900', // clubs
    '\u2665': 'text-red-600',  // hearts
    '\u2666': 'text-red-600',  // diamonds
  };

  const parts = cards.split(/(\s+\|\s+|\s+vs\s+)/);

  return (
    <div className="flex flex-wrap items-center gap-2 my-2">
      {parts.map((part, i) => {
        const trimmed = part.trim();
        if (trimmed === '|') {
          return (
            <span key={i} className="text-gray-400 font-bold mx-1">|</span>
          );
        }
        if (trimmed === 'vs') {
          return (
            <span key={i} className="text-gray-500 font-bold mx-1 text-sm">vs</span>
          );
        }

        // Split individual cards
        const cardTokens = trimmed.split(/\s+/);
        return (
          <span key={i} className="flex gap-1">
            {cardTokens.map((token, j) => {
              // Check if this is a card (contains suit symbol)
              const hasSuit = /[♠♣♥♦]/.test(token);
              if (!hasSuit) {
                return (
                  <span key={j} className="text-gray-600 text-sm">{token}</span>
                );
              }

              const suitChar = token.match(/[♠♣♥♦]/)?.[0] || '';
              const colorClass = suitColors[suitChar] || 'text-gray-900';

              return (
                <span
                  key={j}
                  className={`
                    inline-flex items-center justify-center
                    bg-white border border-gray-300 rounded-md
                    px-2 py-1 font-bold text-sm shadow-sm
                    ${colorClass}
                  `}
                >
                  {token}
                </span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
}

function ExampleBlock({ block }: { block: ContentBlock }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">📌</span>
        <div className="flex-1">
          <p className="text-gray-700 mb-2">{block.content}</p>
          {block.cards && <CardDisplay cards={block.cards} />}
        </div>
      </div>
    </div>
  );
}

function TipBlock({ block }: { block: ContentBlock }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">💡</span>
        <div className="flex-1">
          <p className="text-green-800">{block.content}</p>
          {block.highlight && (
            <div className="mt-2 bg-green-100 rounded-md px-3 py-2 font-semibold text-green-900 text-sm">
              {block.highlight}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WarningBlock({ block }: { block: ContentBlock }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">⚠️</span>
        <div className="flex-1">
          <p className="text-amber-900">{block.content}</p>
        </div>
      </div>
    </div>
  );
}

function CardsBlock({ block }: { block: ContentBlock }) {
  return (
    <div className="p-4">
      <p className="text-gray-700 mb-2">{block.content}</p>
      {block.cards && <CardDisplay cards={block.cards} />}
    </div>
  );
}

function InteractiveBlock({ block }: { block: ContentBlock }) {
  const linkMap: Record<string, { href: string; label: string; icon: string }> = {
    'preflop-chart': { href: '/preflop', label: 'Apri Chart Preflop', icon: '📋' },
    'calculator': { href: '/calculator', label: 'Apri Calcolatore Equity', icon: '🔢' },
    'quiz': { href: '/quiz', label: 'Vai ai Quiz', icon: '❓' },
  };

  const link = block.interactiveType ? linkMap[block.interactiveType] : null;

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
      <p className="text-indigo-800 mb-3">{block.content}</p>
      {link && (
        <Link
          href={link.href}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <span>{link.icon}</span>
          {link.label}
        </Link>
      )}
    </div>
  );
}

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'text':
      return <TextBlock block={block} />;
    case 'formula':
      return <FormulaBlock block={block} />;
    case 'example':
      return <ExampleBlock block={block} />;
    case 'tip':
      return <TipBlock block={block} />;
    case 'warning':
      return <WarningBlock block={block} />;
    case 'cards':
      return <CardsBlock block={block} />;
    case 'interactive':
      return <InteractiveBlock block={block} />;
    default:
      return null;
  }
}

// === QUIZ SECTION ===

interface QuizSectionProps {
  questions: QuizGate[];
  onAllCorrect: () => void;
}

function QuizSection({ questions, onAllCorrect }: QuizSectionProps) {
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [showResults, setShowResults] = useState(false);

  const allCorrect = questions.every((q, i) => {
    const selected = answers[i];
    if (selected === null || selected === undefined) return false;
    return q.options[selected]?.correct;
  });

  const allAnswered = questions.every((_, i) => answers[i] !== null && answers[i] !== undefined);

  const handleSelect = useCallback((questionIdx: number, optionIdx: number) => {
    if (showResults) return;
    setAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }));
  }, [showResults]);

  const handleCheck = useCallback(() => {
    setShowResults(true);
    if (allCorrect) {
      onAllCorrect();
    }
  }, [allCorrect, onAllCorrect]);

  const handleRetry = useCallback(() => {
    setAnswers({});
    setShowResults(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <h3 className="text-lg font-bold text-gray-900">Quiz di Verifica</h3>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <p className="text-sm text-gray-500 text-center">
        Rispondi correttamente a tutte le domande per completare il modulo.
      </p>

      {questions.map((q, qIdx) => {
        const selected = answers[qIdx];
        const isCorrect = selected !== null && selected !== undefined && q.options[selected]?.correct;

        return (
          <div key={qIdx} className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="font-semibold text-gray-900 mb-3">
              {qIdx + 1}. {q.question}
            </p>

            <div className="space-y-2">
              {q.options.map((opt, oIdx) => {
                let optionClass = 'bg-gray-50 border-gray-200 hover:bg-gray-100';

                if (selected === oIdx && !showResults) {
                  optionClass = 'bg-blue-50 border-blue-400';
                }

                if (showResults) {
                  if (opt.correct) {
                    optionClass = 'bg-green-50 border-green-400';
                  } else if (selected === oIdx && !opt.correct) {
                    optionClass = 'bg-red-50 border-red-400';
                  } else {
                    optionClass = 'bg-gray-50 border-gray-200 opacity-60';
                  }
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelect(qIdx, oIdx)}
                    disabled={showResults}
                    className={`
                      w-full text-left p-3 rounded-lg border transition-all duration-200
                      ${optionClass}
                      ${!showResults ? 'cursor-pointer' : 'cursor-default'}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${selected === oIdx
                          ? (showResults
                            ? (opt.correct ? 'border-green-500 bg-green-500' : 'border-red-500 bg-red-500')
                            : 'border-blue-500 bg-blue-500')
                          : (showResults && opt.correct
                            ? 'border-green-500'
                            : 'border-gray-300')
                        }
                      `}>
                        {selected === oIdx && (
                          <span className="text-white text-xs font-bold">
                            {showResults ? (opt.correct ? '✓' : '✗') : '●'}
                          </span>
                        )}
                        {showResults && opt.correct && selected !== oIdx && (
                          <span className="text-green-500 text-xs font-bold">✓</span>
                        )}
                      </span>
                      <span className="text-sm text-gray-800">{opt.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showResults && (
              <div className={`
                mt-3 p-3 rounded-lg text-sm
                ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}
              `}>
                <span className="font-semibold">{isCorrect ? 'Corretto!' : 'Sbagliato.'}</span>
                {' '}{q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {/* Actions */}
      <div className="flex justify-center gap-3">
        {!showResults ? (
          <button
            onClick={handleCheck}
            disabled={!allAnswered}
            className={`
              px-6 py-2 rounded-lg font-semibold transition-all duration-200
              ${allAnswered
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Verifica Risposte
          </button>
        ) : allCorrect ? (
          <div className="text-center">
            <div className="text-green-600 font-bold text-lg mb-2">
              Tutte le risposte sono corrette!
            </div>
            <p className="text-gray-500 text-sm">Il modulo e stato completato con successo.</p>
          </div>
        ) : (
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors"
          >
            Riprova
          </button>
        )}
      </div>
    </div>
  );
}

// === MAIN COMPONENT ===

export default function LessonViewer({ module, onComplete, onBack }: LessonViewerProps) {
  const [quizPassed, setQuizPassed] = useState(false);

  const handleQuizPassed = useCallback(() => {
    setQuizPassed(true);
    onComplete(true);
  }, [onComplete]);

  const handleCompleteWithoutQuiz = useCallback(() => {
    onComplete(false);
  }, [onComplete]);

  const hasQuiz = module.quiz && module.quiz.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Torna al percorso"
        >
          <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{module.icon}</span>
            <h1 className="text-2xl font-bold text-gray-900">{module.title}</h1>
          </div>
          <p className="text-gray-500 mt-1">{module.description}</p>
        </div>
      </div>

      {/* Content Blocks */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-5">
        {module.content.map((block, idx) => (
          <ContentBlockRenderer key={idx} block={block} />
        ))}
      </div>

      {/* Quiz Gate */}
      {hasQuiz && !quizPassed && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <QuizSection
            questions={module.quiz!}
            onAllCorrect={handleQuizPassed}
          />
        </div>
      )}

      {/* Completion indicator */}
      {quizPassed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-lg font-bold text-green-800">Modulo Completato!</h3>
          <p className="text-green-600 mt-1">Hai superato il quiz e sbloccato i moduli successivi.</p>
        </div>
      )}

      {/* Complete without quiz (for modules without quiz, or after quiz passed) */}
      {!hasQuiz && (
        <div className="text-center">
          <button
            onClick={handleCompleteWithoutQuiz}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Segna come Completato
          </button>
        </div>
      )}
    </div>
  );
}
