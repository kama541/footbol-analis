import React from 'react';
import { useMatch } from '../context/MatchContext';

const MatchStats = () => {
  const { matchStats } = useMatch();
  
  const stats = [
    { label: 'Possession', fc: matchStats.fcPossession, nv: matchStats.nvPossession, format: '%' },
    { label: 'Shots', fc: matchStats.fcShots, nv: matchStats.nvShots },
    { label: 'Shots on Target', fc: matchStats.fcShotsOnTarget, nv: matchStats.nvShotsOnTarget },
    { label: 'Corners', fc: matchStats.fcCorners, nv: matchStats.nvCorners },
    { label: 'Fouls', fc: matchStats.fcFouls, nv: matchStats.nvFouls },
    { label: 'Expected Goals', fc: matchStats.fcXG.toFixed(2), nv: matchStats.nvXG.toFixed(2) },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      <div className="p-3 border-b border-slate-100 bg-white sticky top-0 flex justify-between items-center">
        <h2 className="font-semibold text-football-navy">Match Stats</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-white">
        <div className="flex justify-between items-center px-1 mb-2">
          <div className="w-8 h-8 bg-football-blue/10 text-football-blue rounded flex items-center justify-center font-bold text-sm">FC</div>
          <div className="text-xs font-bold text-slate-400">VS</div>
          <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded flex items-center justify-center font-bold text-sm">NV</div>
        </div>
        
        {stats.map((stat, i) => {
          const total = Number(stat.fc) + Number(stat.nv) || 1;
          const fcPercent = (Number(stat.fc) / total) * 100;
          const nvPercent = (Number(stat.nv) / total) * 100;

          return (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-semibold px-1">
                <span className="text-football-navy w-12">{stat.fc}{stat.format || ''}</span>
                <span className="text-slate-400 tracking-wide text-center flex-1">{stat.label}</span>
                <span className="text-football-navy w-12 text-right">{stat.nv}{stat.format || ''}</span>
              </div>
              <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
                <div className="bg-football-blue transition-all duration-500" style={{ width: `${fcPercent}%` }}></div>
                <div className="bg-slate-300 transition-all duration-500" style={{ width: `${nvPercent}%` }}></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default MatchStats;
