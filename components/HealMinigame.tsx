
import React, { useState, useRef } from 'react';
import { Floppa } from '../types';

interface HealMinigameProps {
  floppa: Floppa;
  onComplete: () => void;
  onCancel: () => void;
}

export const HealMinigame: React.FC<HealMinigameProps> = ({ floppa, onComplete, onCancel }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [isSuccess, setIsSuccess] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  const getItemIcon = () => {
    switch (floppa.health) {
      case 'Injured': return '🩹';
      case 'Sick': return '💊';
      case 'Coughing': return '🧉';
      default: return '❓';
    }
  };

  const getTargetOverlay = () => {
    switch (floppa.health) {
      case 'Injured': return '🤕';
      case 'Sick': return '🤢';
      case 'Coughing': return '🤒';
      default: return '';
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isSuccess) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || isSuccess) return;
    setIsDragging(false);

    const windowCenterX = window.innerWidth / 2;
    const windowCenterY = window.innerHeight / 2;
    const dist = Math.sqrt(Math.pow(e.clientX - windowCenterX, 2) + Math.pow(e.clientY - windowCenterY, 2));

    if (dist < 150) { 
      setIsSuccess(true);
      setTimeout(onComplete, 1500);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 touch-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className={`bg-white rounded-3xl shadow-2xl max-w-lg w-full h-[500px] border-4 overflow-hidden relative transition-colors duration-500 ${
        floppa.health === 'Injured' ? 'border-red-200' : 
        floppa.health === 'Sick' ? 'border-green-200' : 'border-purple-200'
      }`}>
        
        <div className={`p-4 flex justify-between items-center border-b z-20 relative ${
             floppa.health === 'Injured' ? 'bg-red-500 border-red-600' : 
             floppa.health === 'Sick' ? 'bg-green-500 border-green-600' : 'bg-purple-500 border-purple-600'
        }`}>
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            {floppa.health === 'Injured' ? 'Treat Wound' : 
             floppa.health === 'Sick' ? 'Cure Stomach' : 'Soothe Cough'}
          </h2>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white/40">✕</button>
        </div>

        <div className="relative h-full bg-slate-50 flex flex-col items-center justify-center">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            {!isDragging && !isSuccess && (
                <div className="absolute top-10 animate-bounce z-10">
                    <span className="bg-white border-2 border-slate-200 px-4 py-2 rounded-full font-bold text-slate-600 shadow-sm">
                        Drag the {getItemIcon()} to Floppa!
                    </span>
                </div>
            )}

            <div className={`relative w-48 h-48 transition-all duration-500 ${isSuccess ? 'scale-125 rotate-6' : ''}`}>
                <img 
                  src="https://th.bing.com/th/id/OIP.6s-dhmDgibN2OY5p6goR9AHaGj?w=178&h=158&c=7&r=0&o=7&dpr=2.8&pid=1.7&rm=3&PC=EMMX01" 
                  className="w-full h-full object-contain filter drop-shadow-lg"
                  alt="Healing Floppa"
                />
                {!isSuccess && <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-80 pointer-events-none">{getTargetOverlay()}</div>}
            </div>
            
            {isSuccess && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-30">
                    <div className="text-center animate-bounce">
                        <span className="text-6xl block mb-2">✨</span>
                        <span className="text-3xl font-black text-green-600 bg-white px-6 py-2 rounded-2xl shadow-xl border-2 border-green-100">
                            Healed!
                        </span>
                    </div>
                </div>
            )}

            <div
                ref={itemRef}
                onPointerDown={handlePointerDown}
                className={`absolute z-40 text-7xl select-none transition-transform ${isDragging ? 'cursor-grabbing scale-125' : 'cursor-grab'} ${isSuccess ? 'opacity-0 scale-0' : 'opacity-100'}`}
                style={{
                    left: isDragging ? dragPos.x : '50%',
                    top: isDragging ? dragPos.y : '85%',
                    transform: isDragging ? 'translate(-50%, -50%)' : 'translate(-50%, 0)',
                    position: isDragging ? 'fixed' : 'absolute'
                }}
            >
                {getItemIcon()}
            </div>
        </div>
      </div>
    </div>
  );
};
