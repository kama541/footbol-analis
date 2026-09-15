import React, { useState } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  
  const getFirstDayOfMonth = (y: number, m: number) => {
    let day = new Date(y, m, 1).getDay();
    // Monday = 0, Sunday = 6
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);

  // We use 42 slots to accommodate all possible month shapes (up to 6 weeks)
  const totalSlots = 42;
  const gridCells = Array.from({ length: totalSlots });

  const isToday = (d: number) => {
    const today = new Date();
    return today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
  };

  // Keep some mock events on specific days of any viewed month just to look nice
  const getMockEvent = (d: number) => {
    if (d === 14) return { title: 'Analysis Session', type: 'analysis' };
    if (d === 15) return { title: 'Match vs NVB', type: 'match' };
    if (d === 18) return { title: 'Training', type: 'training' };
    return null;
  };

  return (
    <div className="p-8 h-full overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <h1 className="text-3xl font-bold text-football-navy tracking-tight">
          Calendar <span className="text-slate-400 font-normal ml-2">{monthNames[month]} {year}</span>
        </h1>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-sm text-sm"
          >
            Previous
          </button>
          <button 
            onClick={nextMonth}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-sm text-sm"
          >
            Next
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="p-4 text-center border-r border-slate-200 last:border-r-0">{day}</div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="flex-1 grid grid-cols-7 grid-rows-6 bg-slate-100 gap-px">
          {gridCells.map((_, i) => {
            const isPrevMonth = i < firstDay;
            const isNextMonth = i >= firstDay + daysInMonth;
            
            let dayNum;
            if (isPrevMonth) {
              dayNum = daysInPrevMonth - firstDay + i + 1;
            } else if (isNextMonth) {
              dayNum = i - firstDay - daysInMonth + 1;
            } else {
              dayNum = i - firstDay + 1;
            }

            const currentDay = !isPrevMonth && !isNextMonth;
            const today = currentDay && isToday(dayNum);
            const evt = currentDay ? getMockEvent(dayNum) : null;

            return (
              <div 
                key={i} 
                className={`bg-white p-2 flex flex-col hover:bg-slate-50 transition-colors cursor-pointer ${
                  !currentDay ? 'bg-slate-50/50 text-slate-400' : 'text-slate-700'
                }`}
              >
                <span className={`text-sm font-semibold mb-2 ${
                  today ? 'w-6 h-6 rounded-full bg-football-blue text-white flex items-center justify-center' : ''
                }`}>
                  {dayNum}
                </span>
                
                {evt && evt.type === 'match' && (
                  <div className="mt-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded border border-red-200 truncate" title={evt.title}>
                    {evt.title}
                  </div>
                )}
                {evt && evt.type === 'analysis' && (
                  <div className="mt-auto bg-football-purple/10 text-football-purple text-xs font-bold px-2 py-1 rounded border border-football-purple/20 truncate" title={evt.title}>
                    {evt.title}
                  </div>
                )}
                {evt && evt.type === 'training' && (
                  <div className="mt-auto bg-football-green/10 text-football-green text-xs font-bold px-2 py-1 rounded border border-football-green/20 truncate" title={evt.title}>
                    {evt.title}
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
