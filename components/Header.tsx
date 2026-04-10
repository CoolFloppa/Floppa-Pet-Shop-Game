
import React from 'react';

interface HeaderProps {
  shopName: string;
  isShopOpen: boolean;
  onToggleShop: () => void;
  isNightmare?: boolean;
  onBackToMenu: () => void;
  onSave: () => void;
}

const Header: React.FC<HeaderProps> = ({ shopName, isShopOpen, onToggleShop, isNightmare, onBackToMenu, onSave }) => {
  return (
    <header className={`border-b shadow-sm sticky top-0 z-10 transition-colors duration-500 ${isNightmare ? 'bg-slate-900 border-slate-800 text-red-500' : 'bg-white border-amber-100'}`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl shadow-inner ${isNightmare ? 'bg-red-900' : 'bg-amber-400'}`}>
            {isNightmare ? '👹' : '🐆'}
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight ${isNightmare ? 'text-red-600' : 'text-amber-900'}`}>{shopName}</h1>
            <p className={`text-xs font-medium uppercase tracking-widest ${isNightmare ? 'text-red-800' : 'text-amber-600'}`}>Official Floppa Dealer</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
            {isNightmare && (
                <div className="hidden sm:block font-mono font-bold text-red-600 animate-pulse text-lg">
                    🕒 3:00 AM
                </div>
            )}

            <button 
              onClick={onSave}
              className={`px-3 py-1 rounded-full border text-xs font-bold transition active:scale-95 ${
                isNightmare 
                  ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white' 
                  : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
              }`}
            >
              💾 SAVE
            </button>

            <button 
              onClick={onBackToMenu}
              className={`px-3 py-1 rounded-full border text-xs font-bold transition active:scale-95 ${
                isNightmare 
                  ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white' 
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              EXIT
            </button>

            <button 
            onClick={onToggleShop}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border transition active:scale-95 ${
                isShopOpen 
                ? (isNightmare ? 'bg-red-900/30 border-red-800 text-red-500 hover:bg-red-900/50' : 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100') 
                : (isNightmare ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100')
            }`}
            title={isShopOpen ? "Click to Close Shop" : "Click to Open Shop"}
            >
            <span className={`w-2 h-2 rounded-full ${isShopOpen ? (isNightmare ? 'bg-red-600 animate-ping' : 'bg-green-500 animate-pulse') : 'bg-red-500'}`}></span>
            <span className="text-xs font-bold w-12 text-center">{isShopOpen ? 'OPEN' : 'CLOSED'}</span>
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
