import React, { useState, useEffect } from 'react';
import { Institution, StudentProfile, AptitudeQuestion, QuizAttempt } from '../types/placement';
import { INITIAL_APTITUDE_QUESTIONS } from '../data/mockData';
import { generateCustomAptitudeQuestions } from '../services/geminiService';
import { saveQuizAttempt } from '../services/placementService';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  RotateCcw, 
  Award, 
  ChevronRight, 
  Zap, 
  BookOpen 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AptitudePracticeQuizProps {
  institution: Institution;
  student: StudentProfile;
}

export const AptitudePracticeQuiz: React.FC<AptitudePracticeQuizProps> = ({
  institution,
  student
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [questions, setQuestions] = useState<AptitudeQuestion[]>(INITIAL_APTITUDE_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizActive, setQuizActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  const [submitted, setSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Timer countdown
  useEffect(() => {
    let timer: any;
    if (quizActive && !submitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizActive, submitted, timeLeft]);

  const handleStartQuiz = () => {
    let filtered = INITIAL_APTITUDE_QUESTIONS;
    if (selectedCategory !== 'All') {
      filtered = INITIAL_APTITUDE_QUESTIONS.filter(q => q.category === selectedCategory);
    }
    setQuestions(filtered);
    setCurrentIndex(0);
    setUserAnswers({});
    setSubmitted(false);
    setTimeLeft(filtered.length * 90); // 90 seconds per question
    setQuizActive(true);
  };

  const handleGenerateAIQuestions = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateCustomAptitudeQuestions(
        selectedCategory === 'All' ? 'Quantitative' : selectedCategory,
        'Medium'
      );
      if (generated && generated.length > 0) {
        setQuestions(generated);
        setCurrentIndex(0);
        setUserAnswers({});
        setSubmitted(false);
        setTimeLeft(generated.length * 90);
        setQuizActive(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (submitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  const handleAutoSubmit = async () => {
    handleSubmitQuiz();
  };

  const handleSubmitQuiz = async () => {
    setSubmitted(true);
    setQuizActive(false);

    let score = 0;
    const breakdown = questions.map((q, idx) => {
      const uAns = userAnswers[idx];
      const isCorrect = uAns === q.correctIndex;
      if (isCorrect) score += 1;
      return {
        questionText: q.question,
        userAnswer: uAns !== undefined ? uAns : -1,
        correctAnswer: q.correctIndex,
        isCorrect
      };
    });

    const percentage = Math.round((score / questions.length) * 100);

    const attempt: QuizAttempt = {
      id: 'quiz_' + Date.now(),
      studentEmail: student.email,
      studentName: student.name,
      institutionId: institution.id,
      category: selectedCategory,
      score,
      total: questions.length,
      percentage,
      timeTakenSeconds: (questions.length * 90) - timeLeft,
      completedAt: new Date().toISOString(),
      breakdown
    };

    await saveQuizAttempt(attempt);

    if (percentage >= 70) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) correct++;
    });
    return correct;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-xs border border-emerald-500/20 mb-2">
            <Clock className="w-3.5 h-3.5" />
            Timed Campus Placement Assessments
          </div>
          <h2 className="text-2xl font-black text-white">Aptitude & Technical Practice Tests</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Simulate company online assessment (OA) conditions with real countdown timers, negative marking previews, and Gemini AI-generated question banks.
          </p>
        </div>

        {!quizActive && !submitted && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleGenerateAIQuestions}
              disabled={isGenerating}
              className="px-4 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              {isGenerating ? 'Generating...' : 'Gemini AI Custom Test'}
            </button>
            <button
              onClick={handleStartQuiz}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-600/20"
            >
              <Zap className="w-3.5 h-3.5" />
              Start Standard Test
            </button>
          </div>
        )}
      </div>

      {/* Category Filter Pills (When idle) */}
      {!quizActive && !submitted && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['All', 'Quantitative', 'Logical Reasoning', 'Core CS & Data Structures', 'Verbal'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Active Quiz View */}
      {quizActive && currentQ && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          {/* Top Bar with Timer and Progress */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {currentQ.category}
              </span>
              <span className="text-xs text-slate-400">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-sm ${
              timeLeft < 60 ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-slate-800 text-amber-300 border border-slate-700'
            }`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Question Statement */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {currentQ.codeSnippet && (
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto">
                <code>{currentQ.codeSnippet}</code>
              </pre>
            )}

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = userAnswers[currentIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleOptionSelect(optIdx)}
                    className={`p-4 rounded-xl border text-left text-sm transition flex items-center gap-3 ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-500 text-white font-medium shadow-md shadow-indigo-600/10'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <span className={`h-6 w-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold rounded-lg"
            >
              Previous
            </button>

            {/* Question Quick Jump Badges */}
            <div className="hidden sm:flex items-center gap-1.5">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                    currentIndex === idx
                      ? 'ring-2 ring-indigo-500 bg-indigo-600 text-white'
                      : userAnswers[idx] !== undefined
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-600/20"
                >
                  Submit Assessment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Result Breakdown View */}
      {submitted && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white">Assessment Completed</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Your test response has been recorded to your placement profile and benchmarked against campus percentiles.
            </p>

            <div className="inline-flex items-center gap-6 p-4 bg-slate-800/80 rounded-2xl border border-slate-700">
              <div>
                <p className="text-xs text-slate-400">Total Score</p>
                <p className="text-2xl font-extrabold text-emerald-400">
                  {calculateScore()} / {questions.length}
                </p>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div>
                <p className="text-xs text-slate-400">Percentage</p>
                <p className="text-2xl font-extrabold text-white">
                  {Math.round((calculateScore() / questions.length) * 100)}%
                </p>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div>
                <p className="text-xs text-slate-400">Status</p>
                <p className={`text-base font-bold ${
                  (calculateScore() / questions.length) >= 0.7 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {(calculateScore() / questions.length) >= 0.7 ? 'Cutoff Cleared' : 'Needs Practice'}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleStartQuiz}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold inline-flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retake Assessment
              </button>
            </div>
          </div>

          {/* Solutions & Explanations */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Detailed Solutions & Explanations
            </h4>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const userAns = userAnswers[idx];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div key={idx} className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-white">
                        {idx + 1}. {q.question}
                      </p>
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold shrink-0">
                          <CheckCircle className="w-4 h-4" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400 text-xs font-bold shrink-0">
                          <XCircle className="w-4 h-4" /> Incorrect
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 space-y-1">
                      <p>Your Answer: <strong className={isCorrect ? 'text-emerald-400' : 'text-red-400'}>
                        {userAns !== undefined ? q.options[userAns] : 'Not Answered'}
                      </strong></p>
                      <p>Correct Answer: <strong className="text-emerald-400">{q.options[q.correctIndex]}</strong></p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 border border-slate-800 mt-2">
                      <p className="font-bold text-slate-400 mb-0.5">Explanation:</p>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
