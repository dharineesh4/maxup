import React, { useState, useEffect, useRef } from 'react';
import { Institution, StudentProfile, MockInterviewSession, InterviewMessage } from '../types/placement';
import { generateInterviewResponse, generateFinalInterviewReport } from '../services/geminiService';
import { saveMockInterview } from '../services/placementService';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Award, 
  CheckCircle2, 
  RotateCcw, 
  Mic, 
  Volume2, 
  Zap, 
  Target, 
  Sliders, 
  ThumbsUp, 
  AlertTriangle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AIMockInterviewCoachProps {
  institution: Institution;
  student: StudentProfile;
  initialRole?: string;
  initialCompany?: string;
}

export const AIMockInterviewCoach: React.FC<AIMockInterviewCoachProps> = ({
  institution,
  student,
  initialRole = 'Full Stack Software Engineer',
  initialCompany = 'Google'
}) => {
  const [role, setRole] = useState(initialRole);
  const [companyType, setCompanyType] = useState(initialCompany);
  const [difficulty, setDifficulty] = useState<'Standard' | 'Challenging' | 'FAANG Tier'>('Challenging');
  const [inSession, setInSession] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [candidateInput, setCandidateInput] = useState('');
  const [transcript, setTranscript] = useState<InterviewMessage[]>([]);
  const [finalReport, setFinalReport] = useState<any>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Start a new interview session
  const startInterview = async () => {
    setInSession(true);
    setFinalReport(null);
    setLoadingAI(true);

    const initialAIMessage: InterviewMessage = {
      id: 'msg_0',
      sender: 'ai',
      text: `Hello ${student.name}! Welcome to your technical mock interview for the ${role} position${companyType ? ` at ${companyType}` : ''}. I will be assessing your algorithmic reasoning, architecture design, and crisp technical communication at a ${difficulty} standard.\n\nTo begin: Could you briefly walk me through a complex technical problem you tackled recently, highlighting the key trade-offs you evaluated?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTranscript([initialAIMessage]);
    setLoadingAI(false);
  };

  // Submit candidate answer to Gemini
  const handleSendAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateInput.trim() || loadingAI) return;

    const userMsg: InterviewMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: candidateInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedTranscript = [...transcript, userMsg];
    setTranscript(updatedTranscript);
    setCandidateInput('');
    setLoadingAI(true);

    try {
      const aiResponse = await generateInterviewResponse({
        role,
        difficulty,
        transcript: updatedTranscript.map(m => ({ sender: m.sender, text: m.text })),
        candidateAnswer: userMsg.text
      });

      const aiMsg: InterviewMessage = {
        id: 'msg_' + Date.now() + '_ai',
        sender: 'ai',
        text: aiResponse.replyQuestion,
        feedback: aiResponse.feedback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setTranscript([...updatedTranscript, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  // Finish interview and get comprehensive final scorecard
  const handleFinishInterview = async () => {
    setLoadingAI(true);
    try {
      const report = await generateFinalInterviewReport({
        role,
        difficulty,
        transcript: transcript.map(m => ({ sender: m.sender, text: m.text }))
      });

      setFinalReport(report);

      // Persist in Firestore
      const sessionData: MockInterviewSession = {
        id: 'mock_' + Date.now(),
        studentEmail: student.email,
        studentName: student.name,
        institutionId: institution.id,
        role,
        companyType,
        difficulty,
        transcript,
        overallScore: report.overallScore,
        finalFeedback: {
          technicalAccuracy: report.technicalAccuracy,
          communication: report.communication,
          problemSolving: report.problemSolving,
          executiveSummary: report.executiveSummary,
          actionableAdvice: report.actionableAdvice
        },
        status: 'completed',
        startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        completedAt: new Date().toISOString()
      };

      await saveMockInterview(sessionData);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold text-xs border border-indigo-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by Google Gemini 2.5 Flash
            </div>
            <h2 className="text-2xl font-black text-white">AI Mock Interview Coach</h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Conduct dynamic, real-time technical & behavioural interviews. Receive immediate response-by-response coaching and in-depth rubric scorecards calibrated for campus placements.
            </p>
          </div>

          {!inSession && (
            <button
              onClick={startInterview}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition whitespace-nowrap"
            >
              <Zap className="w-4 h-4 fill-white" />
              Launch Mock Interview
            </button>
          )}
        </div>
      </div>

      {/* Configuration Panel (When not in session or reviewing) */}
      {!inSession && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-2">Target Role</label>
            <input
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Software Development Engineer"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-2">Target Company / Culture</label>
            <input
              type="text"
              value={companyType}
              onChange={e => setCompanyType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Google, Microsoft, Goldman Sachs"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-2">Rigour & Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Standard', 'Challenging', 'FAANG Tier'] as const).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition ${
                    difficulty === d
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* In-Session Live Interview Room */}
      {inSession && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Interview Conversation Stream */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[650px] overflow-hidden">
            {/* Session Top Bar */}
            <div className="px-5 py-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-white">{role}</h3>
                  <p className="text-xs text-slate-400">{companyType} • {difficulty} Level</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleFinishInterview}
                  disabled={loadingAI || transcript.length < 3}
                  className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  Conclude & Score
                </button>
                <button
                  onClick={() => {
                    setInSession(false);
                    setTranscript([]);
                    setFinalReport(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  title="Reset session"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {transcript.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-start gap-2.5 max-w-[85%]">
                    {msg.sender === 'ai' && (
                      <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div>
                      <div
                        className={`p-4 rounded-2xl text-sm leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>

                      {/* AI Immediate Inline Feedback & Rating */}
                      {msg.feedback && (
                        <div className="mt-2 p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-xs space-y-1">
                          <div className="flex items-center justify-between text-indigo-300 font-bold mb-1">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-indigo-400" />
                              Gemini Real-Time Coaching Feedback:
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                              {msg.feedback.scoreOutOfTen}/10
                            </span>
                          </div>
                          <p className="text-emerald-300">
                            <strong>Strength:</strong> {msg.feedback.strengths}
                          </p>
                          <p className="text-amber-300">
                            <strong>Tip:</strong> {msg.feedback.improvements}
                          </p>
                        </div>
                      )}

                      <span className="text-[10px] text-slate-500 mt-1 block px-1">
                        {msg.timestamp}
                      </span>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="h-8 w-8 rounded-lg bg-slate-700 text-slate-300 flex items-center justify-center shrink-0 text-xs font-bold">
                        {student.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loadingAI && (
                <div className="flex items-center gap-3 text-slate-400 text-xs py-2">
                  <div className="h-8 w-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <span>Evaluating answer & formulating follow-up probe...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Answer Input Bar */}
            <form onSubmit={handleSendAnswer} className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
              <textarea
                value={candidateInput}
                onChange={e => setCandidateInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendAnswer(e);
                  }
                }}
                placeholder="Type your structured answer here (STAR format recommended)... Press Enter to submit"
                rows={2}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <button
                type="submit"
                disabled={loadingAI || !candidateInput.trim()}
                className="px-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center shadow-lg shadow-indigo-600/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Panel: Performance Telemetry & Final Report */}
          <div className="space-y-4">
            {finalReport ? (
              <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    Final Evaluation Scorecard
                  </h3>
                  <span className="text-2xl font-black text-emerald-400">
                    {finalReport.overallScore}/100
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Technical Depth</span>
                      <span className="font-bold text-white">{finalReport.technicalAccuracy}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${finalReport.technicalAccuracy}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Communication & Structure</span>
                      <span className="font-bold text-white">{finalReport.communication}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${finalReport.communication}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Problem Solving & Trade-offs</span>
                      <span className="font-bold text-white">{finalReport.problemSolving}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${finalReport.problemSolving}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs">
                  <p className="font-bold text-slate-200 mb-1">Executive Summary:</p>
                  <p className="text-slate-300 leading-relaxed">{finalReport.executiveSummary}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase text-slate-400">Actionable Placement Advice:</p>
                  {finalReport.actionableAdvice?.map((tip: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setInSession(false);
                    startInterview();
                  }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition"
                >
                  Start Another Round
                </button>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-400" />
                  Interview Preparation Rubric
                </h3>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
                    <p className="font-semibold text-white mb-1">💡 STAR Response Method</p>
                    <p className="text-slate-400">
                      Structure your answers: <strong>Situation</strong>, <strong>Task</strong>, <strong>Action taken</strong>, and quantified <strong>Result</strong>.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
                    <p className="font-semibold text-white mb-1">⚡ Complexity Trade-offs</p>
                    <p className="text-slate-400">
                      Explicitly articulate Time vs Space complexity trade-offs (e.g. O(N log N) sorting vs O(N) hash map storage).
                    </p>
                  </div>

                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
                    <p className="font-semibold text-white mb-1">🎯 Questions Answered</p>
                    <p className="text-slate-400">
                      Current exchanges: <strong className="text-indigo-400">{transcript.filter(t => t.sender === 'user').length}</strong>. Answer at least 3 questions to unlock the full final scorecard.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
