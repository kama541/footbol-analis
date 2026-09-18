import React from 'react';
import { useMatch } from '../context/MatchContext';
import { useTranslation } from 'react-i18next';

const MatchStats = () => {
  const { matchStats } = useMatch();
  const { t } = useTranslation();
  
  const stats = [
    { label: t('stats.possession'), fc: matchStats.fcPossession, nv: matchStats.nvPossession, format: '%' },
    { label: t('stats.shots'), fc: matchStats.fcShots, nv: matchStats.nvShots },
    { label: t('stats.shots_on_target'), fc: matchStats.fcShotsOnTarget, nv: matchStats.nvShotsOnTarget },
    { label: t('stats.corners'), fc: matchStats.fcCorners, nv: matchStats.nvCorners },
    { label: t('stats.fouls'), fc: matchStats.fcFouls, nv: matchStats.nvFouls },
    { label: t('stats.xg'), fc: matchStats.fcXG.toFixed(2), nv: matchStats.nvXG.toFixed(2) },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1e2235] relative z-10 overflow-hidden border-r border-slate-800">
      <div className="p-4 border-b border-slate-800 bg-[#252a3d] sticky top-0 flex justify-between items-center z-20">
        <h2 className="font-black text-white tracking-tight text-lg">{t('stats.match_stats')}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar relative z-10">
        <div className="flex justify-between items-center px-1 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-football-blue/20 to-football-blue/10 border border-football-blue/20 text-football-blue rounded-xl flex items-center justify-center font-black text-sm shadow-sm">FC</div>
          <div className="text-[10px] font-black text-slate-400 bg-slate-800/50 px-2 py-1 rounded-full tracking-widest">VS</div>
          <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 text-slate-300 rounded-xl flex items-center justify-center font-black text-sm shadow-sm">NV</div>
        </div>
        
        {stats.map((stat, i) => {
          const total = Number(stat.fc) + Number(stat.nv);
          const fcPercent = total === 0 ? 50 : (Number(stat.fc) / total) * 100;
          
          return (
            <div key={i} className="group p-4 rounded-2xl bg-[#252a3d] border border-slate-800 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center text-xs font-black mb-3">
                <span className="text-football-blue w-10 text-left text-sm drop-shadow-sm">{stat.fc}{stat.format}</span>
                <span className="text-slate-400 uppercase tracking-widest text-[10px]">{stat.label}</span>
                <span className="text-slate-300 w-10 text-right text-sm">{stat.nv}{stat.format}</span>
              </div>
              <div className="h-2.5 flex bg-slate-800 rounded-full overflow-hidden shadow-inner relative">
                <div 
                  className="bg-gradient-to-r from-football-blue to-football-purple transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${fcPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]"></div>
                </div>
                <div 
                  className="bg-slate-600 transition-all duration-1000 ease-out"
                  style={{ width: `${100 - fcPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchStats;
