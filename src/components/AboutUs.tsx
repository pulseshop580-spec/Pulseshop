import React from 'react';
import { Info, ArrowLeft, Users, Lightbulb, TrendingUp } from 'lucide-react';

interface AboutUsProps {
  onBack: () => void;
}

export default function AboutUs({ onBack }: AboutUsProps) {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10 flex items-center gap-3">
        <button onClick={onBack} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">About Us</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center">
          <div className="flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-full mx-auto mb-6">
            <Info className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4 font-sans tracking-tight">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            Humara maqsad hai har kisi ko entrepreneur banana. Hum aise unique aur low-investment business ideas provide karte hain jo aapki life badal sakte hain.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xl">50+</h3>
              <p className="text-slate-500 text-sm">Business Ideas</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xl">10,000+</h3>
              <p className="text-slate-500 text-sm">Happy Students</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xl">95%</h3>
              <p className="text-slate-500 text-sm">Success Rate</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Why Choose Us?</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                <span className="text-indigo-600 font-bold text-xs">1</span>
              </div>
              <p className="text-slate-600">Expert video training for every single business idea.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                <span className="text-indigo-600 font-bold text-xs">2</span>
              </div>
              <p className="text-slate-600">Lifetime support and access to our growing community.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                <span className="text-indigo-600 font-bold text-xs">3</span>
              </div>
              <p className="text-slate-600">Verified and tested methods that actually work in real life.</p>
            </div>
          </div>
        </div>

        <div className="text-center pb-8">
          <p className="text-slate-400 text-sm">© 2026 Pulse Shop. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
