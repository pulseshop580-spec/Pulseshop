import React from 'react';
import { Plan } from '../types';

interface ThankYouViewProps {
  plan: Plan;
  orderId: string;
  email: string;
  onProceed: () => void;
}

export default function ThankYouView({ plan, orderId, email, onProceed }: ThankYouViewProps) {
  const getCurrentFormattedDate = () => {
    const months = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    const d = new Date();
    return `${months[d.getMonth()]} ${d.getDate()}, 2026`;
  };

  return (
    <div className="flex-1 flex flex-col animate-fadeIn bg-white select-text text-slate-900" id="thank-you-view">
      <div className="p-5 md:p-8 flex-1 flex flex-col justify-between min-h-[550px] sm:min-h-[580px]">
        
        <div className="flex-1 flex flex-col items-center justify-start max-w-md mx-auto w-full pt-4 pb-2">
          
          <div className="border-[2px] border-dashed border-[#719351] rounded-2xl p-6 bg-white text-center mb-7 w-full select-text">
            <p className="text-[#719351] text-[18px] md:text-[20px] font-bold leading-relaxed tracking-normal">
              आपका Order हमें मिल गया है हम जल्दी ही Transaction देख कर आपके Order को पूरा कर देंगे फिर आप Download बटन पर क्लिक करके Video को Download कर सकते हैं!
            </p>
          </div>

          <div className="w-full flex flex-col select-text mt-4">
            <div className="flex flex-col items-center justify-center text-center pt-6 pb-5">
              <span className="text-[#8a8a8a] text-[15px] md:text-[16px] font-normal tracking-wide">Order number:</span>
              <span className="text-[18px] md:text-[19px] font-bold text-slate-900 mt-2.5 tracking-normal">{orderId}</span>
            </div>
            <div className="border-t border-[#e2e8f0] w-full" />

            <div className="flex flex-col items-center justify-center text-center pt-6 pb-5">
              <span className="text-[#8a8a8a] text-[15px] md:text-[16px] font-normal tracking-wide">Date:</span>
              <span className="text-[18px] md:text-[19px] font-bold text-slate-900 mt-2.5 tracking-normal">{getCurrentFormattedDate()}</span>
            </div>
            <div className="border-t border-[#e2e8f0] w-full" />

            <div className="flex flex-col items-center justify-center text-center pt-6 pb-5">
              <span className="text-[#8a8a8a] text-[15px] md:text-[16px] font-normal tracking-wide">Email:</span>
              <span className="text-[18px] md:text-[19px] font-bold text-slate-900 mt-2.5 select-all break-all px-2 tracking-normal">{email}</span>
            </div>
            <div className="border-t border-[#e2e8f0] w-full mb-8" />
          </div>

          <div className="w-full mt-2">
            <button
              type="button"
              onClick={onProceed}
              className="w-full bg-[#0051fa] hover:bg-[#0041cb] text-white font-bold text-sm md:text-[15px] py-4 px-6 rounded-md shadow-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center uppercase tracking-wide"
            >
              Proceed to Downloads / Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
