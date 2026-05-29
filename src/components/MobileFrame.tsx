import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Sparkles, Sliders } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export default function MobileFrame({ children }: MobileFrameProps) {
  const [isDeviceView, setIsDeviceView] = useState(true);
  const [deviceTheme, setDeviceTheme] = useState<'ios' | 'android'>('ios');
  const [time, setTime] = useState('');
  const [islandExpanded, setIslandExpanded] = useState(false);

  // Live clock for virtual device status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const mins = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTime(`${hours}:${mins} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 flex flex-col justify-between font-sans selection:bg-amber-500/30 selection:text-amber-200 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-600/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Top Controller Ribbon */}
      <header className="bg-[#0b0b0d]/80 backdrop-blur-xl border-b border-zinc-900 px-4 py-3 flex items-center justify-between shadow-lg relative z-10 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          <span className="text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-zinc-400">LexRank Premium Simulator</span>
        </div>
        
        <div className="flex items-center gap-2">
          {isDeviceView && (
            <div className="flex items-center bg-[#111115] border border-zinc-850 rounded-xl p-0.5 mr-2">
              <button
                type="button"
                onClick={() => setDeviceTheme('ios')}
                className={`text-[10px] font-sans font-bold px-2.5 py-1 rounded-lg transition-all ${
                  deviceTheme === 'ios'
                    ? 'bg-zinc-800 text-amber-400 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                iOS Style
              </button>
              <button
                type="button"
                onClick={() => setDeviceTheme('android')}
                className={`text-[10px] font-sans font-bold px-2.5 py-1 rounded-lg transition-all ${
                  deviceTheme === 'android'
                    ? 'bg-zinc-800 text-amber-400 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Android
              </button>
            </div>
          )}

          <button
            type="button"
            id="emulator-toggle-view"
            onClick={() => setIsDeviceView(!isDeviceView)}
            className="flex items-center gap-2 bg-[#121215] border border-zinc-850 text-[11px] py-1.5 px-3 rounded-xl hover:border-amber-500/55 hover:text-amber-400 transition-all font-sans font-bold text-zinc-300 shadow-sm cursor-pointer"
          >
            {isDeviceView ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-amber-500" /> Web Aspect
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-500" /> Phone Aspect
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container Wrapper */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 relative overflow-hidden">
        
        {isDeviceView ? (
          /* Apple Inspired Bezels versus Material */
          <div className={`w-full max-w-[405px] bg-[#0c0c0e] rounded-[55px] p-3 border-[6px] transition-all duration-500 ${
            deviceTheme === 'ios' 
              ? 'border-[#1b1c21] shadow-[0_35px_80px_rgba(0,0,0,0.95),inset_0_1px_2px_rgba(255,255,255,0.06)] ring-1 ring-[#2a2b30]' 
              : 'border-[#222226] shadow-[0_30px_70px_rgba(0,0,0,0.9)] ring-1 ring-zinc-800'
          } relative flex flex-col h-[825px] overflow-hidden justify-between`}>
            
            {/* 1. iOS TYPE: Dynamic Island Bezel, 2. Android Type: Standard teardrop */}
            {deviceTheme === 'ios' ? (
              /* Interactive Dynamic Island overlay */
              <div 
                onClick={() => setIslandExpanded(!islandExpanded)}
                onMouseEnter={() => setIslandExpanded(true)}
                onMouseLeave={() => setIslandExpanded(false)}
                className={`absolute top-3 left-1/2 -translate-x-1/2 bg-[#000000] rounded-full flex items-center justify-center z-50 transition-all duration-300 ease-out cursor-pointer shadow-[0_8px_20px_rgba(0,0,0,0.8)] border border-neutral-900 ${
                  islandExpanded 
                    ? 'w-64 h-11 px-4 py-2 gap-2.5 rounded-2xl border-white/5' 
                    : 'w-24 h-6.5'
                }`}
              >
                {islandExpanded ? (
                  <div className="flex items-center justify-between w-full text-[10.5px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                      <span className="text-zinc-300 font-bold uppercase tracking-wider font-sans">LexRank Presets</span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-400/10 px-1.5 py-0.5 rounded-md">
                      CLAT PG 2027 ACTIVE
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                    <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                  </div>
                )}
              </div>
            ) : (
              /* Teardrop Android punch slot */
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#222226] h-6 w-28 rounded-b-2xl flex items-center justify-center z-20 shadow-inner">
                <span className="bg-zinc-950 w-7 h-1 rounded-full block mb-1" />
              </div>
            )}

            {/* Virtual Device Content Wrapper with Apple rounded curves */}
            <div className={`flex-1 bg-[#09090b] rounded-[44px] overflow-hidden border flex flex-col justify-between relative mt-1.5 transition-all ${
              deviceTheme === 'ios' ? 'border-zinc-900/40' : 'border-[#232328]'
            }`}>
              
              {/* Simulated Device Status bar */}
              <div className="bg-[#0b0b0d] px-6 py-3 pt-4.5 flex items-center justify-between text-[11px] font-sans text-zinc-400 select-none border-b border-zinc-900/60 font-medium">
                <span className="font-bold tracking-tight text-zinc-200">{time || '9:41 AM'}</span>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    <span className="w-0.5 h-1 bg-zinc-400 rounded-xs" />
                    <span className="w-0.5 h-1.5 bg-zinc-405 d-xs" />
                    <span className="w-0.5 h-2 bg-zinc-400 rounded-xs" />
                    <span className="w-0.5 h-2.5 bg-amber-500 rounded-xs" />
                  </div>
                  <Wifi className="w-3.5 h-3.5 text-zinc-300" />
                  <div className="flex items-center gap-1.5 pl-0.5">
                    <div className="relative w-5.5 h-2.5 border border-zinc-500 rounded-sm p-0.5 flex items-center">
                      <div className="bg-emerald-500 h-full w-[85%] rounded-[1px]" />
                      <div className="absolute right-[-2.5px] top-1/2 -translate-y-1/2 bg-zinc-500 w-[1.5px] h-1.2 rounded-r-xs" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Viewport contents scroll context */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 bg-[#09090b] p-[1px]">
                {children}
              </div>

              {/* Bottom Navigation Control Swipe pill (iOS Home indicator vs Soft keys) */}
              {deviceTheme === 'ios' ? (
                <div className="bg-[#0b0b0d] border-t border-zinc-950/40 py-4 flex flex-col items-center justify-center select-none relative z-10 shrink-0">
                  <div className="w-32 h-1.2 bg-zinc-700/80 rounded-full hover:bg-zinc-500 transition-all shadow-sm" />
                </div>
              ) : (
                <div className="bg-[#0b0b0d] border-t border-[#16161a] py-3 flex items-center justify-around text-zinc-500 text-xs select-none relative z-10 shrink-0">
                  <button type="button" className="hover:text-zinc-300 py-1 transition-colors font-mono text-[10px] font-bold cursor-default">&lt; BACK</button>
                  <div className="w-12 h-3 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-all border border-zinc-700/30" />
                  <div className="w-3.5 h-3.5 border-2 border-zinc-800 rounded hover:border-zinc-700 transition-all" />
                </div>
              )}

            </div>

          </div>
        ) : (
          /* Plain Web Layout (Full Viewport responsive dashboard with micro borders and shadows) */
          <div className="w-full max-w-7xl mx-auto bg-[#0a0a0c]/90 border border-zinc-900 rounded-[2rem] p-4 sm:p-7 shadow-2xl relative min-h-[75vh] backdrop-blur-md">
            {children}
          </div>
        )}

      </main>

      {/* Developer credit footer lines */}
      <footer className="bg-[#050506]/95 border-t border-zinc-950 py-3.5 text-center text-[10.5px] text-zinc-500 font-sans tracking-wide">
        <p>&copy; 2026 LexRank CLAT PG &bull; Developed by <span className="text-amber-500/80 font-semibold font-sans">Sundaram Teke</span> &bull; Supported on all Android & Web Platforms</p>
      </footer>

    </div>
  );
}
