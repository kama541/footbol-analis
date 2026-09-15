import React from 'react';
import { Play, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Playlists = () => {
  const navigate = useNavigate();
  const playlists = [
    { id: 'goals', title: 'Goals', count: 42, duration: '14:30', color: 'bg-football-purple' },
    { id: 'best-attacks', title: 'Best Attacks', count: 128, duration: '45:15', color: 'bg-football-blue' },
    { id: 'defensive-actions', title: 'Defensive Actions', count: 85, duration: '28:40', color: 'bg-football-red' },
    { id: 'set-pieces', title: 'Set Pieces', count: 56, duration: '21:05', color: 'bg-football-orange' },
    { id: 'individual-player-analysis', title: 'Individual Player Analysis', count: 24, duration: '08:50', color: 'bg-football-green' },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-football-navy tracking-tight">Playlists</h1>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-football-blue text-white rounded-xl font-bold hover:bg-football-blue/90 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm">
          <Plus size={18} />
          Create Playlist
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {playlists.map((pl, i) => (
          <div key={i} onClick={() => navigate(`/playlists/${pl.id}`)} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer hover:-translate-y-1">
            <div className={`h-32 ${pl.color} relative overflow-hidden flex items-center justify-center`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <Play size={40} className="text-white/50 group-hover:text-white transition-colors" />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-football-navy mb-1">{pl.title}</h3>
              <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                <span>{pl.count} clips</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
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
