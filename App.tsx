
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Stats from './components/Stats';
import WorkArea from './components/WorkArea';
import ShopArea from './components/ShopArea';
import TradingArea from './components/TradingArea';
import HiringShop from './components/HiringShop';
import ChatBot from './components/ChatBot';
import CashRegister from './components/CashRegister';
import QuestLog from './components/QuestLog';
import PlayWithFloppaMinigame from './components/PlayWithFloppaMinigame';
import MotorbikeMinigame from './components/MotorbikeMinigame';
import MainMenu from './components/MainMenu';
import Encyclopedia from './components/Encyclopedia';
import HouseArea from './components/HouseArea';
import { HealMinigame } from './components/HealMinigame';
import { Floppa, PlayerStats, Quest, QuestType, TradeOffer, HiredStaff } from './types';
import { 
  INITIAL_MONEY, 
  INITIAL_KIBBLE, 
  FLOPPA_NAMES, 
  FLOPPA_IMAGES, 
  FLOPPA_BASE_PRICE,
  KIBBLE_PRICE,
  KIBBLE_PACK_AMOUNT,
  KIBBLE_COST_PER_TASK,
  TRADER_NAMES,
  BANDAGE_PRICE,
  MEDICINE_PRICE,
  SYRUP_PRICE
} from './constants';

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [isNightmare, setIsNightmare] = useState(false);
  const [isWinter, setIsWinter] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  const [stats, setStats] = useState<PlayerStats>({
    money: INITIAL_MONEY,
    experience: 0,
    level: 1,
    shopName: "The Caracal Corner",
    kibbleAmount: INITIAL_KIBBLE,
    isShopOpen: true,
    bandageCount: 0,
    medicineCount: 0,
    syrupCount: 0,
    hiredStaff: {
      caretaker: false,
      maid: false,
      nurse: false,
      doctor: false,
      restocker: false
    },
    unlockedEncyclopedia: []
  });

  const [inventory, setInventory] = useState<Floppa[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([]);
  const [activeTab, setActiveTab] = useState<'work' | 'shop' | 'inventory' | 'trade' | 'hiring' | 'encyclopedia' | 'house'>('work');
  const [sellingFloppaId, setSellingFloppaId] = useState<string | null>(null);
  const [playingFloppa, setPlayingFloppa] = useState<Floppa | null>(null);
  const [healingFloppa, setHealingFloppa] = useState<Floppa | null>(null);
  const [deliveringFloppa, setDeliveringFloppa] = useState<Floppa | null>(null);

  // Ref to hold latest state for autosave
  const stateRef = useRef({ stats, inventory, quests, isNightmare, isWinter });

  useEffect(() => {
    stateRef.current = { stats, inventory, quests, isNightmare, isWinter };
  }, [stats, inventory, quests, isNightmare, isWinter]);

  const saveGame = () => {
    const data = {
      ...stateRef.current,
      savedAt: Date.now()
    };
    localStorage.setItem('floppa_save', JSON.stringify(data));
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 2000);
  };

  // Load game from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('floppa_save');
    if (saved) {
      const data = JSON.parse(saved);
      
      // Migrate inventory to include health and ensure the new image is used
      const loadedInventory = data.inventory.map((f: any) => ({
        ...f,
        health: f.health || 'Healthy',
        image: FLOPPA_IMAGES[0] // Enforce the user's specific image for all saves
      }));

      // Ensure new properties exist for old saves
      setStats({
        ...data.stats,
        kibbleAmount: data.stats.kibbleAmount ?? INITIAL_KIBBLE,
        isShopOpen: data.stats.isShopOpen ?? true,
        bandageCount: data.stats.bandageCount ?? 0,
        medicineCount: data.stats.medicineCount ?? 0,
        syrupCount: data.stats.syrupCount ?? 0,
        hiredStaff: data.stats.hiredStaff ?? {
          caretaker: false,
          maid: false,
          nurse: false,
          doctor: false,
          restocker: false
        },
        unlockedEncyclopedia: data.stats.unlockedEncyclopedia ?? Array.from(new Set(loadedInventory.map((f: Floppa) => f.rarity)))
      });
      
      setInventory(loadedInventory);

      if (data.quests) {
        setQuests(data.quests);
      } else {
        generateDailyQuests();
      }

      if (data.isNightmare !== undefined) setIsNightmare(data.isNightmare);
      if (data.isWinter !== undefined) setIsWinter(data.isWinter);

    } else {
      generateDailyQuests();
    }
  }, []);

  // AutoSave every 20 seconds
  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    const saveInterval = setInterval(() => {
      saveGame();
    }, 20000);

    return () => clearInterval(saveInterval);
  }, [gameStarted, isGameOver]);

  // Sickness & Trade Loop
  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    const gameLoop = setInterval(() => {
      if (inventory.length > 0 && tradeOffers.length < 3 && Math.random() > 0.6) {
        generateTradeOffer();
      }

      if (inventory.length > 0 && Math.random() > 0.7) {
        setInventory(prev => {
          const healthyIndices = prev.map((f, i) => f.health === 'Healthy' ? i : -1).filter(i => i !== -1);
          if (healthyIndices.length > 0) {
            const indexToInfect = healthyIndices[Math.floor(Math.random() * healthyIndices.length)];
            const ailments: ('Injured' | 'Sick' | 'Coughing')[] = ['Injured', 'Sick', 'Coughing'];
            const randomAilment = ailments[Math.floor(Math.random() * ailments.length)];

            return prev.map((f, i) => {
              if (i === indexToInfect) {
                return { ...f, health: randomAilment, happiness: Math.max(0, f.happiness - 20) };
              }
              return f;
            });
          }
          return prev;
        });
      }
    }, 15000); 

    return () => clearInterval(gameLoop);
  }, [inventory, tradeOffers, gameStarted, isGameOver]);

  // Staff Automation Loop (Every 5 seconds)
  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    const staffLoop = setInterval(() => {
      if (stats.hiredStaff.maid) {
        setStats(prev => ({ ...prev, money: prev.money + 5 }));
      }

      if (stats.hiredStaff.caretaker && inventory.length > 0) {
        setInventory(prev => prev.map(f => ({
          ...f,
          happiness: Math.min(100, f.happiness + 2)
        })));
      }

      if (stats.hiredStaff.restocker) {
        setStats(prev => {
          if (prev.kibbleAmount < 10 && prev.money >= KIBBLE_PRICE) {
            return {
              ...prev,
              money: prev.money - KIBBLE_PRICE,
              kibbleAmount: prev.kibbleAmount + KIBBLE_PACK_AMOUNT
            };
          }
          return prev;
        });
      }

      setStats(currentStats => {
        let newStats = { ...currentStats };
        let updatedInventory = false;
        
        setInventory(currentInventory => {
          const newInventory = currentInventory.map(f => {
            if (f.health === 'Healthy') return f;

            if (newStats.hiredStaff.nurse) {
              if (f.health === 'Injured' && newStats.bandageCount > 0) {
                newStats.bandageCount--;
                updatedInventory = true;
                return { ...f, health: 'Healthy' as const, happiness: f.happiness + 5 };
              }
              if (f.health === 'Coughing' && newStats.syrupCount > 0) {
                newStats.syrupCount--;
                updatedInventory = true;
                return { ...f, health: 'Healthy' as const, happiness: f.happiness + 5 };
              }
            }

            if (newStats.hiredStaff.doctor) {
              if (f.health === 'Sick' && newStats.medicineCount > 0) {
                newStats.medicineCount--;
                updatedInventory = true;
                return { ...f, health: 'Healthy' as const, happiness: f.happiness + 5 };
              }
            }
            return f;
          });
          return updatedInventory ? newInventory : currentInventory;
        });
        return newStats;
      });
    }, 5000);

    return () => clearInterval(staffLoop);
  }, [stats.hiredStaff, inventory.length, gameStarted, isGameOver]);

  const handleStartGame = (difficulty: 'normal' | 'nightmare', winter: boolean) => {
    setIsNightmare(difficulty === 'nightmare');
    setIsWinter(winter);
    setGameStarted(true);
    setIsGameOver(false);
  };

  const handleBackToMenu = () => {
    setGameStarted(false);
    setIsGameOver(false);
    setSellingFloppaId(null);
    setDeliveringFloppa(null);
  };

  const generateDailyQuests = () => {
    const newQuests: Quest[] = [
      { id: Date.now().toString() + '-1', type: QuestType.SELL_FLOPPAS, description: "Sell 3 Floppas", targetAmount: 3, currentAmount: 0, reward: 150, isClaimed: false },
      { id: Date.now().toString() + '-2', type: QuestType.MAX_HAPPINESS, description: "Make a Floppa 100% Happy", targetAmount: 1, currentAmount: 0, reward: 100, isClaimed: false },
      { id: Date.now().toString() + '-3', type: QuestType.SELL_FLOPPAS, description: "Sell 5 Floppas", targetAmount: 5, currentAmount: 0, reward: 300, isClaimed: false }
    ];
    setQuests(newQuests);
  };

  const generateTradeOffer = () => {
    const targetFloppa = inventory[Math.floor(Math.random() * inventory.length)];
    if (!targetFloppa) return;

    const offerFloppa: Floppa = {
      id: Math.random().toString(36).substr(2, 9),
      name: FLOPPA_NAMES[Math.floor(Math.random() * FLOPPA_NAMES.length)],
      happiness: 50 + Math.floor(Math.random() * 40),
      value: FLOPPA_BASE_PRICE + Math.floor(Math.random() * 50),
      image: FLOPPA_IMAGES[0],
      rarity: Math.random() > 0.9 ? 'Legendary' : Math.random() > 0.7 ? 'Epic' : Math.random() > 0.4 ? 'Rare' : 'Common',
      health: 'Healthy'
    };

    let bonus = 0;
    if (targetFloppa.rarity === 'Legendary' && offerFloppa.rarity !== 'Legendary') bonus += 150;
    if (targetFloppa.rarity === 'Epic' && offerFloppa.rarity === 'Common') bonus += 50;
    bonus += Math.floor(Math.random() * 40) - 20;

    const newOffer: TradeOffer = {
      id: Date.now().toString(),
      traderName: TRADER_NAMES[Math.floor(Math.random() * TRADER_NAMES.length)],
      wantsFloppaId: targetFloppa.id,
      offersFloppa: offerFloppa,
      bonusMoney: bonus,
      createdAt: Date.now()
    };

    setTradeOffers(prev => [...prev, newOffer]);
  };

  const handleAcceptTrade = (offer: TradeOffer) => {
    if (!stats.isShopOpen) {
      alert("The shop is closed! Open it to trade.");
      return;
    }

    const hasItem = inventory.some(f => f.id === offer.wantsFloppaId);
    if (!hasItem) {
      alert("You no longer have the requested Floppa!");
      setTradeOffers(prev => prev.filter(o => o.id !== offer.id));
      return;
    }
    if (offer.bonusMoney < 0 && stats.money < Math.abs(offer.bonusMoney)) {
      alert("You don't have enough money to complete this trade!");
      return;
    }

    setInventory(prev => {
      const filtered = prev.filter(f => f.id !== offer.wantsFloppaId);
      return [...filtered, offer.offersFloppa];
    });

    setStats(prev => ({
      ...prev,
      money: prev.money + offer.bonusMoney,
      unlockedEncyclopedia: prev.unlockedEncyclopedia.includes(offer.offersFloppa.rarity)
            ? prev.unlockedEncyclopedia 
            : [...prev.unlockedEncyclopedia, offer.offersFloppa.rarity]
    }));

    setTradeOffers(prev => prev.filter(o => o.id !== offer.id));
    alert("Trade successful!");
  };

  const handleRejectTrade = (offerId: string) => {
    setTradeOffers(prev => prev.filter(o => o.id !== offerId));
  };

  const updateQuestProgress = (type: QuestType, amount: number) => {
    setQuests(prev => prev.map(q => {
      if (q.type === type && !q.isClaimed && q.currentAmount < q.targetAmount) {
        return { ...q, currentAmount: Math.min(q.targetAmount, q.currentAmount + amount) };
      }
      return q;
    }));
  };

  const claimQuestReward = (id: string) => {
    const quest = quests.find(q => q.id === id);
    if (quest && !quest.isClaimed && quest.currentAmount >= quest.targetAmount) {
      addMoney(quest.reward);
      setQuests(prev => prev.map(q => q.id === id ? { ...q, isClaimed: true } : q));
    }
  };

  const addMoney = (amount: number) => {
    setStats(prev => ({
      ...prev,
      money: prev.money + amount,
      experience: prev.experience + (amount / 2),
      level: Math.floor((prev.experience + amount / 2) / 100) + 1
    }));
  };

  const handleKibbleWorkComplete = (amount: number) => {
    setStats(prev => ({
      ...prev,
      kibbleAmount: Math.max(0, prev.kibbleAmount - KIBBLE_COST_PER_TASK),
      money: prev.money + amount,
      experience: prev.experience + (amount / 2),
      level: Math.floor((prev.experience + amount / 2) / 100) + 1
    }));
  };

  const toggleShopStatus = () => {
    setStats(prev => ({ ...prev, isShopOpen: !prev.isShopOpen }));
  };

  const buyFloppa = () => {
    if (stats.money >= FLOPPA_BASE_PRICE) {
      const newFloppa: Floppa = {
        id: Math.random().toString(36).substr(2, 9),
        name: FLOPPA_NAMES[Math.floor(Math.random() * FLOPPA_NAMES.length)],
        happiness: 50,
        value: FLOPPA_BASE_PRICE,
        image: FLOPPA_IMAGES[0],
        rarity: Math.random() > 0.9 ? 'Legendary' : Math.random() > 0.7 ? 'Epic' : Math.random() > 0.4 ? 'Rare' : 'Common',
        health: 'Healthy'
      };
      
      setInventory(prev => [...prev, newFloppa]);
      setStats(prev => ({ 
          ...prev, 
          money: prev.money - FLOPPA_BASE_PRICE,
          unlockedEncyclopedia: prev.unlockedEncyclopedia.includes(newFloppa.rarity) 
            ? prev.unlockedEncyclopedia 
            : [...prev.unlockedEncyclopedia, newFloppa.rarity]
      }));
    } else {
      alert("Not enough Floppa Coins! Go work for some!");
    }
  };

  const buyKibble = () => {
    if (stats.money >= KIBBLE_PRICE) {
      setStats(prev => ({
        ...prev,
        money: prev.money - KIBBLE_PRICE,
        kibbleAmount: prev.kibbleAmount + KIBBLE_PACK_AMOUNT
      }));
    }
  };

  const buyMedicalItem = (type: 'bandage' | 'medicine' | 'syrup', price: number) => {
    if (stats.money >= price) {
      setStats(prev => ({
        ...prev,
        money: prev.money - price,
        bandageCount: type === 'bandage' ? prev.bandageCount + 1 : prev.bandageCount,
        medicineCount: type === 'medicine' ? prev.medicineCount + 1 : prev.medicineCount,
        syrupCount: type === 'syrup' ? prev.syrupCount + 1 : prev.syrupCount,
      }));
    }
  };

  const handleHireStaff = (role: keyof HiredStaff, cost: number) => {
    if (stats.money >= cost) {
      setStats(prev => ({
        ...prev,
        money: prev.money - cost,
        hiredStaff: {
          ...prev.hiredStaff,
          [role]: true
        }
      }));
    }
  };

  const handleSellClick = (id: string) => {
    if (!stats.isShopOpen) {
      alert("The shop is closed! Open it to sell Floppas.");
      return;
    }
    const floppa = inventory.find(f => f.id === id);
    if (floppa && floppa.health !== 'Healthy') {
      alert("You cannot sell a sick or injured Floppa! Heal them first.");
      return;
    }
    setSellingFloppaId(id);
  };

  const handleDeliveryStart = (floppa: Floppa) => {
    if (floppa.health !== 'Healthy') {
      alert("You cannot deliver a sick or injured Floppa!");
      return;
    }
    setDeliveringFloppa(floppa);
  };

  const handleDeliverySuccess = () => {
    if (!deliveringFloppa) return;
    const baseValue = Math.floor(deliveringFloppa.value * (deliveringFloppa.happiness / 100 + 0.5));
    const deliveryBonus = 50 + (deliveringFloppa.rarity === 'Legendary' ? 100 : 0);
    const totalReward = baseValue + deliveryBonus;

    setStats(prev => ({ ...prev, money: prev.money + totalReward }));
    setInventory(prev => prev.filter(f => f.id !== deliveringFloppa.id));
    updateQuestProgress(QuestType.SELL_FLOPPAS, 1);
    setDeliveringFloppa(null);
  };

  const handleDeliveryCrash = () => {
    if (!deliveringFloppa) return;
    setInventory(prev => prev.map(f => {
      if (f.id === deliveringFloppa.id) {
        return { ...f, health: 'Injured', happiness: Math.max(0, f.happiness - 40) };
      }
      return f;
    }));
    setDeliveringFloppa(null);
  };

  const completeSale = () => {
    if (!sellingFloppaId) return;
    const floppaToSell = inventory.find(f => f.id === sellingFloppaId);
    if (floppaToSell) {
      const sellPrice = Math.floor(floppaToSell.value * (floppaToSell.happiness / 100 + 0.5));
      setStats(prev => ({ ...prev, money: prev.money + sellPrice }));
      setInventory(prev => prev.filter(f => f.id !== sellingFloppaId));
      updateQuestProgress(QuestType.SELL_FLOPPAS, 1);
      setTradeOffers(prev => prev.filter(o => o.wantsFloppaId !== sellingFloppaId));
    }
    setSellingFloppaId(null);
  };

  const handleSaleTimeout = () => {
    if (isNightmare) {
        setIsGameOver(true);
        setSellingFloppaId(null);
        return;
    }
    if (!sellingFloppaId) return;
    setInventory(prev => prev.map(f => {
      if (f.id === sellingFloppaId) {
        return { ...f, health: 'Injured', happiness: Math.max(0, f.happiness - 50) };
      }
      return f;
    }));
    setSellingFloppaId(null);
  };

  const initiatePlay = (floppa: Floppa) => {
    if (floppa.health !== 'Healthy') {
      alert("This Floppa is not feeling well enough to play! Heal them first.");
      return;
    }
    setPlayingFloppa(floppa);
  };

  const completePlay = () => {
    if (!playingFloppa) return;
    const id = playingFloppa.id;
    let happinessReachedMax = false;

    setInventory(prev => prev.map(f => {
      if (f.id === id) {
        const newHappiness = Math.min(100, f.happiness + 20);
        if (newHappiness >= 100 && f.happiness < 100) happinessReachedMax = true;
        return { ...f, happiness: newHappiness, value: f.value + 10 };
      }
      return f;
    }));

    if (happinessReachedMax) updateQuestProgress(QuestType.MAX_HAPPINESS, 1);
    addMoney(2); 
    setPlayingFloppa(null);
  };

  const initiateHeal = (floppa: Floppa) => {
    if (floppa.health === 'Injured' && stats.bandageCount < 1) {
      alert("You need a Bandage! Buy one from the Pharmacy in the Shop.");
      return;
    }
    if (floppa.health === 'Sick' && stats.medicineCount < 1) {
      alert("You need Medicine! Buy pills from the Pharmacy in the Shop.");
      return;
    }
    if (floppa.health === 'Coughing' && stats.syrupCount < 1) {
      alert("You need Syrup! Buy some from the Pharmacy in the Shop.");
      return;
    }
    setHealingFloppa(floppa);
  };

  const completeHeal = () => {
    if (!healingFloppa) return;
    setStats(prev => ({
      ...prev,
      bandageCount: healingFloppa.health === 'Injured' ? prev.bandageCount - 1 : prev.bandageCount,
      medicineCount: healingFloppa.health === 'Sick' ? prev.medicineCount - 1 : prev.medicineCount,
      syrupCount: healingFloppa.health === 'Coughing' ? prev.syrupCount - 1 : prev.syrupCount,
      experience: prev.experience + 5 
    }));
    setInventory(prev => prev.map(f => 
      f.id === healingFloppa.id ? { ...f, health: 'Healthy' as const, happiness: f.happiness + 10 } : f
    ));
    setHealingFloppa(null);
  };

  if (!gameStarted) {
    return <MainMenu onStart={handleStartGame} />;
  }

  const sellingFloppa = inventory.find(f => f.id === sellingFloppaId);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isNightmare ? 'bg-slate-900 text-slate-100' : 'bg-amber-50 text-slate-800'}`}>
      
      {isWinter && (
        <div className="fixed inset-0 pointer-events-none z-0">
           {[...Array(30)].map((_, i) => (
             <div key={i} className="snowflake text-xl" style={{ left: `${Math.random() * 100}%`, animationDuration: `${5 + Math.random() * 10}s`, animationDelay: `-${Math.random() * 5}s`, opacity: 0.8 }}>❄️</div>
           ))}
        </div>
      )}

      {isGameOver && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4">
            <div className="text-center animate-bounce">
                <h1 className="text-8xl mb-6">💀</h1>
                <h2 className="text-6xl font-black text-red-600 mb-4 tracking-tighter">YOU DIED</h2>
                <p className="text-xl text-red-400 font-bold mb-8">Customer Rage was fatal.</p>
                <button onClick={handleBackToMenu} className="px-8 py-3 bg-white text-black font-bold text-xl rounded-xl hover:bg-slate-200">Return to Main Menu</button>
            </div>
        </div>
      )}

      {showSaveNotification && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg font-bold animate-bounce">
          💾 Game Saved!
        </div>
      )}

      <Header 
        shopName={stats.shopName} 
        isShopOpen={stats.isShopOpen} 
        onToggleShop={toggleShopStatus} 
        isNightmare={isNightmare} 
        onBackToMenu={handleBackToMenu}
        onSave={saveGame}
      />
      
      <main className="flex-1 container mx-auto p-4 max-w-5xl relative z-10">
        <Stats stats={stats} floppaCount={inventory.length} />
        
        <div className="mt-6 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className={`flex flex-wrap rounded-xl shadow-sm p-1 mb-6 gap-1 ${isNightmare ? 'bg-slate-800' : 'bg-white'}`}>
              <button onClick={() => setActiveTab('work')} className={`flex-1 min-w-[80px] py-2 rounded-lg font-semibold transition text-sm sm:text-base ${activeTab === 'work' ? (isNightmare ? 'bg-red-900 text-white' : 'bg-amber-400 text-white') : (isNightmare ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-amber-50')}`}>💼 Work</button>
              <button onClick={() => setActiveTab('shop')} className={`flex-1 min-w-[80px] py-2 rounded-lg font-semibold transition text-sm sm:text-base ${activeTab === 'shop' ? (isNightmare ? 'bg-red-900 text-white' : 'bg-amber-400 text-white') : (isNightmare ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-amber-50')}`}>🛒 Shop</button>
              <button onClick={() => setActiveTab('inventory')} className={`flex-1 min-w-[80px] py-2 rounded-lg font-semibold transition text-sm sm:text-base ${activeTab === 'inventory' ? (isNightmare ? 'bg-red-900 text-white' : 'bg-amber-400 text-white') : (isNightmare ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-amber-50')}`}>🐾 Floppas</button>
              <button onClick={() => setActiveTab('house')} className={`flex-1 min-w-[80px] py-2 rounded-lg font-semibold transition text-sm sm:text-base ${activeTab === 'house' ? (isNightmare ? 'bg-red-900 text-white' : 'bg-amber-400 text-white') : (isNightmare ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-amber-50')}`}>🏠 House</button>
              <button onClick={() => setActiveTab('trade')} className={`flex-1 min-w-[80px] py-2 rounded-lg font-semibold transition relative text-sm sm:text-base ${activeTab === 'trade' ? (isNightmare ? 'bg-red-900 text-white' : 'bg-amber-400 text-white') : (isNightmare ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-amber-50')}`}>🌐 Trades {tradeOffers.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-pulse">{tradeOffers.length}</span>}</button>
              <button onClick={() => setActiveTab('hiring')} className={`flex-1 min-w-[80px] py-2 rounded-lg font-semibold transition text-sm sm:text-base ${activeTab === 'hiring' ? (isNightmare ? 'bg-indigo-900 text-white' : 'bg-indigo-500 text-white') : (isNightmare ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-indigo-50 text-indigo-800')}`}>👔 Staff</button>
               <button onClick={() => setActiveTab('encyclopedia')} className={`flex-1 min-w-[40px] py-2 rounded-lg font-semibold transition text-sm sm:text-base ${activeTab === 'encyclopedia' ? (isNightmare ? 'bg-purple-900 text-white' : 'bg-purple-500 text-white') : (isNightmare ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-purple-50 text-purple-800')}`} title="Encyclopedia">📚</button>
            </div>

            {activeTab === 'work' && <WorkArea onWorkComplete={addMoney} onKibbleWorkComplete={handleKibbleWorkComplete} kibbleAmount={stats.kibbleAmount} />}
            {activeTab === 'shop' && <ShopArea onBuy={buyFloppa} onBuyKibble={buyKibble} onBuyMedical={buyMedicalItem} money={stats.money} price={FLOPPA_BASE_PRICE} medicalCounts={{ bandages: stats.bandageCount, medicines: stats.medicineCount, syrups: stats.syrupCount }} />}
            {activeTab === 'hiring' && <HiringShop money={stats.money} hiredStaff={stats.hiredStaff} onHire={handleHireStaff} />}
            {activeTab === 'trade' && <TradingArea offers={tradeOffers} inventory={inventory} onAccept={handleAcceptTrade} onReject={handleRejectTrade} isShopOpen={stats.isShopOpen} />}
            {activeTab === 'encyclopedia' && <Encyclopedia unlocked={stats.unlockedEncyclopedia} isNightmare={isNightmare} />}
            {activeTab === 'house' && <HouseArea isNightmare={isNightmare} isWinter={isWinter} />}
            {activeTab === 'inventory' && (
              <div className="space-y-4">
                 <div className={`p-3 rounded-xl border flex gap-4 overflow-x-auto shadow-sm ${isNightmare ? 'bg-slate-800 border-slate-700' : 'bg-white border-red-100'}`}>
                   <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-lg border border-red-100 min-w-fit text-slate-800">
                     <span className="text-xl">🩹</span>
                     <div><p className="text-[10px] font-bold text-red-800 uppercase">Bandages</p><p className="font-bold text-red-600 leading-none">{stats.bandageCount}</p></div>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg border border-blue-100 min-w-fit text-slate-800">
                     <span className="text-xl">💊</span>
                     <div><p className="text-[10px] font-bold text-blue-800 uppercase">Medicine</p><p className="font-bold text-blue-600 leading-none">{stats.medicineCount}</p></div>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-lg border border-purple-100 min-w-fit text-slate-800">
                     <span className="text-xl">🧉</span>
                     <div><p className="text-[10px] font-bold text-purple-800 uppercase">Syrup</p><p className="font-bold text-purple-600 leading-none">{stats.syrupCount}</p></div>
                   </div>
                 </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {inventory.length === 0 ? (
                    <div className={`col-span-full py-12 text-center rounded-2xl border-2 border-dashed ${isNightmare ? 'bg-slate-800 border-slate-600' : 'bg-white border-amber-200'}`}>
                      <p className="text-slate-400">No floppas yet. Go buy one from the shop!</p>
                    </div>
                  ) : (
                    inventory.map(f => (
                      <div key={f.id} className={`p-4 rounded-2xl shadow-sm border flex flex-col relative overflow-hidden ${isNightmare ? 'bg-slate-800 border-red-900' : 'bg-white border-amber-100'}`}>
                        {f.health !== 'Healthy' && (
                          <div className={`absolute top-0 left-0 right-0 py-1 text-center text-xs font-bold text-white z-10 ${f.health === 'Injured' ? 'bg-red-500' : f.health === 'Sick' ? 'bg-green-600' : 'bg-purple-500'}`}>
                            {f.health === 'Injured' ? '🤕 INJURED' : f.health === 'Sick' ? '🤢 SICK' : '🤒 COUGHING'}
                          </div>
                        )}

                        <div className={`relative h-48 mb-3 rounded-xl flex items-center justify-center overflow-hidden mt-4 ${isNightmare ? 'bg-black' : 'bg-amber-50'}`}>
                          <img src={f.image} alt={f.name} className={`w-full h-full object-contain ${isNightmare ? 'grayscale contrast-125' : ''}`} />
                          <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold text-white shadow-sm ${f.rarity === 'Legendary' ? 'bg-purple-600' : f.rarity === 'Epic' ? 'bg-blue-600' : f.rarity === 'Rare' ? 'bg-green-600' : 'bg-slate-400'}`}>
                            {f.rarity}
                          </span>
                        </div>
                        <h3 className={`font-bold text-lg ${isNightmare ? 'text-red-200' : 'text-slate-800'}`}>{f.name}</h3>
                        <div className="flex justify-between items-center text-sm text-slate-500 mb-4">
                          <span>Happiness: {f.happiness}%</span>
                          <span>Value: {Math.floor(f.value * (f.happiness / 100 + 0.5))} 🪙</span>
                        </div>
                        
                        {f.health === 'Healthy' ? (
                          <div className="flex flex-col gap-2">
                             <div className="flex gap-2">
                                <button onClick={() => initiatePlay(f)} className="flex-1 bg-sky-100 text-sky-700 py-2 rounded-lg font-bold hover:bg-sky-200 transition text-sm">🎾 Play</button>
                                <button onClick={() => handleSellClick(f.id)} disabled={!stats.isShopOpen} className={`flex-1 py-2 rounded-lg font-bold transition shadow-sm text-sm ${stats.isShopOpen ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                                  {stats.isShopOpen ? '💰 Sell' : '🔒 Closed'}
                                </button>
                             </div>
                             <button onClick={() => handleDeliveryStart(f)} className={`w-full py-2 bg-gradient-to-r text-white rounded-lg font-bold shadow-sm transition flex items-center justify-center gap-2 ${isNightmare ? 'from-red-900 to-black hover:from-red-800 hover:to-slate-900' : 'from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700'}`}>
                               <span>{isNightmare ? '💀' : '🏍️'}</span> Deliver (+Bonus)
                             </button>
                          </div>
                        ) : (
                          <button onClick={() => initiateHeal(f)} className={`w-full py-2 rounded-lg font-bold text-white shadow-sm animate-pulse transition ${f.health === 'Injured' ? 'bg-red-500 hover:bg-red-600' : f.health === 'Sick' ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-500 hover:bg-purple-600'}`}>
                             {f.health === 'Injured' ? '🩹 Heal Wound' : f.health === 'Sick' ? '💊 Give Medicine' : '🧉 Give Syrup'}
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <aside className="w-full md:w-80 flex flex-col gap-6 relative z-10">
            <QuestLog quests={quests} onClaim={claimQuestReward} onRefresh={generateDailyQuests} />
            <ChatBot />
          </aside>
        </div>
      </main>
      
      <footer className={`p-4 text-center text-sm relative z-10 ${isNightmare ? 'bg-black text-red-800' : 'bg-amber-100 text-amber-800'}`}>
        <p>© 2024 Floppa Haven - Hand-raised Caracals only. Don't touch the ears!</p>
      </footer>

      {sellingFloppa && <CashRegister floppa={sellingFloppa} onComplete={completeSale} onCancel={() => setSellingFloppaId(null)} onTimeout={handleSaleTimeout} />}
      {playingFloppa && <PlayWithFloppaMinigame floppa={playingFloppa} onComplete={completePlay} onCancel={() => setPlayingFloppa(null)} />}
      {healingFloppa && <HealMinigame floppa={healingFloppa} onComplete={completeHeal} onCancel={() => setHealingFloppa(null)} />}
      {deliveringFloppa && <MotorbikeMinigame floppa={deliveringFloppa} onSuccess={handleDeliverySuccess} onCrash={handleDeliveryCrash} onCancel={() => setDeliveringFloppa(null)} isNightmare={isNightmare} />}
    </div>
  );
};

export default App;
