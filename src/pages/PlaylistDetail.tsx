import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock } from 'lucide-react';
import { useMatch, MatchEvent } from '../context/MatchContext';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const getBadgeColor = (category: string) => {
  switch (category) {
    case 'attacking': return 'bg-[#FFE600]/10 text-[#FFE600]';
    case 'defensive': return 'bg-slate-200/10 text-slate-200';
    case 'positive': return 'bg-slate-300/10 text-slate-300';
    case 'other': return 'bg-slate-400/10 text-slate-400';
    default: return 'bg-slate-100 text-slate-700';
  }
};

const PlaylistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, setCurrentTime, pauseMatch } = useMatch();

  const title = id ? id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Playlist';

  // Filter events based on playlist ID
  const getPlaylistEvents = (): MatchEvent[] => {
    switch (id) {
      case 'goals':
        return events.filter(e => e.type === 'GOAL');
      case 'best-attacks':
        return events.filter(e => ['SHOT', 'CHANCE', 'CROSS', 'KEY PASS', 'ASSIST'].includes(e.type) || e.category === 'attacking');
      case 'defensive-actions':
        return events.filter(e => e.category === 'defensive');
      case 'set-pieces':
        return events.filter(e => ['CORNER', 'FREE KICK'].includes(e.type));
      case 'individual-player-analysis':
        return events.filter(e => e.player); // Just show all events with a player for now
      default:
        return events;
    }
  };

  const playlistEvents = getPlaylistEvents();

  const handleEventClick = (time: number) => {
    // Navigate back to live/matches screen to view video? 
    // Or we could just navigate back and set time.
    navigate('/live');
    setTimeout(() => {
      setCurrentTime(Math.max(0, time - 5));
      pauseMatch();
    }, 100);
  };

  return (
    <div className="p-8 h-full flex flex-col overflow-hidden custom-scrollbar relative z-0">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFE600]/10 blur-[120px] pointer-events-none rounded-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-transparent blur-[120px] pointer-events-none rounded-full -z-10"></div>

      <div className="flex items-center gap-6 mb-10 shrink-0 relative z-10">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all text-slate-700 dark:text-slate-300 shadow-sm group hover:-translate-x-1"
        >
          <ArrowLeft size={24} className="group-hover:scale-110 transition-transform" />
        </button>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-sm">{title}</h1>
        <div className="ml-auto glass-panel px-5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-md text-sm font-black text-slate-700 dark:text-slate-200 bg-white/40 dark:bg-slate-800/40 tracking-wider uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFE600] animate-pulse"></span>
          {playlistEvents.length} ta vaziyat
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar relative z-10">
        {playlistEvents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 glass-card rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm p-12 text-center animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 shadow-inner">
              <Play size={48} className="text-slate-300 dark:text-slate-600 ml-2" />
            </div>
            <h2 className="text-2xl font-black mb-3 text-slate-700 dark:text-slate-300">Hali bu erda voqealar yo'q</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">O'yin vaqtida "{title}" ga oid vaziyatlarni belgilasangiz shu erda paydo bo'ladi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
            {playlistEvents.map((event, index) => (
              <div 
                key={event.id}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => handleEventClick(event.time)}
                className="glass-card rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 hover:-translate-y-1 transition-all cursor-pointer group animate-slide-up relative overflow-hidden"
              >
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFE600]/0 to-[#FFE600]/0 group-hover:from-[#FFE600]/5 group-hover:to-[#FFE600]/5 transition-colors"></div>

                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div className={`px-3 py-1.5 rounded-md text-[10px] font-black tracking-widest uppercase shadow-sm ${getBadgeColor(event.category)}`}>
                    {event.type}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-mono text-sm font-bold bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                    <Clock size={14} />
                    {formatTime(event.time)}
                  </div>
                </div>
                <h3 className="font-black text-slate-900 dark:text-white text-xl mb-2 relative z-10">{event.player}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 font-medium relative z-10">{event.description}</p>
                
                <div className="mt-6 flex items-center text-[#FFE600] text-sm font-black uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 relative z-10">
                  <Play size={16} className="mr-2" />
                  Videoni ko'rish
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;
