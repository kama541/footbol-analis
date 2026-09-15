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
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
      <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 flex justify-between items-center">
        <h2 className="font-semibold text-football-navy dark:text-white">{t('stats.match_stats')}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-white dark:bg-slate-900">
        <div className="flex justify-between items-center px-1 mb-2">
          <div className="w-8 h-8 bg-football-blue/10 text-football-blue rounded flex items-center justify-center font-bold text-sm">FC</div>
          <div className="text-xs font-bold text-slate-400">VS</div>
          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded flex items-center justify-center font-bold text-sm">NV</div>
        </div>
        
        {stats.map((stat, i) => {
          const total = Number(stat.fc) + Number(stat.nv) || 1;
          const fcPercent = (Number(stat.fc) / total) * 100;
          
          return (
            <div key={i} className="group">
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-football-blue w-8 text-left">{stat.fc}{stat.format}</span>
                <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</span>
                <span className="text-slate-600 dark:text-slate-300 w-8 text-right">{stat.nv}{stat.format}</span>
              </div>
              <div className="h-2 flex bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="bg-football-blue transition-all duration-500 ease-out"
                  style={{ width: `${fcPercent}%` }}
                />
                <div 
                  className="bg-slate-300 dark:bg-slate-600 transition-all duration-500 ease-out"
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
