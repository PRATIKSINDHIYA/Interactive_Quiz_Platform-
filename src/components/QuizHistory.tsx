import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { QuizAttempt } from '../types/quiz';
import { History } from 'lucide-react';

interface QuizHistoryProps {
  attempts: QuizAttempt[];
}

export function QuizHistory({ attempts }: QuizHistoryProps) {
  const sortedAttempts = [...attempts].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center space-x-2 mb-4">
        <History className="w-6 h-6" />
        <h2 className="text-xl font-semibold">Quiz History</h2>
      </div>
      
      <div className="space-y-4">
        {sortedAttempts.map((attempt) => (
          <div
            key={attempt.id}
            className="bg-white p-4 rounded-lg shadow border"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">
                {formatDistanceToNow(attempt.timestamp)} ago
              </span>
              <span className="font-semibold">
                Score: {attempt.score}/{attempt.totalQuestions}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Average time per question:{' '}
              {Object.values(attempt.timePerQuestion).reduce((a, b) => a + b, 0) /
                attempt.totalQuestions}
              s
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}