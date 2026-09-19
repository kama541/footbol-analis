import React from 'react';
import { Play, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Playlists = () => {
  const navigate = useNavigate();
  const playlists = [
    { id: 'goals', title: 'Goals', count: 42, duration: '14:30', color: 'bg-[#FFE600] text-black' },
    { id: 'best-attacks', title: 'Best Attacks', count: 128, duration: '45:15', color: 'bg-slate-300 text-slate-900' },
    { id: 'defensive-actions', title: 'Defensive Actions', count: 85, duration: '28:40', color: 'bg-slate-500 text-white' },
    { id: 'set-pieces', title: 'Set Pieces', count: 56, duration: '21:05', color: 'bg-slate-700 text-white' },
    { id: 'individual-player-analysis', title: 'Individual Player Analysis', count: 24, duration: '08:50', color: 'bg-slate-800 text-white' },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar relative z-0 bg-[#1a1e2e]">
      {/* Background ambient light */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-[#FFE600]/10 blur-[120px] pointer-events-none rounded-full -z-10"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-transparent blur-[120px] pointer-events-none rounded-full -z-10"></div>

      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-sm">Playlists</h1>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#FFE600] text-black rounded-xl font-bold shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:bg-yellow-400 text-sm tracking-wide transition-all">
          <Plus size={18} />
          Create Playlist
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {playlists.map((pl, i) => (
          <div key={i} onClick={() => navigate(`/playlists/${pl.id}`)} className="bg-[#1e2235] rounded-3xl overflow-hidden group cursor-pointer border border-slate-800 shadow-xl hover:border-slate-600 transition-all">
            <div className={`h-40 ${pl.color} relative overflow-hidden flex items-center justify-center transition-all duration-500`}>
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 group-hover:opacity-80 transition-opacity"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300 shadow-xl">
                <Play size={24} className="text-white drop-shadow-md ml-1" />
              </div>
            </div>
            <div className="p-6 relative">
              <div className="absolute top-0 right-6 -translate-y-1/2 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center shadow-lg border border-slate-700">
                <span className={`w-3 h-3 rounded-full ${pl.color} shadow-sm animate-pulse`}></span>
              </div>
              <h3 className="text-lg font-black text-white mb-2 group-hover:text-[#FFE600] transition-colors">{pl.title}</h3>
              <div className="flex items-center gap-3 text-sm text-slate-400 font-semibold tracking-wide">
                <span>{pl.count} clips</span>
                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                <span>{pl.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlists;
