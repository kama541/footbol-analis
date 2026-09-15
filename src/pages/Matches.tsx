import React from 'react';
import { PlaySquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Matches = () => {
  const navigate = useNavigate();
  const matches = [
    { date: '15 Sep 2026', time: '18:00', comp: 'UZBEKISTAN SUPER LEAGUE', home: 'Football Club', away: 'Navbahor', homeScore: 1, awayScore: 0, status: 'LIVE' },
    { date: '10 Sep 2026', time: '19:30', comp: 'UZBEKISTAN SUPER LEAGUE', home: 'Pakhtakor', away: 'Football Club', homeScore: 2, awayScore: 2, status: 'FT' },
    { date: '05 Sep 2026', time: '17:00', comp: 'UZBEKISTAN SUPER LEAGUE', home: 'Football Club', away: 'Nasaf', homeScore: 3, awayScore: 1, status: 'FT' },
    { date: '22 Sep 2026', time: '18:00', comp: 'UZBEKISTAN SUPER LEAGUE', home: 'Neftchi', away: 'Football Club', homeScore: null, awayScore: null, status: 'UPCOMING' },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-football-navy tracking-tight">Matches</h1>
        <button className="px-4 py-2 bg-football-blue text-white rounded-lg font-semibold hover:bg-football-blue/90 transition-colors shadow-sm text-sm">
          New Match
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {matches.map((match, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-slate-400 tracking-wider">{match.comp}</span>
              <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${
                match.status === 'LIVE' ? 'bg-red-100 text-red-600 animate-pulse' : 
                match.status === 'FT' ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {match.status}
              </span>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xl text-slate-400 border-2 border-white shadow-sm">
                  {match.home.substring(0, 2).toUpperCase()}
                </div>
                <span className="font-semibold text-sm text-football-navy">{match.home}</span>
              </div>

              <div className="flex flex-col items-center">
                {match.status === 'UPCOMING' ? (
                  <span className="text-xl font-bold text-slate-400">{match.time}</span>
                ) : (
                  <div className="text-3xl font-black text-football-navy flex gap-3">
                    <span>{match.homeScore}</span>
                    <span className="text-slate-300">-</span>
                    <span>{match.awayScore}</span>
                  </div>
                )}
                <span className="text-xs font-medium text-slate-400 mt-1">{match.date}</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xl text-slate-400 border-2 border-white shadow-sm">
                  {match.away.substring(0, 2).toUpperCase()}
                </div>
                <span className="font-semibold text-sm text-football-navy">{match.away}</span>
              </div>
            </div>

            <button 
              onClick={() => match.status === 'LIVE' ? navigate('/live') : null}
              className={`mt-auto w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                match.status === 'UPCOMING' 
                  ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                  : 'bg-football-blue/10 text-football-blue hover:bg-football-blue hover:text-white group-hover:bg-football-blue group-hover:text-white'
              }`}
            >
              <PlaySquare size={18} />
              Open Analysis
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matches;
