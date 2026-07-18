import React from 'react';
import { Home, Download, User, ShieldCheck, Play } from 'lucide-react';
import { Tab } from '../types';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  hasPurchasedAny: boolean;
  pendingOrdersCount?: number;
  isAdmin?: boolean;
}

export default function BottomNav({ activeTab, setActiveTab, hasPurchasedAny, pendingOrdersCount = 0, isAdmin }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-xl px-2 py-1.5 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around">
        
        {/* 1. Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
            activeTab === 'home'
              ? 'text-indigo-600 font-bold scale-105 bg-indigo-50/60'
              : 'text-slate-400 hover:text-slate-700'
          }`}
          id="nav-tab-home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-wide">Home</span>
        </button>

        {/* 2. Downloads / Play */}
        <a
          href={hasPurchasedAny ? "https://drive.google.com/drive/folders/1srUiWfChdz34SpmBzKFh8E8uXKm-Z4iA" : "#"}
          target={hasPurchasedAny ? "_blank" : undefined}
          rel={hasPurchasedAny ? "noopener noreferrer" : undefined}
          onClick={(e) => {
            if (!hasPurchasedAny) {
              e.preventDefault();
              setActiveTab('home');
              const plansSection = document.getElementById('plans-section');
              plansSection?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
            hasPurchasedAny ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-600'
          }`}
          id="nav-tab-downloads"
        >
          {hasPurchasedAny ? (
            <div className="relative">
              <Play className="w-5 h-5 fill-emerald-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full animate-ping"></span>
            </div>
          ) : (
            <Download className="w-5 h-5" />
          )}
          <span className="text-[10px] tracking-wide">{hasPurchasedAny ? 'PLAY' : 'Downloads'}</span>
        </a>

        {/* 3. Account */}
        <button
          onClick={() => setActiveTab('account')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
            activeTab === 'account'
              ? 'text-indigo-600 font-bold scale-105 bg-indigo-50/60'
              : 'text-slate-400 hover:text-slate-700'
          }`}
          id="nav-tab-account"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] tracking-wide">My Account</span>
        </button>

        {/* 4. Admin */}
        {isAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all relative ${
              activeTab === 'admin'
                ? 'text-red-600 font-bold scale-105 bg-red-50/60'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            id="nav-tab-admin"
          >
            <div className="relative">
              <ShieldCheck className="w-5 h-5" />
              {pendingOrdersCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[8px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[14px] text-center scale-90">
                  {pendingOrdersCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-wide">Admin</span>
          </button>
        )}
      </div>
    </nav>
  );
}
