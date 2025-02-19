import React, { useState, useEffect } from 'react';
import type { Question as QuestionType } from '../types/quiz';

interface QuestionProps {
  question: QuestionType;
  onAnswer: (answer: string | number) => void;
  userAnswer?: string | number;
  showFeedback?: boolean;
}

export function Question({ question, onAnswer, userAnswer, showFeedback }: QuestionProps) {
  const [inputValue, setInputValue] = useState<string>('');

  // Reset input value when question changes
  useEffect(() => {
    setInputValue('');
  }, [question.id]);

  const isCorrect = userAnswer !== undefined && userAnswer.toString() === question.correctAnswer.toString();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.type === 'integer') {
      onAnswer(parseInt(inputValue, 10));
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
      
      {question.type === 'multiple-choice' && (
        <div className="space-y-3">
          {question.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswer(option)}
              className={`w-full p-4 text-left rounded-lg transition-colors ${
                userAnswer === option
                  ? showFeedback
                    ? isCorrect
                      ? 'bg-green-100 border-green-500'
                      : 'bg-red-100 border-red-500'
                    : 'bg-blue-100 border-blue-500'
                  : 'bg-white hover:bg-gray-50'
              } border-2 hover:bg-gray-50`}
              disabled={userAnswer !== undefined}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {question.type === 'integer' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-3 border-2 rounded-lg focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your answer..."
            disabled={userAnswer !== undefined}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            disabled={userAnswer !== undefined || !inputValue}
          >
            Submit Answer
          </button>
        </form>
      )}

      {showFeedback && (
        <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
          {isCorrect ? 'Correct!' : `Incorrect. The correct answer is ${question.correctAnswer}`}
        </div>
      )}
    </div>
  );
}