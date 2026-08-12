import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShopItem, User } from '../types';
import { ShoppingBag, Coins, Sparkles, Box, CheckCircle2, Ticket, Coffee, Zap, Award } from 'lucide-react';
import { apiService } from '../services/apiService';
import { audioService } from '../services/audioService';

interface Props {
  user: User;
  shopItems: ShopItem[];
  onRefreshShop: () => void;
  onUpdateUser: (updated: Partial<User>) => void;
}

export const EcoShopView: React.FC<Props> = ({
  user,
  shopItems,
  onRefreshShop,
  onUpdateUser
}) => {
  const [crateLoot, setCrateLoot] = useState<{
    type: string;
    name: string;
    amount?: number;
    rarity: string;
    icon: string;
  } | null>(null);
  const [isOpeningCrate, setIsOpeningCrate] = useState(false);

  const handleBuy = async (item: ShopItem) => {
    if (user.coins < item.price) return;
    audioService.playClick();

    try {
      const res = await apiService.buyShopItem(item.id);
      audioService.playQuestComplete();
      onUpdateUser(res.user);
      onRefreshShop();
    } catch (err) {
      console.error('Buy error:', err);
    }
  };

  const handleOpenCrate = async () => {
    if (user.coins < 300 || isOpeningCrate) return;
    audioService.playCrateOpen();
    setIsOpeningCrate(true);
    setCrateLoot(null);

    setTimeout(async () => {
      try {
        const res = await apiService.openEcoCrate();
        audioService.playLevelUp();
        setCrateLoot(res.reward);
        onUpdateUser(res.user);
        setIsOpeningCrate(false);
      } catch (err) {
        console.error('Crate error:', err);
        setIsOpeningCrate(false);
      }
    }, 1200);
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'Rare': return 'text-cyan-400 bg-cyan-950/80 border-cyan-800';
      case 'Epic': return 'text-purple-400 bg-purple-950/80 border-purple-800';
      case 'Legendary': return 'text-amber-400 bg-amber-950/80 border-amber-800';
      default: return 'text-slate-400 bg-slate-950 border-slate-800';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 backdrop-blur-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 uppercase mb-2">
            <ShoppingBag className="w-3.5 h-3.5" /> REWARDS & COSMETICS MARKETPLACE
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">ECO SHOP & CRATES</h1>
          <p className="text-xs text-slate-400 mt-1">
            Redeem earned Eco Coins for avatar frames, pet skins, canteen vouchers, official merchandise, and loot crates.
          </p>
        </div>

        <div className="bg-amber-950/80 border border-amber-500/40 px-4 py-2.5 rounded-2xl font-mono text-xs text-right text-amber-300 flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] text-slate-400">YOUR BALANCE:</div>
            <div className="font-extrabold text-base">{user.coins.toLocaleString()} ECO COINS</div>
          </div>
        </div>
      </div>

      {/* Eco Crates Section */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/40 rounded-3xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.2)]">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{
              rotate: isOpeningCrate ? [0, -10, 10, -10, 10, 0] : [0, 5, -5, 0],
              scale: isOpeningCrate ? [1, 1.15, 1] : 1
            }}
            transition={{ duration: 0.6, repeat: isOpeningCrate ? Infinity : 0 }}
            className="w-20 h-20 rounded-2xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(245,158,11,0.3)] shrink-0"
          >
            📦
          </motion.div>
          <div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
              FEATURED REWARD
            </span>
            <h3 className="text-xl font-black text-white mt-1">MYSTERY ECO CRATE</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Contains guaranteed high XP boosts (+250 XP), bonus coin jackpots (+500 Coins), or legendary titles.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCrate}
          disabled={user.coins < 300 || isOpeningCrate}
          className="bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs uppercase px-6 py-3.5 rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer transform active:scale-95 shrink-0 disabled:opacity-50"
        >
          {isOpeningCrate ? 'OPENING LOOT CRATE...' : 'OPEN CRATE (300 COINS)'}
        </button>
      </div>

      {/* Crate Loot Result Display */}
      {crateLoot && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-amber-500/50 rounded-3xl p-6 text-center space-y-3 font-mono"
        >
          <Sparkles className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
          <h4 className="text-2xl font-black text-white">LOOT REVEALED!</h4>
          <div className="text-lg font-bold text-amber-400">{crateLoot.name}</div>
          <p className="text-xs text-slate-400">Rarity: {crateLoot.rarity}</p>
        </motion.div>
      )}

      {/* Shop Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopItems.map((item) => (
          <div
            key={item.id}
            className={`bg-slate-900/90 border rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between transition-all relative overflow-hidden ${
              item.purchased ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800'
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800 uppercase">
                  {item.category}
                </span>

                <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${getRarityBadge(item.rarity)}`}>
                  {item.rarity}
                </span>
              </div>

              <h3 className="text-lg font-black text-white mb-1">{item.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.description}</p>

              {item.discountCode && (
                <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl font-mono text-xs text-cyan-400 text-center mb-4">
                  Voucher Code: <strong>{item.discountCode}</strong>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center font-mono text-xs">
              <span className="font-extrabold text-amber-400">{item.price} 🪙</span>

              {item.purchased ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> OWNED
                </span>
              ) : (
                <button
                  onClick={() => handleBuy(item)}
                  disabled={user.coins < item.price}
                  className="bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/40 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  PURCHASE
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
