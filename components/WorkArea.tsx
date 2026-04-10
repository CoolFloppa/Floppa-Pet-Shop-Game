
import React, { useState } from 'react';
import { WORK_PAYOUTS, KIBBLE_COST_PER_TASK } from '../constants';
import CleanEnclosureMinigame from './CleanEnclosureMinigame';
import PrepareKibbleMinigame from './PrepareKibbleMinigame';
import BathFloppaMinigame from './BathFloppaMinigame';

interface WorkAreaProps {
  onWorkComplete: (amount: number) => void;
  onKibbleWorkComplete: (amount: number) => void;
  kibbleAmount: number;
}

const WorkArea: React.FC<WorkAreaProps> = ({ onWorkComplete, onKibbleWorkComplete, kibbleAmount }) => {
  const [working, setWorking] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showCleaningMinigame, setShowCleaningMinigame] = useState(false);
  const [showKibbleMinigame, setShowKibbleMinigame] = useState(false);
  const [showBathMinigame, setShowBathMinigame] = useState(false);

  const startWork = (type: keyof typeof WORK_PAYOUTS, duration: number) => {
    if (working) return;
    
    // Check if it's the cleaning task to launch minigame
    if (type === 'CLEAN_ENCLOSURE') {
      setShowCleaningMinigame(true);
      return;
    }

    // Check if it's the kibble task to launch minigame
    if (type === 'PREPARE_KIBBLE') {
      // Logic check again just in case
      if (kibbleAmount < KIBBLE_COST_PER_TASK) {
        alert("Not enough Kibble in storage! Go to the shop.");
        return;
      }
      setShowKibbleMinigame(true);
      return;
    }

    // Check for Bath Minigame
    if (type === 'BATH_FLOPPA') {
      setShowBathMinigame(true);
      return;
    }

    // Default timer logic for other tasks (Socialize)
    setWorking(type);
    setProgress(0);
    
    const interval = 100;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const percent = (currentStep / steps) * 100;
      setProgress(percent);

      if (currentStep >= steps) {
        clearInterval(timer);
        onWorkComplete(WORK_PAYOUTS[type]);
        setWorking(null);
        setProgress(0);
      }
    }, interval);
  };

  const handleCleaningComplete = () => {
    onWorkComplete(WORK_PAYOUTS.CLEAN_ENCLOSURE);
    setShowCleaningMinigame(false);
  };

  const handleKibbleComplete = () => {
    onKibbleWorkComplete(WORK_PAYOUTS.PREPARE_KIBBLE);
    setShowKibbleMinigame(false);
  };

  const handleBathComplete = () => {
    onWorkComplete(WORK_PAYOUTS.BATH_FLOPPA);
    setShowBathMinigame(false);
  };

  return (
    <div className="space-y-4">
      {showCleaningMinigame && (
        <CleanEnclosureMinigame 
          onComplete={handleCleaningComplete} 
          onCancel={() => setShowCleaningMinigame(false)} 
        />
      )}

      {showKibbleMinigame && (
        <PrepareKibbleMinigame 
          onComplete={handleKibbleComplete} 
          onCancel={() => setShowKibbleMinigame(false)} 
        />
      )}

      {showBathMinigame && (
        <BathFloppaMinigame 
          onComplete={handleBathComplete} 
          onCancel={() => setShowBathMinigame(false)} 
        />
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🔨 Work Station
            {working && <span className="text-sm font-normal text-amber-600 animate-pulse">(Busy working...)</span>}
          </h2>
          
          {/* Kibble Storage Meter */}
          <div className="flex flex-col items-end w-32">
             <div className="flex justify-between w-full text-[10px] font-bold uppercase text-amber-800 mb-1">
               <span>Storage</span>
               <span>{kibbleAmount} units</span>
             </div>
             <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden border border-slate-300 relative">
               <div 
                 className={`h-full transition-all duration-500 ${kibbleAmount < 10 ? 'bg-red-500' : 'bg-amber-600'}`}
                 style={{ width: `${Math.min(100, kibbleAmount)}%` }} // Assuming 100 visual cap for bar or just filling it up
               ></div>
               {/* Stripe pattern */}
               <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem'}}></div>
             </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <button 
            disabled={!!working || kibbleAmount < KIBBLE_COST_PER_TASK}
            onClick={() => startWork('PREPARE_KIBBLE', 0)}
            className={`group p-4 rounded-xl border-2 transition text-left flex items-center justify-between ${
              working === 'PREPARE_KIBBLE' ? 'border-amber-400 bg-amber-50' : 'border-slate-100 hover:border-amber-200'
            } ${working && working !== 'PREPARE_KIBBLE' ? 'opacity-50' : ''} ${kibbleAmount < KIBBLE_COST_PER_TASK ? 'opacity-60 bg-slate-50 cursor-not-allowed' : ''}`}
          >
            <div>
              <p className="font-bold text-lg flex items-center gap-2">
                🥣 Prepare Kibble
                {kibbleAmount < KIBBLE_COST_PER_TASK && (
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase">Empty</span>
                )}
              </p>
              <p className="text-sm text-slate-500">Shake bag to fill bowl!</p>
              <p className="text-xs font-bold text-amber-700 mt-1">Cost: {KIBBLE_COST_PER_TASK} Kibble</p>
            </div>
            <div className="text-right">
              <span className="block font-bold text-amber-600">+{WORK_PAYOUTS.PREPARE_KIBBLE} 🪙</span>
              <span className="text-xs text-slate-400">Manual</span>
            </div>
          </button>

          <button 
            disabled={!!working}
            onClick={() => startWork('CLEAN_ENCLOSURE', 0)} 
            className={`group p-4 rounded-xl border-2 transition text-left flex items-center justify-between ${
              working === 'CLEAN_ENCLOSURE' ? 'border-amber-400 bg-amber-50' : 'border-slate-100 hover:border-amber-200'
            } ${working && working !== 'CLEAN_ENCLOSURE' ? 'opacity-50' : ''}`}
          >
            <div>
              <p className="font-bold text-lg">🧹 Clean Enclosure</p>
              <p className="text-sm text-slate-500">Drag broom to clean!</p>
            </div>
            <div className="text-right">
              <span className="block font-bold text-amber-600">+{WORK_PAYOUTS.CLEAN_ENCLOSURE} 🪙</span>
              <span className="text-xs text-slate-400">Manual</span>
            </div>
          </button>

          <button 
            disabled={!!working}
            onClick={() => startWork('BATH_FLOPPA', 0)} 
            className={`group p-4 rounded-xl border-2 transition text-left flex items-center justify-between ${
              working === 'BATH_FLOPPA' ? 'border-amber-400 bg-amber-50' : 'border-slate-100 hover:border-amber-200'
            } ${working && working !== 'BATH_FLOPPA' ? 'opacity-50' : ''}`}
          >
            <div>
              <p className="font-bold text-lg">🛁 Bath Floppa</p>
              <p className="text-sm text-slate-500">Soap & Rinse the Floppa!</p>
            </div>
            <div className="text-right">
              <span className="block font-bold text-amber-600">+{WORK_PAYOUTS.BATH_FLOPPA} 🪙</span>
              <span className="text-xs text-slate-400">Manual</span>
            </div>
          </button>

          <button 
            disabled={!!working}
            onClick={() => startWork('SOCIALIZE_FLOPPA', 10000)}
            className={`group p-4 rounded-xl border-2 transition text-left flex items-center justify-between ${
              working === 'SOCIALIZE_FLOPPA' ? 'border-amber-400 bg-amber-50' : 'border-slate-100 hover:border-amber-200'
            } ${working && working !== 'SOCIALIZE_FLOPPA' ? 'opacity-50' : ''}`}
          >
            <div>
              <p className="font-bold text-lg">🎭 Socialize Floppa</p>
              <p className="text-sm text-slate-500">Expert-level floppa bonding</p>
            </div>
            <div className="text-right">
              <span className="block font-bold text-amber-600">+{WORK_PAYOUTS.SOCIALIZE_FLOPPA} 🪙</span>
              <span className="text-xs text-slate-400">10s</span>
            </div>
          </button>
        </div>

        {working && (
          <div className="mt-6">
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-amber-400 h-full transition-all duration-100" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">
              Processing... {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkArea;
