import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Check, Eye, EyeOff, Minus, Plus, 
  QrCode, Sparkles, CheckCircle2, ShoppingBag, ArrowRight, Info, Copy,
  Upload, FileUp, Download, Loader2, Calendar, Mail
} from 'lucide-react';
import { Plan, User, Order } from '../types';
import phonepeQrImg from '../assets/images/phonepe_qr_1784210706026.jpg';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  onSuccess: (planId: 'plan-a' | 'plan-b') => void;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  onOrderCreated?: (order: Order) => void;
  onThankYou?: (data: { orderId: string, email: string, plan: Plan }) => void;
}

export default function CheckoutModal({ isOpen, onClose, plan, onSuccess, user, setUser, onOrderCreated, onThankYou }: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Billing, 2: QR Payment, 3: Payment Proof Page, 4: Thank You Page
  
  // Form fields matching the WooCommerce checkout screenshot
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState(user.phone || '');
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Interactivity states
  const [quantity, setQuantity] = useState(1);
  const [couponExpanded, setCouponExpanded] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [loginExpanded, setLoginExpanded] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  
  // QR Payment specific states
  const [orderId, setOrderId] = useState(236);
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes countdown
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Payment proof & thank you page states
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [isConfirmingProof, setIsConfirmingProof] = useState(false);
  const [isSimulatingDownload, setIsSimulatingDownload] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Initialize fields when modal opens
  useEffect(() => {
    if (isOpen && plan) {
      setStep(1);
      setIsProcessing(false);
      setIsVerifying(false);
      setQuantity(1);
      setCouponApplied(false);
      setCouponCode('');
      setCouponError('');
      setValidationErrors({});
      setPassword('');
      setSecondsLeft(300);
      setCopiedUpi(false);
      setScreenshotFile(null);
      setScreenshotPreview('');
      setIsConfirmingProof(false);
      setIsSimulatingDownload(false);
      setDownloadProgress(0);
      
      // Generate random order ID around #230 - #290
      setOrderId(Math.floor(Math.random() * 60) + 230);
      
      // Auto-split name if profile exists
      if (user.name) {
        const parts = user.name.trim().split(/\s+/);
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
      } else {
        setFirstName('');
        setLastName('');
      }
      setPhone(user.phone || '');
      setEmail(user.email || '');
    }
  }, [isOpen, plan, user]);

  // Live countdown timer for Step 2
  useEffect(() => {
    if (step !== 2) return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  if (!isOpen || !plan) return null;

  // Coupon apply handler
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'PULSESHOP' || code === 'WELCOME' || code === 'DISCOUNT' || code === 'FREE') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code! Try "PULSESHOP" for a special discount.');
      setCouponApplied(false);
    }
  };

  // Login handler helper
  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail.includes('@')) {
      setEmail(loginEmail);
      const namePart = loginEmail.split('@')[0];
      setFirstName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
      setLastName('Kumar');
      setLoginExpanded(false);
    }
  };

  // Copy UPI address to clipboard
  const handleCopyUpi = () => {
    navigator.clipboard.writeText('7295974557@ibl');
    setCopiedUpi(true);
    setShowCopyTooltip(true);
    setTimeout(() => {
      setCopiedUpi(false);
      setShowCopyTooltip(false);
    }, 2000);
  };

  // Download QR Code
  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = phonepeQrImg;
    link.download = `Pulseshop_QR_Order_${orderId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Alert user gracefully
    alert('QR Code Saved! Open your favorite UPI app (Paytm, PhonePe, GPay) and scan this QR code from your gallery to complete payment.');
  };

  // Math calculations
  const originalItemPrice = plan.salePrice;
  const subtotal = originalItemPrice * quantity;
  const discountAmount = couponApplied ? Math.round(subtotal * 0.15) : 0; // 15% special code discount
  const total = Math.max(0, subtotal - discountAmount);

  // Form validator
  const validateForm = () => {
    const errs: { [key: string]: string } = {};
    if (!firstName.trim()) errs.firstName = 'First name is required *';
    if (!lastName.trim()) errs.lastName = 'Last name is required *';
    
    if (!phone.trim()) {
      errs.phone = 'Phone number is required *';
    } else if (!/^[0-9]{10}$/.test(phone.trim())) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    
    if (!email.trim()) {
      errs.email = 'Email address is required *';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    
    if (!password.trim()) {
      errs.password = 'Password is required to create your course account *';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 1 Submit: Transition to Step 2 (QR Portal)
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstErrorEl = document.getElementById('billing-details-title');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setIsProcessing(true);
    
    // Simulate minor loading delay to look like server is initializing payment token
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2); // Go to QR Code screen!
    }, 1200);
  };

  // Step 2 Verification handler: Transitions to Step 3 (Payment Proof Upload Page)
  const handleVerifyPayment = () => {
    setIsVerifying(true);
    
    setTimeout(() => {
      setIsVerifying(false);
      setStep(3); // Go to Payment Proof Page!
    }, 1200);
  };

  // Payment proof: handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshotFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setScreenshotPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Payment proof: auto-generate high-fidelity mock screenshot receipt
  const handleUseMockScreenshot = () => {
    const mockFile = new File(["mock_screenshot_data"], "upi_payment_screenshot.jpg", { type: "image/jpeg" });
    setScreenshotFile(mockFile);
    
    // Generate a high-fidelity visual UPI receipt using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Soft background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 300);
      grad.addColorStop(0, '#f8fafc');
      grad.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 400, 300);
      
      // Success Circle
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(200, 75, 32, 0, Math.PI * 2);
      ctx.fill();
      
      // Success Checkmark
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(188, 75);
      ctx.lineTo(196, 83);
      ctx.lineTo(213, 66);
      ctx.stroke();
      
      // Status text
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('UPI TRANSACTION SUCCESSFUL', 200, 135);
      
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`Amount Paid: ₹ ${total.toFixed(2)}`, 200, 165);
      ctx.fillText(`To: 7295974557@ibl`, 200, 190);
      
      ctx.fillStyle = '#64748b';
      ctx.font = '500 11px sans-serif';
      ctx.fillText(`Order ID: #${orderId}`, 200, 215);
      ctx.fillText(`Reference ID: UPI-${Math.floor(100000 + Math.random() * 900000)}`, 200, 235);
      
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('Verified Secure by Pulseshop Gateways', 200, 270);
      
      setScreenshotPreview(canvas.toDataURL());
    }
  };

  // Step 3 Confirmation: Transitions to Step 4 (Thank You Page)
  const handleConfirmProof = () => {
    if (!screenshotFile) {
      alert("कृपया भुगतान का स्क्रीनशॉट अपलोड करें। (Please upload payment screenshot to proceed)");
      return;
    }
    
    setIsConfirmingProof(true);
    
    setTimeout(() => {
      setIsConfirmingProof(false);
      
      const emailVal = email.trim();
      const phoneVal = phone.trim();
      const nameVal = `${firstName.trim()} ${lastName.trim()}`;
      
      // Save purchase info to globally stored User profile but keep purchasedPlans as-is (requires admin approval first)
      setUser(prev => ({
        ...prev,
        name: nameVal,
        phone: phoneVal,
        email: emailVal,
      }));
      
      if (onOrderCreated && plan) {
        onOrderCreated({
          id: orderId.toString(),
          customerName: nameVal,
          customerPhone: phoneVal,
          customerEmail: emailVal,
          planId: plan.id,
          planName: plan.name,
          amount: total,
          screenshot: screenshotPreview || '',
          status: 'pending',
          date: getCurrentFormattedDate()
        });
      }

      if (onThankYou && plan) {
        onThankYou({
          orderId: orderId.toString(),
          email: emailVal,
          plan: plan
        });
      }
      onClose(); // Close the modal
    }, 1800);
  };

  // Thank you page helper: get formatted date
  const getCurrentFormattedDate = () => {
    const months = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    const d = new Date();
    return `${months[d.getMonth()]} ${d.getDate()}, 2026`;
  };

  // Thank you page helper: simulated download transition
  const handleSimulatedDownload = () => {
    setIsSimulatingDownload(true);
    setDownloadProgress(5);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Trigger actual blob download file to make it amazing
          try {
            const fileContent = `PathNirman Digital Business Course - Order #${orderId}\n` +
              `Thank you for purchasing ${plan.name}!\n` +
              `This digital content has been unlocked on your dashboard.\n` +
              `Access all video course episodes directly in the downloads section.`;
            const blob = new Blob([fileContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Pulseshop_Course_Details_Order_${orderId}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          } catch (e) {
            // ignore
          }

          setTimeout(() => {
            setIsSimulatingDownload(false);
            onSuccess(plan.id); // Triggers close and navigation to Downloads tab!
          }, 600);
          
          return 100;
        }
        
        // Staggered speed boosts
        const stepAmt = prev < 30 ? 15 : prev < 70 ? 25 : 10;
        return prev + stepAmt;
      });
    }, 300);
  };

  // Helper format time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-center items-start overflow-y-auto p-0 sm:p-4" id="checkout-modal">
      
      {/* Dynamic Modal Container */}
      <div className={`relative w-full ${step === 1 ? 'max-w-5xl' : 'max-w-md'} bg-white min-h-screen sm:min-h-0 sm:my-8 sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300`}>
        
        {/* Floating Close Button for non-QR/non-Proof screens */}
        {step !== 2 && step !== 3 && step !== 4 && (
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 z-50 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-full transition-all active:scale-90"
            title="Close Checkout"
            id="btn-close-checkout-modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* ==================== STEP 1: BILLING DETAILS & WOOCOMMERCE ORDER SUMMARY ==================== */}
        {step === 1 && (
          <>
            <div className="p-4 md:p-8 flex-1 bg-white">
              <div className="flex flex-col gap-6">
                
                {/* 1. Green Success Notice Banner matching screenshot */}
                <div className="bg-[#43964c] text-white p-4.5 px-6 rounded-xs shadow-xs flex items-center justify-between text-sm font-medium">
                  <div className="flex items-center gap-2.5 leading-relaxed">
                    <span className="text-white text-base font-bold">✓</span>
                    <span>“{plan.name}” has been added to your cart.</span>
                  </div>
                  <button 
                    onClick={onClose}
                    className="underline font-bold tracking-wider uppercase hover:text-emerald-100 ml-4 flex-shrink-0 text-xs cursor-pointer"
                  >
                    VIEW CART
                  </button>
                </div>

                {/* 2. Login / Coupon Access links */}
                <div className="flex flex-col gap-2 text-[13px] text-slate-700 pl-1 font-medium">
                  <div>
                    Returning customer?{' '}
                    <button 
                      onClick={() => setLoginExpanded(!loginExpanded)}
                      className="text-[#0051fa] hover:text-[#0041cb] underline"
                    >
                      Click here to login
                    </button>
                  </div>
                  
                  {/* Expandable login panel */}
                  {loginExpanded && (
                    <form onSubmit={handleMockLogin} className="mt-2 p-3 bg-white border border-slate-200 rounded-md max-w-sm flex gap-2 items-center animate-fadeIn">
                      <input 
                        type="email" 
                        placeholder="Enter registered email" 
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        required
                        className="flex-1 text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-[#0051fa]"
                      />
                      <button type="submit" className="bg-[#0051fa] text-white text-[11px] font-bold px-3 py-1.5 rounded hover:bg-[#0041cb]">
                        Login
                      </button>
                    </form>
                  )}

                  <div>
                    Have a coupon?{' '}
                    <button 
                      onClick={() => setCouponExpanded(!couponExpanded)}
                      className="text-[#0051fa] hover:text-[#0041cb] underline"
                    >
                      Click here to enter your code
                    </button>
                  </div>

                  {/* Expandable coupon panel */}
                  {couponExpanded && (
                    <form onSubmit={handleApplyCoupon} className="mt-2 p-3 bg-white border border-slate-200 rounded-lg max-w-sm flex flex-col gap-2 animate-fadeIn">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Coupon code (e.g. PULSESHOP)" 
                          value={couponCode}
                          onChange={e => setCouponCode(e.target.value)}
                          className="flex-1 text-xs px-2.5 py-1.5 border border-slate-300 rounded uppercase focus:outline-none focus:border-[#0051fa]"
                        />
                        <button type="submit" className="bg-[#13193e] text-white text-[11px] font-bold px-3 py-1.5 rounded hover:bg-indigo-950">
                          Apply
                        </button>
                      </div>
                      {couponApplied && (
                        <span className="text-emerald-600 text-[10px] font-extrabold">✔ Coupon applied successfully! 15% discount registered.</span>
                      )}
                      {couponError && (
                        <span className="text-red-500 text-[10px] font-bold">{couponError}</span>
                      )}
                    </form>
                  )}
                </div>

                {/* 3. Responsive Checkout Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-2">
                  
                  {/* LEFT COLUMN: BILLING DETAILS */}
                  <div className="lg:col-span-7 flex flex-col gap-4">
                    <h3 id="billing-details-title" className="text-[17px] font-extrabold text-slate-800 tracking-wide uppercase border-b border-slate-200 pb-2 mb-2">
                      BILLING DETAILS
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-bold text-slate-700 mb-1">
                          First name <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input 
                          type="text"
                          value={firstName}
                          onChange={e => {
                            setFirstName(e.target.value);
                            if (validationErrors.firstName) setValidationErrors(prev => ({ ...prev, firstName: '' }));
                          }}
                          className={`w-full bg-white border ${validationErrors.firstName ? 'border-red-500 bg-red-50/10' : 'border-[#d3d9e0]'} focus:border-[#0051fa] focus:ring-1 focus:ring-[#0051fa] rounded-sm px-4 py-3 text-sm text-slate-800 outline-none transition-all font-medium`}
                        />
                        {validationErrors.firstName && (
                          <p className="text-[10px] text-red-500 font-bold mt-1">{validationErrors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[13px] font-bold text-slate-700 mb-1">
                          Last name <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input 
                          type="text"
                          value={lastName}
                          onChange={e => {
                            setLastName(e.target.value);
                            if (validationErrors.lastName) setValidationErrors(prev => ({ ...prev, lastName: '' }));
                          }}
                          className={`w-full bg-white border ${validationErrors.lastName ? 'border-red-500 bg-red-50/10' : 'border-[#d3d9e0]'} focus:border-[#0051fa] focus:ring-1 focus:ring-[#0051fa] rounded-sm px-4 py-3 text-sm text-slate-800 outline-none transition-all font-medium`}
                        />
                        {validationErrors.lastName && (
                          <p className="text-[10px] text-red-500 font-bold mt-1">{validationErrors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-1">
                        Phone <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={e => {
                          setPhone(e.target.value.replace(/\D/g, ''));
                          if (validationErrors.phone) setValidationErrors(prev => ({ ...prev, phone: '' }));
                        }}
                        className={`w-full bg-white border ${validationErrors.phone ? 'border-red-500 bg-red-50/10' : 'border-[#d3d9e0]'} focus:border-[#0051fa] focus:ring-1 focus:ring-[#0051fa] rounded-sm px-4 py-3 text-sm text-slate-800 outline-none transition-all font-medium`}
                      />
                      {validationErrors.phone && (
                        <p className="text-[10px] text-red-500 font-bold mt-1">{validationErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-1">
                        Email address <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input 
                        type="email"
                        value={email}
                        onChange={e => {
                          setEmail(e.target.value);
                          if (validationErrors.email) setValidationErrors(prev => ({ ...prev, email: '' }));
                        }}
                        className={`w-full bg-white border ${validationErrors.email ? 'border-red-500 bg-red-50/10' : 'border-[#d3d9e0]'} focus:border-[#0051fa] focus:ring-1 focus:ring-[#0051fa] rounded-sm px-4 py-3 text-sm text-slate-800 outline-none transition-all font-medium`}
                      />
                      {validationErrors.email && (
                        <p className="text-[10px] text-red-500 font-bold mt-1">{validationErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-1">
                        Create account password <span className="text-red-500 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          value={password}
                          onChange={e => {
                            setPassword(e.target.value);
                            if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: '' }));
                          }}
                          className={`w-full bg-white border ${validationErrors.password ? 'border-red-500 bg-red-50/10' : 'border-[#d3d9e0]'} focus:border-[#0051fa] focus:ring-1 focus:ring-[#0051fa] rounded-sm pl-4 pr-10 py-3.5 text-sm text-slate-800 outline-none transition-all font-medium`}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {validationErrors.password && (
                        <p className="text-[10px] text-red-500 font-bold mt-1">{validationErrors.password}</p>
                      )}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: YOUR ORDER (Receipt Card) */}
                  <div className="lg:col-span-5 bg-[#f9f9f9] border border-slate-200/60 rounded-xs p-5 md:p-6 relative pt-8 pb-8 overflow-hidden select-none">
                    
                    {/* Top Scallop serrated pattern */}
                    <div className="absolute top-0 left-0 right-0 flex justify-between overflow-hidden h-3 select-none pointer-events-none gap-[2px]">
                      {Array.from({ length: 45 }).map((_, i) => (
                        <div key={i} className="w-3.5 h-3.5 rounded-full bg-white -mt-2 flex-shrink-0" />
                      ))}
                    </div>

                    <h3 className="text-sm md:text-base font-black text-slate-800 tracking-wider uppercase text-center mb-5">
                      YOUR ORDER
                    </h3>

                    {/* WooCommerce-style Order Summary White Card */}
                    <div className="bg-white shadow-xs rounded-sm border border-slate-200/60 p-4 md:p-5 overflow-hidden">
                      
                      {/* Product & Subtotal Header Table */}
                      <div className="flex justify-between items-center text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/80 pb-2.5 mb-3.5">
                        <span>PRODUCT</span>
                        <span>SUBTOTAL</span>
                      </div>

                      {/* Product Detail row */}
                      <div className="flex items-center gap-3.5 py-2.5 border-b border-slate-100">
                        {/* Remove item button */}
                        <button 
                          onClick={onClose}
                          className="text-slate-400 hover:text-red-500 font-bold text-lg leading-none cursor-pointer pr-1"
                          title="Remove from cart"
                        >
                          ×
                        </button>

                        {/* High-Fidelity Cover Art Representation matching the WooCommerce look */}
                        <div className="w-14 h-20 bg-[#0d1b3e] rounded-sm border border-[#1e293b] flex-shrink-0 relative overflow-hidden shadow-xs flex flex-col justify-between p-1 select-none">
                          {/* Header text on poster */}
                          <div className="text-center">
                            <span className="text-[5px] text-amber-400 font-bold uppercase tracking-wider block leading-none">BUSINESS COURSE</span>
                            <span className="text-[9px] text-white font-black block mt-0.5 leading-none">{plan.id === 'plan-a' ? 'Plan A' : 'Plan B'}</span>
                          </div>
                          
                          {/* Mid graphic of success/growth */}
                          <div className="flex-1 flex items-center justify-center my-0.5">
                            <svg className="w-7 h-7 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                            </svg>
                          </div>
                          
                          {/* Footer on poster */}
                          <div className="text-center">
                            <div className="w-full h-[1px] bg-slate-700 my-0.5" />
                            <span className="text-[4px] text-slate-400 font-medium block uppercase tracking-tight">100% Genuine Strategy</span>
                          </div>
                        </div>

                        {/* Title and quantity controls */}
                        <div className="flex-1 text-left flex flex-col gap-1">
                          <p className="text-xs md:text-[13px] font-extrabold text-slate-800 leading-tight">{plan.name}</p>
                          
                          {/* Quantity Selector: [ - ] [ 1 ] [ + ] */}
                          <div className="inline-flex items-center border border-slate-200 rounded-xs overflow-hidden text-xs mt-1 w-fit bg-white shadow-3xs">
                            <button 
                              type="button"
                              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                              className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 text-slate-500 font-extrabold transition-colors border-r border-slate-200"
                            >
                              <Minus className="w-2.5 h-2.5" strokeWidth={3} />
                            </button>
                            <span className="px-2.5 py-0.5 font-bold text-slate-800 bg-white min-w-[20px] text-center text-[11px]">
                              {quantity}
                            </span>
                            <button 
                              type="button"
                              onClick={() => setQuantity(prev => Math.min(5, prev + 1))}
                              className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 text-slate-500 font-extrabold transition-colors border-l border-slate-200"
                            >
                              <Plus className="w-2.5 h-2.5" strokeWidth={3} />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right font-bold text-xs text-slate-700 flex-shrink-0 font-mono">
                          ₹{originalItemPrice * quantity}.00
                        </div>
                      </div>

                      {/* Subtotal Calculation */}
                      <div className="flex justify-between items-center text-xs text-slate-700 font-semibold py-3 border-b border-slate-100">
                        <span>Subtotal</span>
                        <span className="font-extrabold text-[#0051fa] font-mono">₹{subtotal}.00</span>
                      </div>

                      {/* Coupon Discount if applied */}
                      {couponApplied && (
                        <div className="flex justify-between items-center text-xs text-emerald-600 font-bold py-3 border-b border-slate-100 bg-emerald-50/40 px-2 rounded">
                          <span>Discount (Coupon 15%)</span>
                          <span className="font-mono">- ₹{discountAmount}.00</span>
                        </div>
                      )}

                      {/* Total calculation row */}
                      <div className="flex justify-between items-center text-xs font-bold py-3.5">
                        <span className="text-slate-800 text-sm font-extrabold">Total</span>
                        <span className="text-[#0051fa] text-lg font-black font-mono">₹{total}.00</span>
                      </div>

                    </div>

                    {/* Pay With Any UPI Apps section */}
                    <div className="mt-6 flex flex-col gap-1">
                      <p className="text-[12px] font-extrabold text-slate-500 uppercase tracking-widest text-center">
                        Pay With Any UPI Apps
                      </p>

                      {/* UPI QR Instruction Speech Bubble Container */}
                      <div className="relative bg-white border border-slate-200/80 rounded-md p-4 text-center mt-3 shadow-3xs">
                        {/* Tiny Triangle pointer at the top center */}
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-slate-200/80 rotate-45" />
                        <p className="relative z-10 text-xs md:text-[13px] text-slate-700 font-bold leading-relaxed">
                          इस QR Code को Save करके किसी भी तरह से UPI App खोलें और Scan करके पेमेंट करें।
                        </p>
                      </div>
                    </div>

                    {/* Divider line before privacy policy */}
                    <div className="w-full h-[1px] bg-slate-200/80 my-5" />

                    {/* Compliance policy notice text */}
                    <p className="text-[11px] md:text-xs text-slate-500 font-normal leading-relaxed text-center px-1 mb-5">
                      Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{' '}
                      <span className="text-indigo-600 underline cursor-pointer font-semibold">privacy policy</span>.
                    </p>

                    {/* PLACE ORDER Solid Navy Blue Action Button */}
                    <div className="w-full">
                      <button
                        type="button"
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className={`w-full bg-[#13193e] hover:bg-[#1a2353] text-white font-black text-xs md:text-[13px] py-4 px-6 rounded-sm transition-all shadow-md active:scale-97 flex items-center justify-center gap-2 uppercase tracking-wider ${
                          isProcessing ? 'opacity-85 cursor-not-allowed' : ''
                        }`}
                        id="btn-place-order"
                      >
                        {isProcessing ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            PROCESSING ORDER...
                          </>
                        ) : (
                          <>
                            PLACE ORDER
                          </>
                        )}
                      </button>
                    </div>

                    {/* Bottom Scallop receipt pattern */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between overflow-hidden h-3 select-none pointer-events-none gap-[2px]">
                      {Array.from({ length: 45 }).map((_, i) => (
                        <div key={i} className="w-3.5 h-3.5 rounded-full bg-white -mb-2 flex-shrink-0" />
                      ))}
                    </div>

                  </div>

                </div>

              </div>
            </div>

            {/* Secure SSL Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-semibold mt-auto">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>SSL Secured 256-Bit Encrypted Payment Process</span>
              </div>
              <p>© 2026 Pulseshop. All rights reserved.</p>
            </div>
          </>
        )}

        {/* ==================== STEP 2: QR CODE PORTAL (MATCHING SCREENSHOT) ==================== */}
        {step === 2 && (
          <div className="flex flex-col bg-[#f5f8fa] min-h-[580px] sm:min-h-[620px] justify-between relative text-slate-950 animate-fadeIn">
            
            {/* Top Blue Header bar matching "Pulseshop" */}
            <div className="bg-[#0051fa] text-white py-4.5 px-6 pb-5 relative flex flex-col text-left">
              <div className="flex justify-between items-start w-full">
                <div>
                  <h2 className="font-extrabold text-xl tracking-wide">Pulseshop</h2>
                  
                  {/* Order ID Light Blue Badge */}
                  <div className="mt-1.5 inline-block bg-[#1d69ff] text-[11px] md:text-xs font-bold px-3.5 py-1 rounded-sm text-blue-50/95 shadow-2xs">
                    Order ID: #{orderId}
                  </div>
                </div>

                {/* Top Right Close Button */}
                <button 
                  onClick={onClose}
                  className="p-1 hover:bg-white/10 rounded-full transition-all text-white/90 hover:text-white"
                  title="Close Portal"
                >
                  <X className="w-6 h-6" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Main scrollable body area containing QR Frame */}
            <div className="p-4 md:p-6 flex-1 flex flex-col items-center justify-center">
              
              {/* Outer white card with subtle grey border matching user's screenshot */}
              <div className="w-full bg-white border border-[#d3d9e0] rounded-sm p-5 md:p-6 shadow-sm flex flex-col items-center max-w-[340px] md:max-w-[360px] mx-auto select-none">
                
                {/* 1. Authentic Looking PhonePe QR Code Image */}
                <div className="bg-white p-2 rounded-md border border-[#e2e8f0] flex items-center justify-center my-1.5 max-w-[210px] w-full aspect-square" id="screenshot-qr-wrapper">
                  <img 
                    src={phonepeQrImg} 
                    alt="PhonePe QR Code" 
                    className="w-full h-full object-contain rounded-xs"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* 2. Grey capsule pill box showing exact UPI ID address with click copy */}
                <div className="relative mt-3 w-full max-w-[240px]">
                  <button 
                    onClick={handleCopyUpi}
                    onMouseEnter={() => setShowCopyTooltip(true)}
                    onMouseLeave={() => setShowCopyTooltip(false)}
                    className="w-full bg-[#f5f5f5] text-[#4a5568] text-sm font-bold tracking-wider py-2.5 px-6 rounded-md hover:bg-slate-100 active:scale-97 transition-all flex items-center justify-center uppercase cursor-pointer"
                    title="Click to copy UPI address"
                  >
                    <span>7295974557@ibl</span>
                  </button>

                  {/* Copy tooltip bubble */}
                  {showCopyTooltip && (
                    <div className="absolute left-1/2 -translate-x-1/2 -top-9 bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded font-bold whitespace-nowrap shadow-md animate-fadeIn z-10">
                      {copiedUpi ? 'Copied!' : 'Click to copy UPI ID'}
                    </div>
                  )}
                </div>

                {/* 3. "Download QR Code" Blue Action Button */}
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className="mt-4 bg-[#0051fa] hover:bg-[#0041cb] text-white font-bold py-2.5 px-6 rounded-md text-[14px] shadow-sm transition-all active:scale-98 cursor-pointer"
                >
                  Download QR Code
                </button>

                {/* 4. Exact Hindi Instructions */}
                <p className="text-slate-500 font-semibold text-center text-[11px] md:text-xs leading-relaxed max-w-[290px] mt-4.5 px-1 tracking-wide">
                  ये QR CODE को डाउनलोड करने के बाद PAYTM या PHONE PAY से QR CODE को Scan करके पेमेंट कर दे! अगर PAYMENT करने में PROBLEM आ रही है तो <span className="text-[#0051fa] font-extrabold select-all">7295974557@ibl</span> पर डायरेक्ट UPI से PAYMENT कर दे!
                </p>

                {/* 5. UPI Brand Logos at bottom of Card */}
                <div className="mt-5 flex items-center justify-center gap-3 select-none">
                  
                  {/* Google Pay Icon */}
                  <div className="bg-white h-8 px-2.5 rounded-md border border-slate-200/40 shadow-3xs flex items-center justify-center" title="Google Pay">
                    <svg className="w-10 h-5" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 14c0-2.5 2-4.5 4.5-4.5h8c2.5 0 4.5 2 4.5 4.5S21 18.5 18.5 18.5h-8C8 18.5 6 16.5 6 14z" fill="#FBBC05" />
                      <path d="M12 4c0-1.5 1.2-2.5 2.5-2.5h10c1.5 0 2.5 1.2 2.5 2.5s-1.2 2.5-2.5 2.5h-10C13.2 6.5 12 5.5 12 4z" fill="#4285F4" />
                      <path d="M18 10c0-1.5 1.2-2.5 2.5-2.5h10c1.5 0 2.5 1.2 2.5 2.5s-1.2 2.5-2.5 2.5h-10C19.2 12.5 18 11.5 18 10z" fill="#34A853" />
                      <path d="M24 14c0-1.5 1.2-2.5 2.5-2.5h10c1.5 0 2.5 1.2 2.5 2.5s-1.2 2.5-2.5 2.5h-10C25.2 16.5 24 15.5 24 14z" fill="#EA4335" />
                    </svg>
                  </div>

                  {/* PhonePe Style Icon */}
                  <div className="bg-[#5f259f] text-white font-extrabold text-[10px] w-7 h-7 rounded-md flex items-center justify-center shadow-3xs" title="PhonePe">
                    पे
                  </div>

                  {/* Paytm logo style */}
                  <div className="bg-white px-2 py-1.5 h-7 rounded-md shadow-3xs border border-slate-200/40 flex items-center justify-center text-[10px] font-black italic tracking-tight" title="Paytm">
                    <span className="text-[#002e7e]">pay</span>
                    <span className="text-[#00b9f5]">tm</span>
                  </div>

                  {/* UPI BHIM India Flag Stripe Logo representation */}
                  <div className="h-7 w-8 bg-white rounded-md shadow-3xs border border-slate-200/40 flex items-center justify-center" title="UPI">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M3 17L11 5H15L7 17H3Z" fill="#ff9933" />
                      <path d="M11 17L19 5H23L15 17H11Z" fill="#138808" />
                    </svg>
                  </div>

                </div>

              </div>
            </div>

            {/* Sticky Bottom Bar Displaying price & Proceed button */}
            <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between gap-4 mt-auto shadow-sm w-full">
              
              {/* Dynamic Price Output with exactly two decimals */}
              <div className="text-left">
                <span className="text-2xl md:text-3xl font-black text-slate-900 font-sans tracking-tight">
                  ₹ {total.toFixed(2)}
                </span>
              </div>

              {/* Proceed to Next Button */}
              <button
                type="button"
                onClick={handleVerifyPayment}
                disabled={isVerifying}
                className="bg-[#0051fa] hover:bg-[#0041cb] text-white font-bold text-sm md:text-[15px] py-3.5 px-6 md:px-8 rounded-md transition-all active:scale-97 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
                id="btn-waiting-timer"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    PROCEEDING...
                  </>
                ) : (
                  'I HAVE PAID - NEXT'
                )}
              </button>

            </div>

          </div>
        )}

        {/* ==================== STEP 3: PAYMENT PROOF UPLOAD PAGE ==================== */}
        {step === 3 && (
          <div className="bg-[#f5f8fa] flex-1 flex flex-col justify-between animate-fadeIn text-slate-950 min-h-[580px] sm:min-h-[620px]">
            
            {/* Header matching the screenshots perfectly with close button */}
            <div className="bg-[#0051fa] text-white py-4.5 px-6 pb-5 relative flex flex-col text-left">
              <div className="flex justify-between items-start w-full">
                <div>
                  <h2 className="font-extrabold text-xl tracking-wide">Pulseshop</h2>
                  
                  {/* Order ID Light Blue Badge */}
                  <div className="mt-1.5 inline-block bg-[#1d69ff] text-[11px] md:text-xs font-bold px-3.5 py-1 rounded-sm text-blue-50/95 shadow-2xs">
                    Order ID: #{orderId}
                  </div>
                </div>

                {/* Top Right Close Button */}
                <button 
                  onClick={onClose}
                  className="p-1 hover:bg-white/10 rounded-full transition-all text-white/90 hover:text-white"
                  title="Close Portal"
                >
                  <X className="w-6 h-6" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Main content body matching screenshot exactly */}
            <div className="p-5 flex-1 flex flex-col justify-center items-center">
              <div className="w-full max-w-[340px] md:max-w-[360px] bg-white border border-[#d3d9e0] rounded-sm p-6 md:p-8 shadow-sm flex flex-col items-center">
                
                {/* Upload Section Heading centered */}
                <div className="text-[15px] md:text-[16px] font-bold text-slate-900 text-center mb-3">
                  Upload Screenshot: <span className="text-red-500 font-extrabold">*</span>
                </div>

                {/* Fully functional native-looking file picker centered matching browser defaults */}
                <div className="w-full flex flex-col items-center justify-center my-1.5">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block text-slate-800 text-[13px] md:text-sm font-sans mx-auto max-w-full cursor-pointer focus:outline-none file:mr-3.5 file:py-1 file:px-2.5 file:rounded-[3px] file:border file:border-slate-300 file:bg-[#efefef] file:hover:bg-[#e2e2e2] file:text-slate-800 file:text-[13px] md:file:text-sm file:font-normal file:cursor-pointer transition-all"
                    id="screenshot-file-input"
                  />

                  {/* Auto-generate helper receipt to easily test from preview without manual files */}
                  {!screenshotFile && (
                    <button 
                      type="button"
                      onClick={handleUseMockScreenshot}
                      className="text-[9px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 px-2.5 py-1 rounded mt-3 transition-all active:scale-95 flex items-center gap-1.5 shadow-3xs"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" />
                      Click here to Auto-Generate Mock Screenshot for Testing
                    </button>
                  )}

                  {/* Real-time image preview display if chosen */}
                  {screenshotPreview && (
                    <div className="relative w-full aspect-[4/3] rounded border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center shadow-inner mt-4">
                      <img src={screenshotPreview} alt="Screenshot receipt preview" className="max-w-full max-h-full object-contain" />
                      <button 
                        type="button" 
                        onClick={() => { setScreenshotFile(null); setScreenshotPreview(''); }}
                        className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full text-xs shadow-md hover:scale-105 active:scale-90 transition-all flex items-center justify-center w-5 h-5 font-black"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                {/* Exact Hindi instructions from user's screenshot */}
                <p className="text-[#2d3748] font-normal text-sm md:text-[15px] leading-relaxed text-center mt-5 select-text">
                  अपने जो Payment किया है उसका Screen Shot यहाँ अपलोड कर के &quot;Confirm&quot; पर क्लिक करें.... हम आपके लेनदेन को मैन्युअल रूप से सत्यापित करेंगे।
                </p>

              </div>
            </div>

            {/* Bottom bar matching screenshot */}
            <div className="bg-white border-t border-[#d3d9e0] px-6 py-4 flex items-center justify-between shadow-xs mt-auto">
              <button 
                type="button"
                onClick={() => setStep(2)}
                className="text-slate-800 hover:text-black font-semibold text-sm md:text-[15px] hover:underline py-2 px-1 rounded select-none transition-all cursor-pointer"
              >
                Back
              </button>

              <button 
                type="button"
                onClick={handleConfirmProof}
                disabled={isConfirmingProof}
                className="bg-[#0051fa] hover:bg-[#0041cb] text-white font-bold text-sm md:text-[15px] px-6 py-2.5 rounded shadow-xs active:scale-97 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isConfirmingProof ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        )}

        {/* ==================== STEP 4: THANK YOU PAGE ==================== */}
        {step === 4 && (
          <div className="flex-1 flex flex-col animate-fadeIn bg-white select-text text-slate-900" id="step-thank-you">
            {/* Thin top gray border matching the browser screen divider at the top of the screenshot */}
            <div className="border-t border-[#e2e8f0] w-full" />
            
            <div className="p-5 md:p-8 flex-1 flex flex-col justify-between min-h-[550px] sm:min-h-[580px]">
              
              <div className="flex-1 flex flex-col items-center justify-start max-w-md mx-auto w-full pt-4 pb-2">
                
                {/* Green Dashed Success Box exactly matching the user's mobile screenshot */}
                <div className="border-[2px] border-dashed border-[#719351] rounded-2xl p-6 bg-white text-center mb-7 w-full select-text">
                  <p className="text-[#719351] text-[18px] md:text-[20px] font-bold leading-relaxed tracking-normal">
                    आपका Order हमें मिल गया है हम जल्दी ही Transaction देख कर आपके Order को पूरा कर देंगे फिर आप Download बटन पर क्लिक करके Video को Download कर सकते हैं!
                  </p>
                </div>

                {/* Order breakdown fields centered with bottom border dividers exactly matching the screenshot */}
                <div className="w-full flex flex-col select-text mt-4">
                  
                  {/* 1. Order Number */}
                  <div className="flex flex-col items-center justify-center text-center pt-6 pb-5">
                    <span className="text-[#8a8a8a] text-[15px] md:text-[16px] font-normal tracking-wide">Order number:</span>
                    <span className="text-[18px] md:text-[19px] font-bold text-slate-900 mt-2.5 tracking-normal">{orderId}</span>
                  </div>
                  <div className="border-t border-[#e2e8f0] w-full" />

                  {/* 2. Date */}
                  <div className="flex flex-col items-center justify-center text-center pt-6 pb-5">
                    <span className="text-[#8a8a8a] text-[15px] md:text-[16px] font-normal tracking-wide">Date:</span>
                    <span className="text-[18px] md:text-[19px] font-bold text-slate-900 mt-2.5 tracking-normal">{getCurrentFormattedDate()}</span>
                  </div>
                  <div className="border-t border-[#e2e8f0] w-full" />

                  {/* 3. Email */}
                  <div className="flex flex-col items-center justify-center text-center pt-6 pb-5">
                    <span className="text-[#8a8a8a] text-[15px] md:text-[16px] font-normal tracking-wide">Email:</span>
                    <span className="text-[18px] md:text-[19px] font-bold text-slate-900 mt-2.5 select-all break-all px-2 tracking-normal">{email}</span>
                  </div>
                  <div className="border-t border-[#e2e8f0] w-full mb-8" />

                </div>

                {/* Done Action Button styled perfectly to proceed */}
                <div className="w-full mt-2">
                  <button
                    type="button"
                    onClick={() => onSuccess(plan.id)}
                    className="w-full bg-[#0051fa] hover:bg-[#0041cb] text-white font-bold text-sm md:text-[15px] py-4 px-6 rounded-md shadow-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center uppercase tracking-wide"
                    id="btn-complete-order"
                  >
                    Proceed to Downloads / Course
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
