import React, { useState, useEffect, useRef } from 'react';
import { MockTest, Question, TestResult } from '../types';
import { 
  Clock, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Bookmark, 
  CheckCircle, 
  XCircle,
  TrendingUp, 
  ArrowLeft,
  BookOpen,
  Info,
  ZoomIn,
  ZoomOut,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Columns,
  AlignLeft,
  Sparkles,
  Calendar,
  Users,
  Gavel,
  Scale,
  AlertTriangle,
  ListTodo
} from 'lucide-react';
import { motion } from 'motion/react';
import { getJudgementBrief } from '../data/judgementBriefs';

const cleanOptionText = (text: string): string => {
  if (!text) return '';
  const match = text.match(/^[A-H][\.\)]\s+(.*)/i);
  if (match) {
    return match[1];
  }
  return text;
};

interface MockTestEngineProps {
  test: MockTest;
  onExit: () => void;
  onSubmitResult: (result: TestResult) => void;
}

export default function MockTestEngine({ test, onExit, onSubmitResult }: MockTestEngineProps) {
  // We flatten the list of questions for easy global indexing (0 to totalQuestionsCount-1)
  const allQuestionsWithContext = React.useMemo(() => {
    const list: { question: Question; passageTitle: string; passageText: string; passageIndex: number; localIndex: number; globalIndex: number }[] = [];
    let globalIdx = 0;
    
    test.passages.forEach((passage, pIdx) => {
      passage.questions.forEach((q, qIdx) => {
        list.push({
          question: q,
          passageTitle: passage.title,
          passageText: passage.text,
          passageIndex: pIdx,
          localIndex: qIdx,
          globalIndex: globalIdx++
        });
      });
    });
    return list;
  }, [test]);

  const totalQuestions = allQuestionsWithContext.length;

  const [currentGlobalIndex, setCurrentGlobalIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isMarkedForReview, setIsMarkedForReview] = useState<Record<number, boolean>>({});
  const [visitedQuestions, setVisitedQuestions] = useState<Record<number, boolean>>({ 0: true });

  // Paragraph visibility & interaction states for enhanced aspirant engagement
  const [layoutMode, setLayoutMode] = useState<'stacked' | 'split' | 'passage-focus' | 'question-focus'>('stacked');
  const [passageViewTab, setPassageViewTab] = useState<'text' | 'brief'>('text');
  const [passageFontSize, setPassageFontSize] = useState(14); // in px
  const [showRuler, setShowRuler] = useState(false);
  const [rulerTop, setRulerTop] = useState(0);
  const passageContainerRef = useRef<HTMLDivElement>(null);

  // Drag tracking mouse hover location for reading focus bar
  const handlePassageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showRuler || !passageContainerRef.current) return;
    const rect = passageContainerRef.current.getBoundingClientRect();
    const relativeY = e.clientY - rect.top + passageContainerRef.current.scrollTop;
    setRulerTop(relativeY);
  };

  // Timer Setup (Minutes to Seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(test.durationMinutes * 60);
  const [testActive, setTestActive] = useState(true);
  const [showFinishedSummary, setShowFinishedSummary] = useState(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Record spent seconds each interval
    if (testActive && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleCompleteSubmission();
            return 0;
          }
          return prev - 1;
        });
        setTimeSpentSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testActive]);

  // Handle marking a question as Visited
  const selectGlobalIndex = (idx: number) => {
    setCurrentGlobalIndex(idx);
    setVisitedQuestions(prev => ({ ...prev, [idx]: true }));
  };

  const handleSelectOption = (optionIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentGlobalIndex]: optionIdx
    }));
  };

  const handleClearAnswer = () => {
    setSelectedAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentGlobalIndex];
      return copy;
    });
  };

  const handleToggleReview = () => {
    setIsMarkedForReview(prev => ({
      ...prev,
      [currentGlobalIndex]: !prev[currentGlobalIndex]
    }));
  };

  const handleNext = () => {
    if (currentGlobalIndex < totalQuestions - 1) {
      selectGlobalIndex(currentGlobalIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentGlobalIndex > 0) {
      selectGlobalIndex(currentGlobalIndex - 1);
    }
  };

  // Score calculation engine
  const calculateFinalScores = () => {
    let corrCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    allQuestionsWithContext.forEach((ctx, idx) => {
      const selection = selectedAnswers[idx];
      if (selection === undefined) {
        skippedCount++;
      } else if (selection === ctx.question.correctAnswer) {
        corrCount++;
      } else {
        wrongCount++;
      }
    });

    // Score calculation formula: (+1.00 per correct, -0.25 per wrong)
    const rawScore = corrCount * 1.0 - wrongCount * 0.25;
    const finalScore = Number(rawScore.toFixed(2));
    const percentage = Number(((corrCount / totalQuestions) * 100).toFixed(1));

    return {
      score: finalScore,
      correctCount: corrCount,
      wrongCount: wrongCount,
      skippedCount: skippedCount,
      percentage
    };
  };

  const handleCompleteSubmission = () => {
    setTestActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const results = calculateFinalScores();

    const finalizedResult: TestResult = {
      id: `res-${Date.now()}`,
      testId: test.id,
      testTitle: test.title,
      score: results.score,
      correctCount: results.correctCount,
      wrongCount: results.wrongCount,
      skippedCount: results.skippedCount,
      totalQuestions: totalQuestions,
      date: new Date().toLocaleDateString(),
      timeSpentSeconds,
      percentage: results.percentage
    };

    setShowFinishedSummary(true);
    // Push updates to parent user object right away so dashboard logs compile nicely
    onSubmitResult(finalizedResult);
  };

  const formatTimer = (totSecs: number) => {
    const mins = Math.floor(totSecs / 60);
    const secs = totSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeContext = allQuestionsWithContext[currentGlobalIndex];

  // Helper colors for question navigation status card palette
  const getPaletteBadgeStyle = (idx: number) => {
    const isAnswered = selectedAnswers[idx] !== undefined;
    const isFlagged = isMarkedForReview[idx];
    const isVisited = visitedQuestions[idx];

    if (idx === currentGlobalIndex) {
      return 'ring-2 ring-amber-500 ring-offset-2 ring-offset-zinc-950 font-bold';
    }

    if (isFlagged) {
      return 'bg-purple-900 border-purple-600 text-purple-100'; // Marked for review
    }
    if (isAnswered) {
      return 'bg-emerald-950 border-emerald-600 text-emerald-200'; // Answered
    }
    if (isVisited) {
      return 'bg-zinc-800 border-zinc-700 text-zinc-300'; // Visited but not answered
    }
    return 'bg-zinc-950 border-zinc-900 text-zinc-600'; // Purely unvisited
  };

  // Review Summary statistics
  const answeredCount = Object.keys(selectedAnswers).length;
  const flaggedCount = Object.values(isMarkedForReview).filter(Boolean).length;
  const unattemptedCount = totalQuestions - answeredCount;

  if (showFinishedSummary) {
    const scoreMetrics = calculateFinalScores();
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-2 py-4">
        
        {/* Header navigation back */}
        <button
          type="button"
          id="btn-back-dashboard"
          onClick={onExit}
          className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 text-xs font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-500" /> Exit to Dashboard
        </button>

        {/* Score cards header */}
        <div className="bg-[#0b0b0d] border border-zinc-800/80 rounded-3xl p-6 text-center space-y-4 shadow-xl">
          <div className="inline-flex justify-center items-center w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500 mb-2">
            <BookOpen className="w-5.5 h-5.5" />
          </div>

          <h2 className="text-lg font-extrabold text-white font-sans">{test.title} Results</h2>
          <p className="text-zinc-400 text-xs max-w-lg mx-auto leading-relaxed">
            Your performance has been evaluated strictly using the CLAT PG scoring rubric. Each incorrect response incurs an incremental -0.25 point deduction index.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-4">
            <div className="bg-[#070709] border border-zinc-800/60 p-3 rounded-xl shadow-inner">
              <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest block font-bold">Final Score</span>
              <p className="text-xl font-mono font-bold text-amber-500 mt-1">{scoreMetrics.score.toFixed(2)}</p>
              <span className="text-[9px] text-zinc-600 block mt-0.5">out of {totalQuestions}.0</span>
            </div>

            <div className="bg-[#070709] border border-zinc-800/60 p-3 rounded-xl shadow-inner">
              <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest block font-bold">Accuracy Rate</span>
              <p className="text-xl font-mono font-bold text-emerald-400 mt-1">{scoreMetrics.percentage.toFixed(0)}%</p>
              <span className="text-[9px] text-zinc-600 block mt-0.5">{scoreMetrics.correctCount} Correct / {totalQuestions}</span>
            </div>

            <div className="bg-[#070709] border border-zinc-800/60 p-3 rounded-xl shadow-inner">
              <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest block font-bold">Incorrect</span>
              <p className="text-xl font-mono font-bold text-red-400 mt-1">{scoreMetrics.wrongCount}</p>
              <span className="text-[9px] text-red-500 font-mono block mt-0.5">-{(scoreMetrics.wrongCount * 0.25).toFixed(2)} Penalty</span>
            </div>

            <div className="bg-[#070709] border border-zinc-800/60 p-3 rounded-xl shadow-inner">
              <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest block font-bold">Time Taken</span>
              <p className="text-xl font-mono font-bold text-zinc-300 mt-1">
                {Math.floor(timeSpentSeconds / 60)}m {timeSpentSeconds % 60}s
              </p>
              <span className="text-[9px] text-zinc-600 block mt-0.5">Avg {Math.round(timeSpentSeconds / totalQuestions)}s / Q</span>
            </div>
          </div>
        </div>

        {/* Detailed Solutions Explorer */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">Precedent and Solutions Explorer</h3>

          <div className="space-y-4">
            {allQuestionsWithContext.map((item, idx) => {
              const selectedOpt = selectedAnswers[idx];
              const isCorrect = selectedOpt === item.question.correctAnswer;
              const hasAttempted = selectedOpt !== undefined;

              return (
                <div key={idx} className="bg-[#0b0b0d] border border-zinc-800/70 rounded-2xl p-5 space-y-4.5 shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[9px] bg-zinc-950 px-2.5 py-1 font-mono text-zinc-400 border border-zinc-900 rounded font-bold uppercase tracking-wider">
                      Question Q{idx + 1}
                    </span>

                    {hasAttempted ? (
                      isCorrect ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-800/20 px-2 py-0.5 rounded">
                          <CheckCircle className="w-3.5 h-3.5" /> +1.00 Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-red-400 bg-red-950/20 border border-red-800/20 px-2 py-0.5 rounded">
                          <XCircle className="w-3.5 h-3.5" /> -0.25 Incorrect
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-zinc-500 bg-zinc-950 border border-zinc-900 px-2 py-0.5 rounded uppercase">
                        0.00 Skipped
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-serif italic text-zinc-400 line-clamp-2 border-l-2 border-amber-500/70 pl-3">
                    Excerpt from: "{item.passageTitle}"
                  </p>

                  <h3 className="text-xs font-bold text-[#f3f4f6] leading-relaxed pt-1">
                    {item.question.text}
                  </h3>

                  {/* Options render */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 font-sans">
                    {item.question.options.map((opt, optIdx) => {
                      const isCorrectOpt = optIdx === item.question.correctAnswer;
                      const isSelectedOpt = optIdx === selectedOpt;
                      
                      let optStyle = 'bg-[#070709] border-zinc-850 text-zinc-400';
                      if (isCorrectOpt) {
                        optStyle = 'bg-emerald-950/25 border-emerald-500/50 text-emerald-300 font-bold';
                      } else if (isSelectedOpt) {
                        optStyle = 'bg-red-950/25 border-red-500/50 text-red-300';
                      }

                      return (
                        <div key={optIdx} className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${optStyle}`}>
                          <span className="font-mono mt-0.5 select-none text-zinc-500">{String.fromCharCode(65 + optIdx)}.</span>
                          <span>{cleanOptionText(opt)}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Legal Explanation Doctrine Box */}
                  <div className="bg-[#070709] border border-zinc-900 p-3 rounded-xl text-xs leading-relaxed space-y-1 mt-2.5 shadow-inner">
                    <span className="flex items-center gap-1 text-[9px] font-mono text-amber-500 font-bold uppercase tracking-widest">
                      <Info className="w-3 h-3 text-amber-500" /> Precedent / Doctrine Details
                    </span>
                    <p className="text-zinc-400 font-sans">{item.question.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            type="button"
            id="btn-return-dashboard-bottom"
            onClick={onExit}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-extrabold px-6 py-2.5 rounded-xl shadow-lg hover:from-amber-400 hover:to-amber-500 font-sans cursor-pointer transition-transform hover:scale-[1.01]"
          >
            Return to Study Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[77vh] max-w-6xl mx-auto border border-zinc-800/80 bg-[#08080a] rounded-3xl overflow-hidden shadow-2xl relative">
      
      {/* Test Engine Control Top Bar */}
      <div className="bg-[#0b0b0d] border-b border-zinc-900 py-3.5 px-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="engine-quit-btn"
            onClick={() => {
              if (window.confirm('Are you sure you want to quit the mock test? Your progress will not be analyzed.')) {
                onExit();
              }
            }}
            className="text-zinc-400 hover:text-zinc-200 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
          >
            &larr; Quit Exam
          </button>
          <span className="h-4 w-px bg-zinc-800" />
          <h3 className="text-xs font-extrabold text-white tracking-tight font-sans truncate max-w-[150px] sm:max-w-xs">{test.title}</h3>
        </div>

        {/* Aspirant Control Center: Dedicated Workspace Layout Switchers */}
        <div className="flex bg-zinc-950/80 p-0.5 rounded-xl border border-zinc-900 shrink-0 gap-1 select-none flex-wrap">
          <button
            type="button"
            onClick={() => setLayoutMode('stacked')}
            className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded-lg cursor-pointer transition-all flex items-center gap-1 ${
              layoutMode === 'stacked'
                ? 'bg-amber-500 text-zinc-950 font-extrabold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
            }`}
            title="Whole passage and questions stacked continuously in one go"
          >
            <Sparkles className="w-3.5 h-3.5" /> Full Stacked
          </button>

          <button
            type="button"
            onClick={() => setLayoutMode('passage-focus')}
            className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded-lg cursor-pointer transition-all flex items-center gap-1 ${
              layoutMode === 'passage-focus'
                ? 'bg-amber-500 text-zinc-950 font-extrabold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
            }`}
            title="Maximize Passage text visible canvas"
          >
            <AlignLeft className="w-3.5 h-3.5" /> Reader View
          </button>
          
          <button
            type="button"
            onClick={() => setLayoutMode('split')}
            className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded-lg cursor-pointer transition-all flex items-center gap-1 ${
              layoutMode === 'split'
                ? 'bg-amber-500 text-zinc-950 font-extrabold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
            }`}
            title="Side by side standard presentation"
          >
            <Columns className="w-3.5 h-3.5" /> Split Mode
          </button>

          <button
            type="button"
            onClick={() => setLayoutMode('question-focus')}
            className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded-lg cursor-pointer transition-all flex items-center gap-1 ${
              layoutMode === 'question-focus'
                ? 'bg-amber-500 text-zinc-950 font-extrabold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
            }`}
            title="Focus exclusively on the MCQs"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Solving Mode
          </button>
        </div>

        {/* Timer Badge */}
        {(() => {
          const isTimeCritical = secondsRemaining > 0 && secondsRemaining < 60;
          return (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-500 select-none ${
              isTimeCritical 
                ? 'bg-rose-950/40 border border-rose-500/50 text-rose-400 animate-pulse shadow-[0_0_18px_rgba(244,63,94,0.3)]' 
                : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
            }`}>
              <Clock className={`w-3.5 h-3.5 ${isTimeCritical ? 'text-rose-400' : 'text-amber-500 animate-pulse'}`} />
              <span className={isTimeCritical ? 'font-extrabold tracking-tight scale-105 transition-transform' : ''}>
                {formatTimer(secondsRemaining)}
              </span>
            </div>
          );
        })()}
      </div>

      {/* Main Dual-Column Split Screen Panel */}
      <div className={`flex-1 flex flex-col ${
        layoutMode === 'stacked' ? 'overflow-y-auto bg-[#0a0a0c]' : 'md:flex-row overflow-hidden'
      }`}>
        
        {/* Left Column: Extensive Judgment Reading Passage Excerpt */}
        <div className={`flex flex-col bg-[#0a0a0c] transition-all duration-300 ${
          layoutMode === 'stacked'
            ? 'w-full shrink-0 border-b border-zinc-900/60'
            : layoutMode === 'split' 
              ? 'w-full md:w-1/2 border-r border-[#151518] overflow-hidden' 
              : layoutMode === 'passage-focus' 
                ? 'w-full md:w-full overflow-hidden' 
                : 'hidden md:hidden'
        }`}>
          {/* Workstation Toolbar */}
          <div className="px-5 py-3 bg-[#0c0c10] border-b border-[#141417] flex flex-wrap items-center justify-between gap-3 shadow-sm select-none">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-zinc-300">Aspirant Workstation</span>
            </div>

            {/* Reading Assistance Panel */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Dynamic Font Size Control */}
              <div className="flex items-center bg-zinc-950/80 rounded-xl p-0.5 border border-zinc-900 gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setPassageFontSize(p => Math.max(11, p - 1))}
                  className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 cursor-pointer transition-colors"
                  title="Make text smaller"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[9px] text-zinc-500 font-mono px-1 select-none font-extrabold uppercase tracking-wider">
                  Font ({passageFontSize})
                </span>
                <button
                  type="button"
                  onClick={() => setPassageFontSize(p => Math.min(18, p + 1))}
                  className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 cursor-pointer transition-colors"
                  title="Make text larger"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Focus Line Guide Toggle */}
              <button
                type="button"
                onClick={() => setShowRuler(!showRuler)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-mono font-bold transition-all cursor-pointer select-none ${
                  showRuler 
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-sm shadow-amber-500/5' 
                    : 'bg-zinc-950/80 border-zinc-900 text-zinc-500 hover:text-zinc-300'
                }`}
                title="Dynamic highlight guide line following layout"
              >
                {showRuler ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Focus Guide</span>
              </button>
            </div>
          </div>

          {/* Secondary Tab Control representing Case Passage vs Landmark Brief */}
          <div className="flex bg-[#0b0b0e] border-b border-[#131316] p-1.5 select-none gap-2">
            <button
              type="button"
              onClick={() => setPassageViewTab('text')}
              className={`flex-1 py-1.5 text-[10px] font-sans font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                passageViewTab === 'text'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Case Passage Excerpt
            </button>
            <button
              type="button"
              onClick={() => setPassageViewTab('brief')}
              className={`flex-1 py-1.5 text-[10px] font-sans font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                passageViewTab === 'brief'
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.08)]'
                  : 'text-zinc-550 hover:text-zinc-350 border border-transparent'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Landmark Judgment Brief
            </button>
          </div>

          {/* Passage Reading Canvas */}
          <div 
            ref={passageContainerRef}
            onMouseMove={handlePassageMouseMove}
            className={`p-5 space-y-4 focus:outline-none relative select-text ${
              layoutMode === 'stacked' ? 'overflow-visible' : 'overflow-y-auto flex-1'
            }`}
          >
            {/* Draggable Hover Reading Ruler Indicator */}
            {showRuler && (
              <div 
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/80 to-transparent pointer-events-none transition-all duration-75 shadow-[0_0_10px_rgba(245,158,11,0.9)]"
                style={{ top: `${rulerTop}px` }}
              />
            )}

            {(() => {
              const passageId = test.passages[activeContext.passageIndex]?.id || '';
              const brief = getJudgementBrief(passageId, activeContext.passageTitle, activeContext.passageText);

              if (passageViewTab === 'brief') {
                return (
                  <div className="space-y-6 py-2 select-text">
                    {/* 1. NAME OF JUDGEMENT & DATE */}
                    <div className="bg-[#0e0e12]/80 border border-amber-500/20 rounded-2xl p-5 relative overflow-hidden shadow-xl shadow-amber-500/[0.01]">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.02] rounded-full filter blur-2xl pointer-events-none" />
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/25 shrink-0 text-amber-400">
                          <Scale className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-extrabold flex items-center gap-1.5 animate-pulse">
                            <Sparkles className="w-3.5 h-3.5" /> Landmark Precedent Brief
                          </h4>
                          <h3 className="text-base md:text-lg font-extrabold font-sans text-white tracking-tight leading-snug">
                            {brief?.name || activeContext.passageTitle}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-400 font-mono pt-1">
                            <span className="flex items-center gap-1.5 text-zinc-350">
                              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                              <span>Decision Date: <strong className="text-zinc-200">{brief?.date || 'Supreme Court'}</strong></span>
                            </span>
                            <span className="text-zinc-600 font-bold hidden sm:inline">&bull;</span>
                            <span className="text-amber-500 font-bold">{brief?.bench || 'Constitution Bench'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. COURT BENCH & PRESIDING JUDGES */}
                    <div className="bg-[#070709] border border-zinc-900/90 rounded-2xl p-4.5 space-y-3">
                      <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-500" />
                        <span>Judges &amp; Bench Composition</span>
                      </h4>
                      <div className="bg-zinc-950/80 p-3.5 border border-zinc-900/80 rounded-xl">
                        <p className="text-xs text-zinc-300 font-mono leading-relaxed">
                          {brief?.judges || 'Supreme Court of India'}
                        </p>
                      </div>
                    </div>

                    {/* 3. FACTS OF CASE (Chronology of Points) */}
                    <div className="bg-[#070709] border border-zinc-900/90 rounded-2xl p-4.5 space-y-4">
                      <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono flex items-center gap-2">
                        <ListTodo className="w-4 h-4 text-blue-400" />
                        <span>Facts of Case &amp; Procedural Chronology</span>
                      </h4>
                      <div className="relative pl-6 pr-2 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-850">
                        {brief?.facts.map((fact, fIdx) => (
                          <div key={fIdx} className="relative space-y-1">
                            {/* Timeline dot */}
                            <div className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-blue-500 border border-[#070709] shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                            <span className="absolute -left-12 top-0 text-[8px] font-mono font-bold text-zinc-500 bg-zinc-950 px-1 py-0.5 border border-zinc-900 rounded select-none">
                              #{fIdx + 1}
                            </span>
                            <p className="text-xs text-zinc-300 leading-relaxed pl-1 pt-0.5 font-serif text-justify">
                              {fact}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4. LEGAL ISSUES INVOLVED */}
                    <div className="bg-[#070709] border border-zinc-900/90 rounded-2xl p-4.5 space-y-3">
                      <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-rose-450" />
                        <span>Key Issues Framed</span>
                      </h4>
                      <div className="space-y-2.5">
                        {brief?.issues.map((issue, iIdx) => (
                          <div key={iIdx} className="flex gap-3 bg-zinc-950/30 p-3 border border-zinc-900/50 rounded-xl items-start">
                            <span className="w-5 h-5 bg-rose-500/10 text-rose-400 border border-rose-500/25 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                              Q{iIdx + 1}
                            </span>
                            <p className="text-xs text-zinc-300 leading-relaxed font-sans font-medium">
                              {issue}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 5. RATIO DECIDENDI */}
                    <div className="bg-[#0d0d10] border border-amber-500/10 rounded-2xl p-4.5 space-y-3.5 relative overflow-hidden">
                      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/[0.015] rounded-full filter blur-xl pointer-events-none" />
                      <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono flex items-center gap-2">
                        <Gavel className="w-4 h-4 text-amber-550" />
                        <span>Ratio Decidendi (Core Legal Holding)</span>
                      </h4>
                      <div className="space-y-3">
                        {brief?.ratioDecidendi.map((ratio, rIdx) => (
                          <div key={rIdx} className="bg-amber-500/[0.015] border-l-2 border-amber-500 p-4 rounded-r-xl relative animate-none">
                            <p className="text-xs md:text-sm text-zinc-200 leading-relaxed font-serif text-justify pr-1 italic">
                              "{ratio}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 6. CONCURRING OR DIFFERING OPINION */}
                    <div className="bg-[#070709] border border-zinc-900/90 rounded-2xl p-4.5 space-y-3">
                      <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-indigo-400" />
                        <span>Concurring &amp; Dissenting Opinions</span>
                      </h4>
                      <div className="bg-[#0b0c10] border border-[#13151b] p-3.5 rounded-xl">
                        <p className="text-xs text-zinc-300 leading-relaxed font-sans font-medium text-justify">
                          {brief?.opinions}
                        </p>
                      </div>
                    </div>

                    {/* 7. STATUTES INVOLVED & ACCURATE SECTIONS */}
                    <div className="bg-[#070709] border border-zinc-900/90 rounded-2xl p-4.5 space-y-3.5">
                      <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono flex items-center gap-2">
                        <Scale className="w-4 h-4 text-teal-400" />
                        <span>Statutory Provisions Involved</span>
                      </h4>
                      <div className="divide-y divide-zinc-900/80 bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden">
                        {brief?.statutes.map((stat, sIdx) => (
                          <div key={sIdx} className="p-3.5 flex flex-col sm:flex-row sm:items-start gap-2 justify-between">
                            <span className="text-xs font-bold text-teal-400 tracking-tight font-sans shrink-0 sm:max-w-[40%] text-left">
                              {stat.act}
                            </span>
                            <span className="text-xs font-mono text-zinc-300 text-left sm:text-right bg-zinc-900/80 px-2 py-1 rounded border border-zinc-900 sm:max-w-[60%] select-all">
                              {stat.sections}
                            </span>
                          </div>
                        )) || (
                          <div className="p-4 text-xs text-zinc-500 italic text-center">
                            No statutory acts directly annotated
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  <h2 className="text-sm font-extrabold text-white font-sans leading-snug">
                    {activeContext.passageTitle}
                  </h2>
                  <p className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest font-bold">
                    Subject Focus: <span className="text-amber-500 font-bold">{test.passages[activeContext.passageIndex].subject}</span>
                  </p>

                  {/* Dynamically Styled Font Scale Wrapper */}
                  <div 
                    className={`text-zinc-300 leading-relaxed font-serif text-justify ${
                      layoutMode === 'stacked' 
                        ? 'bg-[#060608]/20 p-2 text-base md:text-lg border-l-2 border-amber-500/50 pl-4 py-1' 
                        : 'bg-[#060608]/80 p-5 border border-[#161619] rounded-2xl max-h-[290px] md:max-h-none overflow-y-auto'
                    }`}
                    style={{ fontSize: `${passageFontSize + (layoutMode === 'stacked' ? 1 : 0)}px`, lineHeight: '1.8' }}
                  >
                    <span>{activeContext.passageText}</span>
                  </div>

                  <div className="p-3.5 bg-[#0c0c0f] border border-[#161619]/90 rounded-xl text-[10px] text-zinc-550 leading-relaxed flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500 font-bold text-base">&bull;</span>
                      <span className="text-zinc-400">Excerpts are highly technical. In Reader View, you can enjoy maximum paragraph spacing and line focus guide highlights.</span>
                    </div>
                    
                    {layoutMode === 'passage-focus' && (
                      <button
                        type="button"
                        onClick={() => setLayoutMode('split')}
                        className="bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/25 px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold uppercase shrink-0 cursor-pointer transition-all"
                      >
                        Start Solving &rarr;
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Right Column: Active Question MCQ selector Panel & Palette Grid */}
        <div className={`flex flex-col bg-[#070709] transition-all duration-300 ${
          layoutMode === 'stacked'
            ? 'w-full shrink-0 border-t border-zinc-900/60'
            : layoutMode === 'split' 
              ? 'w-full md:w-1/2 overflow-hidden' 
              : layoutMode === 'question-focus' 
                ? 'w-full md:w-full overflow-hidden' 
                : 'hidden md:hidden'
        }`}>
          
          {/* Question context details */}
          <div className="p-4 bg-zinc-950/40 border-b border-[#141416] flex items-center justify-between text-zinc-500 text-[10px] font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <span>Passage Case Question: <strong className="text-amber-500 font-mono text-sm">{currentGlobalIndex + 1}</strong> of <span className="font-mono">{totalQuestions}</span></span>
              {(layoutMode === 'question-focus' || layoutMode === 'stacked') && (
                <button
                  type="button"
                  onClick={() => {
                    if (layoutMode === 'stacked') {
                      // Scroll to top of passage container nicely
                      passageContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      setLayoutMode('split');
                    }
                  }}
                  className="bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-xl text-[9px] font-mono font-bold uppercase cursor-pointer transition-all ml-2 flex items-center gap-1 shrink-0"
                >
                  &larr; {layoutMode === 'stacked' ? 'Jump to Passage' : 'Show Passage'}
                </button>
              )}
            </span>
            <span className="bg-[#0b0b0d] px-2 py-0.5 rounded border border-zinc-800/80 font-mono">
              MCQ Palette
            </span>
          </div>

          {/* Active Question detail screen */}
          <div className={`p-5 space-y-5 ${
            layoutMode === 'stacked' ? 'overflow-visible' : 'overflow-y-auto flex-1'
          }`}>
            <h3 className="text-xs font-bold text-zinc-200 leading-relaxed font-sans">
              {activeContext.question.text}
            </h3>

            {/* Answer Options selectors */}
            <div className="space-y-2.5">
              {activeContext.question.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentGlobalIndex] === idx;
                
                return (
                  <button
                    type="button"
                    key={idx}
                    id={`btn-option-${idx}`}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left text-xs p-3.5 rounded-2xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSelected 
                        ? 'bg-amber-500/10 border-amber-500 text-amber-200 font-bold shadow-[0_0_15px_rgba(245,158,11,0.06)]' 
                        : 'bg-[#0d0d10] hover:bg-[#121215] border-zinc-800/60 text-zinc-400 hover:text-zinc-300 shadow-sm'
                    }`}
                  >
                    <span className="font-mono text-zinc-400 bg-zinc-950/80 w-5 h-5 flex items-center justify-center rounded-lg border border-zinc-800/80 shrink-0 font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{cleanOptionText(option)}</span>
                  </button>
                );
              })}
            </div>

            {/* Micro panel actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                id="btn-clear-selection"
                onClick={handleClearAnswer}
                disabled={selectedAnswers[currentGlobalIndex] === undefined}
                className="text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-500 hover:text-zinc-300 disabled:opacity-40 transition-colors cursor-pointer"
              >
                Clear Selection
              </button>

              <button
                type="button"
                id="btn-flag-review"
                onClick={handleToggleReview}
                className={`text-[10px] font-mono uppercase tracking-wider font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  isMarkedForReview[currentGlobalIndex] 
                    ? 'text-purple-400' 
                    : 'text-zinc-500 hover:text-zinc-450'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 shrink-0" />
                {isMarkedForReview[currentGlobalIndex] ? 'Flagged' : 'Flag Passage'}
              </button>
            </div>
          </div>

          {/* Navigative Footer & Diagnostic palette selectors */}
          <div className="bg-[#0b0b0d] border-t border-zinc-900 p-4 space-y-4">
            
            {/* Navigational Button Blocks */}
            <div className="flex items-center justify-between gap-2 text-[11px] font-bold">
              <button
                type="button"
                id="btn-prev-question"
                onClick={handlePrev}
                disabled={currentGlobalIndex === 0}
                className="flex items-center gap-1 px-3 py-1.5 bg-zinc-950 hover:bg-[#121215] border border-zinc-800/80 text-zinc-450 hover:text-zinc-200 rounded-xl disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer font-mono uppercase"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>

              {currentGlobalIndex === totalQuestions - 1 ? (
                <button
                  type="button"
                  id="btn-submit-exam"
                  onClick={handleCompleteSubmission}
                  className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold px-4 py-2 rounded-xl transition-all hover:scale-[1.01] cursor-pointer shadow-lg shadow-emerald-500/10"
                >
                  Submit Exam
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-next-question"
                  onClick={handleNext}
                  className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-extrabold rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Save &amp; Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Diagnostic palettes grid list */}
            <div className="space-y-2 border-t border-zinc-900 pt-3">
              <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono uppercase tracking-widest font-bold">
                <span>Passage Palette</span>
                <span className="flex gap-2">
                  <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Ans ({answeredCount})</span>
                  <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> Flag ({flaggedCount})</span>
                </span>
              </div>

              <div className="grid grid-cols-5 xs:grid-cols-8 sm:grid-cols-10 gap-1.5 max-h-24 overflow-y-auto pr-1">
                {Array.from({ length: totalQuestions }).map((_, idx) => (
                  <button
                    type="button"
                    key={idx}
                    id={`palette-btn-${idx}`}
                    onClick={() => selectGlobalIndex(idx)}
                    className={`h-7 rounded-lg text-[10px] font-mono border text-center transition-colors cursor-pointer flex items-center justify-center ${getPaletteBadgeStyle(idx)}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
            
          </div>

        </div>

      </div>

    </div>
  );
}
