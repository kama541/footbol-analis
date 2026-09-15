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
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
      <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0">
        <h2 className="font-semibold text-football-navy dark:text-white">{t('events.recent_events')}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-white dark:bg-slate-900">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <p className="text-sm">No events tagged yet</p>
          </div>
        ) : (
          events.map(event => (
            <div 
              key={event.id}
              className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-3 shadow-sm hover:border-football-blue/30 transition-colors cursor-pointer"
              onClick={() => {
                setCurrentTime(Math.max(0, event.time - 5));
                pauseMatch();
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {formatTime(event.time)}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${getBadgeColor(event.category)}`}>
                    {event.type}
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="p-1.5 text-slate-400 hover:text-football-blue hover:bg-football-blue/10 rounded-lg transition-colors"
                    onClick={(e) => { e.stopPropagation(); /* edit logic */ }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    onClick={(e) => { e.stopPropagation(); deleteEvent(event.id); }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-football-navy dark:text-white">{event.player}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{event.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentEvents;
