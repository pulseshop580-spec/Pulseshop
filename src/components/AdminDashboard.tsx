import React, { useState } from 'react';
import { 
  Check, X, Clock, User, Phone, Mail, Calendar, 
  DollarSign, Eye, ShieldCheck, AlertCircle, Trash2, HelpCircle 
} from 'lucide-react';
import { Order } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  onApprove: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onDeleteOrder?: (orderId: string) => void;
  onAddDemoOrder?: () => void;
  onGoToHome: () => void;
}

export default function AdminDashboard({ 
  orders, 
  onApprove, 
  onReject, 
  onDeleteOrder,
  onAddDemoOrder,
  onGoToHome 
}: AdminDashboardProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="flex flex-col gap-5 px-4 py-3 pb-24 max-w-md mx-auto" id="admin-dashboard">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Pulseshop Admin Control Panel
        </span>
        <h2 className="text-2xl font-black text-slate-900">Order Approvals</h2>
        <p className="text-xs text-slate-500">
          यहाँ से आप ग्राहकों द्वारा भेजे गए भुगतान के स्क्रीनशॉट देखकर उनके कोर्स और डिजिटल प्रोडक्ट डाउनलोड अनलॉक कर सकते हैं।
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-left">
          <p className="text-[10px] text-amber-700 font-bold uppercase">Pending Approvals</p>
          <p className="text-2xl font-black text-amber-800 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-left">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Total Orders</p>
          <p className="text-2xl font-black text-slate-800 mt-1">{orders.length}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 p-1 bg-slate-200/50 border border-slate-300/40 rounded-xl text-xs">
        {(['pending', 'approved', 'rejected', 'all'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-2 text-center font-bold capitalize rounded-lg transition-all ${
              filter === tab
                ? 'bg-white text-[#13193e] shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab === 'pending' ? `Pending (${pendingCount})` : tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              इस फ़िल्टर में कोई ऑर्डर नहीं मिला!
            </p>
            {filter === 'pending' && onAddDemoOrder && (
              <button
                onClick={onAddDemoOrder}
                className="mt-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                + सिमुलेट करें डेमो आर्डर (Add Demo Order)
              </button>
            )}
          </div>
        ) : (
          filteredOrders.map(order => (
            <div 
              key={order.id} 
              className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs text-left flex flex-col gap-3 relative overflow-hidden"
            >
              {/* Order Header / Badge */}
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                <span className="text-xs font-black text-slate-800">
                  Order #{order.id}
                </span>
                <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  order.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : order.status === 'rejected'
                    ? 'bg-red-50 text-red-800 border-red-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                }`}>
                  {order.status === 'pending' ? 'Pending Approval' : order.status}
                </span>
              </div>

              {/* Customer Details */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="font-extrabold text-slate-800">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="font-medium text-slate-600 font-mono">+91 {order.customerPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="font-medium text-slate-600 select-all break-all">{order.customerEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="font-medium text-slate-500">{order.date}</span>
                </div>
              </div>

              {/* Purchase Plan details */}
              <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-150 flex justify-between items-center">
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Purchased Plan</p>
                  <p className="text-xs font-black text-[#13193e] mt-1">{order.planName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Amount Paid</p>
                  <p className="text-xs font-black text-emerald-600 mt-1">₹{order.amount}</p>
                </div>
              </div>

              {/* Screenshot Proof Section */}
              {order.screenshot && (
                <div className="flex flex-col gap-1.5 mt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Payment Proof Screenshot</span>
                  <div className="relative group max-w-[120px]">
                    <img 
                      src={order.screenshot} 
                      alt="Payment proof" 
                      className="w-24 h-18 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedScreenshot(order.screenshot)}
                    />
                    <button 
                      onClick={() => setSelectedScreenshot(order.screenshot)}
                      className="absolute bottom-1 right-1 bg-slate-900/70 p-1 rounded-md text-white hover:bg-slate-900 transition-colors"
                      title="View full screen"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Admin Actions */}
              {order.status === 'pending' && (
                <div className="flex gap-2.5 mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onReject(order.id)}
                    className="flex-1 border border-red-200 hover:bg-red-50 text-red-700 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Reject (अस्वीकार)
                  </button>
                  <button
                    onClick={() => onApprove(order.id)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    Approve (मंजूर)
                  </button>
                </div>
              )}

              {/* Delete Order option for cleanliness */}
              {onDeleteOrder && (
                <button
                  onClick={() => {
                    if (confirm('क्या आप इस ऑर्डर को डिलीट करना चाहते हैं?')) {
                      onDeleteOrder(order.id);
                    }
                  }}
                  className="absolute bottom-4 right-4 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 transition-colors"
                  title="Delete Order Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Screenshot Overlay Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="relative max-w-sm w-full bg-white rounded-2xl overflow-hidden p-3 shadow-2xl flex flex-col items-center">
            <button 
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-2 right-2 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full flex justify-center py-4 bg-slate-50 rounded-xl">
              <img 
                src={selectedScreenshot} 
                alt="Payment proof full preview" 
                className="max-h-[70vh] object-contain rounded-lg shadow-sm"
              />
            </div>
            <div className="mt-3 text-center w-full">
              <p className="text-xs text-slate-500 font-bold uppercase">Payment Receipt Screenshot</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
