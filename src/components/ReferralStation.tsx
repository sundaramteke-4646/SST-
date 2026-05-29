import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { 
  Share2, 
  Copy, 
  Check, 
  Users, 
  QrCode, 
  Gift, 
  Sparkles, 
  Download, 
  Maximize2, 
  X, 
  PartyPopper,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReferralStationProps {
  user: User;
  onUpdatePlan?: (newPlan: 'free' | 'basic' | 'premium') => void;
}

interface ReferredFriend {
  name: string;
  timestamp: string;
  rewarded: boolean;
}

const SIMULATED_NAMES = [
  'Priya Iyer',
  'Rohan Mehra',
  'Kabir Mukherji',
  'Ananya Deshmukh',
  'Aditya Nair',
  'Tanya Malhotra',
  'Vikram Rastogi',
  'Ishita Verma',
  'Abhishek Joshi',
  'Meera Chawla'
];

export default function ReferralStation({ user, onUpdatePlan }: ReferralStationProps) {
  const [friends, setFriends] = useState<ReferredFriend[]>([]);
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [lastNotification, setLastNotification] = useState<string | null>(null);
  const [bonusClaimed, setBonusClaimed] = useState(false);

  // Derive referral code
  const referralCode = user.profile.username.toLowerCase().replace(/[^a-z0-9]/g, '') || 'aspirant';
  
  // Construct dynamic referral URL based on the current domain/origin
  const baseDomain = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-6lllgpxf6hs4g4rmlqfczb-936990438675.asia-southeast1.run.app';
  const referralLink = `${baseDomain}/?ref=${referralCode}`;

  // Load state
  useEffect(() => {
    const key = `lexrank_referrals_${user.email}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setFriends(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing stored referrals', e);
      }
    }

    const keyClaimed = `lexrank_bonus_claimed_${user.email}`;
    const storedClaimed = localStorage.getItem(keyClaimed);
    if (storedClaimed) {
      setBonusClaimed(JSON.parse(storedClaimed));
    }
  }, [user.email]);

  // Save state helper
  const saveFriendsList = (updated: ReferredFriend[]) => {
    setFriends(updated);
    localStorage.setItem(`lexrank_referrals_${user.email}`, JSON.stringify(updated));
  };

  const handleCopyLink = () => {
    copyToClipboard(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate a new friend registering with the referral code
  const handleSimulateReferral = () => {
    if (friends.length >= 10) {
      setLastNotification("Maximum simulation capacity reached (10 users).");
      setTimeout(() => setLastNotification(null), 3000);
      return;
    }

    // Pick a name that isn't already added if possible
    const currentNames = friends.map(f => f.name);
    const availableNames = SIMULATED_NAMES.filter(n => !currentNames.includes(n));
    const randomName = availableNames.length > 0 
      ? availableNames[Math.floor(Math.random() * availableNames.length)]
      : SIMULATED_NAMES[Math.floor(Math.random() * SIMULATED_NAMES.length)] + ` #${friends.length + 1}`;

    const dateStr = new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newFriend: ReferredFriend = {
      name: randomName,
      timestamp: dateStr,
      rewarded: false
    };

    const updated = [...friends, newFriend];
    saveFriendsList(updated);
    setLastNotification(`🎯 ${randomName} signed up using your link!`);
    
    // Clear notification after 4 secs
    setTimeout(() => setLastNotification(null), 4000);
  };

  const handleClaimFreePremium = () => {
    if (friends.length >= 3 && onUpdatePlan && !bonusClaimed) {
      onUpdatePlan('premium');
      setBonusClaimed(true);
      localStorage.setItem(`lexrank_bonus_claimed_${user.email}`, JSON.stringify(true));
      setLastNotification("🎉 Premium Pass Activated via Referral Rewards!");
      setTimeout(() => setLastNotification(null), 5000);
    }
  };

  const handleResetSim = () => {
    saveFriendsList([]);
    setBonusClaimed(false);
    localStorage.removeItem(`lexrank_bonus_claimed_${user.email}`);
    // If we're premium due to resets/claim, revert to free to let them test again
    if (user.plan === 'premium' && onUpdatePlan) {
      onUpdatePlan('free');
    }
  };

  // Milestone goals
  const isMilestone1Unlocked = friends.length >= 1;
  const isMilestone2Unlocked = friends.length >= 3;

  // Social Sharing texts
  const shareText = `LexRank is phenomenal for Postgraduate CLAT LLM exam preparation! Sign up with my link to unlock elite Supreme Court precedent ratio synthesis, Grand Mocks & custom tests: ${referralLink}`;
  const getShareUrl = (medium: 'whatsapp' | 'telegram' | 'twitter') => {
    if (medium === 'whatsapp') {
      return `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    } else if (medium === 'telegram') {
      return `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`;
    } else {
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-805 rounded-2xl p-5 space-y-5 relative shadow-md">
      
      {/* Top Title Bar */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/25 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
            <Gift className="w-3 h-3 text-amber-500" /> Referral Rewards
          </div>
          <h3 className="text-sm font-extrabold text-zinc-100 font-sans tracking-tight">LexRank Elite Share Station</h3>
          <p className="text-[10px] text-zinc-400">Invite peers to optimize postgraduate LLM legal frameworks & unlock premium tools.</p>
        </div>
      </div>

      {/* Interactive Active Toast Notification */}
      <AnimatePresence>
        {lastNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="p-3 bg-zinc-950 border border-amber-500/30 rounded-xl text-[11px] text-amber-400 flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-1.5">
              <PartyPopper className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold">{lastNotification}</span>
            </div>
            <button onClick={() => setLastNotification(null)} className="text-zinc-500 hover:text-zinc-300">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copy and QR Action Panel */}
      <div className="grid grid-cols-1 select-none gap-3">
        {/* Referral Link Copy Area */}
        <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-3 flex items-center justify-between gap-2.5">
          <div className="overflow-hidden space-y-0.5 flex-1">
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block">Personalized Link</span>
            <span className="text-[11px] font-mono font-medium text-zinc-300 block truncate">{referralLink}</span>
          </div>
          <button
            onClick={handleCopyLink}
            className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              copied 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Copy Referral Link"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Small QR & Fast sharing bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowQRModal(true)}
            className="flex-1 bg-zinc-950 hover:bg-zinc-950/60 transition-colors border border-zinc-850 hover:border-zinc-750 px-3 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-xs font-bold text-zinc-300"
          >
            <QrCode className="w-4 h-4 text-amber-500" /> Share QR Code
          </button>
          
          <div className="flex gap-2 shrink-0">
            <a 
              href={getShareUrl('whatsapp')} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-750 rounded-lg flex items-center justify-center transition-colors"
              title="Share on WhatsApp"
            >
              <svg className="w-4 h-4 text-emerald-500 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <a 
              href={getShareUrl('telegram')} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-750 rounded-lg flex items-center justify-center transition-colors"
              title="Share on Telegram"
            >
              <svg className="w-4 h-4 text-blue-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.393c-.16.16-.295.293-.605.293l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.87 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.46c.538-.196 1.006.128.832.99z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Referral Milestone Roadmap */}
      <div className="bg-zinc-950/60 border border-zinc-850/60 rounded-xl p-3.5 space-y-3.5 select-none">
        <div className="flex items-center justify-between text-[11px] font-sans">
          <span className="text-zinc-400 font-medium">Rewards Mastery Route</span>
          <span className="font-mono text-amber-500 font-bold">{friends.length}/3 Peers Invited</span>
        </div>

        {/* Custom Progress Bar */}
        <div className="relative">
          <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, (friends.length / 3) * 100)}%` }}
            />
          </div>

          {/* Markers */}
          <div className="flex justify-between items-center pt-2 text-[10px] text-zinc-500">
            <div className={`flex flex-col items-start ${isMilestone1Unlocked ? 'text-amber-500' : ''}`}>
              <span className="font-bold">1 Peer</span>
              <span className="text-[9px]">Ambassador Tag</span>
            </div>
            <div className={`flex flex-col items-end ${isMilestone2Unlocked ? 'text-amber-500' : ''}`}>
              <span className="font-bold flex items-center gap-1">
                {bonusClaimed ? '✓ Claimed' : '3 Peers'}
              </span>
              <span className="text-[9px]">Free Premier Upgrade</span>
            </div>
          </div>
        </div>

        {/* Milestone 2 Reward Action Button */}
        {isMilestone2Unlocked && !bonusClaimed && onUpdatePlan && (
          <button
            onClick={handleClaimFreePremium}
            className="w-full mt-2 py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-extrabold text-[11px] rounded-lg tracking-wide hover:scale-[1.01] transition-all flex items-center justify-center gap-1 shadow cursor-pointer uppercase"
          >
            <Zap className="w-3.5 h-3.5 fill-current" /> Claim Free Premier Access <ArrowRight className="w-3 h-3" />
          </button>
        )}

        {bonusClaimed && (
          <div className="text-center py-1.5 px-3 rounded-lg border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 text-[10.5px] font-medium flex items-center justify-center gap-1">
            <Check className="w-3.5 h-3.5" /> Premier Access Unlocked via Referrals
          </div>
        )}
      </div>

      {/* Simulated Signups History Ledger */}
      <div className="space-y-2.5 select-none">
        <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-between">
          <span>Joined Peers List ({friends.length})</span>
          {friends.length > 0 && (
            <button 
              onClick={handleResetSim}
              className="text-[9px] text-zinc-600 hover:text-red-400 hover:underline bg-transparent border-none cursor-pointer p-0"
            >
              Reset list
            </button>
          )}
        </h4>

        {friends.length === 0 ? (
          <div className="px-3 py-4 border border-dashed border-zinc-850 bg-zinc-950/20 text-center rounded-xl space-y-1">
            <Users className="w-6 h-6 text-zinc-700 mx-auto" />
            <p className="text-[10px] text-zinc-500">No peers have registered yet. Share your custom link above or simulate a register below!</p>
          </div>
        ) : (
          <div className="max-h-28 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800 pr-1">
            {friends.map((friend, i) => (
              <div key={i} className="bg-zinc-950 border border-zinc-850/80 rounded-lg p-2 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-mono font-bold text-[9px]">
                    {friend.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-200">{friend.name}</p>
                    <p className="text-[9px] text-zinc-500">Joined: {friend.timestamp}</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Verified
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Simulation Helper Panel */}
      <div className="bg-zinc-950/40 border border-zinc-800 p-3 rounded-xl space-y-2.5">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-zinc-400 leading-normal">
            <strong>Developer Demonstration Desk:</strong> Use the live tester below to instantly mock a classmate registering with your custom link. Invite 3 peers to secure a completely free, verified upgrade to the <strong>₹2000 Premier Researcher Plan</strong>.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSimulateReferral}
          className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-200 font-bold text-[10.5px] rounded-lg tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow"
        >
          <Users className="w-3.5 h-3.5 text-zinc-400" /> Simulate Peer Sign-up
        </button>
      </div>

      {/* QR ZOOM MODAL OVERLAY */}
      <AnimatePresence>
        {showQRModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-sm w-full p-6 space-y-5 text-center relative shadow-2xl"
            >
              <button 
                onClick={() => setShowQRModal(false)}
                className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-100 p-1 bg-zinc-900 hover:bg-zinc-850 rounded-lg cursor-pointer transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1 pt-2">
                <h4 className="text-sm font-extrabold text-zinc-100 font-sans uppercase tracking-tight">LexRank QR Code</h4>
                <p className="text-[10px] text-zinc-400">Scan this code to load the app directly containing your referral tag</p>
              </div>

              {/* High resolution QR */}
              <div className="bg-white p-3 rounded-2xl w-48 h-48 mx-auto flex items-center justify-center shadow-lg border border-zinc-800 select-none">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=8&data=${encodeURIComponent(referralLink)}`}
                  alt="Personalized Referral Link QR Code"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1 flex flex-col items-center">
                <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Active Referral Link
                </span>
                <p className="text-[10.5px] text-zinc-500 font-mono select-all mt-1 w-full truncate px-4">{referralLink}</p>
                <p className="text-[9px] text-zinc-500 italic mt-1.5 leading-normal max-w-[280px] bg-zinc-900/50 py-1 px-3 rounded-lg border border-zinc-850/60">
                  ⚡ On iOS &amp; Android, you can long-press the QR code image to copy, save, or share it natively.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowQRModal(false)}
                  className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 font-bold text-xs rounded-lg cursor-pointer transition-colors"
                >
                  Close
                </button>
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=16&data=${encodeURIComponent(referralLink)}`}
                  target="_blank"
                  download="lexrank-referral-qr.png"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/10"
                >
                  <Download className="w-3.5 h-3.5" /> High-Res PNG
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
