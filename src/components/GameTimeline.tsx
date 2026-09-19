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

  const markers = [0, 10, 20, 30, 40, 45, 50, 60, 70, 80, 90];

  return (
    <div className="h-full w-full flex flex-col justify-center px-4 relative group">
      {/* Timeline Base */}
      <div className="relative h-2.5 bg-slate-800 rounded-full w-full mt-4 border border-slate-700 shadow-inner">
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

        {/* Time Markers */}
        {markers.map(minute => (
          <div 
            key={minute} 
            className="absolute -top-6 -translate-x-1/2 text-[10px] font-mono font-bold text-slate-500"
            style={{ left: `${(minute / 90) * 100}%` }}
          >
            {minute.toString().padStart(2, '0')}:00
          </div>
        ))}
        {markers.map(minute => (
          <div 
            key={`tick-${minute}`} 
            className="absolute top-0 h-2.5 w-px bg-slate-600 -translate-x-1/2"
            style={{ left: `${(minute / 90) * 100}%` }}
          ></div>
        ))}

        {/* Event Nodes */}
        {events.map((event) => {
          const positionPercent = (event.time / duration) * 100;
          return (
            <div 
              key={event.id}
              className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-sm border-2 cursor-pointer hover:scale-150 transition-transform group/event shadow-lg z-20 ${getColor(event.category)}`}
              style={{ left: `calc(${positionPercent}% - 7px)`, transform: 'translateY(-50%) rotate(45deg)' }}
              onClick={() => setCurrentTime(event.time)}
            >
              {/* Tooltip */}
              <div className="absolute bottom-[150%] left-1/2 -translate-x-1/2 mb-1 bg-[#1a1d24] border border-slate-700 text-slate-200 text-xs px-2 py-1.5 rounded opacity-0 group-hover/event:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-30 flex flex-col items-center shadow-2xl" style={{ transform: 'translateX(-50%) rotate(-45deg)' }}>
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
    </div>
  );
};

export default GameTimeline;
