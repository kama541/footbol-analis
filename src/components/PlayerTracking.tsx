import React from 'react';
import { useMatch } from '../context/MatchContext';
import { useTranslation } from 'react-i18next';

const PlayerTracking = () => {
  const { players } = useMatch();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
      <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0">
        <h2 className="font-semibold text-football-navy dark:text-white">{t('stats.player_tracking')}</h2>
      </div>
      <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50 sticky top-0 text-xs text-slate-500 dark:text-slate-400 uppercase z-10">
            <tr>
              <th className="px-3 py-2 font-semibold border-b border-slate-100 dark:border-slate-800 w-8">#</th>
              <th className="px-3 py-2 font-semibold border-b border-slate-100 dark:border-slate-800">Player</th>
              <th className="px-3 py-2 font-semibold border-b border-slate-100 dark:border-slate-800 text-right">{t('stats.live_speed')}</th>
              <th className="px-3 py-2 font-semibold border-b border-slate-100 dark:border-slate-800 text-right">{t('stats.top_speed')}</th>
              <th className="px-3 py-2 font-semibold border-b border-slate-100 dark:border-slate-800 text-right">{t('stats.sprints')}</th>
              <th className="px-3 py-2 font-semibold border-b border-slate-100 dark:border-slate-800 text-right">{t('stats.dist')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {players.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-default">
                <td className="px-3 py-2.5 text-slate-400 font-medium">{p.num}</td>
                <td className="px-3 py-2.5 font-bold text-football-navy dark:text-white">
                  {p.name} <span className="text-[10px] text-slate-400 font-normal ml-1">{p.pos}</span>
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-sm">
                  <span className={`px-2 py-0.5 rounded transition-colors ${p.currentSpeed >= 25 ? 'bg-football-red/10 text-football-red font-bold animate-pulse' : 'text-slate-600 dark:text-slate-300'}`}>
                    {p.currentSpeed} <span className="text-[10px]">km/h</span>
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-sm text-slate-600 dark:text-slate-400">
                  {p.topSpeed}
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-sm font-semibold text-football-purple">
                  {p.sprints}
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-sm text-slate-700 dark:text-slate-300">{p.dist}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerTracking;
