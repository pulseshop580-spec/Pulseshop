import React from 'react';
import { Menu, ShoppingCart, Play } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  hasPurchased: boolean;
  onMenuClick: () => void;
  onCartClick: () => void;
}

export default function Header({ cartCount, hasPurchased, onMenuClick, onCartClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#13193e] text-white px-4 py-3 shadow-sm flex items-center justify-between border-b border-[#13193e]/50">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="p-1 hover:bg-slate-800/50 rounded-lg transition-colors active:scale-95"
          id="btn-sidebar-trigger"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        <span className="font-black text-xl tracking-wide text-white">
          Pulseshop
        </span>
      </div>

      <div className="flex items-center gap-4">
        {hasPurchased && (
          <a
            href="https://drive.google.com/drive/folders/1srUiWfChdz34SpmBzKFh8E8uXKm-Z4iA"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-black hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-black text-xs transition-all active:scale-95 shadow-lg border border-white/10"
            id="btn-header-play"
          >
            <span className="tracking-tighter">PLAY</span>
            <Play className="w-4 h-4 fill-white text-white" />
          </a>
        )}
        <button 
          onClick={onCartClick}
          className="relative p-1.5 hover:bg-slate-800/50 rounded-full transition-colors active:scale-95"
          id="btn-cart-trigger"
        >
          <ShoppingCart className="w-6 h-6 text-white" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce border-2 border-[#13193e]">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
