import React, { useState } from 'react';
import { User, UserProfile } from '../types';
import { ShieldCheck, Mail, Lock, User as UserIcon, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import LexRankLogo from './LexRankLogo';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [targetYear, setTargetYear] = useState('2027');
  const [dailyGoal, setDailyGoal] = useState(30);
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !username)) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const storageKey = `lexrank_user_${email.toLowerCase().trim()}`;
    const existingUserData = localStorage.getItem(storageKey);

    if (isLogin) {
      if (existingUserData) {
        try {
          const user = JSON.parse(existingUserData) as User;
          onLoginSuccess(user);
        } catch (e) {
          setError('Failed to login. Corrupted profile.');
        }
      } else {
        setError('No account found with this email. Sign up above or launch Demo account below!');
      }
    } else {
      // Sign up
      if (existingUserData) {
        setError('An account with this email already exists.');
        return;
      }

      const newProfile: UserProfile = {
        username: username.trim(),
        email: email.toLowerCase().trim(),
        targetYear,
        dailyGoalMinutes: dailyGoal,
        studyStreakDays: 1,
        avatarUrl: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150`
      };

      const newUser: User = {
        username: username.trim(),
        email: email.toLowerCase().trim(),
        profile: newProfile,
        completedTests: [] // Brand new user starts with empty list
      };

      localStorage.setItem(storageKey, JSON.stringify(newUser));
      localStorage.setItem('lexrank_last_logged_in', email.toLowerCase().trim());
      onLoginSuccess(newUser);
    }
  };

  const handleLaunchDemo = () => {
    // Generate a beautiful demo user with existing tests completed to show off the visual analytics!
    const demoEmail = 'sundaramteke@gmail.com';
    const demoKey = `lexrank_user_${demoEmail}`;
    
    const demoProfile: UserProfile = {
      username: 'Sundaram Teke',
      email: demoEmail,
      targetYear: '2027',
      dailyGoalMinutes: 45,
      studyStreakDays: 8,
      avatarUrl: ''
    };

    const demoUser: User = {
      username: 'Sundaram Teke',
      email: demoEmail,
      profile: demoProfile,
      completedTests: [
        {
          id: 'res-1',
          testId: 'clat-pg-mock-1',
          testTitle: 'LexRank CLAT PG Grand Mock Test 1',
          score: 8.75, // 10 correct (+10), 5 wrong (-1.25), score = 8.75
          correctCount: 10,
          wrongCount: 5,
          skippedCount: 0,
          totalQuestions: 15,
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          timeSpentSeconds: 1680, // 28 mins
          percentage: 58.3
        },
        {
          id: 'res-2',
          testId: 'clat-pg-mock-2',
          testTitle: 'LexRank CLAT PG Fundamental Rights Practice',
          score: 6.25, // 7 correct (+7), 3 wrong (-0.75), score = 6.25
          correctCount: 7,
          wrongCount: 3,
          skippedCount: 0,
          totalQuestions: 10,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          timeSpentSeconds: 940, // 15 mins 40s
          percentage: 62.5
        }
      ]
    };

    localStorage.setItem(demoKey, JSON.stringify(demoUser));
    localStorage.setItem('lexrank_last_logged_in', demoEmail);
    onLoginSuccess(demoUser);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[76vh] px-4 py-6 relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[375px] bg-[#0d0d10]/95 border border-zinc-800/80 rounded-3xl shadow-[0_15px_45px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.03)] overflow-hidden relative"
      >
        {/* Glow accent bar at the very top */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700" />

        {/* Banner with logo info */}
        <div className="bg-gradient-to-br from-amber-500/[0.08] via-transparent to-transparent p-6 text-center border-b border-zinc-900 relative flex flex-col items-center">
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500/10 text-amber-400 text-[9px] uppercase tracking-widest font-mono py-1 px-2.5 rounded-full border border-amber-500/20 font-bold">
            <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" /> CLAT PG
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex justify-center mb-1"
          >
            <LexRankLogo size="md" showText={false} className="scale-[0.85]" />
          </motion.div>
          <h1 className="text-xl font-sans font-extrabold tracking-tight text-white mt-2">LexRank CLAT PG</h1>
          <p className="text-[11px] text-zinc-400 mt-1 max-w-[250px] mx-auto">LLM entrance training engineered for legal excellence.</p>
        </div>

        {/* Auth selector tabs */}
        <div className="flex border-b border-zinc-900 bg-[#09090b]">
          <button 
            type="button"
            id="auth-tab-login"
            className={`flex-1 py-3 text-xs font-mono uppercase tracking-wider font-bold transition-all ${isLogin ? 'text-amber-500 border-b-2 border-amber-500 bg-[#0d0d10]' : 'text-zinc-500 hover:text-zinc-300'}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Sign In
          </button>
          <button 
            type="button"
            id="auth-tab-register"
            className={`flex-1 py-3 text-xs font-mono uppercase tracking-wider font-bold transition-all ${!isLogin ? 'text-amber-500 border-b-2 border-amber-500 bg-[#0d0d10]' : 'text-zinc-500 hover:text-zinc-300'}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Sign Up
          </button>
        </div>

        {/* Auth form */}
        <form onSubmit={handleAuth} className="p-5 space-y-4">
          {error && (
            <div className="p-3 text-[11px] bg-red-950/30 border border-red-900/30 text-red-300 rounded-xl font-medium leading-relaxed">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  id="auth-input-name"
                  placeholder="e.g. Sundaram Teke"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#070709] border border-zinc-800/80 rounded-xl py-2 pl-9 pr-4 text-base md:text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all font-sans"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                id="auth-input-email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#070709] border border-zinc-800/80 rounded-xl py-2 pl-9 pr-4 text-base md:text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all font-sans"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                id="auth-input-password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#070709] border border-zinc-800/80 rounded-xl py-2 pl-9 pr-4 text-base md:text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all font-sans"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">Target Year</label>
                <select
                  id="auth-input-year"
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                  className="w-full bg-[#070709] border border-zinc-800/80 rounded-xl py-2 px-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                >
                  <option value="2027">2027 (Upcoming Dec 2026)</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">Goal (Mins/Day)</label>
                <input
                  type="number"
                  id="auth-input-goal"
                  min="10"
                  max="300"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  className="w-full bg-[#070709] border border-zinc-800/80 rounded-xl py-1.5 px-2 text-base md:text-xs text-zinc-100 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 hover:scale-[1.01] hover:from-amber-400 hover:to-amber-500 transition-all mt-4 text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center p-4 bg-[#0a0a0d] border-t border-zinc-900/60">
          <p className="text-[10px] text-zinc-500">Need to explore immediately without creating an account?</p>
          <button
            type="button"
            id="auth-launch-demo"
            onClick={handleLaunchDemo}
            className="mt-2 text-[11px] font-mono text-amber-500 hover:text-amber-400 underline font-bold transition-all cursor-pointer inline-flex items-center gap-1"
          >
            🚀 Launch Demo (Sundaram Teke)
          </button>
        </div>
      </motion.div>
    </div>
  );
}
