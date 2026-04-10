
import React from 'react';
import { Floppa, TradeOffer } from '../types';

interface TradingAreaProps {
  offers: TradeOffer[];
  inventory: Floppa[];
  onAccept: (offer: TradeOffer) => void;
  onReject: (offerId: string) => void;
  isShopOpen: boolean;
}

export default function TradingArea({ offers, inventory, onAccept, onReject, isShopOpen }: TradingAreaProps) {
  const validOffers = offers.filter(offer => inventory.some(f => f.id === offer.wantsFloppaId));

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Epic': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Rare': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-md text-center">
        <h2 className="text-2xl font-bold mb-2">🌐 Global Trade Network</h2>
        <p className="text-slate-300 text-sm">Trading Just Floppas with keepers worldwide.</p>
        {!isShopOpen && <div className="mt-4 bg-red-500/20 border border-red-500/50 p-2 rounded-lg text-red-200 text-sm font-bold">⚠️ Shop is CLOSED. Open shop to trade.</div>}
      </div>

      {validOffers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <div className="text-4xl mb-4 animate-pulse">📡</div>
          <h3 className="text-slate-500 font-bold">Searching for trade partners...</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {validOffers.map(offer => {
            const myFloppa = inventory.find(f => f.id === offer.wantsFloppaId);
            if (!myFloppa) return null;
            return (
              <div key={offer.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 p-3 border-b border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-700">👤 {offer.traderName}</span>
                </div>
                <div className="p-4 flex flex-col md:flex-row items-center gap-4">
                  <div className="flex-1 w-full bg-slate-50 p-3 rounded-xl text-center">
                    <div className="text-xs font-bold text-slate-400 mb-2">You Give</div>
                    <div className="w-28 h-28 mx-auto mb-2 flex items-center justify-center bg-white rounded-lg border border-slate-100 p-1">
                       <img src={myFloppa.image} className="w-full h-full object-contain" alt={myFloppa.name} />
                    </div>
                    <div className="font-bold text-slate-800">{myFloppa.name}</div>
                    <div className={`text-xs inline-block px-2 py-0.5 rounded mt-1 border ${getRarityColor(myFloppa.rarity)}`}>{myFloppa.rarity}</div>
                  </div>
                  <div className="text-slate-300 text-2xl">⇄</div>
                  <div className="flex-1 w-full bg-amber-50 p-3 rounded-xl text-center">
                    <div className="text-xs font-bold text-amber-600 mb-2">You Get</div>
                    <div className="w-28 h-28 mx-auto mb-2 flex items-center justify-center bg-white rounded-lg border border-amber-100 p-1">
                       <img src={offer.offersFloppa.image} className="w-full h-full object-contain" alt={offer.offersFloppa.name} />
                    </div>
                    <div className="font-bold text-slate-800">{offer.offersFloppa.name}</div>
                    <div className={`text-xs inline-block px-2 py-0.5 rounded mt-1 border ${getRarityColor(offer.offersFloppa.rarity)}`}>{offer.offersFloppa.rarity}</div>
                    {offer.bonusMoney !== 0 && <div className={`mt-2 font-bold text-sm ${offer.bonusMoney > 0 ? 'text-green-600' : 'text-red-500'}`}>{offer.bonusMoney > 0 ? `+ ${offer.bonusMoney} 🪙` : `- ${Math.abs(offer.bonusMoney)} 🪙`}</div>}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                  <button onClick={() => onReject(offer.id)} className="flex-1 py-2 bg-white border border-slate-300 text-slate-600 font-bold rounded-xl transition">Decline</button>
                  <button onClick={() => onAccept(offer)} disabled={!isShopOpen} className={`flex-1 py-2 font-bold rounded-xl shadow-sm transition ${isShopOpen ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Accept Trade</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
