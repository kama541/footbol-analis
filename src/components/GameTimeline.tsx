import React from 'react';
import { useMatch, EventCategory } from '../context/MatchContext';

const GameTimeline = () => {
  const { events, currentTime, setCurrentTime } = useMatch();
  
  // Total match time in seconds (90 mins = 5400s)
  const duration = 5400; 

  const getColor = (category: EventCategory) => {
    switch (category) {
      case 'attacking': return 'bg-[#FFE600] border-[#332e00]';
      case 'defensive': return 'bg-white border-slate-400';
      case 'positive': return 'bg-slate-300 border-slate-500';
      case 'other': return 'bg-slate-500 border-slate-700';
      default: return 'bg-slate-400 border-slate-700';
    }
  };

  // Tablet/training screen: fewer markers to avoid crowding
  const markers = [0, 15, 30, 45, 60, 75, 90];

  return (
    <div className="h-full w-full flex flex-col justify-center px-3 md:px-6 relative group">
      
      {/* Legend - visible on tablet+ */}
      <div className="hidden md:flex items-center gap-3 mb-2 flex-wrap">
        {[
          { label: 'Hujum', color: 'bg-football-green' },
          { label: 'Mudofaa', color: 'bg-football-red' },
          { label: 'Ijobiy', color: 'bg-football-purple' },
          { label: 'Boshqa', color: 'bg-football-orange' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm rotate-45 ${item.color} inline-block`}></span>
            <span className="text-[10px] text-slate-400 font-medium">{item.label}</span>
          </div>
        ))}
        <div className="ml-auto text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
          {Math.floor(currentTime / 60).toString().padStart(2, '0')}:{(currentTime % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* Timeline Base */}
      <div
        className="relative rounded-full w-full border border-slate-700 shadow-inner cursor-pointer bg-slate-800"
        style={{ height: '14px' }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          setCurrentTime(Math.floor(pct * duration));
        }}
      >
        {/* Progress Bar */}
        <div 
          className="absolute top-0 left-0 h-full bg-slate-600 rounded-full transition-all duration-300"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        ></div>

        {/* Current Time Indicator */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FFE600] rounded-full shadow-[0_0_10px_rgba(255,230,0,0.8)] border-2 border-[#161920] cursor-pointer z-10 transition-all duration-300"
          style={{ left: `calc(${(currentTime / duration) * 100}% - 8px)` }}
        ></div>

        {/* Time Markers - labels above */}
        {markers.map(minute => (
          <div 
            key={minute} 
            className="absolute -top-5 -translate-x-1/2 text-[9px] md:text-[10px] font-mono font-bold text-slate-500 select-none"
            style={{ left: `${(minute / 90) * 100}%` }}
          >
            {minute}'
          </div>
        ))}

        {/* Tick lines */}
        {markers.map(minute => (
          <div 
            key={`tick-${minute}`} 
            className="absolute top-0 h-full w-px bg-slate-600/60 -translate-x-1/2"
            style={{ left: `${(minute / 90) * 100}%` }}
          ></div>
        ))}

        {/* Half-time separator */}
        <div
          className="absolute top-0 h-full w-0.5 bg-[#FFE600]/40 -translate-x-1/2"
          style={{ left: '50%' }}
        ></div>

        {/* Event Nodes */}
        {events.map((event) => {
          const positionPercent = (event.time / duration) * 100;
          return (
            <div 
              key={event.id}
              className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 rounded-sm border-2 cursor-pointer hover:scale-150 transition-transform group/event shadow-lg z-20 ${getColor(event.category)}`}
              style={{ left: `calc(${positionPercent}% - 7px)`, transform: 'translateY(-50%) rotate(45deg)' }}
              onClick={(e) => { e.stopPropagation(); setCurrentTime(event.time); }}
            >
              {/* Tooltip */}
              <div className="absolute bottom-[160%] left-1/2 mb-1 bg-[#252a3d] border border-slate-700 text-slate-200 text-xs px-2 py-1.5 rounded opacity-0 group-hover/event:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-30 flex flex-col items-center shadow-2xl" style={{ transform: 'translateX(-50%) rotate(-45deg)' }}>
                <span className="font-bold text-white mb-0.5">{event.type}</span>
                <span className="text-[9px] text-slate-400 font-mono">
                  {Math.floor(event.time / 60).toString().padStart(2, '0')}:{(event.time % 60).toString().padStart(2, '0')}
                </span>
                {event.player && <span className="text-[10px] text-slate-300 mt-1">{event.player}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom: segment labels for tablet */}
      <div className="hidden md:flex justify-between mt-1 px-0.5">
        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">1-HALF</span>
        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">2-HALF</span>
      </div>
    </div>
  );
};

export default GameTimeline;
