
import React, { useState, useEffect, useRef } from 'react';

interface PrepareKibbleMinigameProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface KibbleParticle {
  id: number;
  x: number;
  y: number;
}

const PrepareKibbleMinigame: React.FC<PrepareKibbleMinigameProps> = ({ onComplete, onCancel }) => {
  const [fillLevel, setFillLevel] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [bagPos, setBagPos] = useState({ x: 100, y: 130 });
  const [kibbles, setKibbles] = useState<KibbleParticle[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSpawnTime = useRef(0);
  const rotationRef = useRef(0);
  const lastMousePos = useRef({ x: 100, y: 130 });
  const isMounted = useRef(true);

  // Track mount status to prevent updates after unmount
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Check for completion
  useEffect(() => {
    if (fillLevel >= 100) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [fillLevel, onComplete]);

  // Global pointer up listener to handle release outside container
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setBagPos({ x: 100, y: 130 }); // Reset to shelf
        rotationRef.current = 0;
      }
    };

    if (isDragging) {
      window.addEventListener('pointerup', handleGlobalPointerUp);
    }
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, [isDragging]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        lastMousePos.current = { 
            x: e.clientX - rect.left, 
            y: e.clientY - rect.top 
        };
        // Snap bag to cursor immediately
        setBagPos(lastMousePos.current);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isDragging || fillLevel >= 100) return;
    
    e.preventDefault(); // Prevent scrolling on touch devices
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Velocity for shake
    const dx = x - lastMousePos.current.x;
    const dy = y - lastMousePos.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy);

    // Sway rotation
    rotationRef.current = Math.max(-45, Math.min(45, dx * 2));

    setBagPos({ x, y });
    lastMousePos.current = { x, y };

    // Shake & Spawn Logic
    const bowlCenterX = rect.width / 2;
    // Expanded bowl area check
    const isOverBowl = Math.abs(x - bowlCenterX) < 150 && y > 150;
    
    const now = Date.now();
    
    // Dynamic interval: Faster speed = lower interval (more kibble per second)
    // Base 60ms, subtract speed multiplier to spawn faster
    const spawnInterval = Math.max(10, 60 - speed * 1.5);

    // Threshold for "shaking"
    if (isOverBowl && speed > 3 && now - lastSpawnTime.current > spawnInterval) {
        spawnKibble(x, y, speed);
        lastSpawnTime.current = now;
    }
  };

  const spawnKibble = (x: number, y: number, speed: number) => {
    const id = Date.now() + Math.random();
    // Add random spread
    const spreadX = (Math.random() - 0.5) * 60;
    
    // Add particle
    setKibbles(prev => [...prev, { id, x: x + spreadX, y }]);

    // Calculate fill amount contribution
    // Base 1.5, add bonus based on speed (up to +2.0)
    const speedBonus = Math.min(2.0, speed / 10);
    const fillAmount = 1.5 + speedBonus;

    // Schedule removal and fill update
    setTimeout(() => {
      if (!isMounted.current) return;

      // Remove the particle
      setKibbles(prev => prev.filter(k => k.id !== id));
      
      // Update fill level
      setFillLevel(prev => {
        if (prev >= 100) return 100;
        return Math.min(100, prev + fillAmount);
      });
    }, 600); // Animation duration
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 select-none touch-none">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border-4 border-amber-200 overflow-hidden relative">
        {/* Header */}
        <div className="bg-amber-400 p-4 flex justify-between items-center border-b border-amber-500 z-10 relative">
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            🥣 Prepare Kibble
          </h2>
          <button 
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white/40 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Game Container */}
        <div 
          ref={containerRef}
          onPointerMove={handlePointerMove}
          className={`relative h-96 bg-sky-50 overflow-hidden touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-default'}`}
        >
          {/* Shelf Visual */}
          <div className="absolute top-20 left-10 w-40 h-4 bg-amber-800 rounded shadow-md z-0"></div>
          <div className="absolute top-[84px] left-14 text-xs text-amber-900/50 font-bold uppercase tracking-widest">Kibble Storage</div>

          {/* Instructions Overlay */}
          {fillLevel === 0 && !isDragging && (
             <div className="absolute top-10 left-0 right-0 text-center pointer-events-none z-0">
               <span className="bg-white/90 text-amber-600 px-6 py-3 rounded-full font-bold shadow-md animate-bounce border-2 border-amber-100">
                 Drag the bag & Shake FAST over the bowl!
               </span>
               <div className="absolute top-32 left-32 text-4xl animate-pulse">👆</div>
             </div>
          )}

          {/* Falling Kibbles */}
          {kibbles.map(k => (
            <div
              key={k.id}
              className="absolute w-4 h-4 bg-amber-700 rounded-full"
              style={{
                left: k.x,
                top: k.y,
                animation: 'drop 0.6s cubic-bezier(0.5, 0, 1, 1) forwards'
              }}
            />
          ))}

          {/* The Bowl */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-32 border-4 border-slate-300 bg-slate-100 rounded-b-full overflow-hidden shadow-xl z-10">
             {/* Kibble Inside Bowl (Fill Level) */}
             <div 
               className="absolute bottom-0 left-0 right-0 bg-amber-700 transition-all duration-300 ease-out flex items-start justify-center overflow-hidden"
               style={{ height: `${fillLevel}%` }}
             >
                {/* Texture for kibble pile */}
                <div className="w-full h-full opacity-30" style={{ 
                    backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)',
                    backgroundSize: '10px 10px'
                }}></div>
             </div>
             {/* Bowl Highlight */}
             <div className="absolute inset-0 rounded-b-full shadow-[inset_0_-10px_20px_rgba(0,0,0,0.1)] pointer-events-none"></div>
          </div>
          
          {/* Bowl Front Rim (for depth) */}
          <div className="absolute bottom-[134px] left-1/2 -translate-x-1/2 w-64 h-4 bg-slate-200 border-x-4 border-t-4 border-slate-300 rounded-[50%] z-0 scale-x-[0.98]"></div>

          {/* Win Message */}
          {fillLevel >= 100 && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-green-500/20 backdrop-blur-sm">
              <div className="text-center animate-bounce">
                <span className="text-6xl block">🦴</span>
                <span className="text-3xl font-black text-green-700 stroke-white bg-white/80 px-4 py-2 rounded-xl">Yummy!</span>
              </div>
            </div>
          )}

          {/* Draggable Kibble Bag */}
          <div 
            onPointerDown={handlePointerDown}
            className={`absolute text-8xl z-30 transition-transform duration-75 select-none touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab hover:scale-110 transition-transform'}`}
            style={{ 
              left: bagPos.x, 
              top: bagPos.y,
              transform: `translate(-50%, -50%) rotate(${rotationRef.current}deg) ${isDragging ? 'scale(1.1)' : 'scale(1)'}`,
              filter: isDragging ? 'drop-shadow(0 10px 10px rgba(0,0,0,0.2))' : 'drop-shadow(0 4px 4px rgba(0,0,0,0.1))'
            }}
          >
            🥡
          </div>
        </div>

        {/* CSS for drop animation */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes drop {
            from { transform: translateY(0); }
            to { transform: translateY(400px); }
          }
        `}} />
        
        {/* Footer info */}
        <div className="p-3 bg-amber-50 text-center text-xs text-amber-700 font-bold uppercase border-t border-amber-200">
          Fill Level: {Math.min(100, Math.floor(fillLevel))}%
        </div>
      </div>
    </div>
  );
};

export default PrepareKibbleMinigame;
