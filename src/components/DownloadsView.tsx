import React, { useState } from 'react';
import { Lock, Play, Download, Sparkles, FileText, CheckCircle, Video, Clock, X } from 'lucide-react';
import { Plan, VideoEpisode, User, Order } from '../types';
import { PLANS, VIDEO_EPISODES } from '../data';

interface DownloadsViewProps {
  user: User;
  orders: Order[];
  onGoToHome: () => void;
  onSelectPlan: (plan: Plan) => void;
  onApproveOrder?: (orderId: string) => void;
}

export default function DownloadsView({ user, orders, onGoToHome, onSelectPlan, onApproveOrder }: DownloadsViewProps) {
  const [activePlanId, setActivePlanId] = useState<'plan-a' | 'plan-b'>('plan-a');
  const [currentEpisode, setCurrentEpisode] = useState<VideoEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Check which plans are unlocked based on admin approval
  const isPlanUnlocked = (id: 'plan-a' | 'plan-b') => {
    const order = orders.find(o => o.customerEmail === user.email && o.planId === id);
    if (order) {
      return order.status === 'approved';
    }
    return user.purchasedPlans.includes(id);
  };

  // Get current order for active plan to show pending/rejected state
  const currentOrder = orders.find(o => o.customerEmail === user.email && o.planId === activePlanId);

  // Get episodes for active plan
  const activeEpisodes = VIDEO_EPISODES.filter(ep => ep.planId === activePlanId);

  // Select first episode as default if unlocked and none selected
  React.useEffect(() => {
    if (isPlanUnlocked(activePlanId) && activeEpisodes.length > 0 && !currentEpisode) {
      setCurrentEpisode(activeEpisodes[0]);
    } else if (!isPlanUnlocked(activePlanId)) {
      setCurrentEpisode(null);
    }
  }, [activePlanId, orders]);

  // Handle plan tab switch
  const handlePlanTabSwitch = (id: 'plan-a' | 'plan-b') => {
    setActivePlanId(id);
    const episodes = VIDEO_EPISODES.filter(ep => ep.planId === id);
    if (isPlanUnlocked(id) && episodes.length > 0) {
      setCurrentEpisode(episodes[0]);
    } else {
      setCurrentEpisode(null);
    }
    setIsPlaying(false);
  };

  const handleDownloadResource = (resName: string) => {
    alert(`"${resName}" सफलतापूर्वक आपके मोबाइल में डाउनलोड हो गया है!`);
  };

  return (
    <div className="flex flex-col gap-5 px-4 py-3 pb-24 max-w-md mx-auto" id="downloads-view">
      
      {/* Title */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">My Video Courses</span>
        <h2 className="text-2xl font-black text-slate-900">Your Downloads & Lectures</h2>
      </div>


      {/* CASE 1: PLAN IS ORDERED BUT PENDING APPROVAL */}
      {currentOrder && currentOrder.status === 'pending' ? (
        <div className="bg-white border border-amber-200 rounded-3xl p-6 text-center flex flex-col items-center gap-5 my-2 shadow-sm animate-fade-in text-slate-900">
          <div className="w-16 h-16 bg-amber-50 rounded-full border border-amber-200 flex items-center justify-center text-amber-600 animate-pulse">
            <Clock className="w-8 h-8" />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-black text-slate-900">भुगतान सत्यापन लंबित है</h3>
            
            <div className="border-[2px] border-dashed border-[#719351] rounded-2xl p-4 bg-[#fcfdfa] text-center my-1 select-text">
              <p className="text-[#719351] text-xs md:text-sm font-bold leading-relaxed">
                आपका Order हमें मिल गया है हम जल्दी ही Transaction देख कर आपके Order को पूरा कर देंगे फिर आप Download बटन पर क्लिक करके Video को Download कर सकते हैं!
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed px-1 mt-1">
              एडमिन द्वारा आपके पेमेंट स्क्रीनशॉट का मिलान करने के बाद कोर्स के लेक्चर्स और <strong>मुख्य डिजिटल प्रोडक्ट का डाउनलोड लिंक</strong> तुरंत यहाँ अनलॉक हो जाएगा। (आमतौर पर इसमें 5-10 मिनट लगते हैं)
            </p>
          </div>

          {/* Order Details Mini Card */}
          <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left flex flex-col gap-2 font-sans select-text">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Order Number:</span>
              <span className="font-extrabold text-slate-800">#{currentOrder.id}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Plan Type:</span>
              <span className="font-extrabold text-[#13193e]">{currentOrder.planName}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Amount Paid:</span>
              <span className="font-extrabold text-emerald-600">₹{currentOrder.amount}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Order Status:</span>
              <span className="font-black text-amber-600 uppercase tracking-wider text-[10px] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                Pending Verification
              </span>
            </div>
          </div>

          {/* Quick interactive test helper button to approve immediately */}
          {onApproveOrder && (
            <div className="w-full border-t border-slate-100 pt-4 mt-1 flex flex-col gap-2">
              <p className="text-[10px] text-slate-400 font-bold leading-normal">
                💡 टेस्ट करने के लिए नीचे दिए गए बटन पर क्लिक करके आप इस आर्डर को तुरंत खुद मंजूर (approve) कर सकते हैं:
              </p>
              <button
                onClick={() => {
                  onApproveOrder(currentOrder.id);
                  alert('बधाई हो! ऑर्डर सफलतापूर्वक मंजूर (Approve) कर दिया गया है। वीडियो और डाउनलोड लिंक अनलॉक हो गए हैं!');
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-5 rounded-2xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-1.5 text-xs"
              >
                <CheckCircle className="w-4 h-4" />
                तुरंत आर्डर मंजूर करें (Simulate Approval)
              </button>
            </div>
          )}

          <button
            onClick={onGoToHome}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold mt-2"
          >
            होम पेज पर जाएँ (Go to Home)
          </button>
        </div>
      ) : currentOrder && currentOrder.status === 'rejected' ? (
        <div className="bg-white border border-red-200 rounded-3xl p-6 text-center flex flex-col items-center gap-5 my-2 shadow-sm animate-fade-in text-slate-900">
          <div className="w-16 h-16 bg-red-50 rounded-full border border-red-200 flex items-center justify-center text-red-500">
            <X className="w-8 h-8" />
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-lg font-black text-red-700">ऑर्डर अस्वीकृत (Order Rejected)</h3>
            <p className="text-xs text-slate-600 leading-relaxed px-2">
              आपके द्वारा भेजा गया पेमेंट स्क्रीनशॉट सत्यापित नहीं हो पाया। कृपया सही स्क्रीनशॉट के साथ दोबारा पेमेंट कन्फर्म करें या हमारे व्हाट्सएप हेल्पडेस्क से संपर्क करें।
            </p>
          </div>

          <button
            onClick={() => {
              const selected = PLANS.find(p => p.id === activePlanId);
              if (selected) onSelectPlan(selected);
            }}
            className="w-full bg-[#0051fa] hover:bg-[#0041cb] text-white font-black py-4 px-6 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wide text-xs"
          >
            RETRY PURCHASE (Pay ₹{PLANS.find(p => p.id === activePlanId)?.salePrice || '99'})
          </button>
        </div>
      ) : !isPlanUnlocked(activePlanId) ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center flex flex-col items-center gap-5 my-2 shadow-sm animate-fade-in">
          <div className="w-16 h-16 bg-red-50 rounded-full border border-red-200 flex items-center justify-center text-red-500">
            <Lock className="w-8 h-8" />
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-lg font-extrabold text-slate-800">यह कोर्स अभी लॉक है!</h3>
            <p className="text-xs text-slate-600 leading-relaxed px-2">
              आपने अभी तक <span className="text-indigo-600 font-bold">{activePlanId === 'plan-a' ? 'Plan A' : 'Plan B'}</span> एक्टिवेट नहीं किया है। इसे अनलॉक करने के बाद आपको सभी विडियो लेक्चर्स और डाउनलोड लिंक्स तुरंत मिल जायेंगे।
            </p>
          </div>

          {/* Quick value props list */}
          <div className="w-full bg-slate-50/50 rounded-2xl p-4 border border-slate-100 text-left flex flex-col gap-3">
            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{activePlanId === 'plan-a' ? '7 High-Quality Step-by-Step Videos' : '12+ Advanced Business setup Videos'}</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>UPI, Google Pay setup with Aadhar & PAN support</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Free lifetime updates and new setup guidelines</span>
            </div>
          </div>

          <button
            onClick={() => {
              const selected = PLANS.find(p => p.id === activePlanId);
              if (selected) onSelectPlan(selected);
            }}
            className="w-full bg-[#0051fa] hover:bg-[#0041cb] text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            BUY NOW (Pay ₹{PLANS.find(p => p.id === activePlanId)?.salePrice || '99'})
            <Sparkles className="w-4.5 h-4.5 text-amber-300" />
          </button>

          <button
            onClick={onGoToHome}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            सभी प्लान देखें (View All Plans)
          </button>
        </div>
      ) : (
        /* CASE 2: PLAN IS UNLOCKED */
        <div className="flex flex-col gap-5">

          {/* ==================== GOOGLE DRIVE DIGITAL PRODUCT CARD ==================== */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-3xl p-5 text-slate-900 shadow-xs relative overflow-hidden text-left flex flex-col gap-3.5 animate-fadeIn">
            <div className="absolute top-[-10px] right-[-10px] w-20 h-20 bg-emerald-500/5 rounded-full pointer-events-none" />
            
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  MEMBER DIGITAL PRODUCT ACCESS
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <h3 className="text-base font-black text-slate-900 mt-2">
                🎁 मुख्य डिजिटल प्रोडक्ट डाउनलोड करें (Primary Digital Product)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-1 font-medium">
                बधाई हो! आपका पेमेंट एडमिन द्वारा सफलतापूर्वक सत्यापित कर दिया गया है। नीचे दिए गए डाउनलोड बटन पर क्लिक करके सीधे अपने गूगल ड्राइव फ़ोल्डर से सभी बिज़नेस फाइल्स और डिजिटल प्रोडक्ट एक्सेस करें।
              </p>
            </div>

            <a 
              href="https://drive.google.com/drive/folders/1srUiWfChdz34SpmBzKFh8E8uXKm-Z4iA"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 uppercase text-xs tracking-wider border border-emerald-600"
              id="google-drive-download-link"
            >
              <Download className="w-4.5 h-4.5" />
              DOWNLOAD DIGITAL PRODUCT (GOOGLE DRIVE) ➔
            </a>
          </div>
          
          {/* VIDEO PLAYER PREVIEW */}
          {currentEpisode && (
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm animate-fade-in">
              
              {/* Fake Video Player Screen */}
              <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden">
                {isPlaying ? (
                  <video 
                    src={currentEpisode.videoUrl} 
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    onEnded={() => setIsPlaying(false)}
                  />
                ) : (
                  <>
                    {/* Thumbnail Backdrop overlay */}
                    <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center p-6 text-center border-b border-slate-200">
                      <Video className="w-10 h-10 text-indigo-600/30 mb-2" />
                      <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-full mb-1">
                        Currently Playing
                      </span>
                      <p className="text-sm font-bold text-slate-800 line-clamp-1">{currentEpisode.title}</p>
                    </div>

                    <button
                      onClick={() => setIsPlaying(true)}
                      className="relative z-10 w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-200"
                    >
                      <Play className="w-7 h-7 fill-white text-white translate-x-0.5" />
                    </button>
                  </>
                )}
              </div>

              {/* Episode Description */}
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Duration: {currentEpisode.duration} Mins</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    UNLOCKED
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-800 leading-snug">{currentEpisode.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">{currentEpisode.description}</p>
              </div>
            </div>
          )}

          {/* DOWNLOADABLE PDF / BONUS RESOURCES */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-indigo-600 tracking-wider uppercase mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Bonus Learning Materials
            </h4>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-red-50 rounded-lg text-red-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">1. Step-by-Step Business Checklist.pdf</p>
                    <p className="text-[10px] text-slate-400">640 KB • PDF Document</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDownloadResource('1. Step-by-Step Business Checklist.pdf')}
                  className="p-2 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">2. Free Organic Traffic Masterlist.xlsx</p>
                    <p className="text-[10px] text-slate-400">1.2 MB • Excel Spreadsheet</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDownloadResource('2. Free Organic Traffic Masterlist.xlsx')}
                  className="p-2 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              {activePlanId === 'plan-b' && (
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800">3. Wholesale Suppliers Contact List.pdf</p>
                      <p className="text-[10px] text-slate-400">450 KB • PDF Document</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDownloadResource('3. Wholesale Suppliers Contact List.pdf')}
                    className="p-2 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* EPISODE LIST */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">All Course Episodes ({activeEpisodes.length})</h4>
            <div className="flex flex-col gap-2">
              {activeEpisodes.map((ep, idx) => {
                const isSelected = currentEpisode?.id === ep.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => {
                      setCurrentEpisode(ep);
                      setIsPlaying(false);
                    }}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected 
                        ? 'bg-indigo-50/40 border-indigo-600 text-slate-900' 
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black ${
                      isSelected 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{ep.duration} Mins</span>
                        {isSelected && (
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest animate-pulse">Playing</span>
                        )}
                      </div>
                      <p className="text-xs font-extrabold line-clamp-1 leading-tight">{ep.title.replace(/Episode \d+: /, '')}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">{ep.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
