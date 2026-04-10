
import React from 'react';
import { KIBBLE_PRICE, KIBBLE_PACK_AMOUNT, BANDAGE_PRICE, MEDICINE_PRICE, SYRUP_PRICE } from '../constants';

interface ShopAreaProps {
  onBuy: () => void;
  onBuyKibble: () => void;
  onBuyMedical: (type: 'bandage' | 'medicine' | 'syrup', price: number) => void;
  money: number;
  price: number;
  medicalCounts: {
    bandages: number;
    medicines: number;
    syrups: number;
  };
}

const ShopArea: React.FC<ShopAreaProps> = ({ onBuy, onBuyKibble, onBuyMedical, money, price, medicalCounts }) => {
  return (
    <div className="space-y-6">
      {/* Floppas Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 text-center">
        <h2 className="text-xl font-bold mb-4 text-left border-b pb-2 text-amber-900">🐆 Live Stock</h2>
        <div className="mb-6 floppa-bounce mt-4">
          <span className="text-7xl">🎁</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Mystery Floppa Box</h2>
        <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm">
          Rescue a new Caracal! Chance for Legendary breeds.
        </p>
        
        <div className="inline-flex flex-col items-center">
          <button 
            onClick={onBuy}
            disabled={money < price}
            className={`px-12 py-3 rounded-2xl text-xl font-black shadow-lg transition transform hover:scale-105 active:scale-95 ${
              money >= price 
                ? 'bg-amber-400 text-white hover:bg-amber-500' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {price} 🪙 BUY FLOPPA
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-400 uppercase">
          <div className="p-2 bg-slate-50 rounded-lg">Common: 50%</div>
          <div className="p-2 bg-green-50 text-green-600 rounded-lg border border-green-100">Rare: 30%</div>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">Epic: 15%</div>
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg border border-purple-100">Legendary: 5%</div>
        </div>
      </div>

      {/* Supplies Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
        <h2 className="text-xl font-bold mb-4 border-b pb-2 text-amber-900">📦 Supplies</h2>
        
        <div className="flex items-center gap-4 border border-amber-100 p-4 rounded-xl bg-amber-50/50">
          <div className="text-5xl bg-white p-3 rounded-full shadow-sm">
            🥡
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-amber-900">Bulk Kibble Pack</h3>
            <p className="text-xs text-amber-700 font-medium">Contains {KIBBLE_PACK_AMOUNT} units of premium meat.</p>
            <p className="text-xs text-slate-500 mt-1">Required to prepare food.</p>
          </div>
          <div className="flex flex-col items-end">
            <button 
              onClick={onBuyKibble}
              disabled={money < KIBBLE_PRICE}
              className={`px-6 py-2 rounded-xl font-bold shadow-md transition active:scale-95 ${
                money >= KIBBLE_PRICE 
                  ? 'bg-amber-600 text-white hover:bg-amber-700' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {KIBBLE_PRICE} 🪙 BUY
            </button>
          </div>
        </div>
      </div>

      {/* Pharmacy Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
        <h2 className="text-xl font-bold mb-4 border-b pb-2 text-red-600 flex items-center gap-2">
            🚑 Pharmacy
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Bandages */}
            <div className="border border-red-100 p-4 rounded-xl bg-red-50 flex flex-col items-center text-center">
                <div className="text-4xl mb-2">🩹</div>
                <h3 className="font-bold text-red-800">Bandage</h3>
                <p className="text-xs text-red-600 mb-2">For cuts & scrapes</p>
                <div className="mt-auto w-full">
                    <button 
                        onClick={() => onBuyMedical('bandage', BANDAGE_PRICE)}
                        disabled={money < BANDAGE_PRICE}
                        className={`w-full py-1.5 rounded-lg font-bold text-sm mb-1 ${
                            money >= BANDAGE_PRICE ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-slate-200 text-slate-400'
                        }`}
                    >
                        {BANDAGE_PRICE} 🪙
                    </button>
                    <span className="text-xs font-bold text-slate-400">Owned: {medicalCounts.bandages}</span>
                </div>
            </div>

            {/* Medicine */}
            <div className="border border-blue-100 p-4 rounded-xl bg-blue-50 flex flex-col items-center text-center">
                <div className="text-4xl mb-2">💊</div>
                <h3 className="font-bold text-blue-800">Medicine</h3>
                <p className="text-xs text-blue-600 mb-2">Cures stomach bugs</p>
                <div className="mt-auto w-full">
                    <button 
                        onClick={() => onBuyMedical('medicine', MEDICINE_PRICE)}
                        disabled={money < MEDICINE_PRICE}
                        className={`w-full py-1.5 rounded-lg font-bold text-sm mb-1 ${
                            money >= MEDICINE_PRICE ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-slate-200 text-slate-400'
                        }`}
                    >
                        {MEDICINE_PRICE} 🪙
                    </button>
                    <span className="text-xs font-bold text-slate-400">Owned: {medicalCounts.medicines}</span>
                </div>
            </div>

            {/* Syrup */}
            <div className="border border-purple-100 p-4 rounded-xl bg-purple-50 flex flex-col items-center text-center">
                <div className="text-4xl mb-2">🧉</div>
                <h3 className="font-bold text-purple-800">Syrup</h3>
                <p className="text-xs text-purple-600 mb-2">Soothes coughs</p>
                <div className="mt-auto w-full">
                    <button 
                        onClick={() => onBuyMedical('syrup', SYRUP_PRICE)}
                        disabled={money < SYRUP_PRICE}
                        className={`w-full py-1.5 rounded-lg font-bold text-sm mb-1 ${
                            money >= SYRUP_PRICE ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-slate-200 text-slate-400'
                        }`}
                    >
                        {SYRUP_PRICE} 🪙
                    </button>
                    <span className="text-xs font-bold text-slate-400">Owned: {medicalCounts.syrups}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ShopArea;
