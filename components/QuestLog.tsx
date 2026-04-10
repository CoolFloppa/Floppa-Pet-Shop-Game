
import React from 'react';
import { Quest } from '../types';

interface QuestLogProps {
  quests: Quest[];
  onClaim: (id: string) => void;
  onRefresh: () => void;
}

const QuestLog: React.FC<QuestLogProps> = ({ quests, onClaim, onRefresh }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
      <div className="bg-amber-400 p-4 flex items-center justify-between border-b border-amber-500">
        <div className="flex items-center gap-2">
          <span className="text-xl">📜</span>
          <h3 className="font-bold text-white">Daily Quests</h3>
        </div>
        <button 
          onClick={onRefresh}
          className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded transition"
          title="Get new quests"
        >
          ↻
        </button>
      </div>

      <div className="p-4 space-y-4">
        {quests.length === 0 ? (
          <p className="text-center text-slate-400 text-sm">All quests completed!</p>
        ) : (
          quests.map(quest => {
            const progress = Math.min(100, (quest.currentAmount / quest.targetAmount) * 100);
            const isComplete = quest.currentAmount >= quest.targetAmount;

            return (
              <div key={quest.id} className={`border rounded-xl p-3 ${isComplete && !quest.isClaimed ? 'border-green-200 bg-green-50' : 'border-slate-100'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-sm text-slate-700">{quest.description}</p>
                    <p className="text-xs text-slate-500">Reward: <span className="text-amber-600 font-bold">{quest.reward} 🪙</span></p>
                  </div>
                  {quest.isClaimed ? (
                    <span className="text-xs font-bold text-slate-300">CLAIMED</span>
                  ) : (
                    <button
                      onClick={() => onClaim(quest.id)}
                      disabled={!isComplete}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        isComplete 
                          ? 'bg-green-500 text-white hover:bg-green-600 shadow-sm animate-bounce' 
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isComplete ? 'CLAIM' : 'LOCKED'}
                    </button>
                  )}
                </div>

                <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-amber-400'}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-right mt-1">
                  <span className="text-[10px] font-bold text-slate-400">
                    {quest.currentAmount} / {quest.targetAmount}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default QuestLog;
