import React from 'react';
import { useMatch } from '../context/MatchContext';
import { DownloadCloud, Sparkles, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TopHeaderProps {
  onOpenAi: () => void;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const TopHeader = ({ onOpenAi }: TopHeaderProps) => {
  const { currentTime, matchStats, exportToJSON } = useMatch();
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header className="h-20 bg-transparent border-none px-6 flex items-center justify-between shrink-0 z-10 transition-colors relative">
      <div className="flex flex-col justify-center">
        <h1 className="text-xl lg:text-2xl font-black text-white flex items-center gap-3 tracking-tight">
          Football Club vs Navbahor
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-white/10 text-white tracking-widest uppercase border border-white/20 shadow-sm">
            {t('header.analysis')}
          </span>
        </h1>
        <div className="flex items-center gap-3 text-xs text-white/70 font-semibold mt-1 uppercase tracking-wider">
          <span>Uzbekistan Super League</span>
          <span className="w-1 h-1 rounded-full bg-white/40"></span>
          <span>15 Sep 2026</span>
          <span className="w-1 h-1 rounded-full bg-white/40"></span>
          <span className="flex items-center text-football-red gap-1.5 font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-football-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-football-red shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>
            </span>
            {t('header.live')}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        
        {/* Custom Language Switcher */}
        <div className="relative">
          <button 
            onClick={() => {
              const el = document.getElementById('lang-dropdown');
              if (el) el.classList.toggle('hidden');
            }}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Globe size={16} className="text-white/80" />
            <span className="text-xs font-bold text-white uppercase">
              {i18n.language || 'UZB'}
            </span>
          </button>
          
          <div id="lang-dropdown" className="absolute right-0 top-full mt-2 w-24 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg hidden overflow-hidden z-50">
            {['en', 'uz', 'ru'].map(lang => (
              <div 
                key={lang}
                onClick={() => {
                  i18n.changeLanguage(lang);
                  const el = document.getElementById('lang-dropdown');
                  if (el) el.classList.add('hidden');
                }}
                className={`px-4 py-2 text-xs font-bold cursor-pointer transition-colors ${i18n.language === lang ? 'bg-football-blue text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                {lang === 'en' ? 'ENG' : lang === 'uz' ? 'UZB' : 'RUS'}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={exportToJSON}
            className="glass-button flex items-center gap-2 px-4 py-2 bg-white/10 border-white/20 text-white text-xs font-bold rounded-xl hover:bg-white/20"
            title={t('header.export_json')}
          >
            <DownloadCloud size={16} />
            <span className="hidden sm:inline">{t('header.export_json')}</span>
          </button>
          <button 
            onClick={onOpenAi}
            className="glass-button flex items-center gap-2 px-4 py-2 bg-football-blue/80 text-white text-xs font-bold rounded-xl border-football-blue hover:bg-football-blue hover:text-white group shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            title={t('header.ai_assistant')}
          >
            <Sparkles size={16} className="group-hover:animate-pulse" />
            <span className="hidden sm:inline">{t('header.ai_assistant')}</span>
          </button>
        </div>

        <div className="text-center px-8 border-x border-white/20 hidden md:block">
          <div className="text-[10px] text-white/70 font-bold tracking-widest mb-1 uppercase">{t('header.match_time')}</div>
          <div className="text-3xl font-black text-white tracking-tight drop-shadow-md" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatTime(currentTime)}
          </div>
        </div>
        
        <div className="flex items-center gap-4 pl-4">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-sm font-black text-white shadow-sm">FC</div>
          <div className="font-black text-2xl text-white flex items-center gap-2 drop-shadow-md">
            <span className="text-3xl text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">{matchStats.fcScore}</span>
            <span className="text-white/60 font-medium">-</span>
            <span className="text-3xl text-purple-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]">{matchStats.nvScore}</span>
          </div>
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-sm font-black text-white shadow-sm">NV</div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
