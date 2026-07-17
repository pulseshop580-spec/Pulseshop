import React, { useState, useEffect, useRef } from 'react';
import { User as UserIcon, Shield, Briefcase, Plus, Send, Check, Edit2, Sparkles, AlertCircle } from 'lucide-react';
import { User, Plan } from '../types';
import { PLANS } from '../data';

interface AccountViewProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  isAdmin: boolean;
  onAdminLogin: (password: string) => boolean;
}

export default function AccountView({ user, setUser, isAdmin, onAdminLogin }: AccountViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [formData, setFormData] = useState({
    name: user.name || 'Student Learner',
    phone: user.phone || '9999999999',
    email: user.email || 'learner@pulseshop.com'
  });

  const [simulatedEarnings, setSimulatedEarnings] = useState(() => {
    const saved = localStorage.getItem('pn_sim_earnings');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'नमस्कार! मैं आपका pulseshop Business AI Mentor हूँ। आप मुझसे अपने बिज़नेस सेटअप, PAN/Aadhar, UPI या फ्री ट्रैफिक के बारे में कोई भी सवाल पूछ सकते हैं! 😊' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('pn_sim_earnings', simulatedEarnings.toString());
  }, [simulatedEarnings]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name: formData.name,
      phone: formData.phone,
      email: formData.email
    }));
    setIsEditing(false);
  };

  const triggerMockSale = () => {
    if (user.purchasedPlans.length === 0) {
      alert('पहले कोई प्लान (Plan A या Plan B) अनलॉक करें ताकि आपका बिज़नेस सेटअप चालू हो सके!');
      return;
    }
    const bonus = user.purchasedPlans.includes('plan-b') ? 1200 : 450;
    setSimulatedEarnings(prev => prev + bonus);
    
    // Add a chat notification from the bot
    setChatMessages(prev => [
      ...prev,
      { sender: 'bot', text: `🎉 वाह! आपके बिज़नेस सेटअप से एक नया आर्डर आया है! आपके खाते में ₹${bonus} जमा हुए हैं। इसी तरह रोज़ाना काम करते रहें!` }
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');

    // Simulate bot response after 1 second
    setTimeout(() => {
      let botResponse = 'बहुत अच्छा सवाल है! ';
      const lowerText = userText.toLowerCase();

      if (lowerText.includes('traffic') || lowerText.includes('कस्टमर') || lowerText.includes('ग्राहक') || lowerText.includes('client')) {
        botResponse = 'फ्री ट्रैफिक (Free Traffic) पाने का सबसे बेस्ट तरीका है: Instagram Reels और YouTube Shorts! आप हमारे कोर्स में दिए गए Templates का यूज़ करके 15 सेकंड के वीडियो बनाएं। रोजाना 3 वीडियो डालने से 10 दिनों में आपके पास 1,000+ ग्राहक आने लगेंगे! 🚀';
      } else if (lowerText.includes('pan') || lowerText.includes('aadhar') || lowerText.includes('आधार') || lowerText.includes('पैन') || lowerText.includes('18')) {
        botResponse = 'अगर आपकी उम्र 18 साल से कम है या आपके पास PAN/Aadhar नहीं है, तो बिल्कुल घबराएं नहीं! आप अपने माता-पिता (Parents) या बड़े भाई-बहन के डॉक्यूमेंट्स का उपयोग करके पूरी तरह से वैध और सुरक्षित बिज़नेस अकाउंट सेटअप कर सकते हैं। इसकी पूरी प्रक्रिया कोर्स के वीडियो में डिटेल से बताई गयी है।';
      } else if (lowerText.includes('paisa') || lowerText.includes('earning') || lowerText.includes('कमाई') || lowerText.includes('withdraw') || lowerText.includes('upi')) {
        botResponse = 'आपकी पूरी कमाई सीधे आपके UPI ID (जैसे GPay, PhonePe, Paytm) या सीधे बैंक अकाउंट में क्रेडिट होती है। जैसे ही आप वीडियो में बताए गए सेटअप को कम्प्लीट करते हैं, आपकी डेली अर्निंग सीधे बैंक में जाने लगती है।';
      } else if (lowerText.includes('plan b') || lowerText.includes('planb') || lowerText.includes('b')) {
        botResponse = 'Plan B हमारा सबसे प्रीमियम सेलर है! इसमें 12 से ज्यादा हाई-क्वालिटी वीडियो लेक्चर्स हैं जिनमें 3 गुप्त हाई-प्रॉफिट बिज़नेस आईडियाज बताए गए हैं। साथ ही आपको लाइफटाइम फ्री अपडेट्स और आर्डर जनरेटर भी मिलता है।';
      } else {
        botResponse = 'समझ गया! pulseshop कोर्सेज का यही फायदा है कि आपको हर चीज़ का लाइव डेमो स्क्रीन-रिकॉर्डिंग के साथ मिलता है। क्या आपने वीडियो लेक्चर्स देखना शुरू कर दिया है? अगर नहीं, तो Downloads सेक्शन में जाकर तुरंत पहला वीडियो देखें और बिज़नेस सेटअप करें! 👍';
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-5 px-4 py-3 pb-24 max-w-md mx-auto" id="account-view">
      
      {/* Title */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">User Dashboard</span>
        <h2 className="text-2xl font-black text-slate-900" onClick={() => {
          if (clickCount >= 4) {
            setShowAdminLogin(true);
            setClickCount(0);
          } else {
            setClickCount(clickCount + 1);
          }
        }}>My Account</h2>
      </div>

      {/* ADMIN LOGIN (Hidden) */}
      {showAdminLogin && user.email === 'pulseshop580@gmail.com' && !isAdmin && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col gap-3">
          <h4 className="text-sm font-black text-slate-800">Admin Access</h4>
          <input
            type="password"
            placeholder="Enter Admin Password"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const password = e.currentTarget.value;
                if (onAdminLogin(password)) {
                  alert('Admin access granted!');
                  setShowAdminLogin(false);
                } else {
                  alert('Invalid password!');
                }
              }
            }}
          />
        </div>
      )}

      {/* USER PROFILE CARD */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-150 flex items-center justify-center text-indigo-600">
            <UserIcon className="w-8 h-8" />
          </div>

          <div className="flex-1 text-left">
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-base text-slate-800">{user.name || 'Student Learner'}</h3>
              <Shield className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-xs text-slate-500">{user.email || 'learner@pulseshop.com'}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Mobile: +91 {user.phone || '9999999999'}</p>
          </div>

          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-800 transition-all"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* EDIT PROFILE FORM */}
        {isEditing && (
          <form onSubmit={handleUpdateProfile} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col gap-3 animate-slide-in">
            <h4 className="text-xs font-bold text-indigo-600 uppercase">Edit Profile Details</h4>
            <div>
              <label className="block text-[10px] text-slate-500 font-bold mb-1">नाम (Name)</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-bold mb-1">व्हाट्सएप नंबर (Phone)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0,10) })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-bold mb-1">ईमेल (Email)</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-indigo-600"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs transition-colors"
            >
              प्रोफ़ाइल सेव करें (Save Details)
            </button>
          </form>
        )}

        <div className="border-t border-slate-100 pt-4 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">My Active Programs</span>
          <div className="flex flex-wrap gap-2">
            {user.purchasedPlans.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No plans active yet. Unlock Plan A or Plan B to start learning!</span>
            ) : (
              user.purchasedPlans.map(pId => {
                const planObj = PLANS.find(pl => pl.id === pId);
                return (
                  <span 
                    key={pId}
                    className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                      pId === 'plan-b' 
                        ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {planObj?.name} Active
                  </span>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* EARNINGS ENGINE / PRACTICE ZONE */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col gap-4 text-left relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Business Practice Center</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-0.5">My Business Sandbox</h3>
          <p className="text-[11px] text-slate-600 leading-normal mt-1">
            यहाँ आप सीखे गए बिज़नेस टूल्स और ट्रैफ़िक जनरेटर का उपयोग करके लाइव कस्टमर ऑर्डर और अर्निंग का अभ्यास कर सकते हैं।
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Simulated Earnings (कुल अभ्यास कमाई)</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">₹{simulatedEarnings.toLocaleString()}</p>
          </div>

          <button
            onClick={triggerMockSale}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 transition-all active:scale-95 shadow-md shadow-emerald-200"
            id="btn-simulate-sale"
          >
            <Plus className="w-4 h-4" />
            Simulate Sale
          </button>
        </div>

        {user.purchasedPlans.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle className="w-4.5 h-4.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <span className="text-[10px] text-amber-800 leading-normal">
              नोट: बिज़नेस अभ्यास केंद्र का उपयोग करने के लिए आपके पास कम से कम एक एक्टिव कोर्स प्लान होना आवश्यक है।
            </span>
          </div>
        )}
      </div>

      {/* AI MENTOR CHAT BOX */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col gap-3 text-left">
        <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            🤖
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-800">pulseshop AI Business Assistant</h4>
            <p className="text-[9px] text-slate-400 font-medium">Ready to help 24/7 • Speaks Hindi-English</p>
          </div>
        </div>

        {/* Messages list */}
        <div className="h-44 overflow-y-auto flex flex-col gap-2.5 p-1 bg-slate-50 rounded-xl">
          {chatMessages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex flex-col max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'self-end bg-indigo-600 text-white rounded-br-none'
                  : 'self-start bg-white text-slate-700 rounded-bl-none border border-slate-200 shadow-sm'
              }`}
            >
              <p>{msg.text}</p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input box */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="जैसे: फ्री ग्राहक कैसे लाएं?"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            className="flex-1 bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-600 text-xs rounded-xl px-3 py-2.5 text-slate-800 outline-none"
          />
          <button
            type="submit"
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors active:scale-95 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
