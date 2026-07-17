import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10 flex items-center gap-3">
        <button onClick={onBack} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Privacy Policy</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-2xl mx-auto mb-2">
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Information Collection</h2>
            <p className="text-slate-600 leading-relaxed">
              We collect information that you provide directly to us when you create an account, purchase a plan, or contact our support team. This includes your name, email address, phone number, and payment confirmation details.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Use of Information</h2>
            <p className="text-slate-600 leading-relaxed">
              We use the collected information to process your orders, provide access to purchased business ideas/videos, send important updates about your account, and improve our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Data Security</h2>
            <p className="text-slate-600 leading-relaxed">
              We implement industry-standard security measures to protect your personal information. Your payment screenshots and contact details are stored securely and are only accessible by authorized administrators.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Third-Party Sharing</h2>
            <p className="text-slate-600 leading-relaxed">
              We do not sell or rent your personal information to third parties. We only share data necessary for processing payments or as required by law.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm italic">
              Last Updated: July 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
