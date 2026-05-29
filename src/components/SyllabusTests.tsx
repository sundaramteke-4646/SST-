import React, { useState } from 'react';
import { User } from '../types';
import { 
  SYLLABUS_SUBJECTS, 
  getSyllabusTestsForSubject, 
  SubjectMetadata 
} from '../data/syllabusTestData';
import { 
  Lock, 
  Unlock, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  ChevronRight, 
  Play, 
  Search, 
  SlidersHorizontal,
  FolderLock,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SyllabusTestsProps {
  user: User;
  onStartTest: (testId: string) => void;
  onUpgradeRedirect: () => void;
}

export default function SyllabusTests({ user, onStartTest, onUpgradeRedirect }: SyllabusTestsProps) {
  const [selectedSubject, setSelectedSubject] = useState<SubjectMetadata | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unattempted' | 'completed'>('all');

  // Plan level check
  const isPremium = (user.plan || 'free') !== 'free';

  // Back to subjects helper
  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setSearchQuery('');
    setFilterType('all');
  };

  // Check if test is completed
  const isTestCompleted = (testId: string) => {
    return user.completedTests.some(t => t.testId === testId);
  };

  // Get score for test
  const getTestBestScore = (testId: string) => {
    const scores = user.completedTests
      .filter(t => t.testId === testId)
      .map(t => t.score);
    return scores.length > 0 ? Math.max(...scores) : null;
  };

  // Subject Stats calculations
  const getSubjectProgress = (subjectSlug: string) => {
    const tests = getSyllabusTestsForSubject(subjectSlug);
    const completedCount = tests.filter(test => isTestCompleted(test.id)).length;
    return {
      completed: completedCount,
      total: tests.length,
      percentage: Math.round((completedCount / tests.length) * 100)
    };
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!selectedSubject ? (
          /* SUBJECTS GRID VIEW */
          <motion.div
            key="subjects"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" /> Comprehensive Syllabus Engine
                </span>
                <h2 className="text-xl font-extrabold text-zinc-100 font-sans tracking-tight">
                  Subject-wise &amp; Topic-wise Practice
                </h2>
                <p className="text-xs text-zinc-400 max-w-xl">
                  Take micro mock tests engineered across all subjects mentioned in the CLAT PG syllabus. Every subject has exactly 50 tests. Only one test (Constitutional Law Test 1) is accessible under the free tier.
                </p>
              </div>

              {!isPremium && (
                <button
                  type="button"
                  onClick={onUpgradeRedirect}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 px-4 py-2 rounded-xl text-xs font-bold tracking-tight shadow-md shadow-amber-500/10 cursor-pointer flex items-center gap-1.5 shrink-0 transition-all hover:scale-[1.01]"
                >
                  <Lock className="w-3.5 h-3.5" /> Unlock All 300 Practice Tests (₹500)
                </button>
              )}
            </div>

            {/* SUBJECTS BENTO CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SYLLABUS_SUBJECTS.map((subject) => {
                const { completed, total, percentage } = getSubjectProgress(subject.slug);
                const isSubjectFullyLocked = !isPremium && subject.slug !== 'constitutional-law';

                // Assign subject border styles based on themes
                const colorMap: any = {
                  amber: 'border-amber-500/10 hover:border-amber-500/30 text-amber-500',
                  blue: 'border-blue-500/10 hover:border-blue-500/30 text-blue-500',
                  emerald: 'border-emerald-500/10 hover:border-emerald-500/30 text-emerald-500',
                  teal: 'border-teal-500/10 hover:border-teal-500/30 text-teal-500',
                  red: 'border-red-500/10 hover:border-red-500/30 text-red-500',
                  purple: 'border-purple-500/10 hover:border-purple-500/30 text-purple-500'
                };

                const fillMap: any = {
                  amber: 'bg-amber-500',
                  blue: 'bg-blue-500',
                  emerald: 'bg-emerald-500',
                  teal: 'bg-teal-500',
                  red: 'bg-red-500',
                  purple: 'bg-purple-500'
                };

                return (
                  <div
                    key={subject.id}
                    id={`subject-card-${subject.slug}`}
                    onClick={() => setSelectedSubject(subject)}
                    className={`bg-zinc-950 border ${colorMap[subject.color]} rounded-2xl p-5 cursor-pointer hover:bg-zinc-900/40 transition-all flex flex-col justify-between group relative h-[210px]`}
                  >
                    {/* Background badge lock indictrs */}
                    {isSubjectFullyLocked && (
                      <div className="absolute top-4 right-4 bg-zinc-900/70 border border-zinc-800 p-1.5 rounded-xl text-zinc-500 shrink-0">
                        <FolderLock className="w-4 h-4" />
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${fillMap[subject.color]}`} />
                        <h4 className="text-base font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">
                          {subject.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-3">
                        {subject.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-900/80 space-y-2.5">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-zinc-500">Progress</span>
                        <span className="text-zinc-300 font-bold">{completed} / {total} Units ({percentage}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${fillMap[subject.color]} rounded-full transition-all duration-500`} 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-zinc-500 font-mono tracking-wide uppercase font-bold">
                          {total} practice sets
                        </span>
                        <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1 group-hover:text-amber-500 transition-colors">
                          Open Units <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* SUBJECT DETAIL DRILLDOWN PRACTICE TESTS VIEW */
          <motion.div
            key="tests"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Subject detail header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-950/40 border border-zinc-900 p-4.5 rounded-2xl">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBackToSubjects}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-805 p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  title="Go Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                    <h3 className="text-lg font-bold text-zinc-100 font-sans leading-tight">
                      {selectedSubject.name} Units
                    </h3>
                  </div>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    Browse all 50 practice mocks covering key focus topics.
                  </p>
                </div>
              </div>

              {/* Stats badges */}
              <div className="text-sm font-mono text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-900 flex gap-4">
                <div>
                  Completed: <strong className="text-amber-500">{getSubjectProgress(selectedSubject.slug).completed} / 50</strong>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Query topic (e.g. Fundamental Rights, Contract, POSITIVISM...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 hover:border-zinc-850 rounded-xl py-2 pl-10 pr-4 text-base md:text-xs text-zinc-105 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-all font-sans"
                />
              </div>

              {/* Filters selector */}
              <div className="flex bg-zinc-950 border border-zinc-900/80 p-0.5 rounded-xl shrink-0 gap-1.5 list-none">
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  All (50)
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('unattempted')}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    filterType === 'unattempted'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Unattempted
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('completed')}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    filterType === 'completed'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* PRACTICE TESTS LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getSyllabusTestsForSubject(selectedSubject.slug)
                .filter(test => {
                  if (searchQuery.trim() !== '') {
                    const q = searchQuery.toLowerCase();
                    return test.title.toLowerCase().includes(q) || test.topic.toLowerCase().includes(q);
                  }
                  return true;
                })
                .filter(test => {
                  const verified = isTestCompleted(test.id);
                  if (filterType === 'unattempted') return !verified;
                  if (filterType === 'completed') return verified;
                  return true;
                })
                .map((test) => {
                  const completed = isTestCompleted(test.id);
                  const bestScore = getTestBestScore(test.id);
                  
                  // Verification for "only allow one test for free"
                  const isLocked = !isPremium && !test.isFree;

                  return (
                    <div
                      key={test.id}
                      className={`bg-zinc-950 border rounded-2xl p-4.5 flex flex-col justify-between transition-all group relative overflow-hidden ${
                        isLocked 
                          ? 'border-zinc-900/40 opacity-70 hover:border-amber-500/10' 
                          : 'border-zinc-900 hover:border-amber-500/25'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="bg-zinc-900 text-[9px] font-mono text-zinc-500 border border-zinc-805 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            Set {test.id.substring(test.id.lastIndexOf('-') + 1)}
                          </span>
                          
                          {isLocked ? (
                            <span className="flex items-center gap-1 bg-amber-500/10 text-amber-500 text-[9px] font-mono font-bold uppercase tracking-wider py-0.5 px-2.5 border border-amber-500/20 rounded-full">
                              <Lock className="w-2.5 h-2.5" /> Locked
                            </span>
                          ) : test.isFree ? (
                            <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-bold uppercase tracking-wider py-0.5 px-2.5 border border-emerald-500/20 rounded-full">
                              <Unlock className="w-2.5 h-2.5" /> Free Sample Unit
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 bg-zinc-900 text-zinc-400 text-[9px] font-mono font-bold uppercase tracking-wider py-0.5 px-2.5 border border-zinc-800 rounded-full">
                              Fully Unlocked
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-zinc-200 mt-2.5 group-hover:text-amber-400 transition-colors font-sans">
                          {selectedSubject.name} Unit Practice {test.id.substring(test.id.lastIndexOf('-') + 1)}
                        </h4>
                        
                        <p className="text-[11px] text-zinc-400 font-mono mt-1 leading-relaxed">
                          Topic: <span className="text-zinc-200 font-sans font-medium">{test.topic}</span>
                        </p>
                      </div>

                      <div className="pt-4 border-t border-zinc-900/60 mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-zinc-650" /> {test.durationMinutes} Mins
                          </span>
                          <span className="bg-zinc-900 px-1.5 py-0.5 rounded text-[10px]">
                            {test.questionCount} Questions
                          </span>
                        </div>

                        {isLocked ? (
                          <button
                            type="button"
                            onClick={onUpgradeRedirect}
                            className="bg-zinc-900 hover:bg-zinc-800 text-amber-500 hover:text-amber-400 border border-zinc-800 hover:border-amber-500/20 px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <Lock className="w-3 h-3" /> Unlock Unit
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onStartTest(test.id)}
                            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-sans font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow shadow-amber-500/5 transition-all active:scale-95"
                          >
                            <Play className="w-3 h-3 fill-current" /> {completed ? 'Re-attempt' : 'Start Test'}
                          </button>
                        )}
                      </div>

                      {/* Display historic scores if completed */}
                      {completed && bestScore !== null && (
                        <div className="absolute top-12 right-4 text-right">
                          <span className="text-[9px] text-zinc-500 font-mono uppercase font-bold block">Best Attempt</span>
                          <span className="text-xs font-mono font-extrabold text-emerald-400">
                            {bestScore.toFixed(2)} pts
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
