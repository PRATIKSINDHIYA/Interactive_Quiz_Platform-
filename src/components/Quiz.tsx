import React, { useState, useEffect, useCallback } from 'react';
import { Question } from './Question';
import { Timer } from './Timer';
import { questions } from '../data/questions';
import type { QuizState } from '../types/quiz';
import { saveAttempt } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';

const QUESTION_TIME_LIMIT = 30;

export function Quiz({ onComplete }: { onComplete: () => void }) {
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    answers: {},
    timeRemaining: QUESTION_TIME_LIMIT,
    isComplete: false,
    timePerQuestion: {},
  });

  const handleAnswer = useCallback((answer: string | number) => {
    setState((prev) => {
      const timeSpent = QUESTION_TIME_LIMIT - prev.timeRemaining;
      return {
        ...prev,
        answers: { ...prev.answers, [prev.currentQuestion]: answer },
        timePerQuestion: { ...prev.timePerQuestion, [prev.currentQuestion]: timeSpent },
        currentQuestion: prev.currentQuestion + 1,
        timeRemaining: QUESTION_TIME_LIMIT,
      };
    });
  }, []);

  const handleTimeUp = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentQuestion: prev.currentQuestion + 1,
      timeRemaining: QUESTION_TIME_LIMIT,
      timePerQuestion: { ...prev.timePerQuestion, [prev.currentQuestion]: QUESTION_TIME_LIMIT },
    }));
  }, []);

  useEffect(() => {
    if (state.currentQuestion < questions.length && !state.isComplete) {
      const timer = setInterval(() => {
        setState((prev) => ({
          ...prev,
          timeRemaining: Math.max(0, prev.timeRemaining - 1),
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [state.currentQuestion, state.isComplete]);

  useEffect(() => {
    if (state.currentQuestion === questions.length && !state.isComplete) {
      const score = Object.entries(state.answers).reduce(
        (acc, [index, answer]) =>
          answer.toString() === questions[parseInt(index)].correctAnswer.toString()
            ? acc + 1
            : acc,
        0
      );

      const attempt = {
        id: uuidv4(),
        timestamp: Date.now(),
        score,
        totalQuestions: questions.length,
        answers: state.answers,
        timePerQuestion: state.timePerQuestion,
      };

      saveAttempt(attempt);
      setState((prev) => ({ ...prev, isComplete: true }));
      onComplete();
    }
  }, [state.currentQuestion, state.isComplete, state.answers, state.timePerQuestion, onComplete]);

  if (state.isComplete) {
    return null;
  }

  const currentQuestion = questions[state.currentQuestion];

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div className="text-lg font-semibold">
          Question {state.currentQuestion + 1} of {questions.length}
        </div>
        <Timer
          timeRemaining={state.timeRemaining}
          onTimeUp={handleTimeUp}
        />
      </div>

      <Question
        question={currentQuestion}
        onAnswer={handleAnswer}
        userAnswer={state.answers[state.currentQuestion]}
        showFeedback={false}
      />
    </div>
  );
}