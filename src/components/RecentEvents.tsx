import React from 'react';
import { useMatch, EventCategory } from '../context/MatchContext';
import { Edit2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const getBadgeColor = (category: EventCategory) => {
  switch (category) {
    case 'attacking': return 'bg-football-purple/10 text-football-purple';
    case 'defensive': return 'bg-football-red/10 text-football-red';
    case 'positive': return 'bg-football-green/10 text-football-green';
    case 'other': return 'bg-football-orange/10 text-football-orange';
    default: return 'bg-slate-100 text-slate-700';
  }
};

const RecentEvents = () => {
  const { events, deleteEvent, setCurrentTime, pauseMatch } = useMatch();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl relative z-10 overflow-hidden shadow-[-10px_0_20px_rgba(0,0,0,0.05)] border-l border-slate-200/50 dark:border-slate-800/50">
      <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-20">
        <h2 className="font-black text-slate-900 dark:text-white tracking-tight text-lg">{t('events.recent_events')}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative z-10">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 font-bold opacity-70">
            <p className="text-sm">No events tagged yet</p>
          </div>
        ) : (
          events.map((event, index) => (
            <div 
              key={event.id}
              style={{ animationDelay: `${index * 0.05}s` }}
              className="glass-card bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700/50 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group animate-slide-up relative overflow-hidden"
              onClick={() => {
                setCurrentTime(Math.max(0, event.time - 5));
                pauseMatch();
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-football-blue/0 to-football-purple/0 group-hover:from-football-blue/5 group-hover:to-football-purple/5 transition-colors"></div>
              
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-black text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-700/50 px-2 py-0.5 rounded-md">
                    {formatTime(event.time)}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-[9px] font-black tracking-widest uppercase shadow-sm ${getBadgeColor(event.category)}`}>
                    {event.type}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="p-1.5 text-slate-400 hover:text-football-blue hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                    onClick={(e) => { e.stopPropagation(); /* edit logic */ }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    className="p-1.5 text-slate-400 hover:text-football-red hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                    onClick={(e) => { e.stopPropagation(); deleteEvent(event.id); }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-football-blue transition-colors">{event.player}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{event.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentEvents;
