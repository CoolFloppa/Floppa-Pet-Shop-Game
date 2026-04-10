
export interface Floppa {
  id: string;
  name: string;
  happiness: number;
  value: number;
  image: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  health: 'Healthy' | 'Injured' | 'Sick' | 'Coughing';
}

export interface HiredStaff {
  caretaker: boolean;
  maid: boolean;
  nurse: boolean;
  doctor: boolean;
  restocker: boolean;
}

export interface PlayerStats {
  money: number;
  experience: number;
  level: number;
  shopName: string;
  kibbleAmount: number;
  isShopOpen: boolean;
  bandageCount: number;
  medicineCount: number;
  syrupCount: number;
  hiredStaff: HiredStaff;
  unlockedEncyclopedia: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface TradeOffer {
  id: string;
  traderName: string;
  wantsFloppaId: string; // ID of the floppa in player's inventory
  offersFloppa: Floppa; // The new floppa being offered
  bonusMoney: number; // Can be negative (player pays) or positive (player receives)
  createdAt: number;
}

export enum WorkTask {
  PREPARE_KIBBLE = 'PREPARE_KIBBLE',
  CLEAN_ENCLOSURE = 'CLEAN_ENCLOSURE',
  SOCIALIZE_FLOPPA = 'SOCIALIZE_FLOPPA',
  BATH_FLOPPA = 'BATH_FLOPPA'
}

export enum QuestType {
  SELL_FLOPPAS = 'SELL_FLOPPAS',
  MAX_HAPPINESS = 'MAX_HAPPINESS'
}

export interface Quest {
  id: string;
  type: QuestType;
  description: string;
  targetAmount: number;
  currentAmount: number;
  reward: number;
  isClaimed: boolean;
}