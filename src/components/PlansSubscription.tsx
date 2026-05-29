import React, { useState } from 'react';
import { User } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { 
  CreditCard, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  HelpCircle, 
  ArrowRight, 
  Loader2, 
  Calendar,
  IndianRupee,
  BadgeAlert,
  Zap,
  CheckCircle2,
  X,
  QrCode,
  Building,
  Copy,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PlansSubscriptionProps {
  user: User;
  onUpdatePlan: (newPlan: 'free' | 'basic' | 'premium') => void;
}

export default function PlansSubscription({ user, onUpdatePlan }: PlansSubscriptionProps) {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi_qr'>('card');
  const [copiedText, setCopiedText] = useState<'account' | 'ifsc' | 'upi' | null>(null);
  const [directQrAmount, setDirectQrAmount] = useState<'500' | '2000'>('2000');

  // Promo discount code states
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const activePlan = user.plan || 'free';

  const handleCopy = (text: string, type: 'account' | 'ifsc' | 'upi') => {
    copyToClipboard(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const bankDetails = {
    bankName: 'Bank of Maharashtra',
    accountNumber: '60160669731',
    ifscCode: 'MAHB0000445',
    payeeName: 'Sundaram Teke',
    upiId: '60160669731@MAHB0000445.ifsc.npci',
    amount: '500'
  };

  // Plans data details
  const plans = [
    {
      id: 'free' as const,
      name: 'Free Starter Trial',
      price: '0',
      period: 'Forever',
      description: 'Test the waters of competitive postgraduate law preparation.',
      features: [
        'Access to 1 Grand Mock Paper (Mock 1)',
        'Basic study analytics trajectory tracking',
        'Standard subject mastery analytics',
        'Daily goal reminder notification configuration'
      ],
      lockedFeatures: [
        'AI judgment custom-tests synthesis',
        'Lock on Mock Test 2 & custom test creations',
        'Up-to-date Landmark AI recommendation dashboard'
      ],
      color: 'border-zinc-800 text-zinc-400 bg-zinc-950/40',
      badge: 'Starter Tier'
    },
    {
      id: 'basic' as const,
      name: 'Basic Sprint Plan',
      price: '500',
      period: 'Monthly Plan',
      description: 'Comprehensive static review with full access to all 300 syllabus-wise practice tests.',
      features: [
        'Unlock ALL 300 Practice Tests (Syllabus Engine)',
        'Unlock ALL Grand Mock Papers (Mock 1, 2, 3...)',
        'Extended historic performance logs tracking',
        'Full color Subject-wise Mastery trajectory charts',
        '1 Advanced Search AI recommendation per 24 hours',
        'Dedicated 2027 CLAT PG (Dec 2026) Syllabus tracking logs'
      ],
      lockedFeatures: [
        'Unlimited AI precedent custom mock test creations'
      ],
      color: 'border-amber-500/20 text-zinc-100 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900',
      badge: 'Popular',
      badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    },
    {
      id: 'premium' as const,
      name: 'Premier Researcher Plan',
      price: '2000',
      period: 'One-Time Payment',
      description: 'Ultimate power tools powered by real-time Landmark AI Labs.',
      features: [
        'Unlock ALL Mock Papers & custom analytical logs',
        'UNLIMITED custom-test AI synthesis (Any SC precedent)',
        'Unlimited AI precedent research & ratio formulations',
        'Hard recommendations with predictive question calibration',
        'Exclusive offline-capability emulators tracking support',
        'Priority high-speed response bypass servers'
      ],
      lockedFeatures: [],
      color: 'border-amber-500/60 text-zinc-100 bg-gradient-to-br from-zinc-900 via-[#13110d] to-zinc-950',
      badge: 'Ultimate AI Power',
      badgeColor: 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-extrabold shadow-md shadow-amber-500/15'
    }
  ];

  const selectedPlanInfo = plans.find(p => p.id === selectedPlan);
  const basePrice = selectedPlanInfo ? parseInt(selectedPlanInfo.price, 10) : 500;
  
  const discountPercent = appliedPromo === 'SST10' ? 10 : appliedPromo === 'SST25' ? 25 : 0;
  const discountAmount = Math.round((basePrice * discountPercent) / 100);
  const finalPrice = basePrice - discountAmount;

  const handleOpenCheckout = (planId: 'basic' | 'premium') => {
    setSelectedPlan(planId);
    setPaymentStep('form');
    setPaymentMethod('upi_qr');
    setCardNumber('');
    setCardName(user.username || '');
    setCardExpiry('');
    setCardCvv('');
    // Reset coupon code and status
    setPromoCode('');
    setAppliedPromo(null);
    setPromoError('');
    setPromoSuccess('');
  };

  const handleApplyPromo = () => {
    const cleanCode = promoCode.trim().toUpperCase();
    if (!cleanCode) {
      setPromoError('Please enter a promo code.');
      setPromoSuccess('');
      return;
    }
    if (cleanCode === 'SST10') {
      setAppliedPromo('SST10');
      setPromoSuccess('SST10 Applied! 10% instant discount credited.');
      setPromoError('');
    } else if (cleanCode === 'SST25') {
      setAppliedPromo('SST25');
      setPromoSuccess('SST25 Applied! 25% instant discount credited.');
      setPromoError('');
    } else {
      setPromoError('Invalid coupon. Try SST10 or SST25.');
      setPromoSuccess('');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
    setPromoSuccess('');
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) return;

    setPaymentStep('processing');
    setIsProcessing(true);

    setTimeout(() => {
      onUpdatePlan(selectedPlan!);
      setPaymentStep('success');
      setIsProcessing(false);
    }, 3000);
  };

  const getPlanLabel = (plan: 'free' | 'basic' | 'premium') => {
    if (plan === 'free') return 'Free Starter';
    if (plan === 'basic') return 'Basic Sprint';
    return 'Premium Researcher';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-1 py-4 font-sans text-zinc-100">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-805 rounded-2xl p-6 relative overflow-hidden shadow-md">
        <div className="absolute right-3 top-3 opacity-15">
          <CreditCard className="w-24 h-24 text-amber-500/30 rotate-12" />
        </div>
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest leading-none">
            <IndianRupee className="w-3 h-3 text-amber-500" /> Subscription Center
          </div>
          <h2 className="text-xl font-bold font-sans">Empower Your Legal Preparation</h2>
          <p className="text-zinc-400 text-xs max-w-2xl leading-relaxed">
            Upgrade your access to unlock complete simulated Grand Mock papers, granular statistics, and AI Precedent synthesis inside Landmark Labs. Choose either of our tailored, result-oriented plans.
          </p>
        </div>

        {/* Current Plan Indicator Banner */}
        <div className="mt-5 bg-zinc-950/80 border border-zinc-800/80 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
              activePlan === 'free' ? 'bg-zinc-900 text-zinc-500 border border-zinc-800' :
              activePlan === 'basic' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/25' :
              'bg-gradient-to-br from-amber-500 to-amber-600 text-zinc-950 border border-amber-400/30'
            }`}>
              <ShieldCheck className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 block font-bold">Your Active Account Tier</span>
              <h3 className="text-sm font-bold text-zinc-200 mt-0.5">
                {getPlanLabel(activePlan)} Plan 
                {activePlan !== 'free' && <span className="text-emerald-400 text-xs font-semibold ml-2">• Fully Activated</span>}
              </h3>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[11px] text-zinc-400 font-mono">
              Status: <span className={
                user.email === 'sundaramteke@gmail.com' ? "text-amber-400 font-extrabold animate-pulse" :
                activePlan === 'free' ? "text-zinc-500 font-bold" : "text-emerald-500 font-extrabold"
              }>
                {user.email === 'sundaramteke@gmail.com' ? 'Lifetime Unlimited Explorer Pass' :
                 activePlan === 'free' ? 'Standard Trial (Limited Access)' : 'Active (Valid for 30 Days)'}
              </span>
            </p>
            {user.email === 'sundaramteke@gmail.com' ? (
              <p className="text-[10px] text-amber-500/80 font-mono mt-0.5">Permanent Access Granted • Whitelisted Account</p>
            ) : activePlan !== 'free' && (
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Renews automatically via simulated wallet ledger.</p>
            )}
          </div>
        </div>
      </div>

      {/* Plans List Pricing Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {plans.map((p) => {
          const isCurrent = activePlan === p.id;
          
          return (
            <div 
              key={p.id}
              className={`border rounded-2xl p-5 flex flex-col justify-between space-y-5 relative transition-all duration-300 shadow-md ${p.color} ${
                isCurrent ? 'ring-2 ring-amber-500 border-transparent shadow-[0_0_20px_rgba(245,158,11,0.06)]' : 'hover:border-zinc-700'
              }`}
            >
              {/* Badge for popular plan */}
              {p.badge && (
                <span className={`absolute -top-3.5 right-4 text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${p.badgeColor}`}>
                  {p.badge}
                </span>
              )}

              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-zinc-300">{p.name}</h3>
                  <p className="text-[11px] text-zinc-500 leading-tight mt-1">{p.description}</p>
                </div>

                {/* Price Display */}
                <div className="pt-2 pb-1 border-b border-zinc-900 flex items-baseline gap-1 relative select-none">
                  <span className="text-zinc-500 font-sans text-xs">₹</span>
                  <span className="text-3xl font-extrabold font-mono text-zinc-100 tracking-tight">{p.price}</span>
                  <span className="text-zinc-500 text-[10.5px] font-mono">/ {p.period}</span>
                </div>

                {/* Features list */}
                <div className="space-y-2.5 pt-2">
                  <p className="text-[9.5px] font-mono tracking-wider text-zinc-500 uppercase font-bold">Core Access Features</p>
                  <ul className="space-y-2 text-xs">
                    {p.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-zinc-300 leading-tight">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                    {p.lockedFeatures.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-zinc-600 leading-tight select-none">
                        <Lock className="w-3.5 h-3.5 text-zinc-800 shrink-0 mt-1" />
                        <span className="line-through">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Purchase/Current Button */}
              <div className="pt-4 border-t border-zinc-900">
                {isCurrent ? (
                  <div className="w-full text-center bg-zinc-900/50 text-emerald-400 font-extrabold text-xs py-2 px-4 rounded-xl border border-emerald-500/20 font-mono select-none flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Selected Tier
                  </div>
                ) : p.id === 'free' ? (
                  <button 
                    disabled 
                    className="w-full text-center bg-zinc-950/80 text-zinc-600 font-bold text-xs py-2.5 px-4 rounded-xl border border-zinc-900/40 cursor-not-allowed select-none"
                  >
                    Not Available to Downgrade
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenCheckout(p.id)}
                    className="w-full text-center bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs py-2.5 px-4 rounded-xl shadow shadow-amber-500/5 hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                  >
                    Subscribe for ₹{p.price} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Payment Channel Card - Integrated Bank of Maharashtra */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/20 p-5 rounded-2xl space-y-4 shadow-lg shadow-black/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2.5">
            <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 border border-amber-500/25 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
              <Building className="w-3 h-3 text-amber-500" /> Registered Bank Account Ledger
            </span>
            <h3 className="text-sm font-bold text-zinc-100 font-sans mt-0.5">Direct UPI Transfer &amp; Bank Vault Deposit</h3>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-xl">
              Use the live generated QR or the banking credentials below to transfer <span className="text-amber-500 font-mono font-bold">₹{directQrAmount}</span>. Scanning this UPI QR will initiate a direct transfer to Sundaram Teke's Bank of Maharashtra account.
            </p>
            
            {/* Interactive Amount Toggle */}
            <div className="flex gap-2 pt-1 select-none">
              <button
                type="button"
                onClick={() => setDirectQrAmount('500')}
                className={`px-3 py-1 text-[9px] font-mono font-bold uppercase rounded-lg border cursor-pointer transition-all ${
                  directQrAmount === '500'
                    ? 'bg-amber-500 text-zinc-950 border-amber-500 font-extrabold'
                    : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 border-zinc-800'
                }`}
              >
                Basic QR (₹500)
              </button>
              <button
                type="button"
                onClick={() => setDirectQrAmount('2000')}
                className={`px-3 py-1 text-[9px] font-mono font-bold uppercase rounded-lg border cursor-pointer transition-all ${
                  directQrAmount === '2000'
                    ? 'bg-amber-500 text-zinc-950 border-amber-500 font-extrabold'
                    : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 border-zinc-800'
                }`}
              >
                Premier QR (₹2000)
              </button>
            </div>
          </div>
          
          <div className="w-24 h-24 bg-white p-1 rounded-lg shrink-0 border border-zinc-800 shadow shadow-amber-500/5 relative select-none flex items-center justify-center">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=4&data=${encodeURIComponent(`upi://pay?pa=60160669731@MAHB0000445.ifsc.npci&pn=Sundaram+Teke&am=${directQrAmount}&cu=INR`)}`}
              alt="UPI Bank of Maharashtra Transfer QR" 
              className="w-full h-full object-contain rounded"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Bank Column */}
          <div className="bg-zinc-950/60 border border-zinc-900 p-3 rounded-xl space-y-1 relative">
            <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-500 block font-bold">Bank Name</span>
            <div className="text-xs text-zinc-200 font-semibold flex items-center justify-between">
              <span>Bank of Maharashtra</span>
            </div>
          </div>

          {/* Account Column */}
          <div className="bg-zinc-950/60 border border-zinc-900 p-3 rounded-xl space-y-1 relative">
            <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-500 block font-bold">Account Number</span>
            <div className="text-xs text-zinc-200 font-mono font-bold flex items-center justify-between">
              <span>60160669731</span>
              <button
                type="button"
                onClick={() => handleCopy('60160669731', 'account')}
                className="text-zinc-400 hover:text-amber-500 p-0.5 rounded transition-colors"
                title="Copy Card"
              >
                {copiedText === 'account' ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-zinc-400" />
                )}
              </button>
            </div>
          </div>

          {/* IFSC Code Column */}
          <div className="bg-zinc-950/60 border border-zinc-900 p-3 rounded-xl space-y-1 relative">
            <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-500 block font-bold">IFSC Code</span>
            <div className="text-xs text-zinc-200 font-mono font-bold flex items-center justify-between">
              <span className="text-amber-500">MAHB0000445</span>
              <button
                type="button"
                onClick={() => handleCopy('MAHB0000445', 'ifsc')}
                className="text-zinc-400 hover:text-amber-500 p-0.5 rounded transition-colors"
                title="Copy IFSC"
              >
                {copiedText === 'ifsc' ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-zinc-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-zinc-900/40 border border-zinc-805 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> Subscription FAQ Desk
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-400 leading-relaxed">
          <div className="space-y-1 bg-zinc-950/30 p-3.5 rounded-xl border border-zinc-900">
            <h4 className="font-bold text-zinc-200">How do the pricing tiers work?</h4>
            <p className="text-[11px]">The Basic Sprint Plan is priced at ₹500 for monthly review, while the Premier Researcher Plan is ₹2000 for a one-time payment, unlocking unlimited AI compilations and the complete study suite.</p>
          </div>
          <div className="space-y-1 bg-zinc-950/30 p-3.5 rounded-xl border border-zinc-900">
            <h4 className="font-bold text-zinc-200">Is this real money or simulated?</h4>
            <p className="text-[11px]">Because this is a simulated practice environment, the financial ledger is fully mocked! You can test the checkout with any virtual card details and experience the premium preparation suite immediately.</p>
          </div>
        </div>
      </div>

      {/* Elegant Checkout Overlay Modal (Interactive Pay Frame) */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[390px] bg-[#0c0c0e] border border-zinc-805 rounded-[30px] shadow-2xl shadow-black relative overflow-hidden"
            >
              {/* Header */}
              <div className="bg-[#111113] border-b border-zinc-900 p-5.5 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-amber-500 font-extrabold">Instant Upgrade checkout</span>
                  <h3 className="text-sm font-bold text-white mt-1">
                    Pay{' '}
                    {appliedPromo ? (
                      <>
                        <span className="text-zinc-500 line-through text-xs mr-1">₹{basePrice}</span>
                        <span className="text-amber-400 font-mono font-extrabold text-base">₹{finalPrice}</span>
                      </>
                    ) : (
                      <span className="text-amber-400 font-mono font-extrabold text-base">₹{basePrice}</span>
                    )}{' '}
                    via Secure Gateway
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedPlan(null)}
                  disabled={isProcessing}
                  className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors flex items-center justify-center border border-zinc-850 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5.5">
                {paymentStep === 'form' && (
                  <div className="space-y-4">
                    {/* Promo Code Input Module */}
                    <div className="bg-[#070709] border border-zinc-850 p-3 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">Have a Promo Coupon?</span>
                        {appliedPromo && (
                          <span className="text-[10px] text-emerald-400 font-semibold font-mono flex items-center gap-1">
                            • Active Discount Applied
                          </span>
                        )}
                      </div>
                      
                      {!appliedPromo ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. SST10 or SST25"
                            value={promoCode}
                            onChange={(e) => {
                              setPromoCode(e.target.value);
                              setPromoError('');
                            }}
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl py-1.5 px-3 text-xs text-zinc-100 placeholder-zinc-650 uppercase font-mono focus:outline-none focus:border-amber-500/60"
                          />
                          <button
                            type="button"
                            onClick={handleApplyPromo}
                            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all font-sans cursor-pointer shrink-0"
                          >
                            Apply
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-amber-500/5 border border-amber-500/15 p-2 rounded-xl">
                          <div className="space-y-0.5 text-left">
                            <p className="text-xs font-mono font-bold text-amber-500">{appliedPromo}</p>
                            <p className="text-[9.5px] text-zinc-400 font-sans">Saved <span className="text-emerald-400 font-bold">₹{discountAmount}</span> ({discountPercent}% Off)</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemovePromo}
                            className="text-[10px] text-zinc-500 hover:text-red-400 hover:bg-red-500/10 px-2.5 py-1 rounded-lg transition-all font-mono"
                          >
                            Remove
                          </button>
                        </div>
                      )}

                      {/* Promo Alerts */}
                      {promoError && (
                        <p className="text-[10px] text-rose-400 font-mono mt-1 text-left">{promoError}</p>
                      )}
                      {promoSuccess && (
                        <p className="text-[10px] text-emerald-400 font-mono mt-1 text-left">{promoSuccess}</p>
                      )}

                      {/* Protip */}
                      {!appliedPromo && !promoError && !promoSuccess && (
                        <p className="text-[9.5px] text-zinc-500 font-sans leading-none text-left">
                          Try code <span className="font-mono text-amber-500/90 font-bold">SST10</span> (10% off) or <span className="font-mono text-amber-500/90 font-bold">SST25</span> (25% off)
                        </p>
                      )}
                    </div>

                    {/* Payment Method Switcher Tabs */}
                    <div className="flex bg-[#070709] border border-zinc-800/80 rounded-xl p-1 gap-1">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 py-1.5 text-center rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          paymentMethod === 'card'
                            ? 'bg-zinc-800 text-white border border-zinc-750'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" /> Card Channel
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi_qr')}
                        className={`flex-1 py-1.5 text-center rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          paymentMethod === 'upi_qr'
                            ? 'bg-amber-500 text-zinc-950 font-extrabold shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        <QrCode className="w-3.5 h-3.5" /> UPI QR &amp; Bank
                      </button>
                    </div>

                    {paymentMethod === 'card' ? (
                      <form onSubmit={handleProcessPayment} className="space-y-4">
                        {/* Visual Card Display */}
                        <div className="w-full h-44 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-zinc-700/80 rounded-2xl p-4.5 flex flex-col justify-between relative shadow-lg overflow-hidden select-none">
                          {/* background chips */}
                          <div className="absolute right-0 bottom-0 text-[100px] text-zinc-500/5 font-mono pointer-events-none font-bold italic select-none">₹{finalPrice}</div>
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-amber-400" />
                              <span className="text-[9px] font-mono tracking-widest uppercase font-extrabold text-zinc-400">LEXPAY NETWORKS</span>
                            </div>
                            <span className="text-[8px] uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 rounded-full font-bold">
                              {selectedPlan === 'basic' ? 'Basic Tier' : 'Premier Tier'}
                            </span>
                          </div>

                          {/* Card Number display */}
                          <div className="text-sm font-mono tracking-[4px] text-zinc-300 my-1 font-bold">
                            {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim().slice(0, 19) : "•••• •••• •••• ••••"}
                          </div>

                          <div className="flex justify-between items-end text-zinc-400 font-mono">
                            <div>
                              <span className="text-[7.5px] uppercase text-zinc-500 tracking-wider block">Cardholder</span>
                              <span className="text-[10px] font-semibold text-zinc-300 font-sans tracking-wide truncate inline-block max-w-[150px]">
                                {cardName.toUpperCase() || "NAME OF CANDIDATE"}
                              </span>
                            </div>
                            <div className="flex gap-4">
                              <div>
                                <span className="text-[7.5px] uppercase text-zinc-500 tracking-wider block">Expires</span>
                                <span className="text-[10px] font-semibold text-zinc-300 tracking-widest block">{cardExpiry || "MM/YY"}</span>
                              </div>
                              <div>
                                <span className="text-[7.5px] uppercase text-zinc-500 tracking-wider block">CVV</span>
                                <span className="text-[10px] font-semibold text-zinc-300 tracking-widest block">{cardCvv ? "•••" : "•••"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Inputs */}
                        <div className="space-y-3.5">
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">Credit/Debit Card Number</label>
                            <input
                              type="text"
                              required
                              maxLength={16}
                              placeholder="4111 2222 3333 4444"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                              className="w-full bg-[#070709] border border-zinc-800/80 rounded-xl py-2 px-3 text-base md:text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">Cardholder Name</label>
                            <input
                              type="text"
                              required
                              maxLength={30}
                              placeholder="e.g. Sundaram Teke"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              className="w-full bg-[#070709] border border-zinc-800/80 rounded-xl py-2 px-3 text-base md:text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-all"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">Expiry Date</label>
                              <input
                                type="text"
                                required
                                maxLength={5}
                                placeholder="MM/YY"
                                value={cardExpiry}
                                onChange={(e) => {
                                  let val = e.target.value.replace(/\D/g, '');
                                  if (val.length > 2) {
                                    val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
                                  }
                                  setCardExpiry(val);
                                }}
                                className="w-full bg-[#070709] border border-zinc-800/80 rounded-xl py-2 px-3 text-base md:text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-all font-mono text-center"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">CVV Pin</label>
                              <input
                                type="password"
                                required
                                maxLength={3}
                                placeholder="•••"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                                className="w-full bg-[#070709] border border-zinc-800/80 rounded-xl py-2 px-3 text-base md:text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-all font-mono text-center"
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold py-2.5 px-4 rounded-xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all mt-4 text-xs flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <IndianRupee className="w-3.5 h-3.5" /> Confirm ₹{finalPrice} Payment
                        </button>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        {/* QR Code Container with interactive framing */}
                        <div className="flex flex-col items-center justify-center p-4 bg-zinc-950 border border-zinc-900 rounded-2xl relative shadow-inner">
                          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none rounded-2xl" />
                          <div className="w-48 h-48 bg-white p-2.5 rounded-xl shadow border border-zinc-850 relative group transition-all">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(
                                `upi://pay?pa=${bankDetails.upiId}&pn=${encodeURIComponent(bankDetails.payeeName)}&am=${finalPrice}&cu=INR`
                              )}`}
                              alt={`UPI Transfer QR Code to Bank of Maharashtra`}
                              title={`Scan to Pay ₹${finalPrice} via Bank Transfer UPI`}
                              className="w-full h-full object-contain rounded-lg"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <span className="text-[10px] font-mono text-zinc-400 mt-2.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                            Live Secure ₹{finalPrice} QR Code
                          </span>
                        </div>

                        {/* Direct Bank Details Breakdown */}
                        <div className="bg-[#070709] border border-zinc-850 rounded-xl p-3.5 space-y-2.5 text-xs">
                          <div className="flex justify-between items-center pb-2 border-b border-zinc-900/60">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Bank Name</span>
                            <span className="text-zinc-200 font-medium flex items-center gap-1.5">
                              <Building className="w-3.5 h-3.5 text-amber-500/70" /> {bankDetails.bankName}
                            </span>
                          </div>

                          <div className="flex justify-between items-center gap-2">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold shrink-0">Account No.</span>
                            <div className="flex items-center gap-2 overflow-hidden">
                              <span className="font-mono text-zinc-200 truncate select-all">{bankDetails.accountNumber}</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(bankDetails.accountNumber, 'account')}
                                className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-colors"
                                title="Copy Account Number"
                              >
                                {copiedText === 'account' ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="flex justify-between items-center gap-2">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold shrink-0">IFSC Code</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-amber-500 select-all font-bold">{bankDetails.ifscCode}</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(bankDetails.ifscCode, 'ifsc')}
                                className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-colors"
                                title="Copy IFSC Code"
                              >
                                {copiedText === 'ifsc' ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pb-1">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Account Name</span>
                            <span className="text-zinc-300 font-sans">{bankDetails.payeeName}</span>
                          </div>
                        </div>

                        {/* Submit Payment button for UPI */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentStep('processing');
                              setIsProcessing(true);
                              setTimeout(() => {
                                onUpdatePlan(selectedPlan!);
                                setPaymentStep('success');
                                setIsProcessing(false);
                              }, 3000);
                            }}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold py-2.5 px-4 rounded-xl shadow-lg shadow-amber-500/15 hover:scale-[1.01] transition-all text-xs flex items-center justify-center gap-2 cursor-pointer font-sans"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Transferred ₹{finalPrice}? Click to Verify &amp; Activate
                          </button>
                          <p className="text-[9px] text-zinc-500 text-center mt-2 font-mono leading-tight">
                            After scanning and submitting from your bank app, tap verification above to activate subscription.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {paymentStep === 'processing' && (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
                    <div className="space-y-1.5">
                      <p className="text-sm font-bold text-white font-sans">Contacting payment gateway servers...</p>
                      <p className="text-[10px] text-zinc-500 font-mono">Securing dynamic channel with the central RBI database</p>
                    </div>
                  </div>
                )}

                {paymentStep === 'success' && (
                  <div className="py-8 flex flex-col items-center justify-center text-center space-y-5">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-bounce">
                      <Check className="w-8 h-8 font-extrabold" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white font-sans">Payment of ₹{finalPrice} Received!</h4>
                      <p className="text-xs text-zinc-400 px-4">
                        Congratulations! Your account has been upgraded to the <span className="text-amber-400 font-semibold">{getPlanLabel(selectedPlan!)} Plan</span> successfully. All corresponding premium features are instantly ready.
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedPlan(null)}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-2.5 px-4 rounded-xl transition-all text-xs cursor-pointer"
                    >
                      Enter Prep Workspace
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
