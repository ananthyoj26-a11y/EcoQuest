import React, { useState } from 'react';
import { QRPortal, User } from '../types';
import { QrCode, MapPin, Sparkles, CheckCircle2, Search, Compass, AlertCircle } from 'lucide-react';
import { apiService } from '../services/apiService';
import { audioService } from '../services/audioService';

interface Props {
  user: User;
  portals: QRPortal[];
  onRefreshPortals: () => void;
}

export const EcoHuntView: React.FC<Props> = ({ user, portals, onRefreshPortals }) => {
  const [inputCode, setInputCode] = useState('');
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleScanCode = async (codeToScan?: string) => {
    const code = codeToScan || inputCode;
    if (!code.trim()) return;

    audioService.playClick();
    setScanMessage(null);
    setIsError(false);

    try {
      const res = await apiService.scanQRPortal(code);
      if (res.alreadyScanned) {
        setScanMessage(`Portal "${res.portal.name}" already scanned today!`);
        setIsError(true);
      } else {
        audioService.playQuestComplete();
        setScanMessage(`Success! Discovered "${res.portal.name}" (+${res.xpEarned} XP, +${res.coinsEarned} Eco Coins)!`);
        setIsError(false);
        setInputCode('');
        onRefreshPortals();
      }
    } catch (err) {
      console.error('Scan portal error:', err);
      setScanMessage('Invalid QR portal code! Please check campus location.');
      setIsError(true);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 backdrop-blur-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 uppercase mb-2">
            <QrCode className="w-3.5 h-3.5" /> CAMPUS TREASURE HUNT
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">QR ECO HUNT & PORTALS</h1>
          <p className="text-xs text-slate-400 mt-1">
            Locate physical QR code portals installed across campus locations (Library, Rooftops, Gardens, Canteen) to unlock hidden rewards.
          </p>
        </div>
      </div>

      {/* Manual Scanner Box */}
      <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-6 backdrop-blur-xl space-y-3 font-mono">
        <h3 className="font-extrabold text-sm text-white tracking-wider uppercase flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" /> SCANNER PORTAL ENTRY
        </h3>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Enter or paste portal code (e.g. ECO_WATER_LIB_9921)..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-emerald-400 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleScanCode()}
            className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer transform active:scale-95"
          >
            SCAN PORTAL
          </button>
        </div>

        {scanMessage && (
          <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            isError ? 'bg-rose-950/80 border-rose-500/40 text-rose-300' : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
          }`}>
            {isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{scanMessage}</span>
          </div>
        )}
      </div>

      {/* List of Campus Portals & Clues */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {portals.map((p) => (
          <div
            key={p.id}
            className={`bg-slate-900/90 border rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between transition-all relative overflow-hidden ${
              p.scanned ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800'
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800 uppercase">
                  {p.category}
                </span>

                {p.scanned ? (
                  <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> DISCOVERED
                  </span>
                ) : (
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    +{p.xpReward} XP • +{p.coinsReward} 🪙
                  </span>
                )}
              </div>

              <h3 className="text-lg font-black text-white mb-1">{p.name}</h3>
              <p className="text-xs font-mono text-slate-400 flex items-center gap-1 mb-3">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {p.location}
              </p>

              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3 text-xs text-slate-300 italic mb-4 leading-relaxed">
                "{p.clueHint}"
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center font-mono text-xs">
              <span className="text-slate-500 text-[10px]">{p.code}</span>
              {!p.scanned && (
                <button
                  onClick={() => handleScanCode(p.code)}
                  className="bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/40 px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  SIMULATE SCAN
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
