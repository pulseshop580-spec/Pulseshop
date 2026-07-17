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

        {/* 2. Downloads (External Link) */}
        <a
          href="https://drive.google.com/drive/folders/1srUiWfChdz34SpmBzKFh8E8uXKm-Z4iA"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all text-slate-400 hover:text-emerald-600"
        >
          <Download className="w-5 h-5" />
          <span className="text-[10px] tracking-wide">Downloads</span>
        </a>

        {/* 2.5 Play (Shows after purchase) */}
        {hasPurchasedAny && (
          <button
            onClick={() => setActiveTab('home')}
            className="flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all text-indigo-600 hover:text-indigo-800"
          >
            <Play className="w-5 h-5 fill-indigo-600" />
            <span className="text-[10px] font-bold tracking-wide">Play</span>
          </button>
        )}

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
