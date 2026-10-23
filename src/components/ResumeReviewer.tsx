import React, { useState, useRef } from 'react';
import { Institution, StudentProfile, ResumeReviewResult } from '../types/placement';
import { reviewResumeWithAI } from '../services/geminiService';
import { saveResumeReview } from '../services/placementService';
import { parsePdfResume, ParsedResumePDF } from '../utils/pdfParser';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Target, 
  Copy, 
  Check, 
  RefreshCw,
  UploadCloud,
  FileCheck2,
  Trash2,
  Eye,
  EyeOff,
  FileType,
  AlertTriangle,
  Layers,
  FileUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResumeReviewerProps {
  institution: Institution;
  student: StudentProfile;
}

const SAMPLE_DEMO_RESUME = `Dharineesh R
Email: dharineesh1701@gmail.com | Phone: +91 98765 43210
GitHub: github.com/dharineesh | LinkedIn: linkedin.com/in/dharineesh
B.Tech in Computer Science & Engineering | CGPA: 8.85 / 10.0

EDUCATION:
- B.Tech Computer Science, Tier-1 Institute (2021 - 2025) | CGPA: 8.85
- Higher Secondary Certificate: 96.4%

TECHNICAL SKILLS:
- Languages: C++, Python, TypeScript, JavaScript, SQL, Go
- Frameworks & Tools: React 19, Node.js, Express, Tailwind CSS, Docker, Kubernetes, Git
- Cloud & Databases: Google Cloud Platform (GCP), Firebase Firestore, PostgreSQL, Redis
- Core CS: Data Structures & Algorithms, System Design, Operating Systems, Computer Networks, DBMS

PROJECTS:
1. Campus Placement & Career AI Automation Platform
- Architected a multi-tenant university placement platform serving 4+ institutions using React, TypeScript, and Firebase Firestore.
- Implemented automated AI mock technical interviews with Gemini 2.5 Flash, reducing candidate interview preparation turnaround by 65%.
- Integrated real-time automated applicant tracking, simulated ATS resume evaluation, and scheduled deadline email notification digests.

2. Distributed High-Throughput In-Memory Key-Value Cache
- Engineered a distributed cache in Go supporting Raft consensus protocol, node failover, and log replication.
- Achieved sub-3ms P99 read latencies and 45,000 QPS under simulated 128-thread concurrent benchmark workloads.
- Implemented LRU/LFU cache eviction policies with configurable memory limits and write-ahead logging (WAL).

3. Real-Time Collaborative Canvas Engine
- Built a multi-user vector drawing canvas utilizing WebSockets and conflict-free replicated data types (CRDTs).
- Optimized client-side frame rates to steady 60 FPS by rendering dirty regions via HTML5 Canvas.

WORK EXPERIENCE:
Software Development Engineer Intern — AlphaTech Cloud Services (May 2024 - July 2024)
- Optimized PostgreSQL indexing and query execution plans for billing microservice, slashing slow query latency by 42%.
- Developed containerized CI/CD pipelines with Docker and GitHub Actions, cutting mean deployment times from 28 to 9 minutes.
- Authored automated integration and unit test suites reaching 88% codebase branch coverage.

HONORS & ACHIEVEMENTS:
- Global Rank 182 / 12,000+ participants in Google Kickstart Round F.
- Winner, Smart India Hackathon (SIH 2024), Software Edition.
- Solved 650+ Data Structures and Algorithms problems on LeetCode (Knight rating 1940+).`;

export const ResumeReviewer: React.FC<ResumeReviewerProps> = ({
  institution,
  student
}) => {
  const [targetRole, setTargetRole] = useState('Software Development Engineer');
  const [targetCompany, setTargetCompany] = useState('Google / Top-Tier Product Tech');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeReviewResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // PDF Upload & Parsing States
  const [parsedPdf, setParsedPdf] = useState<ParsedResumePDF | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [isParsingPdf, setIsParsingPdf] = useState<boolean>(false);
  const [parseProgress, setParseProgress] = useState<{ stage: string; current: number; total: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [showRawTextPreview, setShowRawTextPreview] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle PDF file parsing via File API & pdfjs
  const processUploadedFile = async (file: File) => {
    setUploadError(null);

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Please select a valid PDF file (.pdf). Word docs or images are not supported directly.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File size exceeds the 15 MB limit. Please upload an optimized resume PDF.');
      return;
    }

    setIsParsingPdf(true);
    setParseProgress({ stage: 'Reading PDF file...', current: 1, total: 4 });

    try {
      const parsed = await parsePdfResume(file, (progress) => {
        setParseProgress(progress);
      });

      setParsedPdf(parsed);
      setResumeText(parsed.text);
      setUploadError(null);
    } catch (err: unknown) {
      console.error('Failed to parse PDF resume:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse text from the uploaded PDF.';
      setUploadError(errorMessage);
    } finally {
      setIsParsingPdf(false);
      setParseProgress(null);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setParsedPdf(null);
    setResumeText('');
    setResult(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSamplePdfSimulation = () => {
    const words = SAMPLE_DEMO_RESUME.split(/\s+/).filter(Boolean);
    setParsedPdf({
      fileName: 'Dharineesh_Resume_SDE_2025.pdf',
      fileSizeBytes: 142800,
      fileSizeFormatted: '139.5 KB',
      pageCount: 1,
      text: SAMPLE_DEMO_RESUME,
      wordCount: words.length,
      characterCount: SAMPLE_DEMO_RESUME.length
    });
    setResumeText(SAMPLE_DEMO_RESUME);
    setUploadError(null);
  };

  // Run ATS scan using parsed raw text
  const handleAnalyzeResume = async () => {
    if (!resumeText.trim()) {
      setUploadError('Please upload a PDF resume first to extract text for analysis.');
      return;
    }
    setLoading(true);
    setUploadError(null);

    try {
      const review = await reviewResumeWithAI({
        resumeText,
        targetRole,
        targetCompany,
        studentName: student.name,
        studentEmail: student.email,
        institutionId: institution.id
      });

      setResult(review);
      await saveResumeReview(review);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      setUploadError('Failed to complete AI ATS analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold text-xs border border-indigo-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            PDF File-API Text Extraction & ATS Engine
          </div>
          <h2 className="text-2xl font-black text-white">AI Placement Resume Reviewer</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Upload your resume PDF directly. Our file-parsing engine extracts selectable text and checks against tier-1 recruitment filters for match rate, missing technical keywords, and Google X-Y-Z formula rewrites.
          </p>
        </div>

        <button
          onClick={handleAnalyzeResume}
          disabled={loading || isParsingPdf || !resumeText.trim()}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Scanning Resume ATS...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Analyze & Score Resume
            </>
          )}
        </button>
      </div>

      {/* Editor & Targets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: PDF File Parsing Utility & Target Preferences */}
        <div className="lg:col-span-1 space-y-4">
          {/* Target Role & Benchmark */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Target Benchmark</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                Placement Drive
              </span>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. SDE-1, Cloud Engineer, Data Scientist"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">Target Company</label>
              <input
                type="text"
                value={targetCompany}
                onChange={e => setTargetCompany(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Google, Microsoft, Adobe, Goldman Sachs"
              />
            </div>
          </div>

          {/* PDF Resume File Parser Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileType className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">PDF Resume Upload</h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                File API / PDF.js
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Upload your official campus resume in PDF format. Text is parsed automatically on-device.
            </p>

            {/* Hidden native input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="application/pdf,.pdf"
              className="hidden"
            />

            {/* Drag & Drop Upload Zone */}
            {!parsedPdf ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                  isDragOver
                    ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
                    : 'border-slate-700 hover:border-indigo-500/60 bg-slate-800/40 hover:bg-slate-800/70'
                }`}
              >
                <div className="p-3.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <UploadCloud className="w-6 h-6 animate-pulse" />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-200">
                    Click to browse or drop your resume PDF
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Supports single or multi-page PDF documents up to 15 MB
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                  <FileUp className="w-3.5 h-3.5" />
                  Select PDF File
                </span>
              </div>
            ) : (
              /* Uploaded & Parsed File Card */
              <div className="bg-slate-800/70 border border-indigo-500/30 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate" title={parsedPdf.fileName}>
                        {parsedPdf.fileName}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span>{parsedPdf.fileSizeFormatted}</span>
                        <span>•</span>
                        <span>{parsedPdf.pageCount} {parsedPdf.pageCount === 1 ? 'Page' : 'Pages'}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-medium">{parsedPdf.wordCount} words</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleRemoveFile}
                    title="Remove and upload different PDF"
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Parsing Status Pill */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Text Successfully Extracted
                  </span>
                  <button
                    onClick={() => setShowRawTextPreview(!showRawTextPreview)}
                    className="text-indigo-400 hover:text-indigo-300 font-medium text-[11px] flex items-center gap-1"
                  >
                    {showRawTextPreview ? (
                      <>
                        <EyeOff className="w-3 h-3" /> Hide Extracted Text
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" /> View Extracted Text
                      </>
                    )}
                  </button>
                </div>

                {/* Expandable Raw Text View */}
                {showRawTextPreview && (
                  <div className="space-y-1.5 pt-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>ATS Text Feed ({parsedPdf.characterCount} chars)</span>
                      <span>Editable if needed</span>
                    </div>
                    <textarea
                      rows={6}
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-[11px] font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Live Parsing Progress Indicator */}
            {isParsingPdf && parseProgress && (
              <div className="p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    {parseProgress.stage}
                  </span>
                  <span>{parseProgress.current} / {parseProgress.total}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-1.5 transition-all duration-300"
                    style={{ width: `${Math.round((parseProgress.current / parseProgress.total) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {uploadError && (
              <div className="p-3 bg-red-950/30 border border-red-900/40 rounded-xl text-xs text-red-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span className="leading-snug">{uploadError}</span>
              </div>
            )}

            {/* Alternative Demo Action */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Don't have a PDF ready?</span>
              <button
                type="button"
                onClick={handleLoadSamplePdfSimulation}
                className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs hover:underline flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5" />
                Try Sample Campus Resume
              </button>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
            <p className="font-semibold text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ATS Parser Best Practices:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
              <li>Use single-column standard fonts (Arial, Calibri, Inter).</li>
              <li>Avoid rasterized graphics, tables, or scanned snapshots.</li>
              <li>Include measurable metrics (percentages, latency, QPS, scale).</li>
            </ul>
          </div>
        </div>

        {/* Right Column: AI Analysis Result */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <div className="space-y-6 animate-in fade-in">
              {/* Score Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-slate-800"
                        fill="transparent"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - result.atsScore / 100)}
                        className={`${
                          result.atsScore >= 80 ? 'text-emerald-500' : result.atsScore >= 60 ? 'text-indigo-500' : 'text-amber-500'
                        }`}
                        fill="transparent"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-2xl font-black text-white">{result.atsScore}</span>
                      <span className="text-[10px] text-slate-400 block -mt-1">/100</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">Overall ATS Alignment Score</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-md">{result.summaryVerdict}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {result.atsScore >= 75 ? 'Ready for Campus Drives' : 'Requires Metric Tuning'}
                      </span>
                      <span className="text-xs text-slate-500">Evaluated against {targetRole}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Missing Keywords & Strengths Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs uppercase font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Key Strengths Identified
                  </h4>
                  <ul className="space-y-2">
                    {result.strengths.map((str, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs uppercase font-bold text-amber-400 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Recommended Missing ATS Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-medium">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Critical Fixes */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs uppercase font-bold text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Critical Recommended Corrections
                </h4>
                <div className="space-y-2">
                  {result.criticalFixes.map((fix, idx) => (
                    <div key={idx} className="p-3 bg-red-950/20 border border-red-900/30 rounded-xl text-xs text-slate-200">
                      {fix}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bullet Point Rewrites */}
              {result.bulletPointImprovements && result.bulletPointImprovements.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    AI Quantified Bullet Point Rewrites
                  </h4>

                  <div className="space-y-4">
                    {result.bulletPointImprovements.map((item, idx) => (
                      <div key={idx} className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-3">
                        <div>
                          <p className="text-[11px] font-bold uppercase text-slate-400">Original Bullet:</p>
                          <p className="text-xs text-slate-400 line-through mt-0.5">{item.original}</p>
                        </div>

                        <div className="p-3 bg-slate-900 rounded-lg border border-indigo-500/30">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-bold uppercase text-emerald-400">High-Impact Rewrite (X-Y-Z):</span>
                            <button
                              onClick={() => copyToClipboard(item.improved, idx)}
                              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold cursor-pointer"
                            >
                              {copiedIndex === idx ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  Copy Bullet
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-xs font-medium text-emerald-300">{item.improved}</p>
                        </div>

                        <p className="text-[11px] text-slate-400">
                          <strong>Why it works:</strong> {item.impact}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No Resume Analysis Run Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {parsedPdf 
                  ? 'Your PDF has been parsed into raw text! Click "Analyze & Score Resume" above to start ATS evaluation.'
                  : 'Upload your campus resume PDF on the left. The file parser will automatically extract the content for instant ATS scoring and keyword gap analysis.'}
              </p>
              {parsedPdf && (
                <button
                  onClick={handleAnalyzeResume}
                  disabled={loading}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition inline-flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Start AI ATS Evaluation Now
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
