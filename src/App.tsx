import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, CheckCircle2, ChevronRight, Sparkles, HelpCircle, 
  ShieldCheck, Phone, Video, Download, Lock, Star, Play, 
  Tv, MessageSquare, Award, ArrowUpRight, TrendingUp, DollarSign, X
} from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from './lib/firebase';
import { Tab, Plan, User, EarningAlert, Order } from './types';
import { PLANS, VIDEO_EPISODES, EARNING_ALERTS, FAQS } from './data';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import CheckoutModal from './components/CheckoutModal';
// Removed DownloadsView import
import ThankYouView from './components/ThankYouView';
import AccountView from './components/AccountView';
import AdminDashboard from './components/AdminDashboard';
import PrivacyPolicy from './components/PrivacyPolicy';
import RefundPolicy from './components/RefundPolicy';
import AboutUs from './components/AboutUs';
import ThreeStepSlider from './components/ThreeStepSlider';
import businessBanner from './assets/images/business_banner_1784185423899.jpg';

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [thankYouData, setThankYouData] = useState<{ orderId: string, email: string, plan: Plan } | null>(null);
  const [cartPlan, setCartPlan] = useState<Plan | null>(null);
  const [activePolicy, setActivePolicy] = useState<{ title: string; content: string } | null>(null);

  // Persistence for user status
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('pn_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      name: '',
      email: '',
      phone: '',
      purchasedPlans: [], // Start empty
      joinedDate: new Date().toLocaleDateString('en-IN')
    };
  });

  // Save user changes
  useEffect(() => {
    localStorage.setItem('pn_user_profile', JSON.stringify(user));
  }, [user]);

  // Orders tracking state for Admin Approvals - now synced with Firestore
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  // Fetch orders from Firestore in real-time
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupOrdersListener = () => {
      const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const ordersData = snapshot.docs.map(d => ({
          ...d.data(),
          id: d.id,
        })) as Order[];
        setOrders(ordersData);
        setIsOrdersLoading(false);
      }, (error) => {
        console.error("Error fetching orders:", error);
        setIsOrdersLoading(false);
      });
    };

    // Anonymous sign-in and listen to auth changes
    const authUnsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, setup listener
        if (unsubscribe) unsubscribe();
        setupOrdersListener();
      } else {
        // Not signed in, try signing in anonymously
        signInAnonymously(auth).catch(err => console.error("Firebase Auth Error:", err));
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
      authUnsubscribe();
    };
  }, []);

  const [isAdmin, setIsAdmin] = useState(false);
  const adminPassword = 'DDhj12@$';

  const [deletedPlanIds, setDeletedPlanIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('pulseshop_deleted_plans');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [];
  });

  const handleAdminLogin = (password: string) => {
    if (password === adminPassword) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  useEffect(() => {
    localStorage.setItem('pulseshop_deleted_plans', JSON.stringify(deletedPlanIds));
  }, [deletedPlanIds]);

  const handleDeletePlan = (planId: string) => {
    setDeletedPlanIds(prev => [...prev, planId]);
  };

  const handleOrderCreated = async (newOrder: Order) => {
    try {
      // Add to Firestore instead of local state
      await addDoc(collection(db, 'orders'), {
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone,
        customerEmail: newOrder.customerEmail,
        planId: newOrder.planId,
        planName: newOrder.planName,
        amount: newOrder.amount,
        screenshot: newOrder.screenshot,
        status: 'pending',
        date: newOrder.date,
        timestamp: serverTimestamp() // Add timestamp for ordering
      });
    } catch (error) {
      console.error("Error creating order in Firestore:", error);
      alert("ऑर्डर सबमिट करने में समस्या आई। कृपया पुनः प्रयास करें।");
      throw error;
    }
  };

  const handleApproveOrder = async (orderId: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: 'approved' });
      
      // Local state update for current user immediate feedback if it's their order
      const order = orders.find(o => o.id === orderId);
      if (order && order.customerEmail.toLowerCase() === user.email.toLowerCase()) {
        setUser(prevUser => {
          const purchased = [...prevUser.purchasedPlans];
          if (!purchased.includes(order.planId)) {
            purchased.push(order.planId);
          }
          return {
            ...prevUser,
            purchasedPlans: purchased
          };
        });
      }
    } catch (error) {
      console.error("Error approving order:", error);
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: 'rejected' });
    } catch (error) {
      console.error("Error rejecting order:", error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('क्या आप इस ऑर्डर को हटाना चाहते हैं?')) return;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleAddDemoOrder = async () => {
    const demoOrder = {
      customerName: "Rahul Sharma (डेमो)",
      customerPhone: "9876543210",
      customerEmail: user.email || "demo@pulseshop.com",
      planId: "plan-a",
      planName: "Plan A: Basic Business Guide",
      amount: 99,
      screenshot: "https://images.unsplash.com/photo-1601597111158-2fceff270190?w=150&auto=format&fit=crop",
      status: "pending",
      date: new Date().toLocaleDateString('en-IN')
    };
    
    try {
      await addDoc(collection(db, 'orders'), {
        ...demoOrder,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding demo order:", error);
    }
  };

  // Live Earning Alert Rotating State
  const [currentAlertIdx, setCurrentAlertIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlertIdx(prev => (prev + 1) % EARNING_ALERTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentAlert = EARNING_ALERTS[currentAlertIdx];

  // Countdown timer (Urgency for 'Sir Paisa Nahi Hai' offer)
  // Counts down from 02:45:30 and resets to create urgency
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('pn_timer_secs');
    return saved ? parseInt(saved, 10) : 9930; // ~2 hrs 45 mins
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev > 1 ? prev - 1 : 9930;
        localStorage.setItem('pn_timer_secs', next.toString());
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = () => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    };
  };

  const timeParts = formatCountdown();

  // Handle plan checkout initiation
  const handleOpenCheckout = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleThankYou = (data: { orderId: string, email: string, plan: Plan }) => {
    setThankYouData(data);
    setActiveTab('thankyou');
  };

  // Handle successful purchase
  const handlePurchaseSuccess = (planId: 'plan-a' | 'plan-b') => {
    // Clear cart if that plan was inside it
    if (cartPlan?.id === planId) {
      setCartPlan(null);
    }

    setIsCheckoutOpen(false);
    // Redirect to home after successful order placement
    setActiveTab('home');
  };

  // Add a plan to cart
  const handleAddToCart = (plan: Plan) => {
    setCartPlan(plan);
    alert(`${plan.name} आपके कार्ट में जोड़ा गया है!`);
  };

  // Smooth scroll helper to element
  const scrollToPlans = () => {
    const element = document.getElementById('plans-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans select-none antialiased">
      
      {/* HEADER COMPONENT */}
      <Header 
        cartCount={cartPlan ? 1 : 0}
        hasPurchased={user.purchasedPlans.length > 0 || orders.some(o => o.customerEmail.toLowerCase() === user.email.toLowerCase() && o.status === 'approved')}
        onMenuClick={() => setIsSidebarOpen(true)}
        onCartClick={() => {
          if (cartPlan) {
            handleOpenCheckout(cartPlan);
          } else {
            alert('आपका कार्ट अभी खाली है! कोई भी बिज़नेस प्लान चुनें और "BUY NOW" पर क्लिक करें।');
          }
        }}
      />

      {/* SIDEBAR DRAWER */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavToTab={(tab) => setActiveTab(tab)}
        isAdmin={isAdmin}
        purchasedPlans={user.purchasedPlans}
      />

      {/* MAIN CONTAINER */}
      <main className="flex-1 w-full max-w-md mx-auto bg-slate-50 flex flex-col relative shadow-xl overflow-x-hidden min-h-[calc(100vh-56px)] pb-24">
        
        {/* TAB 1: HOME SECTION */}
        {activeTab === 'thankyou' && thankYouData && (
          <ThankYouView 
            plan={thankYouData.plan}
            orderId={thankYouData.orderId}
            email={thankYouData.email}
            onProceed={() => setActiveTab('home')}
          />
        )}
        {activeTab === 'home' && (
          <div className="flex flex-col animate-fade-in animate-duration-300" id="home-view">
            
            {/* NEW SCREENSHOT-ACCURATE HERO BANNER */}
            <section className="bg-white px-3 pt-5 pb-3 border-b border-slate-100 relative overflow-hidden" id="hero-section">
              <div className="grid grid-cols-12 gap-1 items-start relative z-10">
                {/* Left side content (col-span-7) */}
                <div className="col-span-7 flex flex-col text-left">
                  {/* Small badge */}
                  <div className="inline-block self-start bg-[#13193e] text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider mb-2">
                    Pulseshop
                  </div>

                  {/* Redesigned Heading */}
                  <h1 className="text-slate-900 leading-tight font-extrabold tracking-tight">
                    <span className="text-amber-500 font-serif italic text-[18px] md:text-2xl font-black drop-shadow-xs mr-1">Idea</span> 
                    <span className="text-[11px] md:text-sm text-slate-800 font-black">हम देंगे आप बस</span>
                    <br />
                    <span className="text-sky-600 font-sans italic text-[15px] md:text-xl font-black mr-1">Business</span> 
                    <span className="text-[11px] md:text-sm text-slate-800 font-black">शुरू करिये..!!</span>
                  </h1>

                  {/* Bullet badges from screenshot (dark capsules with white text) */}
                  <div className="flex flex-col gap-1.5 mt-3">
                    <div className="bg-[#13193e] hover:bg-[#1c2454] text-white text-[7.5px] md:text-[9.5px] font-bold px-2 py-1 rounded-full text-left flex items-center gap-1 shadow-xs transition-colors">
                      <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0 animate-ping" />
                      3 Idea's + Life Time New Idea Update
                    </div>
                    <div className="bg-[#13193e] hover:bg-[#1c2454] text-white text-[7.5px] md:text-[9.5px] font-bold px-2 py-1 rounded-full text-left flex items-center gap-1 shadow-xs transition-colors">
                      <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0 animate-ping" />
                      Earn Upto 15000 to 3 lakh Per Month
                    </div>
                    <div className="bg-[#13193e] hover:bg-[#1c2454] text-white text-[7.5px] md:text-[9.5px] font-bold px-2 py-1 rounded-full text-left flex items-center gap-1 shadow-xs transition-colors">
                      <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0 animate-ping" />
                      Proudly Provide 100 % Unique Ideas
                    </div>
                  </div>

                  {/* Coins doodle representation */}
                  <div className="mt-4 flex items-center gap-2 px-1">
                    <div className="flex flex-col items-center">
                      <svg className="w-10 h-10 text-slate-400 opacity-90" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="20" cy="54" rx="14" ry="4" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                        <ellipse cx="20" cy="48" rx="14" ry="4" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
                        <ellipse cx="20" cy="42" rx="14" ry="4" fill="#f1f5f9" stroke="#475569" strokeWidth="1.5" />
                        <ellipse cx="44" cy="54" rx="14" ry="4" fill="#fbcfe8" stroke="#be185d" strokeWidth="1.5" />
                        <ellipse cx="44" cy="48" rx="14" ry="4" fill="#fce7f3" stroke="#be185d" strokeWidth="1.5" />
                        <path d="M32 30C32 23.3726 26.6274 18 20 18C13.3726 18 8 23.3726 8 30C8 33.3137 9.5 36.5 12 38.5V42H28V38.5C30.5 36.5 32 33.3137 32 30Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                        <line x1="16" y1="42" x2="24" y2="42" stroke="#ca8a04" strokeWidth="2" />
                        <line x1="18" y1="45" x2="22" y2="45" stroke="#ca8a04" strokeWidth="2" />
                        <path d="M17 28L20 32L23 28" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="20" y1="14" x2="20" y2="10" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="32" y1="20" x2="35" y2="18" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="8" y1="20" x2="5" y2="18" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span className="text-[6.5px] text-slate-400 font-bold leading-none mt-1">100% Unique</span>
                    </div>
                    <div className="flex flex-col gap-0.5 text-left pl-1">
                      <span className="text-[7.5px] text-[#13193e] font-extrabold">🚀 Launch Today</span>
                      <span className="text-[6.5px] text-slate-500 font-medium">Verify through simple videos</span>
                    </div>
                  </div>
                </div>

                {/* Right side content (col-span-5) - Man on beanbag illustration */}
                <div className="col-span-5 relative flex flex-col items-center justify-center">
                  
                  {/* Floating speech bubble */}
                  <div className="absolute -top-0 right-[-4px] bg-[#e0f2fe] border border-sky-200 rounded-lg p-1.5 shadow-xs max-w-[110px] z-20 animate-bounce-slow">
                    <p className="text-[7px] font-black text-[#13193e] text-center leading-normal font-sans">
                      एक Business Idea आपकी जिंदगी बदल सकती है
                    </p>
                    <div className="absolute bottom-[-4.5px] left-[40%] w-2.5 h-2.5 bg-[#e0f2fe] border-r border-b border-sky-200 rotate-45" />
                  </div>

                  {/* Smiling man on orange beanbag chair vector graphic */}
                  <svg className="w-full h-auto max-w-[130px] mt-4" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="80" cy="90" r="50" fill="#38bdf8" fillOpacity="0.12" />

                    <g transform="translate(110, 30)">
                      <path d="M0 4.5C0 1.5 3 0 6 0C9 0 12 1.5 12 4.5C12 9.5 6 13 6 13C6 13 0 9.5 0 4.5Z" fill="#38bdf8" />
                      <path d="M3 5.5L5 7.5L9 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </g>

                    <path d="M25 105C25 80 50 70 80 70C110 70 135 80 135 105C135 125 110 135 80 135C50 135 25 125 25 105Z" fill="#f97316" />
                    <path d="M40 102C40 85 60 76 80 76C100 76 120 85 120 102C120 118 100 125 80 125C60 125 40 118 40 102Z" fill="#ea580c" />

                    <path d="M72 40C72 32 88 32 88 40C88 44 85 47 80 47C75 47 72 44 72 40Z" fill="#fbcfe8" />
                    <path d="M71 39C71 33 89 33 89 39C86 36 74 36 71 39Z" fill="#1e293b" />
                    <path d="M72 34C73 31 87 31 88 34" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
                    
                    <circle cx="77" cy="39" r="1" fill="#1e293b" />
                    <circle cx="83" cy="39" r="1" fill="#1e293b" />
                    <path d="M78 43C78 44 82 44 82 43" stroke="#e11d48" strokeWidth="1" strokeLinecap="round" />
                    
                    <path d="M60 62C60 52 100 52 100 62L95 85L65 85Z" fill="#3b82f6" />
                    <line x1="64" y1="56" x2="68" y2="85" stroke="white" strokeWidth="1.5" />
                    <line x1="72" y1="54" x2="74" y2="85" stroke="white" strokeWidth="1.5" />
                    <line x1="80" y1="54" x2="80" y2="85" stroke="white" strokeWidth="1.5" />
                    <line x1="88" y1="54" x2="86" y2="85" stroke="white" strokeWidth="1.5" />
                    <line x1="96" y1="56" x2="92" y2="85" stroke="white" strokeWidth="1.5" />

                    <path d="M65 85L50 115L68 120L75 98L85 98L92 120L110 115L95 85Z" fill="#64748b" />
                    <line x1="75" y1="95" x2="75" y2="115" stroke="#475569" strokeWidth="1" />
                    <line x1="85" y1="95" x2="85" y2="115" stroke="#475569" strokeWidth="1" />

                    <ellipse cx="48" cy="116" rx="6" ry="3" fill="#cbd5e1" stroke="#334155" />
                    <ellipse cx="112" cy="116" rx="6" ry="3" fill="#cbd5e1" stroke="#334155" />

                    <path d="M66 74L94 74L92 84L68 84Z" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
                    <path d="M68 84L92 84L88 95L72 95Z" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                    <rect x="71" y="86" width="18" height="7" fill="#38bdf8" rx="0.5" />

                    <g transform="translate(125, 45)">
                      <rect x="0" y="0" width="16" height="11" rx="1.5" fill="#fca5a5" stroke="#b91c1c" strokeWidth="0.8" />
                      <path d="M1 1.5L8 6.5L15 1.5" stroke="#b91c1c" strokeWidth="0.8" />
                      <circle cx="13" cy="3" r="3.5" fill="#ef4444" />
                      <text x="11.5" y="5.2" fill="white" fontSize="5.5" fontWeight="black" fontFamily="sans-serif">99</text>
                    </g>
                    <g transform="translate(10, 85)">
                      <rect x="0" y="0" width="14" height="9.5" rx="1.5" fill="#fca5a5" stroke="#b91c1c" strokeWidth="0.8" />
                      <path d="M1 1.5L7 5.5L13 1.5" stroke="#b91c1c" strokeWidth="0.8" />
                      <circle cx="11.5" cy="2.5" r="3" fill="#ef4444" />
                      <text x="10.2" y="4.5" fill="white" fontSize="5" fontWeight="black" fontFamily="sans-serif">99</text>
                    </g>

                    <g transform="translate(115, 95)" className="animate-pulse">
                      <path d="M6 3C6 1.5 4.5 0 3 0C1.5 0 0 1.5 0 3C0 6 6 9.5 6 9.5C6 9.5 12 6 12 3C12 1.5 10.5 0 9 0C7.5 0 6 1.5 6 3Z" fill="#ef4444" />
                    </g>

                    <g transform="translate(10, 20)" className="animate-bounce-slow">
                      <path d="M6 0L12 4L9 11L3 11L0 4Z" fill="#f59e0b" />
                      <path d="M4 11L6 15L8 11Z" fill="#ef4444" />
                    </g>
                    <g transform="translate(135, 15)" className="animate-bounce-slow">
                      <path d="M6 0L12 4L9 11L3 11L0 4Z" fill="#f59e0b" />
                      <path d="M4 11L6 15L8 11Z" fill="#ef4444" />
                    </g>
                  </svg>
                </div>
              </div>
            </section>

            {/* THREE STEPS TIMELINE CARDS */}
            <ThreeStepSlider />

            {/* LIVE EARNINGS COMPACT CAPSULE */}
            <section className="px-3 py-1 flex justify-start">
              <div className="bg-white border border-slate-100 rounded-lg p-1.5 md:p-3 flex items-center gap-1.5 shadow-xs max-w-sm">
                <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 font-bold text-[9px] md:text-xs flex items-center justify-center flex-shrink-0">
                  ₹
                </div>
                <p className="text-[8.5px] md:text-xs font-black text-slate-700 leading-none">
                  <span className="text-slate-900 font-extrabold">{currentAlert.name}</span> earned <span className="text-emerald-600 font-black">₹{currentAlert.amount}</span> today
                </p>
              </div>
            </section>

            {/* SCREENSHOT ACCURATE MINIMAL GREEN CLICK HERE BUTTON */}
            <section className="px-3 py-2 text-center">
              <button
                onClick={scrollToPlans}
                className="inline-block bg-[#012d1b] hover:bg-[#023e26] text-white text-[9.5px] md:text-xs font-black py-2.5 px-6 rounded-md shadow-md active:scale-98 transition-all tracking-wide"
                id="btn-scroll-to-plans"
              >
                Click Here To More Information About Business
              </button>
            </section>

            {/* SALES OFFER SECTION & RESIDUAL RED COUNTDOWN TIMER */}
            <section className="px-3 py-4 flex flex-col items-center gap-2 bg-white" id="plans-section">
              <div className="text-center max-w-md">
                <h3 className="text-[12.5px] md:text-base font-black text-[#13193e] leading-snug">
                  Start Your First Online Business & Earn Upto 3 lakh/ Month
                </h3>
                <p className="text-[10.5px] md:text-xs font-black text-orange-600 mt-1">
                  Special Offer For &quot;Sir Paisa Nahi Hai&quot; Users😍!
                </p>
              </div>

              {/* TIMELINE COUNTDOWN IN PURE RED TEXT */}
              <div className="flex flex-col items-center mt-2.5 bg-white px-5 py-2.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3 text-[18px] md:text-2xl font-black text-red-600 font-mono tracking-widest leading-none">
                  <span>00</span>
                  <span className="text-slate-400 font-light">:</span>
                  <span>{timeParts.hours}</span>
                  <span className="text-slate-400 font-light">:</span>
                  <span>{timeParts.minutes}</span>
                  <span className="text-slate-400 font-light">:</span>
                  <span className="animate-pulse">{timeParts.seconds}</span>
                </div>
                
                <div className="flex items-center gap-3.5 text-[7.5px] font-black text-slate-400 tracking-wider mt-1 uppercase pl-1">
                  <span className="w-8 text-center">DAYS</span>
                  <span className="w-8 text-center">HRS</span>
                  <span className="w-8 text-center">MINS</span>
                  <span className="w-8 text-center">SECS</span>
                </div>
              </div>
            </section>

            {/* SIDE-BY-SIDE PLAN A & PLAN B GRID */}
            <section className="px-3 py-4 grid grid-cols-2 gap-3 bg-slate-50/50" id="plans-grid">
              {PLANS.map((plan) => {
                const isUnlocked = user.purchasedPlans.includes(plan.id);
                const isPlanA = plan.id === 'plan-a';
                
                return (
                  <div key={plan.id} className="flex flex-col h-full justify-between">
                    {/* The 500x800px Aspect Ratio Graphical Card */}
                    <div className="relative w-full aspect-[500/800] bg-[#162d59] rounded-xs shadow-md text-white overflow-hidden flex flex-col justify-between p-2 md:p-4 border border-[#223069] select-none">
                      
                      {/* Vertical Watermark text 'Pulseshop' on the right side */}
                      <div className="absolute right-[-14px] top-1/2 -translate-y-1/2 rotate-90 origin-center text-[11px] md:text-sm font-black text-white/[0.07] uppercase tracking-widest font-sans pointer-events-none select-none">
                        Pulseshop
                      </div>

                      {/* Top Bar with SALE Badge & Plan Title */}
                      <div className="flex items-center justify-between w-full relative z-10">
                        {/* SALE Corner Badge */}
                        <span className="bg-[#0b17b3] text-white text-[7px] md:text-[9.5px] font-black px-1.5 py-0.5 rounded-xs uppercase tracking-wider shadow-xs">
                          SALE
                        </span>

                        {/* Centered Plan Header (Golden/Yellow A/B) */}
                        <div className="flex-1 text-center pr-4">
                          <h3 className="text-[11px] md:text-sm font-black text-white leading-none font-sans">
                            Plan <span className="text-[#fbbf24] font-serif italic text-[14px] md:text-lg font-black">{isPlanA ? 'A' : 'B'}</span>
                          </h3>
                        </div>
                      </div>

                      {/* Precise Vector Illustration in the Center */}
                      <div className="flex-1 flex items-center justify-center relative my-1">
                        {isPlanA ? (
                          /* Plan A Rocket Laptop Illustration */
                          <svg className="w-full h-full max-h-[85px] md:max-h-[140px] mx-auto overflow-visible" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Glow behind the rocket */}
                            <circle cx="65" cy="45" r="25" fill="#38bdf8" fillOpacity="0.12" className="animate-pulse" />
                            
                            {/* Laptop Base */}
                            <path d="M20 75 L100 75 L105 80 L15 80 Z" fill="#475569" />
                            <rect x="25" y="73" width="70" height="2" fill="#64748b" />
                            
                            {/* Laptop Screen */}
                            <rect x="30" y="38" width="60" height="36" rx="1.5" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                            
                            {/* 3D-styled Charts on screen */}
                            <rect x="36" y="55" width="4.5" height="15" fill="#f43f5e" />
                            <rect x="43" y="50" width="4.5" height="20" fill="#fbbf24" />
                            <rect x="50" y="44" width="4.5" height="26" fill="#10b981" />
                            
                            {/* Character standing on the left pointing */}
                            <g transform="translate(14, 40)">
                              <circle cx="8" cy="8" r="4.5" fill="#fbcfe8" />
                              <rect x="5" y="13" width="6" height="15" rx="1.5" fill="#0284c7" />
                              <path d="M11 15 L17 10" stroke="#fbcfe8" strokeWidth="1.5" strokeLinecap="round" />
                              <path d="M4 14 L1 19" stroke="#fbcfe8" strokeWidth="1.5" strokeLinecap="round" />
                              <rect x="5" y="28" width="2.5" height="8" fill="#1e293b" />
                              <rect x="8.5" y="28" width="2.5" height="8" fill="#1e293b" />
                            </g>

                            {/* Rocket Launching diagonally to top-right */}
                            <g transform="translate(54, 15) rotate(15)">
                              {/* Rocket body */}
                              <path d="M10 0 C10 0 17 8 17 18 C17 21 15 23 10 23 C5 23 3 21 3 18 C3 8 10 0 10 0 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.5" />
                              {/* Rocket Tip */}
                              <path d="M10 0 C10 0 14 4 14 7 L6 7 C6 4 10 0 10 0 Z" fill="#ef4444" />
                              {/* Rocket Wings */}
                              <path d="M3 16 L0 21 L3 20 Z" fill="#3b82f6" />
                              <path d="M17 16 L20 21 L17 20 Z" fill="#3b82f6" />
                              {/* Window */}
                              <circle cx="10" cy="11" r="2.5" fill="#38bdf8" stroke="#1d4ed8" strokeWidth="0.5" />
                              {/* Flame & Smoke */}
                              <path d="M8 23 L10 28 L12 23 Z" fill="#f97316" />
                              <path d="M9 23 L10 32 L11 23 Z" fill="#facc15" />
                            </g>
                          </svg>
                        ) : (
                          /* Plan B Rocket & Guy with Sparkler Illustration */
                          <svg className="w-full h-full max-h-[85px] md:max-h-[140px] mx-auto overflow-visible" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Glowing effect behind Rocket */}
                            <circle cx="78" cy="45" r="28" fill="#e0a96d" fillOpacity="0.1" className="animate-pulse" />

                            {/* Suit character with sparkle */}
                            <g transform="translate(18, 22)">
                              {/* Head and blindfold / VR glass */}
                              <circle cx="12" cy="10" r="4.5" fill="#fca5a5" />
                              <rect x="9" cy="8" width="7" height="2.5" fill="#1e1b4b" />
                              
                              {/* Green Suit Body */}
                              <path d="M5 15 L19 15 L21 38 L3 38 Z" fill="#15803d" />
                              {/* White Shirt Collar & tie */}
                              <path d="M10 15 L12 20 L14 15 Z" fill="#ffffff" />
                              <path d="M11.5 17 L12.5 17 L12 24 Z" fill="#dc2626" />
                              
                              {/* Suit arm holding match/sparkler */}
                              <path d="M19 18 L28 14" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
                              {/* Sparkler stick */}
                              <path d="M28 14 L32 9" stroke="#78350f" strokeWidth="0.8" />
                              {/* Sparkler Flame (glowing dots) */}
                              <circle cx="32" cy="9" r="2.5" fill="#fbbf24" />
                              <line x1="32" y1="9" x2="35" y2="6" stroke="#f97316" strokeWidth="0.5" />
                              <line x1="32" y1="9" x2="29" y2="6" stroke="#f97316" strokeWidth="0.5" />
                              <line x1="32" y1="9" x2="35" y2="12" stroke="#f97316" strokeWidth="0.5" />
                              
                              {/* Left arm down */}
                              <path d="M5 18 L1 26" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
                              
                              {/* Legs */}
                              <rect x="5" y="38" width="4.5" height="15" fill="#1e1b4b" />
                              <rect x="12.5" y="38" width="4.5" height="15" fill="#1e1b4b" />
                            </g>

                            {/* Large Orange Startup Rocket on the Right */}
                            <g transform="translate(68, 8)">
                              {/* Rocket Body */}
                              <rect x="6" y="15" width="16" height="52" rx="3" fill="#ea580c" stroke="#b45309" strokeWidth="0.7" />
                              {/* Rocket Red Nose cone */}
                              <path d="M6 15 L14 1 L22 15 Z" fill="#dc2626" />
                              {/* Wings */}
                              <path d="M6 55 L0 64 L6 62 Z" fill="#b45309" />
                              <path d="M22 55 L28 64 L22 62 Z" fill="#b45309" />
                              {/* Flame at bottom */}
                              <path d="M11 67 L14 76 L17 67 Z" fill="#fbbf24" />
                              <path d="M9 67 L14 82 L19 67 Z" fill="#ef4444" />
                              {/* STARTUP Text printed vertically inside rocket */}
                              <g transform="translate(15, 48) rotate(-90)">
                                <text fill="#ffffff" fontSize="7" fontWeight="900" letterSpacing="1" fontFamily="sans-serif">STARTUP</text>
                              </g>
                            </g>
                          </svg>
                        )}
                      </div>

                      {/* Precise White/Yellow Bullet Points */}
                      <div className="flex flex-col gap-1.5 py-2 text-left border-t border-dashed border-white/10 mt-auto select-none">
                        {isPlanA ? (
                          <>
                            <div className="flex items-center gap-1.5">
                              <span className="text-white text-[7px] md:text-xs">•</span>
                              <span className="text-[7.5px] md:text-[10px] font-extrabold text-slate-100 leading-none">Total Episode : 7</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-white text-[7px] md:text-xs">•</span>
                              <span className="text-[7.5px] md:text-[10px] font-extrabold text-slate-100 leading-none">No of <span className="text-yellow-400">Idea&apos;s</span> : 1</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-white text-[7px] md:text-xs">•</span>
                              <span className="text-[7.5px] md:text-[10px] font-extrabold text-slate-100 leading-none">Earning Capacity : <span className="text-yellow-400 font-black">15,000</span> to <span className="text-yellow-400 font-black">1 lakh</span>/Month</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-white text-[7px] md:text-xs">•</span>
                              <span className="text-[7.5px] md:text-[10px] font-extrabold text-slate-100 leading-none font-sans">Stock : Only For 100 People</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-1.5">
                              <span className="text-white text-[7px] md:text-xs">•</span>
                              <span className="text-[7.5px] md:text-[10px] font-extrabold text-slate-100 leading-none">Total Episode : 12 +</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-white text-[7px] md:text-xs">•</span>
                              <span className="text-[7.5px] md:text-[10px] font-extrabold text-slate-100 leading-none">No of <span className="text-yellow-400">Idea&apos;s</span> : <span className="text-yellow-400 font-black">3 (Recent)</span></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-white text-[7px] md:text-xs">•</span>
                              <span className="text-[7.5px] md:text-[10px] font-extrabold text-slate-100 leading-none">Earning Capacity : <span className="text-yellow-400 font-black">25,000</span> to <span className="text-yellow-400 font-black">3 lakh</span>/Month</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-white text-[7px] md:text-xs">•</span>
                              <span className="text-[7.5px] md:text-[10px] font-extrabold text-slate-100 leading-none">Time : Min. <span className="text-yellow-400 font-black">2 Hour</span> / Day</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Branded Banner Claim at Bottom of Card */}
                      <div className="text-center pt-1.5 pb-0.5 border-t border-[#223069] mt-1 select-none">
                        <p className="text-[7px] md:text-[9px] font-black text-cyan-300 leading-tight">
                          इस एक Idea से आपकी पूरी जिंदगी बदल जाएगी..!!
                        </p>
                      </div>

                    </div>

                    {/* Underneath Card Information */}
                    <div className="text-center pt-2 flex flex-col items-center gap-0.5 flex-1 justify-between">
                      <div className="flex flex-col items-center gap-0.5 w-full">
                        {/* Plan Name */}
                        <span className="text-[10px] md:text-xs font-bold text-slate-500">
                          {isPlanA ? 'Plan A' : 'Plan B'}
                        </span>

                        {/* Stars Rating (★) */}
                        <div className="flex items-center justify-center gap-0.5 mt-0.5">
                          <div className="flex text-amber-400 text-[10px] md:text-xs">
                            <span>★</span><span>★</span><span>★</span><span>★</span>
                            <span className={isPlanA ? "text-amber-400" : "text-amber-400/80"}>★</span>
                          </div>
                          <span className="text-[8.5px] md:text-[10px] text-slate-400 font-semibold pl-1">
                            {isPlanA ? '(29)' : '(113)'}
                          </span>
                        </div>

                        {/* Stock Status Indicator */}
                        <div className="mt-0.5">
                          {isPlanA ? (
                            <span className="text-red-600 text-[9px] md:text-[11px] font-extrabold">
                              Out of stock
                            </span>
                          ) : (
                            <span className="text-emerald-700 text-[9px] md:text-[11px] font-extrabold flex items-center gap-0.5 justify-center">
                              ✔ In stock
                            </span>
                          )}
                        </div>

                        {/* Pricing Row */}
                        <div className="flex items-center justify-center gap-2 mt-0.5">
                          <span className="text-slate-400 line-through text-[9px] md:text-xs">
                            ₹{plan.originalPrice}.00
                          </span>
                          <span className="text-[#13193e] font-black text-[11px] md:text-sm">
                            ₹{plan.salePrice}.00
                          </span>
                        </div>
                      </div>

                      {/* Compact BUY NOW Action Button */}
                      <div className="w-full px-1.5 pt-1.5 mt-2">
                        <button
                          onClick={() => handleOpenCheckout(plan)}
                          className="w-full bg-[#0051fa] hover:bg-[#0041cb] text-white font-black text-[10.5px] md:text-[12px] py-2 px-1 rounded-md transition-all shadow-md active:scale-95 flex items-center justify-center gap-1 uppercase tracking-wider"
                          id={`btn-unlock-${plan.id}`}
                        >
                          Buy now
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </section>

            {/* MOTIVATIONAL NOTE / QUOTE BOX (PULSESHOP BRANDED) */}
            <section className="px-3 pb-8 pt-4 bg-white" id="motivational-quote-box">
              <div className="bg-white border-2 border-indigo-50 rounded-2xl p-8 shadow-sm max-w-lg mx-auto text-center">
                <div className="space-y-3">
                  <p className="text-[13px] md:text-sm text-indigo-700 font-black leading-tight">
                    Sirf sapne mat dekho, apni doosri income banana shuru karo.
                  </p>
                  <p className="text-[13px] md:text-sm text-indigo-800 font-black leading-tight">
                    Aaj ka Plan B, kal ki financial freedom ban sakta hai.
                  </p>
                  <p className="text-[13px] md:text-sm text-indigo-900 font-black leading-tight">
                    Jab tak ek hi income par bharosa hai, tak tak risk zyada hai.
                  </p>
                  <p className="text-[13px] md:text-sm text-indigo-800 font-black leading-tight">
                    Smart log salary ke saath online income bhi banate hain.
                  </p>
                  <p className="text-[13px] md:text-sm text-indigo-700 font-black leading-tight">
                    Plan B shuru karo — kyunki future kisi ko bata kar nahi aata.
                  </p>
                </div>
              </div>
            </section>

            {/* MOBILE-FRIENDLY COMPACT FOOTER */}
            <footer className="bg-[#13193e] text-slate-300 px-4 pt-8 pb-24 border-t border-slate-800" id="mobile-footer">
              <div className="max-w-md mx-auto flex flex-col gap-6 text-left">
                {/* Brand Header */}
                <div>
                  <h3 className="text-base font-black text-white tracking-wide">Pulseshop</h3>
                  <p className="text-[10px] text-slate-400 leading-normal mt-1">
                    Pulseshop helps the youth of India build genuine, highly-profitable digital business systems with step-by-step guidance.
                  </p>
                </div>

                {/* Quick Link Buttons (Row of Capsules) */}
                <div className="flex flex-wrap gap-1.5">
                  <button 
                    onClick={() => setActiveTab('privacy')}
                    className="bg-[#223069] text-white text-[9px] font-bold px-2.5 py-1 rounded-full hover:bg-sky-600 transition-colors"
                  >
                    Privacy Policy
                  </button>
                  <button 
                    onClick={() => setActiveTab('refund')}
                    className="bg-[#223069] text-white text-[9px] font-bold px-2.5 py-1 rounded-full hover:bg-sky-600 transition-colors"
                  >
                    Refund & Return Policy
                  </button>
                  <button 
                    onClick={() => setActiveTab('about')}
                    className="bg-[#223069] text-white text-[9px] font-bold px-2.5 py-1 rounded-full hover:bg-sky-600 transition-colors"
                  >
                    About Us
                  </button>
                  <button 
                    onClick={() => setActivePolicy({
                      title: "Contact Us",
                      content: "We are here to support you in your digital journey! Feel free to reach out to our dedicated support team:\n\n📧 Email: pulseshop580@gmail.com\n🌐 Website: www.pulseshop.in\n\n🕒 Support Hours: Monday to Saturday (10:00 AM - 6:00 PM IST)\n\nWe typically respond to all support emails within 24 hours."
                    })}
                    className="bg-[#223069] text-white text-[9px] font-bold px-2.5 py-1 rounded-full hover:bg-sky-600 transition-colors"
                  >
                    Contact Us
                  </button>
                </div>

                {/* Contact and Copyright Bottom Info */}
                <div className="border-t border-slate-800/80 pt-4 flex flex-col gap-1 text-[9px] text-slate-400">
                  <p>📧 Email: <span className="text-white font-bold">pulseshop580@gmail.com</span></p>
                  <p>🌐 Website: <span className="text-white font-bold">www.pulseshop.in</span></p>
                  <p className="mt-2 text-slate-500 font-medium">© 2026 Pulseshop. All Rights Reserved.</p>
                </div>
              </div>
            </footer>

          </div>
        )}

        {/* TAB 3: ACCOUNT/DASHBOARD VIEW */}
        {activeTab === 'account' && (
          <AccountView 
            user={user}
            setUser={setUser}
            isAdmin={isAdmin}
            onAdminLogin={handleAdminLogin}
          />
        )}

        {/* TAB 4: ADMIN DASHBOARD VIEW */}
        {isAdmin && activeTab === 'admin' && (
          <div className="animate-fadeIn">
            {isOrdersLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-slate-500 font-bold">लोड हो रहा है... (Loading Orders...)</p>
              </div>
            ) : (
              <AdminDashboard 
                orders={orders}
                plans={PLANS.filter(p => !deletedPlanIds.includes(p.id))}
                onApprove={handleApproveOrder}
                onReject={handleRejectOrder}
                onDeleteOrder={handleDeleteOrder}
                onDeletePlan={handleDeletePlan}
                onAddDemoOrder={handleAddDemoOrder}
                onGoToHome={() => setActiveTab('home')}
              />
            )}
          </div>
        )}

        {/* TAB 5: PRIVACY POLICY VIEW */}
        {activeTab === 'privacy' && (
          <PrivacyPolicy onBack={() => setActiveTab('home')} />
        )}

        {/* TAB 6: REFUND POLICY VIEW */}
        {activeTab === 'refund' && (
          <RefundPolicy onBack={() => setActiveTab('home')} />
        )}

        {/* TAB 7: ABOUT US VIEW */}
        {activeTab === 'about' && (
          <AboutUs onBack={() => setActiveTab('home')} />
        )}

      </main>

      {/* FIXED BOTTOM NAVIGATION */}
      <BottomNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasPurchasedAny={user.purchasedPlans.length > 0}
        pendingOrdersCount={orders.filter(o => o.status === 'pending').length}
        isAdmin={isAdmin}
      />

      {/* CHECKOUT MODAL GATEWAY */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        plan={selectedPlan}
        onSuccess={handlePurchaseSuccess}
        user={user}
        setUser={setUser}
        onOrderCreated={handleOrderCreated}
        onThankYou={handleThankYou}
      />
      
      {/* INTERACTIVE POLICY MODAL */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" id="policy-modal">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                {activePolicy.title}
              </h3>
              <button 
                onClick={() => setActivePolicy(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="px-6 py-5 overflow-y-auto text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {activePolicy.content}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setActivePolicy(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all rounded-xl shadow-xs"
              >
                समझ गया (Okay)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
