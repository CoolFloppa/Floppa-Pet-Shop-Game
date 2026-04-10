
import React from 'react';
import { STAFF_PRICES } from '../constants';
import { HiredStaff } from '../types';

interface HiringShopProps {
  money: number;
  hiredStaff: HiredStaff;
  onHire: (role: keyof HiredStaff, cost: number) => void;
}

const HiringShop: React.FC<HiringShopProps> = ({ money, hiredStaff, onHire }) => {
  return (
    <div className="space-y-6">
      <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-md text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <h2 className="text-3xl font-bold mb-2 relative z-10">👔 Staff Recruitment</h2>
        <p className="text-indigo-200 text-sm relative z-10">
          Automate your Floppa empire by hiring professionals. <br/>
          One-time hiring fee. They work forever!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Caretaker */}
        <StaffCard 
          role="caretaker"
          title="Caretaker"
          icon="🧶"
          description="Plays with Floppas automatically. Increases happiness of all Floppas every 10s."
          price={STAFF_PRICES.CARETAKER}
          isHired={hiredStaff.caretaker}
          canAfford={money >= STAFF_PRICES.CARETAKER}
          onHire={() => onHire('caretaker', STAFF_PRICES.CARETAKER)}
        />

        {/* Maid */}
        <StaffCard 
          role="maid"
          title="Maid"
          icon="🧹"
          description="Keeps the shop tidy. Finds 'cleaning tips' (money) under the rugs every 10s."
          price={STAFF_PRICES.MAID}
          isHired={hiredStaff.maid}
          canAfford={money >= STAFF_PRICES.MAID}
          onHire={() => onHire('maid', STAFF_PRICES.MAID)}
        />

        {/* Restocker */}
        <StaffCard 
          role="restocker"
          title="Restocker"
          icon="📦"
          description="Automatically buys a Kibble Pack when storage drops below 10 units."
          price={STAFF_PRICES.RESTOCKER}
          isHired={hiredStaff.restocker}
          canAfford={money >= STAFF_PRICES.RESTOCKER}
          onHire={() => onHire('restocker', STAFF_PRICES.RESTOCKER)}
        />

        {/* Nurse */}
        <StaffCard 
          role="nurse"
          title="Nurse"
          icon="👩‍⚕️"
          description="Automatically uses Bandages or Syrup to heal Injured or Coughing Floppas."
          price={STAFF_PRICES.NURSE}
          isHired={hiredStaff.nurse}
          canAfford={money >= STAFF_PRICES.NURSE}
          onHire={() => onHire('nurse', STAFF_PRICES.NURSE)}
        />

        {/* Doctor */}
        <StaffCard 
          role="doctor"
          title="Doctor"
          icon="👨‍⚕️"
          description="The specialist. Automatically uses Medicine to cure Sick Floppas instantly."
          price={STAFF_PRICES.DOCTOR}
          isHired={hiredStaff.doctor}
          canAfford={money >= STAFF_PRICES.DOCTOR}
          onHire={() => onHire('doctor', STAFF_PRICES.DOCTOR)}
        />
      </div>
    </div>
  );
};

interface StaffCardProps {
  role: string;
  title: string;
  icon: string;
  description: string;
  price: number;
  isHired: boolean;
  canAfford: boolean;
  onHire: () => void;
}

const StaffCard: React.FC<StaffCardProps> = ({ title, icon, description, price, isHired, canAfford, onHire }) => {
  return (
    <div className={`border-2 rounded-2xl p-4 flex flex-col relative overflow-hidden transition-all ${
      isHired ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-slate-200 hover:border-indigo-300'
    }`}>
      {isHired && (
        <div className="absolute top-3 right-3 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          Hired
        </div>
      )}
      
      <div className="flex items-center gap-4 mb-3">
        <div className="text-4xl bg-white p-2 rounded-full shadow-sm border border-slate-100">{icon}</div>
        <div>
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <p className="text-xs text-indigo-600 font-bold">{price} 🪙 Fee</p>
        </div>
      </div>
      
      <p className="text-sm text-slate-500 mb-4 flex-grow">{description}</p>
      
      <button
        onClick={onHire}
        disabled={isHired || !canAfford}
        className={`w-full py-2 rounded-xl font-bold transition shadow-sm ${
          isHired 
            ? 'bg-slate-200 text-slate-500 cursor-default' 
            : canAfford 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95' 
              : 'bg-slate-100 text-slate-300 cursor-not-allowed'
        }`}
      >
        {isHired ? 'Currently Employed' : `Hire for ${price} 🪙`}
      </button>
    </div>
  );
};

export default HiringShop;
