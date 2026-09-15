import React from 'react';
import { useMatch } from '../context/MatchContext';
import { useTranslation } from 'react-i18next';

const PlayerTracking = () => {
  const { players } = useMatch();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl relative z-10 overflow-hidden shadow-[10px_0_20px_rgba(0,0,0,0.05)] border-r border-slate-200/50 dark:border-slate-800/50">
      <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-20">
        <h2 className="font-black text-slate-900 dark:text-white tracking-tight text-lg">{t('stats.player_tracking')}</h2>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 p-4">
        <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 backdrop-blur-md sticky top-0 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50 w-8">#</th>
                <th className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50">Player</th>
                <th className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50 text-right">{t('stats.live_speed')}</th>
                <th className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50 text-right">{t('stats.top_speed')}</th>
                <th className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50 text-right">{t('stats.sprints')}</th>
                <th className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50 text-right">{t('stats.dist')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50 bg-white/40 dark:bg-slate-900/40">
              {players.map((p, index) => (
                <tr 
                  key={p.id} 
                  className="hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 group cursor-default"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="px-4 py-3 text-slate-400 dark:text-slate-500 font-bold text-xs">{p.num}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2 group-hover:text-football-blue transition-colors">
                      {p.name}
                      <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md uppercase">
                        {p.pos}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm">
                    <span className={`px-2.5 py-1 rounded-md transition-all duration-300 ${p.currentSpeed >= 25 ? 'bg-football-red/15 text-football-red font-black shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'text-slate-600 dark:text-slate-300 font-bold bg-slate-100/50 dark:bg-slate-800/50'}`}>
                      {p.currentSpeed} <span className="text-[10px] uppercase font-bold tracking-wider">km/h</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-bold text-slate-500 dark:text-slate-400">
                    {p.topSpeed}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-black text-football-purple">
                    {p.sprints}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-bold text-slate-700 dark:text-slate-300">{p.dist}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlayerTracking;
