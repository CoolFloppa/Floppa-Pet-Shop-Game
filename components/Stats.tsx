
import React from 'react';
import { PlayerStats } from '../types';

interface StatsProps {
  stats: PlayerStats;
  floppaCount: number;
}

const Stats: React.FC<StatsProps> = ({ stats, floppaCount }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100 flex flex-col items-center">
        <span className="text-2xl mb-1">🪙</span>
        <span className="text-xl font-bold">{stats.money}</span>
        <span className="text-xs text-slate-400 uppercase font-bold">Floppa Coins</span>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100 flex flex-col items-center">
        <span className="text-2xl mb-1">⭐</span>
        <span className="text-xl font-bold">Lvl {stats.level}</span>
        <span className="text-xs text-slate-400 uppercase font-bold">Experience</span>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100 flex flex-col items-center">
        <span className="text-2xl mb-1">🐾</span>
        <span className="text-xl font-bold">{floppaCount}</span>
        <span className="text-xs text-slate-400 uppercase font-bold">Owned</span>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100 flex flex-col items-center">
        <span className="text-2xl mb-1">🏆</span>
        <span className="text-xl font-bold">{stats.experience}</span>
        <span className="text-xs text-slate-400 uppercase font-bold">Prestige</span>
      </div>
    </div>
  );
};

export default Stats;
