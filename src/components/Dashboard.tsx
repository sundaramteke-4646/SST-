import React, { useState } from 'react';
import { User, MockTest, TestResult } from '../types';
import LandmarkLabs from './LandmarkLabs';
import PlansSubscription from './PlansSubscription';
import SyllabusTests from './SyllabusTests';
import ReferralStation from './ReferralStation';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  Award, 
  BookOpen, 
  ChevronRight, 
  Sparkles, 
  User as UserIcon, 
  TrendingUp, 
  Flame, 
  LogOut, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle,
  FileText,
  CreditCard,
  Lock,
  IndianRupee
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  user: User;
  availableTests: MockTest[];
  onStartTest: (testId: string) => void;
  onLogout: () => void;
  onAddCustomTest: (newTest: MockTest) => void;
  onUpdatePlan: (newPlan: 'free' | 'basic' | 'premium') => void;
}

export default function Dashboard({ user, availableTests, onStartTest, onLogout, onAddCustomTest, onUpdatePlan }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'syllabus' | 'labs' | 'plans'>('dashboard');
  const completedCount = user.completedTests.length;
  
  // Calculate analytics
  const scoreArray = user.completedTests.map(t => t.score);
  const avgScore = completedCount > 0 
    ? (scoreArray.reduce((a, b) => a + b, 0) / completedCount).toFixed(2) 
    : '0.00';
  
  const totalCorrect = user.completedTests.reduce((acc, curr) => acc + curr.correctCount, 0);
  const totalAttempted = user.completedTests.reduce((acc, curr) => acc + curr.correctCount + curr.wrongCount, 0);
  const totalQuestionsSum = user.completedTests.reduce((acc, curr) => acc + curr.totalQuestions, 0);
  
  const overallAccuracy = totalAttempted > 0 
    ? ((totalCorrect / totalAttempted) * 100).toFixed(0) 
    : '0';

  const totalMinutesSpent = user.completedTests.reduce((acc, curr) => acc + Math.round(curr.timeSpentSeconds / 60), 0);

  // Performance breakdown by law subjects (simulated analysis based on tests)
  // CLAT PG mock 1 covers Constitutional Law (q1-5), Jurisprudence (q6-10), Contracts (q11-15)
  // CLAT PG mock 2 covers Constitutional Law (q16-20), Criminal Law (q21-25)
  const getSubjectAnalytics = () => {
    let constTotal = 0, constCorrect = 0;
    let jurTotal = 0, jurCorrect = 0;
    let contractTotal = 0, contractCorrect = 0;
    let criminalTotal = 0, criminalCorrect = 0;

    user.completedTests.forEach(test => {
      if (test.testId === 'clat-pg-mock-1') {
        constTotal += 5;
        jurTotal += 5;
        contractTotal += 5;
        // Distribute correct answers symmetrically for demo
        constCorrect += Math.min(5, Math.ceil(test.correctCount * 0.4));
        jurCorrect += Math.min(5, Math.floor(test.correctCount * 0.3));
        contractCorrect += Math.min(5, Math.floor(test.correctCount * 0.3));
      }
      if (test.testId === 'clat-pg-mock-2') {
        constTotal += 5;
        criminalTotal += 5;
        constCorrect += Math.min(5, Math.ceil(test.correctCount * 0.6));
        criminalCorrect += Math.min(5, Math.floor(test.correctCount * 0.4));
      }
    });

    return [
      { name: 'Constitutional Law', correct: constCorrect, total: constTotal || 5, color: '#f59e0b' },
      { name: 'Jurisprudence', correct: jurCorrect, total: jurTotal || 5, color: '#3b82f6' },
      { name: 'Law of Contract', correct: contractCorrect, total: contractTotal || 5, color: '#10b981' },
      { name: 'Criminal Law', correct: criminalCorrect, total: criminalTotal || 5, color: '#ef4444' }
    ];
  };

  const subjectStats = getSubjectAnalytics();

  // Generate dynamic recommendation strings
  const getRecommendations = () => {
    const list = [];
    const weakerSubjects = subjectStats.filter(s => (s.correct / s.total) < 0.6);
    
    if (weakerSubjects.length > 0) {
      weakerSubjects.forEach(sub => {
        if (sub.name === 'Jurisprudence') {
          list.push({
            id: 'rec-jur',
            type: 'focus',
            title: 'Revise Analytical Positivism & H.L.A. Hart',
            desc: 'Your Jurisprudence scoring rate is below target. Review the connection between Primary and Secondary Rules.'
          });
        } else if (sub.name === 'Constitutional Law') {
          list.push({
            id: 'rec-const',
            type: 'focus',
            title: 'Analyze Basic Structure & Privacy Standards',
            desc: 'Consolidate Kesavananda Bharati precedents and the 3-fold Puttaswamy test.'
          });
        } else if (sub.name === 'Criminal Law') {
          list.push({
            id: 'rec-crim',
            type: 'focus',
            title: 'Study General Exceptions & Insanity defense rules',
            desc: 'Differentiate between Legal and Medical Insanity standards under Section 84.'
          });
        } else if (sub.name === 'Law of Contract') {
          list.push({
            id: 'rec-contract',
            type: 'focus',
            title: 'Master Contract Frustration criteria',
            desc: 'Focus on Satyabrata Ghose precedents and the commercial vs physical impossibility standards in Sec 56.'
          });
        }
      });
    }

    // Default good recommendations
    list.push({
      id: 'rec-time',
      type: 'tip',
      title: 'Practice with Real Exam Pacings',
      desc: 'CLAT PG requires reading extensive 500-word judgment extracts. Keep reading speeds above 150 words per minute.'
    });

    list.push({
      id: 'rec-marking',
      type: 'warning',
      title: 'Calibrate Guesswork (Avoid -0.25 Penalties)',
      desc: 'Always skip questions if you cannot rule out at least 2 options. Negative marking drags overall ranks down.'
    });

    return list.slice(0, 3);
  };

  const recommendations = getRecommendations();

  // Score mapping for Custom SVG Chart
  // Make a beautiful historic score graph
  const renderSVGGraph = () => {
    if (user.completedTests.length === 0) {
      return (
        <div className="h-44 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/40 p-4">
          <BookOpen className="w-8 h-8 text-zinc-700 mb-2" />
          <p className="text-zinc-500 text-xs text-center">No scores logged yet. Complete a mock test to launch real-time progress diagnostics!</p>
        </div>
      );
    }

    const maxScore = 15;
    const height = 150;
    const width = 450;
    const paddingLeft = 35;
    const paddingRight = 15;
    const paddingTop = 20;
    const paddingBottom = 20;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Plot points
    const points: {x: number, y: number, name: string, score: number}[] = [];
    const testsToShow = [...user.completedTests].slice(-6); // Last 6 tests

    testsToShow.forEach((test, idx) => {
      const x = paddingLeft + (idx / Math.max(1, testsToShow.length - 1)) * chartWidth;
      const parsedScore = Math.max(0, test.score);
      const y = paddingTop + chartHeight - (parsedScore / maxScore) * chartHeight;
      points.push({ x, y, name: test.testTitle.split(' ').slice(2, 5).join(' ') || 'Mock', score: test.score });
    });

    // Create path strings
    let linePath = '';
    let areaPath = '';

    if (points.length > 0) {
      linePath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
      
      // Bottom corners for filling color gradient
      areaPath = `M ${points[0].x} ${height - paddingBottom} L ${points[0].x} ${points[0].y} ` + 
                 points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') + 
                 ` L ${points[points.length - 1].x} ${height - paddingBottom} Z`;
    }

    return (
      <div className="w-full overflow-x-auto pb-2 focus:outline-none">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[380px] h-auto select-none">
          {/* Grids */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const tempY = paddingTop + ratio * chartHeight;
            const labelScore = ((1 - ratio) * maxScore).toFixed(1);
            return (
              <g key={i} className="opacity-40">
                <line x1={paddingLeft} y1={tempY} x2={width - paddingRight} y2={tempY} stroke="#27272a" strokeWidth="1" strokeDasharray="4 4" />
                <text x="5" y={tempY + 4} fill="#71717a" className="text-[9px] font-mono">{labelScore}</text>
              </g>
            );
          })}

          {/* Area under curve */}
          {points.length > 0 && (
            <g>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.00" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#chartGradient)" />
              <path d={linePath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}

          {/* Dots */}
          {points.map((pt, idx) => (
            <g key={idx} className="group cursor-help">
              <circle cx={pt.x} cy={pt.y} r="4" fill="#f59e0b" stroke="#18181b" strokeWidth="2" />
              <circle cx={pt.x} cy={pt.y} r="8" fill="#f59e0b" fillOpacity="0.1" className="hover:scale-150 transition-transform" />
              
              {/* Tooltip score label */}
              <text x={pt.x} y={pt.y - 10} textAnchor="middle" fill="#f59e0b" className="text-[10px] font-mono font-bold">
                {pt.score.toFixed(2)}
              </text>
              
              {/* X label */}
              <text x={pt.x} y={height - 5} textAnchor="middle" fill="#71717a" className="text-[8px] font-sans font-medium">
                {pt.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-1 py-4">
      {/* Header Profile Banner */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 relative overflow-hidden shadow-md">
        <div className="absolute -right-20 -top-20 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center text-zinc-950 shadow-lg shadow-amber-500/10">
              <UserIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-zinc-100 font-sans">{user.profile.username}</h2>
                <span className="bg-amber-500/10 text-amber-500 text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/20 font-bold uppercase">
                  Aspirant
                </span>
              </div>
              <p className="text-zinc-400 text-xs mt-0.5">{user.profile.email}</p>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-600" /> Target Exam: <strong className="text-zinc-300 font-medium">CLAT PG {user.profile.targetYear}</strong>
                  {user.profile.targetYear === '2027' && (
                    <span className="text-[10px] text-amber-500 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 ml-1.5 font-bold animate-pulse">
                      First Week of Dec 2026
                    </span>
                  )}
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-800" />
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" /> Streak: <strong className="text-zinc-300 font-medium">{user.profile.studyStreakDays} Days</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full md:w-auto items-center justify-between gap-4 border-t border-zinc-800 md:border-none pt-4 md:pt-0">
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest block">Est. National Rank</span>
              <span className="text-2xl font-bold font-mono text-amber-400">
                {completedCount > 0 
                  ? `#${Math.max(12, Math.round(5000 / (Number(avgScore) + 1)))}` 
                  : 'N/A'}
              </span>
            </div>
            <button
              type="button"
              id="dashboard-logout-btn"
              onClick={onLogout}
              className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Logout Profile"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Modern High-End Tab Switcher Selection Menu */}
      <div className="flex bg-zinc-950 border border-zinc-800/65 rounded-xl p-1 gap-1.5 max-w-lg w-full overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-1.5 px-3 text-center rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10 font-extrabold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          Study Analytics
        </button>
        <button
          onClick={() => setActiveTab('syllabus')}
          className={`flex-1 py-1.5 px-3 text-center rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'syllabus'
              ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10 font-extrabold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Syllabus Practice
        </button>
        <button
          onClick={() => setActiveTab('labs')}
          className={`flex-1 py-1.5 px-3 text-center rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'labs'
              ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10 font-extrabold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Landmark Labs
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex-1 py-1.5 px-3 text-center rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'plans'
              ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10 font-extrabold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" /> Plan &amp; Billing
        </button>
      </div>

      {activeTab === 'syllabus' ? (
        <SyllabusTests
          user={user}
          onStartTest={onStartTest}
          onUpgradeRedirect={() => setActiveTab('plans')}
        />
      ) : activeTab === 'labs' ? (
        <LandmarkLabs 
          onAddCustomTest={onAddCustomTest} 
          onStartTest={onStartTest} 
          availableTests={availableTests} 
          plan={user.plan || 'free'}
          onUpgradeRedirect={() => setActiveTab('plans')}
        />
      ) : activeTab === 'plans' ? (
        <PlansSubscription
          user={user}
          onUpdatePlan={onUpdatePlan}
        />
      ) : (
        <>
          {/* Main Analytics Grid container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Statistics Panels */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wide">Average Score</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-amber-400">{avgScore}</span>
                <span className="text-xs text-zinc-600">/15</span>
              </div>
              <span className="text-[9px] text-zinc-500 mt-1 block">Net correct - negative marks</span>
            </div>

            <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wide">Accuracy</span>
              <div className="mt-2 flex items-baseline gap-0.5">
                <span className="text-2xl font-bold font-mono text-emerald-400">{overallAccuracy}</span>
                <span className="text-xs text-emerald-500 font-mono">%</span>
              </div>
              <span className="text-[9px] text-zinc-500 mt-1 block">Correct vs Total Attempted</span>
            </div>

            <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wide">Completed Mocks</span>
              <div className="mt-2 text-2xl font-bold font-mono text-zinc-200">
                {completedCount}
              </div>
              <span className="text-[9px] text-zinc-500 mt-1 block">Total tests finished</span>
            </div>

            <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wide font-medium">Study Focus</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-zinc-200">{totalMinutesSpent}</span>
                <span className="text-xs text-zinc-600">mins</span>
              </div>
              <span className="text-[9px] text-zinc-500 mt-1 block">Accumulated practice time</span>
            </div>

          </div>

          {/* Performance Flow chart */}
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-zinc-200">Score Trajectory</h3>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono uppercase bg-zinc-950 px-2 py-1 border border-zinc-800 rounded">15-Mark Scale</span>
            </div>
            {renderSVGGraph()}
          </div>

          {/* Dynamic Recommendations Engines */}
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-amber-500 w-4 h-4 animate-pulse" />
              <h3 className="text-sm font-bold text-zinc-200">Smart Prep AI Analysis</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recommendations.map(rec => (
                <div key={rec.id} className="bg-zinc-950 border border-zinc-800/50 rounded-xl p-3.5 space-y-1.5 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-1.5">
                    {rec.type === 'focus' && <AlertTriangle className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                    {rec.type === 'tip' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    {rec.type === 'warning' && <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                    <h4 className="text-xs font-semibold text-zinc-200 line-clamp-1">{rec.title}</h4>
                  </div>
                  <p className="text-[10.5px] text-zinc-400 leading-relaxed">{rec.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Topic Diagnostics and Developer Credits */}
        <div className="space-y-6">
          
          {/* Topic diagnostics panel */}
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-zinc-200">Subject-wise Mastery</h3>
            
            <div className="space-y-3.5">
              {subjectStats.map((stat, idx) => {
                const percentage = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-sans">
                      <span className="font-medium text-zinc-300">{stat.name}</span>
                      <span className="font-mono text-zinc-500">
                        {stat.correct}/{stat.total} Practice Correct ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    {/* Mastery Bar */}
                    <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/20">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage || 10}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className="h-full rounded-full" 
                        style={{ backgroundColor: stat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Referral Program Info & Simulator */}
          <ReferralStation user={user} onUpdatePlan={onUpdatePlan} />

          {/* Credits Panel */}
          <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center space-y-2 relative overflow-hidden">
            <div className="absolute right-0 top-0 text-[50px] opacity-[0.02] font-mono select-none font-bold">LAW</div>
            <p className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">ENGINEERED BY</p>
            <div className="text-xs font-sans font-semibold text-zinc-300">
              Sundaram Teke
            </div>
            <p className="text-[10px] text-zinc-600 max-w-[200px] mx-auto">
              Specially synthesized for premier postgraduate CLAT / LLM selection optimization.
            </p>
          </div>

        </div>
      </div>

      {/* Available Practice Tests Container */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-zinc-100 font-sans flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" /> Active Grand Mock Tests
          </h3>
          <span className="text-xs text-zinc-400 font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
            CLAT PG Format (+1.00 / -0.25)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableTests.map(test => {
            const hasCompleted = user.completedTests.some(t => t.testId === test.id);
            const testBestScore = user.completedTests
              .filter(t => t.testId === test.id)
              .reduce((max, curr) => curr.score > max ? curr.score : max, -5);

            const isLocked = (user.plan || 'free') === 'free' && test.id !== 'clat-pg-mock-1';

            return (
              <div 
                key={test.id} 
                id={`mock-card-${test.id}`}
                className={`bg-zinc-900 border rounded-2xl p-5 flex flex-col justify-between transition-all group relative overflow-hidden shadow-md shadow-black/10 ${
                  isLocked ? 'border-zinc-800/40 opacity-75 hover:border-amber-500/10' : 'border-zinc-800/70 hover:border-amber-500/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] bg-zinc-950 font-mono uppercase text-zinc-400 px-2.5 py-1 rounded border border-zinc-800">
                      Mock Paper
                    </span>
                    {isLocked ? (
                      <span className="flex items-center gap-1 bg-amber-500/10 text-amber-500 text-[10px] uppercase font-mono font-bold tracking-wider py-0.5 px-2 border border-amber-500/20 rounded">
                        <Lock className="w-2.5 h-2.5 text-amber-500" /> Premium Locked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono">
                        <Clock className="w-3.5 h-3.5" /> {test.durationMinutes} Mins
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-zinc-200 mt-2 font-sans group-hover:text-amber-400 transition-colors">
                    {test.title}
                  </h4>

                  {/* Syllabus / Content Badge breakdown */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {test.id === 'clat-pg-mock-1' ? (
                      <>
                        <span className="text-[9px] bg-amber-500/5 text-amber-500 font-medium px-2 py-0.5 rounded border border-amber-500/10">3 Passages</span>
                        <span className="text-[9px] bg-zinc-950 text-zinc-400 font-medium px-2 py-0.5 rounded border border-zinc-800">Constitutional Law</span>
                        <span className="text-[9px] bg-zinc-950 text-zinc-400 font-medium px-2 py-0.5 rounded border border-zinc-800">Jurisprudence</span>
                        <span className="text-[9px] bg-zinc-950 text-zinc-400 font-medium px-2 py-0.5 rounded border border-zinc-800">Contract</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[9px] bg-amber-500/5 text-amber-500 font-medium px-2 py-0.5 rounded border border-amber-500/10">2 Passages</span>
                        <span className="text-[9px] bg-zinc-950 text-zinc-400 font-medium px-2 py-0.5 rounded border border-zinc-800">Basic Structure</span>
                        <span className="text-[9px] bg-zinc-950 text-zinc-400 font-medium px-2 py-0.5 rounded border border-zinc-800">Criminal Law</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="border-t border-zinc-800/80 mt-5 pt-4 flex items-center justify-between">
                  <div>
                    {hasCompleted ? (
                      <div className="text-xs">
                        <span className="text-zinc-500 block">Status: <strong className="text-emerald-400 font-semibold font-sans">Completed</strong></span>
                        <span className="text-zinc-400 font-mono">Best Score: <strong className="text-amber-400 font-bold">{testBestScore.toFixed(2)}</strong></span>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-500">
                        {isLocked ? "Requires Basic Plan (₹200)" : "Unattempted Paper"}
                      </span>
                    )}
                  </div>

                  {isLocked ? (
                    <button
                      type="button"
                      id={`btn-launch-${test.id}`}
                      onClick={() => setActiveTab('plans')}
                      className="flex items-center gap-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-amber-500 font-mono font-bold text-[10px] uppercase tracking-wider py-2 px-3.5 rounded-xl border border-zinc-700 hover:border-amber-500/30 transition-all cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" /> Unlock Paper <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      id={`btn-launch-${test.id}`}
                      onClick={() => onStartTest(test.id)}
                      className="flex items-center gap-1.5 bg-amber-500 text-zinc-950 font-bold text-xs py-2 px-4 rounded-xl shadow shadow-amber-500/5 hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/10 transition-all cursor-pointer"
                    >
                      {hasCompleted ? 'Retake Test' : 'Begin Test'} <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History Log Container */}
      {completedCount > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-base font-bold text-zinc-200 flex items-center gap-2 font-sans">
            <Trophy className="w-4 h-4 text-amber-500" /> Historic Exam Log Submissions
          </h3>
          
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-mono uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 font-normal">Test Description</th>
                    <th className="py-3 px-4 font-normal">Submission Date</th>
                    <th className="py-3 px-4 font-normal text-right">Correct / Attempted</th>
                    <th className="py-3 px-4 font-normal text-right">Time Taken</th>
                    <th className="py-3 px-4 font-normal text-right text-amber-400">Final Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {user.completedTests.map((res, i) => (
                    <tr key={i} className="hover:bg-zinc-950/20 text-zinc-300 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-zinc-200 max-w-[200px] sm:max-w-xs truncate">{res.testTitle}</td>
                      <td className="py-3.5 px-4 font-mono text-zinc-400">{res.date}</td>
                      <td className="py-3.5 px-4 font-mono text-right text-zinc-400">
                        <span className="text-emerald-400 font-semibold">{res.correctCount}</span>
                        {' / '}
                        <span>{res.correctCount + res.wrongCount}</span>
                        <span className="text-zinc-600"> (of {res.totalQuestions})</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-right text-zinc-400">
                        {Math.floor(res.timeSpentSeconds / 60)}m {res.timeSpentSeconds % 60}s
                      </td>
                      <td className="py-3.5 px-4 font-mono text-right text-amber-400 font-bold">{res.score.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
