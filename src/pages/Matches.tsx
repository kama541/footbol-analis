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
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-football-navy dark:text-white tracking-tight">Matches</h1>
        <button 
          onClick={() => setShowNewMatch(true)}
          className="flex items-center gap-2 px-4 py-2 bg-football-blue text-white rounded-lg font-semibold hover:bg-football-blue/90 transition-colors shadow-sm text-sm"
        >
          New Match
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {matches.map((match) => (
          <div key={match.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{match.comp}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                match.status === 'LIVE' ? 'bg-football-red/10 text-football-red animate-pulse' :
                match.status === 'FT' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' :
                'bg-football-blue/10 text-football-blue'
              }`}>
                {match.status}
              </span>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col items-center gap-2 w-24">
                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-xl text-slate-400">
                  {match.homeLogo}
                </div>
                <span className="font-bold text-football-navy dark:text-white text-center text-sm">{match.home}</span>
              </div>
              
              <div className="flex flex-col items-center flex-1">
                {match.status !== 'UPCOMING' ? (
                  <div className="text-3xl font-black text-football-navy dark:text-white tracking-tight">
                    {match.homeScore} - {match.awayScore}
                  </div>
                ) : (
                  <div className="text-xl font-bold text-slate-600 dark:text-slate-400">
                    {match.time}
                  </div>
                )}
                <div className="text-xs font-medium text-slate-400 mt-1">{match.date}</div>
              </div>

              <div className="flex flex-col items-center gap-2 w-24">
                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-xl text-slate-400">
                  {match.awayLogo}
                </div>
                <span className="font-bold text-football-navy dark:text-white text-center text-sm">{match.away}</span>
              </div>
            </div>

            <button 
              onClick={() => handleOpenAnalysis(match.id)}
              className={`mt-auto w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                match.status === 'LIVE' || match.status === 'FT' 
                  ? 'bg-football-blue text-white hover:bg-football-blue/90' 
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
              disabled={match.status === 'UPCOMING'}
            >
              <PlaySquare size={18} />
              Open Analysis
            </button>
          </div>
        ))}
      </div>

      {/* New Match Modal */}
      {showNewMatch && (
        <div className="fixed inset-0 bg-football-navy/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-[450px] shadow-2xl animate-fade-in border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-football-navy dark:text-white">Create New Match</h2>
              <button onClick={() => setShowNewMatch(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Opponent Team</label>
                <input type="text" placeholder="e.g. Bunyodkor" className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-football-blue" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Date</label>
                  <input type="date" className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-football-blue" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Time</label>
                  <input type="time" className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-football-blue" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Location</label>
                <select className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-football-blue">
                  <option>Home</option>
                  <option>Away</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowNewMatch(false)} className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-lg font-bold hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowNewMatch(false)} className="flex-1 py-2 bg-football-blue text-white rounded-lg font-bold hover:bg-football-blue/90 transition-colors">
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
