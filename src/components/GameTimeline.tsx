import React from 'react';
import { useMatch, EventCategory } from '../context/MatchContext';

const GameTimeline = () => {
  const { events, currentTime, setCurrentTime } = useMatch();
  
  // Total match time in seconds (90 mins = 5400s)
  const duration = 5400; 

  const getColor = (category: EventCategory) => {
    switch (category) {
      case 'attacking': return 'bg-football-purple border-white';
      case 'defensive': return 'bg-football-red border-white';
      case 'positive': return 'bg-football-green border-white';
      case 'other': return 'bg-football-orange border-white';
      default: return 'bg-slate-400 border-white';
    }
  };

  const markers = [0, 15, 30, 45, 60, 75, 90];

  return (
    <div className="h-full w-full flex flex-col justify-center px-8 relative overflow-hidden group">
      {/* Timeline Base */}
      <div className="relative h-2 bg-slate-100 rounded-full w-full">
        {/* Progress Bar */}
        <div 
          className="absolute top-0 left-0 h-full bg-slate-300 rounded-full transition-all duration-300"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        ></div>

        {/* Current Time Indicator */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-football-blue rounded-full shadow border-2 border-white cursor-pointer z-10 transition-all duration-300"
          style={{ left: `calc(${(currentTime / duration) * 100}% - 8px)` }}
        ></div>

        {/* Time Markers */}
        {markers.map(minute => (
          <div 
            key={minute} 
            className="absolute top-4 -translate-x-1/2 text-xs font-bold text-slate-400"
            style={{ left: `${(minute / 90) * 100}%` }}
          >
            {minute}'
          </div>
        ))}
        {markers.map(minute => (
          <div 
            key={`tick-${minute}`} 
            className="absolute top-0 h-2 w-0.5 bg-slate-200 -translate-x-1/2"
            style={{ left: `${(minute / 90) * 100}%` }}
          ></div>
        ))}

        {/* Event Nodes */}
        {events.map((event) => {
          const positionPercent = (event.time / duration) * 100;
          return (
            <div 
              key={event.id}
              className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 cursor-pointer hover:scale-125 transition-transform group/event shadow-sm ${getColor(event.category)}`}
              style={{ left: `calc(${positionPercent}% - 7px)` }}
              onClick={() => setCurrentTime(event.time)}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-football-navy text-white text-xs px-2 py-1 rounded opacity-0 group-hover/event:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-20">
                <span className="font-bold">{event.type}</span> • {Math.floor(event.time / 60)}'
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameTimeline;
