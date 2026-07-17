import React from 'react';

export default function ThreeStepSlider() {
  const steps = [
    {
      step: 'STEP 1',
      description: 'सबसे पहले Plan B Business Idea डाउनलोड करें। डाउनलोड करते ही आपको 4 बिज़नेस आइडिया की Setup Videos मिल जाएंगी।'
    },
    {
      step: 'STEP 2',
      description: 'वीडियो देखकर अपने मोबाइल या लैपटॉप से Online Business Setup करें। हर वीडियो में पूरा Process आसान भाषा में बताया गया है।'
    },
    {
      step: 'STEP 3',
      description: 'पैसे प्राप्त करने के लिए बस Aadhar, PAN और Bank Account चाहिए और उम्र 18 साल से कम है तो आप अपने माता-पिता के Documents का Use कर सकते हैं'
    }
  ];

  return (
    <div className="px-3 py-2 bg-[#fafafa]" id="three-step-grid-container">
      <div className="grid grid-cols-3 gap-1.5 md:gap-4 max-w-4xl mx-auto">
        {steps.map((item, index) => (
          <div 
            key={index} 
            className="bg-white border border-slate-200/60 rounded-sm p-2 md:p-5 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col items-center justify-start min-h-[115px] md:min-h-[180px] transition-all"
          >
            {/* Step Header: Dark Green, centered, bold, no line under it */}
            <span className="text-[9.5px] md:text-[13px] font-black text-[#1b5e20] uppercase tracking-wider block mb-1.5 md:mb-3 font-sans">
              {item.step}
            </span>
            
            {/* Step Description in Hindi: Centered, slate-500/600, elegant line-height */}
            <p className="text-[8px] leading-[1.35] md:text-[11.5px] text-slate-500 font-medium text-center">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

