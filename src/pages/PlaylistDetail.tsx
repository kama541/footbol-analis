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
    case 'attacking': return 'bg-football-purple/10 text-football-purple';
    case 'defensive': return 'bg-football-red/10 text-football-red';
    case 'positive': return 'bg-football-green/10 text-football-green';
    case 'other': return 'bg-football-orange/10 text-football-orange';
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
    <div className="p-8 h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 shadow-sm"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-football-navy tracking-tight">{title}</h1>
        <div className="ml-auto bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-bold text-slate-600">
          {playlistEvents.length} ta vaziyat
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2">
        {playlistEvents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <Play size={48} className="mb-4 text-slate-300" />
            <h2 className="text-xl font-bold mb-2 text-slate-600">Hali bu erda voqealar yo'q</h2>
            <p className="text-sm">O'yin vaqtida "{title}" ga oid vaziyatlarni belgilasangiz shu erda paydo bo'ladi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlistEvents.map(event => (
              <div 
                key={event.id}
                onClick={() => handleEventClick(event.time)}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-football-blue/50 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wider ${getBadgeColor(event.category)}`}>
                    {event.type}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-sm font-bold bg-slate-50 px-2 py-1 rounded">
                    <Clock size={14} />
                    {formatTime(event.time)}
                  </div>
                </div>
                <h3 className="font-bold text-football-navy text-lg mb-1">{event.player}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{event.description}</p>
                
                <div className="mt-4 flex items-center text-football-blue text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={16} className="mr-1.5" />
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
