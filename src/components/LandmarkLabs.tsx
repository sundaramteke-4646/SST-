import React, { useState } from 'react';
import { MockTest, Passage } from '../types';
import { 
  Search, 
  Sparkles, 
  Gavel, 
  FileText, 
  AlertTriangle, 
  Play, 
  ChevronRight, 
  Scale, 
  Clock, 
  CheckCircle, 
  ArrowLeft,
  Lock,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandmarkLabsProps {
  onAddCustomTest: (newTest: MockTest) => void;
  onStartTest: (testId: string) => void;
  availableTests: MockTest[];
  plan: 'free' | 'basic' | 'premium';
  onUpgradeRedirect: () => void;
}

// Curated active, real-world landmark judgments (2024-2025) of the Supreme Court of India
const TRENDING_JUDGMENTS = [
  {
    title: "Electoral Bonds Case",
    citation: "Association for Democratic Reforms v. Union of India (2024)",
    bench: "5-Judge Constitution Bench (Unanimous)",
    focus: "Article 19(1)(a) & Corporate Funding in Politics",
    desc: "Struck down the Electoral Bonds Scheme as unconstitutional, holding that anonymity in political funding violates the voters' right to information."
  },
  {
    title: "Bribery Shield Overruled",
    citation: "Sita Soren v. Union of India (2024)",
    bench: "7-Judge Constitution Bench (Unanimous)",
    focus: "Articles 105(2) & 194(2) Bribery Immunity",
    desc: "Overruled the 1998 PV Narasimha Rao ratio. Held that MPs and MLAs do not enjoy prosecution immunity under Article 105 or 194 for accepting bribes to vote."
  },
  {
    title: "Article 370 Abrogation",
    citation: "In Re: Article 370 of the Constitution (2023)",
    bench: "5-Judge Constitution Bench (Unanimous)",
    focus: "Federalism, Article 370, and Statehood reorganization",
    desc: "Upheld the President's power to abrogate Article 370, declaring the sovereign integration of Jammu & Kashmir and endorsing temporary special status."
  },
  {
    title: "Same-Sex Marriage Verdict",
    citation: "Supriyo v. Union of India (2023)",
    bench: "5-Judge Constitution Bench (3:2 split)",
    focus: "Special Marriage Act & Right to Marry",
    desc: "Declined legal recognition for same-sex marriages, declaring that creation of such union rights falls within the legislative domain of Parliament."
  },
  {
    title: "CEC Appointment Mandate",
    citation: "Anoop Baranwal v. Union of India (2023)",
    bench: "5-Judge Constitution Bench (Unanimous)",
    focus: "Article 324(2) & Independence of Election Commission",
    desc: "Directed CEC appointments to be made by the President on recommendations of a committee of the Prime Minister, Leader of Opposition, and the Chief Justice of India."
  },
  {
    title: "PMLA Bail Strictures Review",
    citation: "Vijay Madanlal Choudhary v. Union of India",
    bench: "3-Judge Bench",
    focus: "Section 45 Twin Conditions & Burden of Proof",
    desc: "Sustained the constitutional validity of twin bail barriers under Section 45 and the high reverse burden of innocence on the accused."
  }
];

export default function LandmarkLabs({ onAddCustomTest, onStartTest, availableTests, plan, onUpgradeRedirect }: LandmarkLabsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedTest, setGeneratedTest] = useState<MockTest | null>(null);
  const [showUpgradeGate, setShowUpgradeGate] = useState(false);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lexrank_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addToRecentSearches = (queryText: string) => {
    const clean = queryText.trim();
    if (!clean) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter(q => q.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('lexrank_recent_searches', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save to localStorage:', err);
      }
      return updated;
    });
  };

  // Filter state for dynamic synthesis counter
  const aiGeneratedCount = availableTests.filter(t => t.id && t.id.startsWith('ai-clat-')).length;
  const isPremium = plan === 'premium';
  const hasReachedFreeLimit = !isPremium && aiGeneratedCount >= 2;

  const loadingMessages = [
    "Docketing Supreme Court database archives...",
    "Retrieving trustworthy ratios and official legal texts via Search Grounding...",
    "Structuring legal facts with academic CLAT PG trend benchmarks...",
    "Synthesizing 5 highly challenging landmark-based MCQ questions...",
    "Formulating detailed judicial explanations & precedent linkages...",
    "Assembling your custom AI practice paper..."
  ];

  const triggerGeneration = async (query: string) => {
    if (!query.trim()) return;
    
    // Check free limit restriction
    if (hasReachedFreeLimit) {
      setShowUpgradeGate(true);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setGeneratedTest(null);
    setLoadingStep(0);

    // Dynamic loading interval simulation
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 4500);

    try {
      const response = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to contact LexRank Legal AI Engine. Verify active internet access.");
      }

      const rawData = await response.json();

      // Formulate standard MockTest schema
      const uniqueId = `ai-clat-${Date.now()}`;
      const newPassage: Passage = {
        id: `p-${uniqueId}`,
        title: rawData.title || `Constitutional Law: Analysis of ${query}`,
        subject: (rawData.subject as any) || 'Constitutional Law',
        text: rawData.text,
        questions: rawData.questions.map((q: any, i: number) => ({
          id: `q-${uniqueId}-${i}`,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        }))
      };

      const customMockTest: MockTest = {
        id: uniqueId,
        title: `AI custom: ${query.split(' ').slice(0, 4).join(' ')} Judgment`,
        durationMinutes: 15, // Perfect 15 mins for a single passage sprint test
        passages: [newPassage],
        totalQuestionsCount: 5
      };

      // Register test to master state list
      onAddCustomTest(customMockTest);
      setGeneratedTest(customMockTest);
      addToRecentSearches(query);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred during synthesis.");
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const handleCuratedClick = (caseTitle: string, citationText: string) => {
    // Check if a test for this case is already generated to save quota
    const existingTest = availableTests.find(t => 
      t.title.toLowerCase().includes(caseTitle.toLowerCase()) || 
      (t.passages[0] && t.passages[0].title.toLowerCase().includes(caseTitle.toLowerCase()))
    );

    if (existingTest) {
      onStartTest(existingTest.id);
    } else {
      triggerGeneration(`${citationText} ratio and law`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerGeneration(searchQuery);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-1 py-4 font-sans">
      
      {/* Banner */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-2xl p-6 relative overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 text-[100px] opacity-[0.01] pointer-events-none font-mono tracking-tighter select-none">AI</div>
        <div className="space-y-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest leading-none">
              <Sparkles className="w-3.5 h-3.5" /> Landmark AI Labs
            </div>
            
            <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
              isPremium 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-zinc-800/80 text-zinc-400 border-zinc-750'
            }`}>
              {isPremium ? "Premium Plan (Unlimited Matches)" : `Free Balance: ${Math.max(0, 2 - aiGeneratedCount)}/2 Attempts Left`}
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-zinc-100 font-sans">Dynamic Legal Research Compiler</h2>
          <p className="text-zinc-400 text-xs max-w-2xl leading-relaxed">
            Directly connect your prep curriculum with up-to-date judicial precedents. Using real-time search grounding, LexRank synthesizes high-difficulty exam passages and multiple choice questions formatted strictly to active CLAT PG exam trends.
          </p>
        </div>
      </div>

      {showUpgradeGate ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0c0c0f] border-2 border-amber-500/30 rounded-2xl p-6 md:p-8 space-y-6 text-center max-w-xl mx-auto shadow-xl shadow-amber-950/10"
        >
          <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
            <Lock className="w-6 h-6 text-amber-500 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-zinc-100 font-sans">
              🔒 Landmark AI Synthesis Locked
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-md mx-auto">
              You have completed <span className="text-amber-500 font-mono font-bold">2 of 2</span> free Landmark AI compilations. Subscription to our premium package unlocks unlimited custom mock generations.
            </p>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-850 rounded-xl p-4.5 text-left space-y-3 max-w-md mx-auto">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-zinc-200">Unlimited Legal Synthesis</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Generate endless dynamic mock practice material from any statutory section or case ratio.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Scale className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-zinc-200">Exam-Aligned Passages</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Custom questions formatted precisely to modern CLAT PG difficult legal parameters.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xs sm:max-w-none mx-auto">
            <button
              onClick={() => setShowUpgradeGate(false)}
              className="w-full sm:w-auto px-5 py-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 font-bold text-xs rounded-xl cursor-pointer transition-all"
            >
              Back to Labs
            </button>
            <button
              onClick={onUpgradeRedirect}
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              Get Premium Protection <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      ) : isLoading ? (
        <div className="h-96 flex flex-col items-center justify-center p-6 bg-zinc-900 border border-zinc-800/60 rounded-2xl space-y-6 text-center select-none">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-amber-500/25 border-t-amber-500 rounded-full animate-spin" />
            <Scale className="w-6 h-6 text-amber-500 absolute top-5 left-5 animate-pulse" />
          </div>
          <div className="space-y-2 max-w-md">
            <p className="text-zinc-100 text-sm font-semibold font-sans">Synthesizing Active Landmark Precedent</p>
            <p className="text-xs text-amber-400 font-mono italic animate-pulse h-10 flex items-center justify-center">
              &quot;{loadingMessages[loadingStep]}&quot;
            </p>
            <p className="text-[10px] text-zinc-500 font-mono">This usually takes about 10-25 seconds to construct premium exam materials.</p>
          </div>
        </div>
      ) : generatedTest ? (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-emerald-500/30 rounded-2xl p-6 space-y-5 shadow-lg shadow-emerald-950/5"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-zinc-200">Synthesis Complete! Practice Ready</h3>
            </div>
            <button 
              onClick={() => setGeneratedTest(null)}
              className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 font-mono transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          </div>

          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4.5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded font-bold">
                {generatedTest.passages[0].subject}
              </span>
              <span className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {generatedTest.durationMinutes} Mins Sprint Mocks
              </span>
            </div>
            <h4 className="text-base font-bold text-zinc-100 font-sans">{generatedTest.passages[0].title}</h4>
            <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-serif italic text-justify bg-zinc-900/40 p-3 rounded-lg border border-zinc-805">
              &quot;{generatedTest.passages[0].text}&quot;
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Includes 5 highly challenging questions mapping to this case.</span>
            <button
              onClick={() => onStartTest(generatedTest.id)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs rounded-xl shadow shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-4 h-4 shrink-0 fill-current" /> Begin Dynamic AI Test
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Target Query compiler input */}
          <form onSubmit={handleSearchSubmit} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Gavel className="w-3.5 h-3.5 text-amber-500" /> Precedent Case &amp; Clause Query
            </h3>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Enter specific judgment names or legal articles (e.g. 'Sita Soren v Union of India', 'Section 45 PMLA bail'...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950/80 border border-zinc-800/80 active:border-amber-500 focus:border-amber-500/50 rounded-xl py-3 pl-11 pr-4 text-base md:text-xs text-zinc-200 outline-none transition-all placeholder:text-zinc-650"
              />
              <Search className="w-4 h-4 text-zinc-600 absolute left-4 top-3.5" />
            </div>

            {recentSearches.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1.5">
                <span className="text-[10px] uppercase font-sans tracking-widest text-zinc-500 font-bold">Recent Searches:</span>
                <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
                  {recentSearches.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setSearchQuery(item);
                        triggerGeneration(item);
                      }}
                      className="inline-flex items-center gap-1 bg-zinc-950 hover:bg-zinc-850 hover:border-zinc-700/60 border border-zinc-900 px-2.5 py-1 rounded-full text-[10px] text-zinc-400 hover:text-amber-400 transition-all font-sans cursor-pointer max-w-[140px] truncate"
                      title={`Search for "${item}"`}
                    >
                      <Clock className="w-2.5 h-2.5 text-zinc-600 shrink-0 animate-none" />
                      <span className="truncate">{item}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        localStorage.removeItem('lexrank_recent_searches');
                      } catch {}
                      setRecentSearches([]);
                    }}
                    className="text-[9px] text-zinc-600 hover:text-rose-400 font-mono underline hover:no-underline transition-all cursor-pointer ml-auto"
                  >
                    Clear history
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 pt-1">
              <p className="text-[10px] text-zinc-500 leading-relaxed max-w-sm">
                Specify any Indian Supreme Court landmark case or topical statutory provisions. The compiler will launch parallel search pipelines to extract the ratios.
              </p>
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-md shadow-amber-500/5"
              >
                Assemble AI Mock <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Curated Hot Landmark Judgments */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-amber-500" /> Curated Hot Precedents (2024 Exam Trends)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TRENDING_JUDGMENTS.map((caseItem, idx) => {
                const hasGenerated = availableTests.some(t => t.title.toLowerCase().includes(caseItem.title.toLowerCase()) || t.passages[0]?.title.toLowerCase().includes(caseItem.title.toLowerCase()));

                return (
                  <div 
                    key={idx}
                    className="bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/20 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm relative overflow-hidden transition-all group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2 border-b border-zinc-800/40 pb-2">
                        <div>
                          <h4 className="text-xs font-bold text-zinc-200 font-sans group-hover:text-amber-400 transition-colors">
                            {caseItem.title}
                          </h4>
                          <span className="text-[9.5px] text-zinc-500 block font-mono italic truncate mt-0.5">
                            {caseItem.citation}
                          </span>
                        </div>
                        {hasGenerated && (
                          <span className="text-[8px] bg-emerald-950/30 border border-emerald-900/30 text-emerald-400 font-mono px-2 py-0.5 rounded uppercase font-bold shrink-0">
                            Generated
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-zinc-400 leading-relaxed font-sans line-clamp-2">
                        {caseItem.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-zinc-805">
                      <div className="text-[9px] text-zinc-500">
                        <span className="block font-mono font-medium">Focus: <strong className="text-zinc-400">{caseItem.focus}</strong></span>
                        <span className="block font-mono font-medium mt-0.5">Bench: <strong className="text-zinc-500">{caseItem.bench}</strong></span>
                      </div>

                      <button
                        onClick={() => handleCuratedClick(caseItem.title, caseItem.citation)}
                        className={`py-1.5 px-3 font-bold text-[10px] rounded-lg transition-all cursor-pointer shadow-sm flex items-center gap-1 font-mono shrink-0 ${
                          hasGenerated
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/20'
                            : hasReachedFreeLimit
                              ? 'bg-amber-500/5 hover:bg-amber-500/15 text-amber-500/90 border border-amber-500/10'
                              : 'bg-zinc-800/80 hover:bg-amber-500 text-zinc-300 hover:text-zinc-950 border border-zinc-700/60 hover:border-amber-500'
                        }`}
                      >
                        {hasGenerated ? (
                          <>
                            <Play className="w-3 h-3 fill-current" /> Practice
                          </>
                        ) : hasReachedFreeLimit ? (
                          <>
                            <Lock className="w-3 h-3 text-amber-500/85" /> Locked
                          </>
                        ) : (
                          'Launch'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-950/20 border border-red-800/30 p-4 rounded-xl text-xs space-y-2 text-red-400 leading-relaxed shadow-inner">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span className="font-bold">Constitutional System Exception</span>
          </div>
          <p className="font-sans">{errorMsg}</p>
          <p className="text-[9.5px] text-red-500/80 font-mono">
            Could be caused by request rate limiting or transient server issues. Tap retry to re-launch search loops.
          </p>
        </div>
      )}
    </div>
  );
}
