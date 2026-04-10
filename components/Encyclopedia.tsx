
import React from 'react';

interface EncyclopediaProps {
  unlocked: string[];
  isNightmare?: boolean;
}

const RARITY_INFO: Record<string, { color: string; description: string; valueRange: string; icon: string; stats: string }> = {
  'Common': {
    color: 'text-slate-600 bg-slate-100 border-slate-200',
    description: "The standard domestic Floppa. Loves cubes and mild scratches. Reliable but basic.",
    valueRange: "50 - 150 🪙",
    icon: "🐈",
    stats: "Happiness Decay: Normal | Hunger: Normal"
  },
  'Rare': {
    color: 'text-green-600 bg-green-50 border-green-200',
    description: "A Floppa with distinctive ear tufts. Slightly more demanding but customers love them.",
    valueRange: "150 - 350 🪙",
    icon: "🐆",
    stats: "Happiness Decay: +10% | Value: +50%"
  },
  'Epic': {
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    description: "An impressive specimen. Can hiss in 3 octaves. Requires gourmet kibble.",
    valueRange: "350 - 800 🪙",
    icon: "🐅",
    stats: "Happiness Decay: +25% | Value: +150%"
  },
  'Legendary': {
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    description: "The Golden Floppa. Rumored to control the cement market. Extremely volatile.",
    valueRange: "800 - 2000+ 🪙",
    icon: "👑",
    stats: "Happiness Decay: +50% | Value: +400%"
  }
};

const Encyclopedia: React.FC<EncyclopediaProps> = ({ unlocked, isNightmare }) => {
  const rarities = ['Common', 'Rare', 'Epic', 'Legendary'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className={`p-6 rounded-2xl shadow-md text-center ${isNightmare ? 'bg-slate-800 text-red-500 border border-red-900' : 'bg-amber-100 text-amber-900 border border-amber-200'}`}>
        <h2 className="text-3xl font-bold mb-2">📚 Floppa Encyclopedia</h2>
        <p className={`text-sm ${isNightmare ? 'text-slate-400' : 'text-amber-700'}`}>
          Track your discovered Caracal breeds and their characteristics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {rarities.map((rarity) => {
          const isUnlocked = unlocked.includes(rarity);
          const info = RARITY_INFO[rarity];
          
          if (!isUnlocked) {
            return (
              <div key={rarity} className={`p-6 rounded-2xl border-2 border-dashed flex items-center gap-4 opacity-70 ${isNightmare ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-3xl grayscale">
                  🔒
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-400">???</h3>
                  <p className="text-sm text-slate-400">Discover this breed to unlock details.</p>
                </div>
              </div>
            );
          }

          return (
            <div key={rarity} className={`p-6 rounded-2xl border-2 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm transition-transform hover:scale-[1.01] ${isNightmare ? 'bg-slate-900 border-red-900' : 'bg-white border-amber-100'}`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-5xl shrink-0 shadow-inner ${isNightmare ? 'bg-slate-800 grayscale' : info.color.split(' ')[1]}`}>
                {info.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className={`font-bold text-2xl ${isNightmare ? 'text-red-400' : info.color.split(' ')[0]}`}>{rarity} Floppa</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold border uppercase ${isNightmare ? 'bg-slate-800 text-slate-400 border-slate-600' : info.color}`}>
                    Discovered
                  </span>
                </div>
                
                <p className={`mb-3 italic ${isNightmare ? 'text-slate-400' : 'text-slate-600'}`}>
                  "{info.description}"
                </p>
                
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm p-3 rounded-xl ${isNightmare ? 'bg-black/40' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">💰 Value Range:</span>
                    <span className={isNightmare ? 'text-red-300' : 'text-amber-600 font-bold'}>{info.valueRange}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">📊 Base Stats:</span>
                    <span className={isNightmare ? 'text-slate-300' : 'text-slate-600'}>{info.stats}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.4s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default Encyclopedia;
