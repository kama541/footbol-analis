import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlaySquare, Calendar, Users, X } from 'lucide-react';

const Matches = () => {
  const navigate = useNavigate();
  const [showNewMatch, setShowNewMatch] = useState(false);

  const matches = [
    { id: 1, home: 'Football Club', away: 'Navbahor', date: '15 Sep 2026', time: '18:00', status: 'LIVE', homeScore: 1, awayScore: 0, comp: 'UZBEKISTAN SUPER LEAGUE', homeLogo: 'FC', awayLogo: 'NV' },
    { id: 2, home: 'Pakhtakor', away: 'Football Club', date: '10 Sep 2026', time: '19:30', status: 'FT', homeScore: 2, awayScore: 2, comp: 'UZBEKISTAN SUPER LEAGUE', homeLogo: 'PA', awayLogo: 'FC' },
    { id: 3, home: 'Football Club', away: 'Nasaf', date: '05 Sep 2026', time: '17:00', status: 'FT', homeScore: 3, awayScore: 1, comp: 'UZBEKISTAN SUPER LEAGUE', homeLogo: 'FC', awayLogo: 'NS' },
    { id: 4, home: 'Neftchi', away: 'Football Club', date: '22 Sep 2026', time: '18:00', status: 'UPCOMING', homeScore: null, awayScore: null, comp: 'UZBEKISTAN SUPER LEAGUE', homeLogo: 'NE', awayLogo: 'FC' },
  ];

  const handleOpenAnalysis = (id: number) => {
    // Navigate to the live tagging / analysis page
    navigate('/live');
  };

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar relative z-0 bg-[#1a1e2e]">
      {/* Background ambient light */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-[#FFE600]/10 blur-[120px] pointer-events-none rounded-full -z-10"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-transparent blur-[120px] pointer-events-none rounded-full -z-10"></div>

      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-sm">
          Matches
        </h1>
        <button 
          onClick={() => setShowNewMatch(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#FFE600] text-black rounded-xl font-bold shadow-lg shadow-[#FFE600]/25 hover:shadow-[#FFE600]/40 text-sm tracking-wide"
        >
          <Calendar size={18} />
          New Match
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {matches.map((match) => (
          <div key={match.id} className="bg-[#1e2235] rounded-3xl p-6 border border-slate-800 flex flex-col group relative overflow-hidden shadow-lg hover:border-slate-600 transition-all">
            {/* Card gradient effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FFE600]/10 to-transparent rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>

            <div className="flex justify-between items-center mb-8 relative z-10">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{match.comp}</span>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider uppercase shadow-sm ${
                match.status === 'LIVE' ? 'bg-[#FFE600]/15 text-[#FFE600] shadow-[#FFE600]/20 animate-pulse' :
                match.status === 'FT' ? 'bg-slate-800 text-slate-400' :
                'bg-white/10 text-white shadow-white/20'
              }`}>
                {match.status}
              </span>
            </div>

            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex flex-col items-center gap-3 w-28">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center font-black text-2xl text-slate-500 shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
                  {match.homeLogo}
                </div>
                <span className="font-bold text-white text-center text-sm">{match.home}</span>
              </div>
              
              <div className="flex flex-col items-center flex-1">
                {match.status !== 'UPCOMING' ? (
                  <div className="text-4xl font-black text-white tracking-tighter drop-shadow-md">
                    {match.homeScore} - {match.awayScore}
                  </div>
                ) : (
                  <div className="text-2xl font-black text-slate-500">
                    {match.time}
                  </div>
                )}
                <div className="text-xs font-semibold text-slate-400 mt-2 tracking-wide">{match.date}</div>
              </div>

              <div className="flex flex-col items-center gap-3 w-28">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center font-black text-2xl text-slate-500 shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
                  {match.awayLogo}
                </div>
                <span className="font-bold text-white text-center text-sm">{match.away}</span>
              </div>
            </div>

            <button 
              onClick={() => handleOpenAnalysis(match.id)}
              className={`mt-auto w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden z-10 ${
                match.status === 'LIVE' || match.status === 'FT' 
                  ? 'bg-[#FFE600] text-black shadow-lg shadow-[#FFE600]/25 hover:shadow-[#FFE600]/40 hover:-translate-y-0.5' 
                  : 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-800'
              }`}
              disabled={match.status === 'UPCOMING'}
            >
              {match.status !== 'UPCOMING' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              )}
              <PlaySquare size={18} className={match.status !== 'UPCOMING' ? 'group-hover:scale-110 transition-transform' : ''} />
              Open Analysis
            </button>
          </div>
        ))}
      </div>

      {/* New Match Modal */}
      {showNewMatch && (
        <div className="fixed inset-0 bg-football-navy/80 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
          <div className="glass-panel rounded-3xl p-8 w-[450px] animate-slide-up relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFE600]/10 blur-2xl rounded-full"></div>
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Create Match</h2>
              <button onClick={() => setShowNewMatch(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-100/50 dark:bg-slate-800/50 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-5 relative z-10">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Opponent Team</label>
                <input type="text" placeholder="e.g. Bunyodkor" className="w-full border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-white outline-none focus:border-[#FFE600] focus:ring-1 focus:ring-[#FFE600] transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Date</label>
                  <input type="date" className="w-full border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-white outline-none focus:border-[#FFE600] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Time</label>
                  <input type="time" className="w-full border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-white outline-none focus:border-[#FFE600] transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Location</label>
                <select className="w-full border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-white outline-none focus:border-[#FFE600] transition-all">
                  <option>Home</option>
                  <option>Away</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-10 relative z-10">
              <button onClick={() => setShowNewMatch(false)} className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowNewMatch(false)} className="glass-button flex-1 py-3.5 bg-[#FFE600] text-black rounded-xl font-bold shadow-lg shadow-[#FFE600]/30 hover:shadow-[#FFE600]/50">
                Save Match
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches;
