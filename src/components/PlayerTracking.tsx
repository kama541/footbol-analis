import React from 'react';
import { useMatch } from '../context/MatchContext';

const PlayerTracking = () => {
  const { players } = useMatch();

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      <div className="p-3 border-b border-slate-100 bg-white sticky top-0">
        <h2 className="font-semibold text-football-navy">Player Tracking</h2>
      </div>
      <div className="flex-1 overflow-y-auto bg-white">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 sticky top-0 text-xs text-slate-500 uppercase z-10">
            <tr>
              <th className="px-3 py-2 font-semibold border-b border-slate-100 w-8">#</th>
              <th className="px-3 py-2 font-semibold border-b border-slate-100">Player</th>
              <th className="px-3 py-2 font-semibold border-b border-slate-100 text-right">Dist (km)</th>
              <th className="px-3 py-2 font-semibold border-b border-slate-100 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {players.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors group cursor-default">
                <td className="px-3 py-2.5 text-slate-400 font-medium">{p.num}</td>
                <td className="px-3 py-2.5">
                  <div className="font-semibold text-football-navy">{p.name}</div>
                  <div className="text-[10px] font-bold text-slate-400 mt-0.5">{p.pos}</div>
                </td>
                <td className="px-3 py-2.5 text-right font-medium text-slate-700">{p.dist.toFixed(2)}</td>
                <td className="px-3 py-2.5 text-right font-medium text-slate-700">
                  <span className="bg-slate-100 px-2 py-0.5 rounded font-bold">{p.actions}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerTracking;
