
export const INITIAL_MONEY = 100;
export const INITIAL_KIBBLE = 50;
export const FLOPPA_BASE_PRICE = 50;

export const KIBBLE_PRICE = 25;
export const KIBBLE_PACK_AMOUNT = 50;
export const KIBBLE_COST_PER_TASK = 10;

// Medical Prices
export const BANDAGE_PRICE = 15;
export const MEDICINE_PRICE = 30;
export const SYRUP_PRICE = 25;

// Staff Prices (One-time hire fee)
export const STAFF_PRICES = {
  CARETAKER: 500,  // Auto-increases happiness
  MAID: 300,       // Generates passive income (tips)
  NURSE: 750,      // Auto-heals Injured/Coughing (uses items)
  DOCTOR: 1000,    // Auto-heals Sick (uses items)
  RESTOCKER: 400   // Auto-buys kibble when low
};

export const WORK_PAYOUTS = {
  PREPARE_KIBBLE: 15,
  CLEAN_ENCLOSURE: 12,
  SOCIALIZE_FLOPPA: 20,
  BATH_FLOPPA: 35
};

export const FLOPPA_IMAGES = [
  'https://th.bing.com/th/id/OIP.6s-dhmDgibN2OY5p6goR9AHaGj?w=178&h=158&c=7&r=0&o=7&dpr=2.8&pid=1.7&rm=3&PC=EMMX01'
];

export const FLOPPA_NAMES = [
  "Big Floppa", "Gosha", "Justin", "Gregory", "Caracal King", 
  "Ear Tufts", "Desert Dash", "Kibble Muncher", "Sogga's Rival"
];

export const TRADER_NAMES = [
  "FloppaLover99", "CaracalKeeper", "SoggaFan", "WildCatEnjoyer", 
  "EarTuftEnthusiast", "NoHissJustMeow", "FloppaTrader_X"
];
