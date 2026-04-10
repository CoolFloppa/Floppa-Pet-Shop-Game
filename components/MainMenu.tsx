
import React, { useState } from 'react';

interface MainMenuProps {
  onStart: (difficulty: 'normal' | 'nightmare', isWinter: boolean) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart }) => {
  const [isWinter, setIsWinter] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-1000 ${isWinter ? 'bg-slate-200' : 'bg-amber-50'}`}>
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      {isWinter && (
        <div className="absolute inset-0 pointer-events-none">
           {[...Array(20)].map((_, i) => (
             <div key={i} className="snowflake text-2xl" style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${5 + Math.random() * 5}s`,
                animationDelay: `-${Math.random() * 5}s`,
                opacity: 0.7
             }}>❄️</div>
           ))}
        </div>
      )}

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border-4 border-amber-200 p-8 text-center relative z-10">
        <div className="mb-6 animate-bounce">
          <span className="text-8xl">{isWinter ? '☃️' : '🐆'}</span>
        </div>
        
        <h1 className="text-4xl font-black text-amber-900 mb-2">FLOPPA HAVEN</h1>
        <p className="text-amber-600 font-bold uppercase tracking-widest mb-8">The Pet Shop Simulator</p>

        {/* Winter Toggle */}
        <div className="mb-8 flex justify-center">
            <button 
                onClick={() => setIsWinter(!isWinter)}
                className={`flex items-center gap-3 px-4 py-2 rounded-full border-2 transition-all ${
                    isWinter ? 'bg-blue-50 border-blue-400' : 'bg-slate-50 border-slate-200'
                }`}
            >
                <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${isWinter ? 'bg-blue-500 border-blue-600 text-white' : 'bg-white border-slate-300'}`}>
                    {isWinter && '✓'}
                </div>
                <span className={`font-bold ${isWinter ? 'text-blue-600' : 'text-slate-400'}`}>
                    ❄️ Winter Mode
                </span>
            </button>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => onStart('normal', isWinter)}
            className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-black text-xl shadow-lg transform transition hover:scale-105 active:scale-95 border-b-4 border-green-700"
          >
            🌞 PLAY NORMAL
          </button>

          <div className="relative group">
            <button 
              onClick={() => onStart('nightmare', isWinter)}
              className="w-full py-4 bg-slate-800 hover:bg-red-950 text-red-500 hover:text-red-600 rounded-xl font-black text-xl shadow-lg transform transition hover:scale-105 active:scale-95 border-b-4 border-black flex items-center justify-center gap-2 group-hover:animate-pulse"
            >
              <span>💀</span> NIGHTMARE MODE <span>💀</span>
            </button>
            
            {/* Warning Tooltip/Box */}
            <div className="mt-2 bg-black text-red-500 text-xs font-bold p-3 rounded-lg border border-red-600">
              <p className="animate-pulse">⚠️ WARNING ⚠️</p>
              <p>IF YOU PLAY IN NIGHTMARE MODE THEN DO IT AT YOUR OWN RISK!!!</p>
              <ul className="text-left mt-2 space-y-1 list-disc list-inside text-slate-400">
                <li>Permadeath on Customer Rage</li>
                <li>Creepy Atmosphere</li>
                <li>Eternal 3:00 AM</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs text-slate-400 font-bold">
          v1.1.0 • Winter Update • Hand-raised Caracals Only
        </p>
      </div>
    </div>
  );
};

export default MainMenu;
