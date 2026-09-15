import React from 'react';

const Calendar = () => {
  return (
    <div className="p-8 h-full overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <h1 className="text-3xl font-bold text-football-navy tracking-tight">Calendar</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-sm text-sm">
            Previous
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-sm text-sm">
            Next
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="p-4 text-center border-r border-slate-200 last:border-r-0">{day}</div>
          ))}
        </div>
        
        {/* Calendar Grid - simplified placeholder */}
        <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-slate-100 gap-px">
          {Array.from({ length: 35 }).map((_, i) => {
            const dayNum = i - 2 > 0 && i - 2 <= 30 ? i - 2 : null;
            return (
              <div key={i} className={`bg-white p-2 flex flex-col hover:bg-slate-50 transition-colors ${!dayNum ? 'bg-slate-50/50 text-slate-300' : 'text-slate-700'}`}>
                <span className={`text-sm font-semibold mb-2 ${dayNum === 15 ? 'w-6 h-6 rounded-full bg-football-blue text-white flex items-center justify-center' : ''}`}>
                  {dayNum || (i < 3 ? 29 + i : i - 32)}
                </span>
                
                {dayNum === 15 && (
                  <div className="mt-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded border border-red-200 truncate">
                    Match vs NVB
                  </div>
                )}
                {dayNum === 14 && (
                  <div className="mt-auto bg-football-purple/10 text-football-purple text-xs font-bold px-2 py-1 rounded border border-football-purple/20 truncate">
                    Analysis Session
                  </div>
                )}
                {dayNum === 18 && (
                  <div className="mt-auto bg-football-green/10 text-football-green text-xs font-bold px-2 py-1 rounded border border-football-green/20 truncate">
                    Training
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
