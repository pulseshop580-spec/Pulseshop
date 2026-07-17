import { Plan, VideoEpisode, EarningAlert } from './types';

export const PLANS: Plan[] = [
  {
    id: 'plan-a',
    name: 'Plan A',
    badge: 'SALE',
    originalPrice: 4999,
    salePrice: 2999,
    episodesCount: 7,
    ideasCount: 1,
    earningCapacity: '₹15,000 to ₹1 Lakh/Month',
    timeRequired: '1 Hour / Day',
    stockLeft: 42,
    descriptionHindi: 'इस एक Idea से आपकी पूरी जिंदगी बदल जाएगी..!!',
    descriptionEnglish: 'This single powerful idea can change your entire life..!!',
    bulletPoints: [
      'Total Episode : 7',
      'No of Idea\'s : 1',
      'Earning Capacity : 15,000 to 1 lakh/Month',
      'Stock : Only For 100 People',
      'Step-by-step mobile setup videos included',
      'Instant access in your Downloads section'
    ],
    colorTheme: {
      primary: 'from-blue-600 to-indigo-700',
      secondary: 'bg-blue-100 text-blue-800',
      bgGradient: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900',
      border: 'border-blue-500/30',
      text: 'text-blue-400'
    }
  },
  {
    id: 'plan-b',
    name: 'Plan B',
    badge: 'BEST SELLER',
    originalPrice: 1999,
    salePrice: 299,
    episodesCount: 12,
    ideasCount: 3,
    earningCapacity: '₹25,000 to ₹3 Lakh/Month',
    timeRequired: 'Min. 2 Hour / Day',
    stockLeft: 18,
    descriptionHindi: 'इस एक Idea से आपकी पूरी जिंदगी बदल जाएगी..!!',
    descriptionEnglish: 'This single powerful idea can change your entire life..!!',
    bulletPoints: [
      'Total Episode : 12 +',
      'No of Idea\'s : 3 (Recent)',
      'Earning Capacity : 25,000 to 3 lakh/Month',
      'Time : Min. 2 Hour / Day',
      '3 High-Profit Secret Business Ideas',
      'Lifetime New Business Idea Updates'
    ],
    colorTheme: {
      primary: 'from-amber-500 to-orange-600',
      secondary: 'bg-amber-100 text-amber-800',
      bgGradient: 'bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900',
      border: 'border-amber-500/30',
      text: 'text-amber-400'
    }
  }
];

export const VIDEO_EPISODES: VideoEpisode[] = [
  // Plan A
  {
    id: 'a1',
    planId: 'plan-a',
    title: 'Episode 1: Introduction & Plan A Earning Foundation',
    duration: '05:20',
    description: 'Learn how Plan A works and understand how students make up to ₹1 Lakh a month doing simple digital tasks.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    isLocked: true
  },
  {
    id: 'a2',
    planId: 'plan-a',
    title: 'Episode 2: Creating Your Account and Verification',
    duration: '08:45',
    description: 'A complete screen-recording guide showing how to verify your account and register using Aadhar/PAN.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    isLocked: true
  },
  {
    id: 'a3',
    planId: 'plan-a',
    title: 'Episode 3: Finding Your First High-Paying Micro Task',
    duration: '12:15',
    description: 'How to bypass low paying jobs and go straight to ₹500 - ₹2000 per task opportunities.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    isLocked: true
  },
  {
    id: 'a4',
    planId: 'plan-a',
    title: 'Episode 4: Activating Recurring Income Links',
    duration: '10:30',
    description: 'Set up passive referral structures that earn you money even when you are sleeping.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    isLocked: true
  },
  {
    id: 'a5',
    planId: 'plan-a',
    title: 'Episode 5: Withdrawing Your Money to UPI/Paytm',
    duration: '06:50',
    description: 'Step-by-step withdrawal demo showing real-time transfer to Google Pay, PhonePe, and Bank Accounts.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    isLocked: true
  },
  {
    id: 'a6',
    planId: 'plan-a',
    title: 'Episode 6: 1 Hour Daily Workflow Blueprint',
    duration: '14:10',
    description: 'The exact daily routine checklist you need to copy-paste to ensure steady income streams.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    isLocked: true
  },
  {
    id: 'a7',
    planId: 'plan-a',
    title: 'Episode 7: Advanced Secrets to Double Your Daily Profit',
    duration: '11:25',
    description: 'Unlock multi-account setups and hidden portal hacks that expert earners use.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    isLocked: true
  },

  // Plan B
  {
    id: 'b1',
    planId: 'plan-b',
    title: 'Episode 1: The Plan B High-Earning Strategy Overview',
    duration: '06:15',
    description: 'Understand the big picture of Plan B. Why this system yields up to ₹3 Lakhs/month with 3 core ideas.',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    isLocked: true
  },
  {
    id: 'b2',
    planId: 'plan-b',
    title: 'Episode 2: Business Idea #1 - Premium Digital Agency Reselling',
    duration: '15:30',
    description: 'Set up a highly lucrative reselling flow of digital assets. No experience or technical skill required.',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    isLocked: true
  },
  {
    id: 'b3',
    planId: 'plan-b',
    title: 'Episode 3: Business Idea #2 - Automated Service Middleman',
    duration: '18:20',
    description: 'Leverage AI systems to fulfill services for international clients while keeping 90% of the margins.',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    isLocked: true
  },
  {
    id: 'b4',
    planId: 'plan-b',
    title: 'Episode 4: Business Idea #3 - License Arbitrage',
    duration: '14:45',
    description: 'Acquire content and software licenses cheap and distribute them to eager small businesses online.',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    isLocked: true
  },
  {
    id: 'b5',
    planId: 'plan-b',
    title: 'Episode 5: Crafting Mobile Landing Pages for Free',
    duration: '22:10',
    description: 'Build premium, conversion-optimized mobile-friendly landers in 15 minutes without writing a single line of code.',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    isLocked: true
  },
  {
    id: 'b6',
    planId: 'plan-b',
    title: 'Episode 6: Traffic Hack: Getting 1,000+ Potential Clients Daily',
    duration: '17:40',
    description: 'Our proprietary free traffic strategy using short-form videos (Reels/Shorts) to get flooded with orders.',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    isLocked: true
  },
  {
    id: 'b7',
    planId: 'plan-b',
    title: 'Episode 7: Collecting Auto-Payments using UPI QR Codes',
    duration: '11:05',
    description: 'Automate your checkout flow so clients pay you directly through QR codes and receive materials instantly.',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    isLocked: true
  },
  {
    id: 'b8',
    planId: 'plan-b',
    title: 'Episode 8: Under 18? How to set up Accounts Legally',
    duration: '09:15',
    description: 'Learn how to legally and safely use your parents Aadhar/PAN cards to verify bank details for payment collection.',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    isLocked: true
  },
  {
    id: 'b9',
    planId: 'plan-b',
    title: 'Episode 9: Scaling from ₹10k to ₹1 Lakh/month in 30 Days',
    duration: '20:35',
    description: 'Once you get your first sales, learn how to reinvest wisely, optimize and skyrocket your margins.',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    isLocked: true
  },
  {
    id: 'b10',
    planId: 'plan-b',
    title: 'Episode 10: Hiring Micro-Freelancers to Outsource All Work',
    duration: '13:50',
    description: 'Put your business on 100% autopilot by hiring virtual assistants to handle customer service and delivery.',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    isLocked: true
  },
  {
    id: 'b11',
    planId: 'plan-b',
    title: 'Episode 11: Case Study: Rohan\'s ₹2.5 Lakh Journey',
    duration: '25:10',
    description: 'Deep-dive interview and screen-share with Rohan, showing his actual dashboards and daily setup.',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    isLocked: true
  },
  {
    id: 'b12',
    planId: 'plan-b',
    title: 'Episode 12: Lifetime Upgrades and New Weekly Idea Drops',
    duration: '08:25',
    description: 'How to access new ideas that are added to the vault every month, for a lifetime, for free.',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    isLocked: true
  }
];

export const EARNING_ALERTS: EarningAlert[] = [
  { id: '1', name: 'Tanish', amount: 6810, plan: 'Plan B', time: 'just now' },
  { id: '2', name: 'Rohan', amount: 12500, plan: 'Plan B', time: '1 min ago' },
  { id: '3', name: 'Aman', amount: 3400, plan: 'Plan A', time: '3 mins ago' },
  { id: '4', name: 'Vikram', amount: 8250, plan: 'Plan B', time: '5 mins ago' },
  { id: '5', name: 'Pooja', amount: 1200, plan: 'Plan A', time: '7 mins ago' },
  { id: '6', name: 'Sandeep', amount: 14500, plan: 'Plan B', time: '9 mins ago' },
  { id: '7', name: 'Neha', amount: 4800, plan: 'Plan A', time: '12 mins ago' },
  { id: '8', name: 'Rajesh', amount: 19500, plan: 'Plan B', time: '15 mins ago' },
  { id: '9', name: 'Kunal', amount: 9800, plan: 'Plan B', time: '18 mins ago' },
  { id: '10', name: 'Ritu', amount: 2500, plan: 'Plan A', time: '22 mins ago' }
];

export const FAQS = [
  {
    questionHindi: 'क्या यह सचमुच काम करता है?',
    questionEnglish: 'Does this really work?',
    answerHindi: 'हाँ, बिल्कुल! यह 100% genuine बिज़नेस मॉडल्स पर आधारित है। हमारे 15,000+ स्टूडेंट्स रोज़ाना कमा रहे हैं। वीडियो में लाइव प्रूफ भी दिखाया गया है।',
    answerEnglish: 'Yes, absolutely! This is based on 100% genuine business models. Over 15,000+ students are earning daily. Live proof is also shown inside the videos.'
  },
  {
    questionHindi: 'मुझे काम शुरू करने के लिए क्या-क्या चाहिए?',
    questionEnglish: 'What do I need to start?',
    answerHindi: 'आपको सिर्फ एक स्मार्टफोन या लैपटॉप और एक इंटरनेट कनेक्शन की आवश्यकता है। बाकी सब कुछ हम वीडियो में बिल्कुल आसान भाषा में सिखाएंगे।',
    answerEnglish: 'You only need a smartphone or laptop and an internet connection. Everything else is taught in very easy language inside our step-by-step video courses.'
  },
  {
    questionHindi: 'पैसे कब और कैसे मिलेंगे?',
    questionEnglish: 'When and how will I get paid?',
    answerHindi: 'आपकी पूरी कमाई सीधे आपके बैंक अकाउंट, या UPI (PhonePe, Google Pay, Paytm) में क्रेडिट होगी। आप रोज़ाना अपनी कमाई को तुरंत ट्रांसफर कर सकते हैं।',
    answerEnglish: 'Your entire earnings will be credited directly to your Bank Account or UPI (PhonePe, Google Pay, Paytm). You can withdraw your earnings instantly on a daily basis.'
  },
  {
    questionHindi: 'अगर मेरी उम्र 18 साल से कम है तो?',
    questionEnglish: 'What if my age is under 18?',
    answerHindi: 'कोई चिंता की बात नहीं है! आप अपने माता-पिता या बड़े भाई-बहन के Aadhar Card, PAN Card और Bank Account का उपयोग करके पूरी तरह सुरक्षित रूप से पैसे प्राप्त कर सकते हैं।',
    answerEnglish: 'No worries at all! You can safely and legally use your parents or siblings Aadhar card, PAN card, and bank account to receive your payouts.'
  },
  {
    questionHindi: 'क्या प्लान खरीदने के बाद कोई और छुपा हुआ चार्ज है?',
    questionEnglish: 'Is there any hidden cost after buying a plan?',
    answerHindi: 'बिल्कुल नहीं! ये वन-टाइम पेमेंट (One-Time Payment) है। आपको लाइफटाइम के लिए सभी वीडियो और नए अपडेट्स बिल्कुल फ्री मिलेंगे।',
    answerEnglish: 'Absolutely not! This is a one-time payment. You will get lifetime access to all current video courses and all future business idea updates for free.'
  }
];
