'use client';

import { useState, useEffect } from 'react';

interface QuizOption {
  label: string;
  value: string | number;
  correct: boolean;
}

interface QuizProps {
  question: string;
  options: QuizOption[];
  explanation?: string;
  onAnswer: (correct: boolean) => void;
}

export default function Quiz({ question, options, explanation, onAnswer }: QuizProps) {
  const [selected, setSelected] = useState<string | number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (option: QuizOption) => {
    if (showResult) return;

    setSelected(option.value);
    setShowResult(true);

    setTimeout(() => {
      onAnswer(option.correct);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg max-w-xl mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{question}</h3>

      <div className="space-y-3">
        {options.map((option, i) => {
          const isSelected = selected === option.value;
          const showCorrect = showResult && option.correct;
          const showWrong = showResult && isSelected && !option.correct;

          return (
            <button
              key={i}
              onClick={() => handleSelect(option)}
              disabled={showResult}
              className={`
                w-full p-4 rounded-lg text-left font-medium
                transition-all duration-200
                ${showCorrect ? 'bg-green-100 border-2 border-green-500 text-green-800' : ''}
                ${showWrong ? 'bg-red-100 border-2 border-red-500 text-red-800' : ''}
                ${!showResult && !isSelected ? 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent' : ''}
                ${!showResult && isSelected ? 'bg-blue-100 border-2 border-blue-500' : ''}
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {showResult && explanation && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800">{explanation}</p>
        </div>
      )}
    </div>
  );
}
