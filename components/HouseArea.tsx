
import React, { useState } from 'react';

interface HouseAreaProps {
  isNightmare: boolean;
  isWinter: boolean;
}

const HouseArea: React.FC<HouseAreaProps> = ({ isNightmare, isWinter }) => {
  const [room, setRoom] = useState<'living_room' | 'kitchen' | 'bedroom' | 'backyard' | 'bathroom'>('living_room');
  const [foodLevel, setFoodLevel] = useState(0);
  const [waterLevel, setWaterLevel] = useState(0);
  const [tvChannel, setTvChannel] = useState<'home' | 'video' | 'app_drawer'>('home');
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);

  const CHANNELS = [
    { 
      id: 'news', 
      name: 'Floppa News 24/7', 
      color: 'from-blue-800 to-slate-900', 
      icon: '📰', 
      title: 'BREAKING NEWS', 
      sub: 'Local Caracal demands more dumplings.',
      visual: '🎙️'
    },
    { 
      id: 'docu', 
      name: 'Nat Geo Wild', 
      color: 'from-green-800 to-emerald-950', 
      icon: '🌿', 
      title: 'The Apex Predator', 
      sub: 'Watch the Floppa hunt the red dot.',
      visual: '🦁'
    },
    { 
      id: 'music', 
      name: 'MTV Hits', 
      color: 'from-purple-800 to-fuchsia-900', 
      icon: '🎵', 
      title: 'Lo-Fi Hisses', 
      sub: 'Beats to relax and flop to.',
      visual: '🎧'
    },
    { 
      id: 'cooking', 
      name: 'Cooking Channel', 
      color: 'from-orange-700 to-red-900', 
      icon: '👨‍🍳', 
      title: 'Kibble Chef', 
      sub: 'Preparing the perfect bowl.',
      visual: '🍳'
    },
    { 
      id: 'static', 
      name: 'Signal Lost', 
      color: 'from-gray-400 to-gray-600', 
      icon: '🔌', 
      title: 'NO SIGNAL', 
      sub: 'Please stand by...',
      visual: '📺'
    },
  ];

  const handleNextChannel = () => {
    setCurrentChannelIndex((prev) => (prev + 1) % CHANNELS.length);
  };

  const handlePrevChannel = () => {
    setCurrentChannelIndex((prev) => (prev - 1 + CHANNELS.length) % CHANNELS.length);
  };

  const currentChannel = CHANNELS[currentChannelIndex];

  const renderFloppa = (positionClass: string) => (
      <div className={`absolute ${positionClass} animate-bounce hover:animate-spin cursor-pointer transition-transform hover:scale-110 z-30`}>
         <div className="w-32 h-32 overflow-hidden rounded-full border-4 border-white shadow-xl bg-amber-100 flex items-center justify-center">
            <img 
              src="https://th.bing.com/th/id/OIP.6s-dhmDgibN2OY5p6goR9AHaGj?w=178&h=158&c=7&r=0&o=7&dpr=2.8&pid=1.7&rm=3&PC=EMMX01" 
              className="w-full h-full object-contain" 
              alt="House Floppa" 
            />
         </div>
         <div className="text-center font-black text-amber-900 bg-white/70 px-3 rounded-full text-xs mt-1 shadow-sm">House Floppa</div>
      </div>
  );

  return (
    <div className={`rounded-3xl overflow-hidden shadow-2xl border-4 ${isNightmare ? 'border-red-900 bg-slate-900' : 'border-amber-200 bg-white'} relative min-h-[600px] flex flex-col`}>
      
      {/* Navigation */}
      <div className={`p-4 flex gap-2 border-b-4 overflow-x-auto ${isNightmare ? 'bg-black border-red-900' : 'bg-white border-amber-100'}`}>
        <button onClick={() => setRoom('living_room')} className={`flex-1 min-w-[100px] py-3 rounded-xl font-black text-sm md:text-lg transition whitespace-nowrap ${room === 'living_room' ? (isNightmare ? 'bg-red-900 text-white' : 'bg-amber-400 text-white shadow-lg') : (isNightmare ? 'text-slate-500 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100')}`}>🛋️ Living</button>
        <button onClick={() => setRoom('kitchen')} className={`flex-1 min-w-[100px] py-3 rounded-xl font-black text-sm md:text-lg transition whitespace-nowrap ${room === 'kitchen' ? (isNightmare ? 'bg-red-900 text-white' : 'bg-amber-400 text-white shadow-lg') : (isNightmare ? 'text-slate-500 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100')}`}>🥣 Kitchen</button>
        <button onClick={() => setRoom('bedroom')} className={`flex-1 min-w-[100px] py-3 rounded-xl font-black text-sm md:text-lg transition whitespace-nowrap ${room === 'bedroom' ? (isNightmare ? 'bg-red-900 text-white' : 'bg-amber-400 text-white shadow-lg') : (isNightmare ? 'text-slate-500 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100')}`}>🛏️ Bedroom</button>
        <button onClick={() => setRoom('bathroom')} className={`flex-1 min-w-[100px] py-3 rounded-xl font-black text-sm md:text-lg transition whitespace-nowrap ${room === 'bathroom' ? (isNightmare ? 'bg-red-900 text-white' : 'bg-amber-400 text-white shadow-lg') : (isNightmare ? 'text-slate-500 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100')}`}>🛁 Bathroom</button>
        <button onClick={() => setRoom('backyard')} className={`flex-1 min-w-[100px] py-3 rounded-xl font-black text-sm md:text-lg transition whitespace-nowrap ${room === 'backyard' ? (isNightmare ? 'bg-red-900 text-white' : 'bg-amber-400 text-white shadow-lg') : (isNightmare ? 'text-slate-500 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100')}`}>🌳 Backyard</button>
      </div>

      {/* Room Content */}
      <div className="flex-1 relative overflow-hidden bg-slate-50">
        
        {/* LIVING ROOM */}
        {room === 'living_room' && (
          <div className="absolute inset-0 p-8 flex flex-col items-center justify-between z-10">
            <div className="absolute top-10 right-10 w-48 h-32 bg-sky-200 rounded-lg border-8 border-amber-800 overflow-hidden shadow-inner z-0">
                <div className="absolute inset-0 bg-blue-900/10"></div>
                <div className="absolute top-0 left-1/2 w-2 h-full bg-amber-800 -translate-x-1/2"></div>
                <div className="absolute top-1/2 left-0 w-full h-2 bg-amber-800 -translate-y-1/2"></div>
                {isWinter ? (
                    <>
                        <div className="absolute bottom-0 w-full h-10 bg-white rounded-t-lg"></div>
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="absolute text-white text-xs animate-bounce" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDuration: `${2 + Math.random() * 3}s` }}>❄️</div>
                        ))}
                        <div className="absolute bottom-2 left-4 text-2xl">⛄</div>
                    </>
                ) : (
                    <div className="absolute bottom-0 w-full h-10 bg-green-300 rounded-t-lg">
                        <div className="absolute bottom-2 left-4 text-2xl">🌳</div>
                    </div>
                )}
            </div>

            <div className="w-full max-w-2xl bg-gray-900 border-[12px] border-gray-800 rounded-2xl shadow-2xl p-1 relative overflow-hidden group mt-4">
                <div className="bg-gradient-to-br from-gray-800 to-black w-full h-64 relative overflow-hidden flex flex-col">
                    {tvChannel === 'home' && (
                        <div className="flex-1 p-6 flex flex-col gap-6">
                            <div className="w-full h-24 bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:brightness-110 transition shadow-lg border border-white/10" onClick={() => setTvChannel('video')}>
                                <div><h3 className="text-white font-black text-xl">FLOPPA TV</h3><p className="text-blue-200 text-xs">Watch the true Caracal master.</p></div>
                                <div className="text-4xl">📺</div>
                            </div>
                        </div>
                    )}
                    {tvChannel === 'video' && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${currentChannel.color} flex flex-col z-40`}>
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                <div className="z-10 animate-bounce"><span className="text-6xl">{currentChannel.visual}</span></div>
                                <div className="z-10 mt-2 bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/10 w-full max-w-xs">
                                    <h2 className="text-white font-black text-lg mb-1">{currentChannel.title}</h2>
                                    <p className="text-gray-300 text-xs">{currentChannel.sub}</p>
                                </div>
                            </div>
                            <div className="h-12 bg-black/80 backdrop-blur flex items-center justify-between px-4">
                                <button onClick={() => setTvChannel('home')} className="text-gray-400 hover:text-white text-xs font-bold">⬅</button>
                                <div className="flex items-center gap-2">
                                    <button onClick={handlePrevChannel} className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs">◀</button>
                                    <button onClick={handleNextChannel} className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs">▶</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative mt-auto mb-4 scale-90 md:scale-100">
               <div className="w-72 h-32 bg-red-800 rounded-t-3xl border-4 border-red-900 shadow-xl relative mx-auto">
                  <div className="absolute top-4 left-4 right-4 h-20 bg-red-700 rounded-xl flex justify-around px-2 py-1">
                      <div className="w-1 h-full bg-red-900/10"></div><div className="w-1 h-full bg-red-900/10"></div>
                  </div>
                  <div className="absolute bottom-0 left-2 right-2 h-12 flex gap-1">
                      <div className="flex-1 bg-red-600 rounded-t-lg border border-red-500 shadow-sm"></div>
                      <div className="flex-1 bg-red-600 rounded-t-lg border border-red-500 shadow-sm"></div>
                  </div>
                  {renderFloppa('bottom-10 left-1/2 -translate-x-1/2')}
               </div>
            </div>
          </div>
        )}

        {/* KITCHEN */}
        {room === 'kitchen' && (
          <div className="absolute inset-0 p-8 flex flex-col items-center justify-end z-10 bg-orange-50/50">
             <div className="flex gap-12 mb-6">
                 <div onClick={() => setFoodLevel(prev => prev === 0 ? 100 : 0)} className="relative cursor-pointer group">
                     <div className="w-32 h-16 bg-red-600 rounded-b-full border-4 border-red-800 shadow-xl relative overflow-hidden">
                         <div className={`absolute bottom-0 w-full bg-amber-700 transition-all duration-500 ease-out`} style={{ height: `${foodLevel}%` }}></div>
                     </div>
                     <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-12 bg-red-700 rounded-[50%] border-4 border-red-800"></div>
                     <div className="text-center mt-2 font-black text-red-900 uppercase">{foodLevel > 0 ? 'Full' : 'Empty'}</div>
                 </div>
                 <div onClick={() => setWaterLevel(prev => prev === 0 ? 100 : 0)} className="relative cursor-pointer group">
                     <div className="w-32 h-16 bg-blue-500 rounded-b-full border-4 border-blue-700 shadow-xl relative overflow-hidden">
                         <div className={`absolute bottom-0 w-full bg-cyan-400/80 transition-all duration-500 ease-out`} style={{ height: `${waterLevel}%` }}></div>
                     </div>
                     <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-12 bg-blue-600 rounded-[50%] border-4 border-blue-700"></div>
                     <div className="text-center mt-2 font-black text-blue-900 uppercase">{waterLevel > 0 ? 'Water' : 'Dry'}</div>
                 </div>
             </div>
             {renderFloppa('bottom-1/3 left-1/2 -translate-x-1/2')}
          </div>
        )}

        {/* BEDROOM */}
        {room === 'bedroom' && (
           <div className={`absolute inset-0 p-8 flex flex-col items-center justify-center z-10 ${isNightmare ? 'bg-indigo-950' : 'bg-indigo-100'}`}>
              <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-900 border-8 border-slate-700 rounded-t-full overflow-hidden shadow-lg z-0">
                 <div className="absolute top-4 right-4 text-4xl animate-pulse">{isNightmare ? '🌑' : '🌙'}</div>
              </div>
              <div className="absolute top-[60%] -translate-y-1/2 left-20 w-56 h-80 bg-blue-600 rounded-xl shadow-xl border-4 border-blue-800 flex items-center justify-center relative z-20">
                  <div className="absolute top-0 w-full h-full bg-blue-500 rounded-lg"></div>
                  <div className="absolute z-10 transform translate-y-4">
                     <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white transform -rotate-90 bg-amber-50 flex items-center justify-center">
                        <img src="https://th.bing.com/th/id/OIP.6s-dhmDgibN2OY5p6goR9AHaGj?w=178&h=158&c=7&r=0&o=7&dpr=2.8&pid=1.7&rm=3&PC=EMMX01" className="w-full h-full object-contain" alt="Sleeping Floppa" />
                     </div>
                     <div className="absolute -top-6 right-0 text-sm font-bold text-white animate-pulse">Zzz</div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-blue-400 rounded-b-lg border-t-4 border-blue-300 z-20 shadow-inner"></div>
              </div>
           </div>
        )}

        {/* BATHROOM */}
        {room === 'bathroom' && (
           <div className={`absolute inset-0 flex flex-col z-10 ${isNightmare ? 'bg-slate-950' : 'bg-cyan-100'} overflow-hidden`}>
              <div className="absolute top-0 left-0 w-full h-[65%] opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(335deg, ${isNightmare ? '#000' : '#fff'} 23px, transparent 23px), linear-gradient(155deg, ${isNightmare ? '#000' : '#fff'} 23px, transparent 23px)`, backgroundSize: '58px 58px' }}></div>
              <div className={`absolute bottom-0 w-full h-[35%] border-t-8 ${isNightmare ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'} z-0`}>
                 <div className="w-full h-full opacity-20" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${isNightmare ? '#333' : '#ccc'} 0, ${isNightmare ? '#333' : '#ccc'} 1px, transparent 0, transparent 50%)`, backgroundSize: '30px 30px' }}></div>
              </div>
              
              <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 flex flex-col items-center z-0 scale-75 sm:scale-100 origin-bottom">
                  <div className="w-24 h-32 bg-blue-100 border-4 border-slate-300 rounded-xl shadow-lg"></div>
                  <div className="w-28 h-4 bg-slate-300 rounded shadow-md mt-1"></div>
                  <div className="w-24 h-20 bg-white border-x-4 border-b-4 border-slate-300 rounded-b-2xl"></div>
              </div>

              <div className="absolute bottom-[10%] left-4 sm:left-12 z-10 scale-90 sm:scale-100 origin-bottom-left">
                  <div className="relative w-64 sm:w-80 h-32 bg-white rounded-b-3xl border-4 border-slate-200 shadow-2xl overflow-hidden">
                      <div className="absolute top-4 left-2 right-2 bottom-2 bg-cyan-300/60 rounded-b-2xl">
                          <div className="absolute top-2 right-1/3 text-2xl animate-bounce">🦆</div>
                      </div>
                  </div>
              </div>

              <div className="absolute bottom-[10%] right-4 sm:right-12 flex flex-col items-center z-10 scale-90 sm:scale-100 origin-bottom-right">
                   <div className="w-24 h-28 bg-white border-4 border-slate-200 rounded-t-xl relative shadow-md"></div>
                   <div className="w-28 h-24 bg-white border-4 border-slate-200 rounded-b-3xl -mt-1 relative z-10 shadow-lg"></div>
              </div>

              {renderFloppa('bottom-[12%] left-1/2 -translate-x-1/2 scale-110')}
           </div>
        )}

        {/* BACKYARD */}
        {room === 'backyard' && (
           <div className={`absolute inset-0 p-0 flex flex-col z-10 overflow-hidden ${isNightmare ? 'bg-slate-900' : (isWinter ? 'bg-slate-200' : 'bg-sky-300')}`}>
               {!isNightmare && !isWinter && <div className="absolute top-10 right-10 text-8xl animate-spin opacity-80">☀️</div>}
               {isNightmare && <div className="absolute top-10 right-10 text-8xl opacity-80 animate-pulse text-red-500">🌑</div>}
               {isWinter && (
                  <>
                    <div className="absolute top-10 right-10 text-6xl opacity-40">☁️</div>
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(30)].map((_, i) => (
                          <div key={i} className="snowflake text-white text-xl animate-bounce" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDuration: `${2 + Math.random() * 3}s` }}>❄️</div>
                        ))}
                    </div>
                  </>
               )}

               <div className={`absolute bottom-0 w-full h-1/3 border-t-8 ${isNightmare ? 'bg-green-900 border-green-950' : (isWinter ? 'bg-white border-slate-300' : 'bg-green-500 border-green-600')}`}></div>

               <div className="absolute bottom-[30%] w-full flex overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                      <div key={i} className={`w-12 h-32 rounded-t-full border-x border-t-4 relative mx-1 ${isWinter ? 'bg-amber-100 border-amber-200' : 'bg-amber-200 border-amber-300'}`}>
                          {isWinter && <div className="absolute top-0 left-0 right-0 h-4 bg-white rounded-t-full"></div>}
                      </div>
                  ))}
               </div>
               
               <div className="absolute bottom-[30%] left-10 text-[150px] leading-none transform -translate-y-4">{isWinter ? '🎄' : '🌳'}</div>
               {isWinter && (
                 <div className={`absolute bottom-[28%] left-1/3 text-8xl ${isNightmare ? 'text-red-500 animate-pulse' : 'animate-bounce'}`}>
                   {isNightmare ? '☃️' : '⛄'}
                 </div>
               )}
               {renderFloppa('bottom-[20%] right-1/3')}
           </div>
        )}
      </div>
    </div>
  );
};

export default HouseArea;
