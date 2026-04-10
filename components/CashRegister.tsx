
import React, { useState, useEffect } from 'react';
import { Floppa } from '../types';

interface CashRegisterProps {
  floppa: Floppa;
  onComplete: () => void;
  onCancel: () => void;
  onTimeout: () => void;
}

type RagePhase = 'none' | 'incident' | 'alarm' | 'arrest';

const CashRegister: React.FC<CashRegisterProps> = ({ floppa, onComplete, onCancel, onTimeout }) => {
  const [step, setStep] = useState<'conveyor' | 'scanner' | 'bagged'>('conveyor');
  const [position, setPosition] = useState('left-10');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFailed, setIsFailed] = useState(false);
  const [ragePhase, setRagePhase] = useState<RagePhase>('none');

  useEffect(() => {
    if (step === 'bagged' || isFailed) return;
    if (timeLeft <= 0) { setIsFailed(true); setRagePhase('incident'); return; }
    const timer = setInterval(() => { setTimeLeft(prev => prev - 1); }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, step, isFailed]);

  useEffect(() => {
    if (ragePhase === 'incident') { setTimeout(() => { setRagePhase('alarm'); }, 2000); } 
    else if (ragePhase === 'alarm') { setTimeout(() => { setRagePhase('arrest'); }, 5000); }
    else if (ragePhase === 'arrest') { setTimeout(() => { onTimeout(); }, 6000); }
  }, [ragePhase, onTimeout]);

  useEffect(() => {
    if (isFailed) return;
    if (step === 'scanner') { setPosition('left-1/2 -translate-x-1/2 scale-110 rotate-12'); } 
    else if (step === 'bagged') {
      setPosition('left-[80%] scale-50 opacity-0 translate-y-10');
      const timer = setTimeout(() => { onComplete(); }, 800);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete, isFailed]);

  const handleClick = () => { if (!isFailed && step !== 'bagged') { setStep(prev => prev === 'conveyor' ? 'scanner' : 'bagged'); } };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className={`bg-white rounded-3xl shadow-2xl max-w-2xl w-full border-4 overflow-hidden relative transition-all duration-300 ${isFailed ? (ragePhase === 'arrest' ? 'border-blue-800' : 'border-red-500') : 'border-amber-200'}`}>
        {ragePhase === 'alarm' && (
           <div className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center animate-alarm-bg overflow-hidden">
              <div className="absolute top-10 w-full bg-yellow-400 text-black font-black text-xl py-2 transform -rotate-1">🚧 SECURITY BREACH 🚧</div>
              <div className="space-y-4 relative z-10 px-4">
                 <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-md animate-pulse">CUSTOMER RAGE!</h1>
                 <button onClick={() => setRagePhase('arrest')} className="mt-4 px-6 py-3 bg-white text-red-600 font-black rounded-full border-4 border-red-600 shadow-xl">⏩ Skip Police Arrival</button>
              </div>
           </div>
        )}
        
        {ragePhase !== 'alarm' && (
          <div className={`p-4 flex justify-between items-center border-b transition-colors duration-300 ${ragePhase === 'arrest' ? 'bg-blue-800' : ragePhase === 'incident' ? 'bg-red-600' : 'bg-amber-400'}`}>
            <h2 className="text-xl font-black text-white uppercase tracking-wider">{ragePhase === 'arrest' ? '👮‍♂️ JUSTICE SERVED' : ragePhase === 'incident' ? '🤬 INCIDENT' : '📠 Cash Register'}</h2>
            {!isFailed && <div className={`flex items-center gap-1 font-mono font-bold px-3 py-1 rounded-lg bg-black/20 text-white ${timeLeft <= 10 ? 'animate-pulse' : ''}`}>⏱️ {timeLeft}s</div>}
          </div>
        )}

        <div className="p-8 min-h-[400px] flex flex-col justify-center">
          {ragePhase === 'arrest' ? (
            <div className="text-center animate-fade-in flex flex-col items-center">
                <span className="text-8xl mb-6">👮‍♂️🚓</span>
                <h3 className="text-2xl font-black text-blue-800">SUSPECT ARRESTED</h3>
                <button onClick={onTimeout} className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl">Dismiss</button>
            </div>
          ) : !isFailed ? (
            <div onClick={handleClick} className="relative h-64 bg-slate-100 rounded-xl border-b-8 border-slate-300 overflow-hidden cursor-pointer shadow-inner select-none">
                <div className="absolute inset-0 flex items-end justify-end p-6 pb-12"><span className="text-8xl">🛍️</span></div>
                <div className={`absolute top-1/2 -translate-y-1/2 w-40 h-40 transition-all duration-500 ease-in-out flex items-center justify-center ${position}`}>
                   <img src={floppa.image} className="w-full h-full object-contain filter drop-shadow-xl" alt="Scanning Floppa" />
                </div>
            </div>
          ) : (
            <div className="text-center"><span className="text-8xl">🤬💨💥</span></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashRegister;
