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
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shrink-0 shadow-sm z-10 transition-colors">
      <div>
        <h1 className="text-xl font-bold text-football-navy dark:text-white flex items-center gap-2">
          Football Club vs Navbahor
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-football-blue/10 text-football-blue tracking-wider uppercase">
            {t('header.analysis')}
          </span>
        </h1>
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
          <span>UZBEKISTAN SUPER LEAGUE</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <span>15 Sep 2026</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <span className="flex items-center text-football-red gap-1.5 font-bold uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-football-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-football-red"></span>
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
            className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Globe size={16} className="text-slate-500 dark:text-slate-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            title={t('header.export_json')}
          >
            <DownloadCloud size={16} />
            <span className="hidden sm:inline">{t('header.export_json')}</span>
          </button>
          <button 
            onClick={onOpenAi}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-football-purple/10 hover:bg-football-purple/20 text-football-purple dark:text-football-purple text-xs font-bold rounded-lg transition-colors border border-football-purple/20"
            title={t('header.ai_assistant')}
          >
            <Sparkles size={16} />
            <span className="hidden sm:inline">{t('header.ai_assistant')}</span>
          </button>
        </div>

        <div className="text-center px-6 border-x border-slate-200 dark:border-slate-800 hidden md:block">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-wider mb-0.5 uppercase">{t('header.match_time')}</div>
          <div className="text-2xl font-black text-football-navy dark:text-white tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatTime(currentTime)}
          </div>
        </div>
        
        <div className="flex items-center gap-3 pl-2">
          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">FC</div>
          <div className="font-black text-xl text-football-navy dark:text-white">
            {matchStats.fcScore} - {matchStats.nvScore}
          </div>
          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">NV</div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
