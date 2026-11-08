import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { HelpCircle, Sparkles, Trophy, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { subscribeToContentUpdates } from '../lib/contentEvents';
import { STORAGE_KEYS, readAdminCollection } from '../lib/adminDataStorage';

export const CouplesQuiz: React.FC = () => {
  const { theme, settings } = useTheme();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      const data = await readAdminCollection<QuizQuestion>(STORAGE_KEYS.quiz, '/api/quiz');
      setQuestions(data);
    } catch (err) {
      console.error('Error fetching quiz questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    return subscribeToContentUpdates('quiz', fetchQuestions);
  }, []);

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return; // prevent multiple clicks
    setSelectedOption(index);
    setShowExplanation(true);

    const currentQ = questions[currentIndex];
    if (index === currentQ.correct_index) {
      setScore((prev) => prev + 1);
      confetti({ particleCount: 20, spread: 50, origin: { y: 0.6 } });
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizFinished(false);
  };

  const currentQ = questions[currentIndex];

  return (
    <section id="quiz" className="py-16 px-4 max-w-3xl mx-auto">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-rose-900/60 text-pink-700 dark:text-pink-300 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-pink-500" />
          <span>How Well Do You Know Us?</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-rose-950 dark:text-rose-100">
          The Couple Knowledge Quiz
        </h2>
        <p className="text-base text-rose-700/80 dark:text-rose-300/80">
          Test your memory on our cutest relationship details!
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-rose-500">Loading couple trivia...</div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12 p-8 rounded-3xl bg-white/60 dark:bg-rose-900/30 border border-pink-200 dark:border-rose-800 text-rose-600">
          No quiz questions created yet. Add trivia in the Master Admin panel! 💕
        </div>
      ) : quizFinished ? (
        /* Quiz Finished Screen */
        <div className={`p-8 sm:p-10 rounded-3xl ${theme.cardBg} border text-center space-y-6 shadow-2xl`}>
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl font-extrabold text-rose-950 dark:text-rose-100">Quiz Completed! 🎉</h3>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
              You scored {score} out of {questions.length}!
            </p>
            <p className="text-sm text-rose-700/80 dark:text-rose-300/80 max-w-md mx-auto">
              {score === questions.length
                ? `100% PERFECT SCORE! You truly know every single detail of our love story! I love you so much, ${settings.partner_name}! ❤️`
                : `You did so awesome, ${settings.partner_name}! Every moment with you is unforgettable! 💕`}
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-base shadow-lg hover:scale-105 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Play Quiz Again</span>
          </button>
        </div>
      ) : (
        /* Question Card */
        <div className={`p-6 sm:p-8 rounded-3xl ${theme.cardBg} border space-y-6 shadow-xl`}>
          <div className="flex items-center justify-between text-xs font-bold text-rose-500">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>Score: {score}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-rose-950 dark:text-rose-100">
            {currentQ?.question}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ?.options?.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correct_index;

              let btnStyle = 'bg-white/80 dark:bg-rose-900/50 border-pink-200 dark:border-rose-800 text-rose-900 dark:text-rose-100 hover:border-pink-400';

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/20';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500 text-white border-rose-400 shadow-md';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border font-semibold text-left transition-all duration-300 flex items-center justify-between gap-3 text-sm sm:text-base ${btnStyle}`}
                >
                  <span>{option}</span>
                  {selectedOption !== null && (
                    <span>
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-white" />
                      ) : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="p-4 rounded-2xl bg-pink-50 dark:bg-rose-900/40 border border-pink-200 dark:border-rose-800 text-rose-900 dark:text-rose-100 text-sm space-y-2 animate-fade-in">
              <p className="font-bold">
                {selectedOption === currentQ.correct_index ? 'Correct! 🎉' : 'Oopsie! 💕'}
              </p>
              {currentQ.explanation && <p className="text-xs italic">{currentQ.explanation}</p>}
            </div>
          )}

          {selectedOption !== null && (
            <button
              onClick={handleNext}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-base shadow-lg hover:scale-[1.01] transition-all"
            >
              {currentIndex + 1 < questions.length ? 'Next Question 👉' : 'See Results 🏆'}
            </button>
          )}
        </div>
      )}
    </section>
  );
};
