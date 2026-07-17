import React from 'react';
import { RotateCcw, ArrowLeft } from 'lucide-react';

interface RefundPolicyProps {
  onBack: () => void;
}

export default function RefundPolicy({ onBack }: RefundPolicyProps) {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10 flex items-center gap-3">
        <button onClick={onBack} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Refund Policy</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-2xl mx-auto mb-2">
            <RotateCcw className="w-8 h-8 text-red-600" />
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Digital Product Nature</h2>
            <p className="text-slate-600 leading-relaxed">
              Our business idea plans and training videos are digital products. Once access is granted (order approved), the content is considered "consumed" or "delivered."
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Refund Eligibility</h2>
            <p className="text-slate-600 leading-relaxed font-semibold text-red-600">
              Due to the digital nature of our content, we generally do not offer refunds once an order has been approved and access has been provided.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Cancellation Before Approval</h2>
            <p className="text-slate-600 leading-relaxed">
              If you have submitted an order but it has not yet been approved by our admin team, you may contact us for a cancellation and refund. Once approved, no refunds will be processed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Support & Issues</h2>
            <p className="text-slate-600 leading-relaxed">
              If you are facing technical difficulties accessing the videos or content after purchase, please contact our support team immediately. We will ensure any technical issues are resolved so you can access your purchase.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm italic">
              Please choose your plan carefully. If you have questions before buying, contact our team.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
