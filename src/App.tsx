import React, { useState, useEffect } from 'react';
import { Quiz } from './components/Quiz';
import { QuizHistory } from './components/QuizHistory';
import type { QuizAttempt } from './types/quiz';
import { getAttempts } from './utils/db';
import { Brain } from 'lucide-react';

function App() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAttempts();
  }, []);

  async function loadAttempts() {
    try {
      const loadedAttempts = await getAttempts();
      setAttempts(loadedAttempts);
    } catch (error) {
      console.error('Error loading attempts:', error);
      setError('Failed to load quiz history');
    }
  }

  const handleQuizComplete = async () => {
    try {
      await loadAttempts();
      setIsQuizActive(false);
    } catch (error) {
      console.error('Error completing quiz:', error);
      setError('Failed to save quiz results');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900">Interactive Quiz Platform</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!isQuizActive ? (
          <div className="space-y-8">
            <div className="text-center">
              <button
                onClick={() => setIsQuizActive(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Start New Quiz
              </button>
            </div>
            
            {attempts.length > 0 && <QuizHistory attempts={attempts} />}
          </div>
        ) : (
          <Quiz onComplete={handleQuizComplete} />
        )}
      </main>
    </div>
  );
}

export default App