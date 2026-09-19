import React, { useState } from 'react';
import { useMatch } from '../context/MatchContext';
import { generateTacticalAnalysis } from '../services/aiService';
import { Sparkles, X, Loader2 } from 'lucide-react';

interface AiInsightsProps {
  isOpen: boolean;
  onClose: () => void;
}

const AiInsights = ({ isOpen, onClose }: AiInsightsProps) => {
  const { events, matchStats, players, currentTime } = useMatch();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateTacticalAnalysis({
        currentTime,
        matchStats,
        events,
        topPlayers: players.sort((a, b) => b.actions - a.actions).slice(0, 3)
      });
      setAnalysis(result);
    } catch (err) {
      setError("Tahlil generatsiya qilishda xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-[#0f1115]/60 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-[500px] h-full bg-[#161920] shadow-2xl flex flex-col animate-slide-in-right">
        
        {/* Header */}
        <div className="h-16 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 bg-[#1a1d24] text-white">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="text-[#FFE600]" size={20} />
            AI Taktik Tahlil (Football Vision AI)
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <div className="bg-[#1a1d24] p-4 rounded-xl border border-slate-800 text-sm text-slate-300">
            AI o'yin davomida yig'ilgan statistika (to'p nazorati, zarbalar, xG) va siz kiritgan jonli teglarga asoslanib professional tahlil yozib beradi.
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-[#FFE600] hover:bg-yellow-500 text-black font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            {loading ? 'Tahlil qilinmoqda...' : 'Tahlilni Boshlash'}
          </button>

          {error && (
            <div className="bg-red-900/20 text-red-400 p-4 rounded-xl text-sm border border-red-900/50">
              {error}
            </div>
          )}

          {analysis && (
            <div className="bg-[#1a1d24] border border-slate-800 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-white mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-[#FFE600]" />
                AI Xulosasi
              </h3>
              <div className="prose prose-sm max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed">
                {analysis}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiInsights;
