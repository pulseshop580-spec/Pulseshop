import React from 'react';
import { X, BookOpen, Star, HelpCircle, PhoneCall, ShieldCheck, Heart, FileText, Info, Play } from 'lucide-react';
import { Tab } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavToTab: (tab: Tab) => void;
  isAdmin?: boolean;
  purchasedPlans: string[];
}

export default function Sidebar({ isOpen, onClose, onNavToTab, isAdmin, purchasedPlans }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex" id="sidebar-container">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative flex w-full max-w-xs flex-col bg-white border-r border-slate-200 text-slate-900 p-6 shadow-2xl h-full animate-slide-in">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-base">
              PS
            </div>
            <span className="font-extrabold text-lg bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent lowercase">
              pulseshop
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-950"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
          {/* Main Links */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase px-2">Navigation</span>
            <button
              onClick={() => { onNavToTab('home'); onClose(); }}
              className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-indigo-900 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-indigo-500" />
              <span>Home</span>
            </button>
            <button
              onClick={() => { onNavToTab('privacy'); onClose(); }}
              className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-indigo-900 transition-colors"
            >
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              <span>Privacy Policy</span>
            </button>
            <button
              onClick={() => { onNavToTab('refund'); onClose(); }}
              className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-indigo-900 transition-colors"
            >
              <FileText className="w-5 h-5 text-indigo-500" />
              <span>Refund Policy</span>
            </button>
            <button
              onClick={() => { onNavToTab('about'); onClose(); }}
              className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-indigo-900 transition-colors"
            >
              <Info className="w-5 h-5 text-indigo-500" />
              <span>About</span>
            </button>
            <button
              onClick={() => { onNavToTab('account'); onClose(); }}
              className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-indigo-900 transition-colors"
            >
              <Star className="w-5 h-5 text-indigo-500" />
              <span>User Profile (प्रोफ़ाइल)</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => { onNavToTab('admin'); onClose(); }}
                className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl hover:bg-red-50 text-slate-700 hover:text-red-900 transition-colors border-t border-slate-100 pt-2"
              >
                <ShieldCheck className="w-5 h-5 text-red-500" />
                <span className="font-bold text-red-600">Admin Panel (एडमिन पैनल)</span>
              </button>
            )}
            
            {/* Moved Download Link here */}
            <div className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors">
              <button
                onClick={() => { onNavToTab('home'); onClose(); }}
                className="flex items-center gap-3 text-left hover:text-indigo-900"
              >
                <FileText className="w-5 h-5 text-emerald-500" />
                <span>Downloads (डाउनलोड)</span>
              </button>
              
              {purchasedPlans.length > 0 && (
                <a
                  href="https://drive.google.com/drive/folders/1srUiWfChdz34SpmBzKFh8E8uXKm-Z4iA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-black hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg font-black text-[10px] transition-all active:scale-95 shadow-md border border-white/10"
                  onClick={onClose}
                >
                  <span>PLAY</span>
                  <Play className="w-3 h-3 fill-white text-white" />
                </a>
              )}
            </div>
          </div>


          {/* Quick Help Box */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-600">Help & Support</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              अगर आपको कोई समस्या हो, तो आप सीधे हमारे AI सपोर्ट या व्हाट्सएप हेल्पडेस्क से जुड़ सकते हैं।
            </p>
            <button 
              onClick={() => { onNavToTab('account'); onClose(); }}
              className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-colors"
            >
              Support Chat
            </button>
          </div>

          {/* Guarantee stamp */}
          <div className="flex items-start gap-2.5 text-slate-600 text-xs mt-auto">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">100% Genuine Program</p>
              <p className="text-[11px] text-slate-500 leading-tight">Verified by pulseshop community learning network.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 mt-6 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
          Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Indian Entrepreneurs
        </div>
      </div>
    </div>
  );
}
