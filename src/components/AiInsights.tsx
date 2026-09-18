import React, { useState, useEffect, useRef } from 'react';
import { useMatch } from '../context/MatchContext';
import { generateTacticalAnalysis } from '../services/aiService';
import { Sparkles, X, Loader2, ChevronDown, ChevronUp, Activity, Target, Zap, Clock } from 'lucide-react';

interface AiInsightsProps {
  isOpen: boolean;
  onClose: () => void;
}

const AiInsights = ({ isOpen, onClose }: AiInsightsProps) => {
  const { events, matchStats, players, currentTime, isPlaying } = useMatch();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoMode, setAutoMode] = useState(false);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-generate analysis every 5 minutes of match time when autoMode is on
  useEffect(() => {
    if (autoMode && isPlaying && currentTime > 0 && currentTime % 300 === 0) {
      handleGenerate();
    }
  }, [currentTime, autoMode, isPlaying]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
  }, []);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateTacticalAnalysis({
        currentTime,
        matchStats,
        events,
        players,
        topPlayers: [...players].sort((a, b) => b.actions - a.actions).slice(0, 3)
      });
      setAnalysis(result);
    } catch (err: any) {
      if (err?.message?.includes('API kaliti')) {
        setError('⚠️ OpenAI API kaliti topilmadi. .env faylida VITE_OPENAI_API_KEY ni sozlang.');
      } else {
        setError(`Xatolik: ${err?.message || "Noma'lum xato. Qayta urinib ko'ring."}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  // Live stats summary
  const topSprinter = [...players].sort((a, b) => b.sprints - a.sprints)[0];
  const topRunner = [...players].sort((a, b) => b.dist - a.dist)[0];
  const goalsFC = matchStats.fcScore;
  const goalsNV = matchStats.nvScore;

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-[480px] h-full bg-[#1a1e2e] border-l border-slate-800 shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">

        {/* Header */}
        <div className="h-14 border-b border-slate-800 px-5 flex items-center justify-between shrink-0 bg-[#1e2235]">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="text-[#FFE600]" size={18} />
            AI Taktik Tahlil
            <span className="text-[10px] bg-[#FFE600]/10 text-[#FFE600] border border-[#FFE600]/20 px-2 py-0.5 rounded font-black tracking-wider">LIVE</span>
          </h2>
          <div className="flex items-center gap-2">
            {/* Auto mode toggle */}
            <button
              onClick={() => setAutoMode(!autoMode)}
              className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${autoMode ? 'bg-[#FFE600]/10 text-[#FFE600] border-[#FFE600]/30' : 'text-slate-500 border-slate-700 hover:text-white'}`}
              title="Har 5 daqiqada avtomatik tahlil"
            >
              AUTO
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Live Match Snapshot */}
        <div className="px-5 py-3 border-b border-slate-800 bg-[#252a3d]/50 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Joriy holat</span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded flex items-center gap-1">
              <Clock size={9} /> {formatTime(currentTime)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#1e2235] rounded-lg p-2.5 text-center border border-slate-800">
              <div className="text-xl font-black text-white">{goalsFC} : {goalsNV}</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">Hisob</div>
            </div>
            <div className="bg-[#1e2235] rounded-lg p-2.5 text-center border border-slate-800">
              <div className="text-sm font-black text-[#FFE600]">{matchStats.fcPossession}%</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">To'p nazorati</div>
            </div>
            <div className="bg-[#1e2235] rounded-lg p-2.5 text-center border border-slate-800">
              <div className="text-sm font-black text-white">{matchStats.fcShots}</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">Zarbalar</div>
            </div>
          </div>

          {/* Top performers */}
          <div className="flex gap-2 mt-2">
            {topSprinter && (
              <div className="flex-1 bg-[#1e2235] rounded-lg px-2.5 py-2 border border-slate-800 flex items-center gap-2">
                <Zap size={12} className="text-[#FFE600] shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-slate-200 truncate">{topSprinter.name.split(' ')[0]}</div>
                  <div className="text-[9px] text-slate-500">{topSprinter.sprints} sprint</div>
                </div>
              </div>
            )}
            {topRunner && (
              <div className="flex-1 bg-[#1e2235] rounded-lg px-2.5 py-2 border border-slate-800 flex items-center gap-2">
                <Activity size={12} className="text-football-blue shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-slate-200 truncate">{topRunner.name.split(' ')[0]}</div>
                  <div className="text-[9px] text-slate-500">{topRunner.dist.toFixed(1)} km</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Generate button */}
        <div className="px-5 py-3 border-b border-slate-800 shrink-0">
          <div className="text-[11px] text-slate-500 mb-2.5 leading-relaxed">
            AI statistika, voqealar va o'yinchilar ma'lumotlariga asoslanib professional taktik tahlil yozib beradi.
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 bg-[#FFE600] hover:bg-yellow-400 text-black font-black rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            {loading ? 'AI tahlil qilmoqda...' : 'Tahlilni Boshlash'}
          </button>
          {autoMode && (
            <p className="text-[10px] text-[#FFE600]/60 text-center mt-1.5">
              ⚡ AUTO: har 5 daqiqada yangilanadi
            </p>
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm border border-red-500/20">
              {error}
            </div>
          )}

          {loading && !analysis && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <Loader2 className="animate-spin mb-3 text-[#FFE600]" size={32} />
              <p className="text-sm font-medium">AI o'yinni tahlil qilmoqda...</p>
              <p className="text-xs mt-1 text-slate-600">Bu bir necha soniya davom etishi mumkin</p>
            </div>
          )}

          {analysis && (
            <div className="bg-[#1e2235] border border-slate-800 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2 text-sm">
                <Sparkles size={14} className="text-[#FFE600]" />
                AI Xulosasi
                <span className="ml-auto text-[9px] text-slate-500 font-mono">{formatTime(currentTime)}</span>
              </h3>
              <div className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                {analysis}
              </div>
            </div>
          )}

          {!analysis && !loading && !error && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-600 text-center">
              <Target size={40} className="mb-3 opacity-40" />
              <p className="text-sm font-medium text-slate-500">Hali tahlil yo'q</p>
              <p className="text-xs mt-1">"Tahlilni Boshlash" tugmasini bosing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiInsights;
