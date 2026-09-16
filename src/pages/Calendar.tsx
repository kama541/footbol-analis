import React, { useState } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('week');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    }
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

  // Month grid
  const totalSlots = 42;
  const gridCells = Array.from({ length: totalSlots });

  // Week grid
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d;
  };

  const startOfWeek = getStartOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  const isToday = (d: Date) => {
    const today = new Date();
    return today.getDate() === d.getDate() && today.getMonth() === d.getMonth() && today.getFullYear() === d.getFullYear();
  };

  // Keep some mock events on specific dates
  const getMockEvent = (d: Date) => {
    const day = d.getDate();
    if (day === 14) return { title: 'Analysis Session', type: 'analysis' };
    if (day === 15) return { title: 'Match vs NVB', type: 'match' };
    if (day === 18) return { title: 'Training', type: 'training' };
    return null;
  };

  return (
    <div className="p-8 h-full overflow-y-auto flex flex-col relative z-0 custom-scrollbar bg-[#0f1115]">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-football-blue/5 blur-[120px] pointer-events-none rounded-full -z-10"></div>
      <div className="absolute bottom-40 left-20 w-80 h-80 bg-football-purple/5 blur-[100px] pointer-events-none rounded-full -z-10"></div>

      <div className="flex items-center justify-between mb-8 shrink-0 relative z-10">
        <div className="flex items-center gap-6">
          <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-sm flex items-center gap-3">
            Taqvim <span className="text-2xl text-slate-500 font-bold">{monthNames[month]} {year}</span>
          </h1>
          <div className="flex bg-slate-900 rounded-xl p-1.5 border border-slate-800 shadow-sm">
            <button
              onClick={() => setViewMode('week')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${viewMode === 'week' ? 'bg-[#161920] shadow-md text-white border border-slate-700' : 'text-slate-500 hover:text-white'}`}
            >
              1 Haftalik
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${viewMode === 'month' ? 'bg-[#161920] shadow-md text-white border border-slate-700' : 'text-slate-500 hover:text-white'}`}
            >
              Oylik
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handlePrev}
            className="px-5 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-all shadow-sm text-sm"
          >
            Oldingi
          </button>
          <button 
            onClick={handleNext}
            className="px-5 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-all shadow-sm text-sm"
          >
            Keyingi
          </button>
        </div>
      </div>

      <div className="flex-1 rounded-3xl overflow-hidden flex flex-col relative z-10 border border-slate-800 shadow-xl shadow-black/50">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 border-b border-slate-800 bg-[#0f1115] text-xs font-black text-slate-400 uppercase tracking-widest shrink-0">
          {['Du', 'Se', 'Chor', 'Pay', 'Ju', 'Shan', 'Yak'].map(day => (
            <div key={day} className="p-4 text-center border-r border-slate-800 last:border-r-0">{day}</div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className={`flex-1 grid grid-cols-7 bg-slate-800 gap-[1px] ${viewMode === 'month' ? 'grid-rows-6' : 'grid-rows-1'}`}>
          {viewMode === 'month' ? (
            // Month View
            gridCells.map((_, i) => {
              const isPrevMonth = i < firstDay;
              const isNextMonth = i >= firstDay + daysInMonth;
              
              let dayNum;
              let currentCellDate = new Date(year, month, 1);
              if (isPrevMonth) {
                dayNum = daysInPrevMonth - firstDay + i + 1;
                currentCellDate = new Date(year, month - 1, dayNum);
              } else if (isNextMonth) {
                dayNum = i - firstDay - daysInMonth + 1;
                currentCellDate = new Date(year, month + 1, dayNum);
              } else {
                dayNum = i - firstDay + 1;
                currentCellDate = new Date(year, month, dayNum);
              }

              const currentDay = !isPrevMonth && !isNextMonth;
              const today = isToday(currentCellDate);
              const evt = getMockEvent(currentCellDate);

              return (
                <div 
                  key={i} 
                  className={`bg-[#161920] p-3 flex flex-col hover:bg-slate-800 transition-colors cursor-pointer relative group ${
                    !currentDay ? 'opacity-30 text-slate-500' : 'text-slate-200'
                  }`}
                >
                  <span className={`text-sm font-bold mb-2 transition-all ${
                    today ? 'w-8 h-8 rounded-full bg-[#FFE600] text-black flex items-center justify-center shadow-lg shadow-[#FFE600]/30 scale-110' : 'group-hover:scale-110 origin-left inline-block'
                  }`}>
                    {dayNum}
                  </span>
                  
                  {evt && evt.type === 'match' && (
                    <div className="mt-auto bg-football-red/20 text-football-red text-xs font-bold px-2.5 py-1.5 rounded-md border border-football-red/20 shadow-sm truncate group-hover:shadow-md transition-shadow" title={evt.title}>
                      <span className="w-1.5 h-1.5 inline-block bg-football-red rounded-full mr-1.5 animate-pulse"></span>
                      {evt.title}
                    </div>
                  )}
                  {evt && evt.type === 'analysis' && (
                    <div className="mt-auto bg-football-purple/20 text-football-purple text-xs font-bold px-2.5 py-1.5 rounded-md border border-football-purple/20 shadow-sm truncate group-hover:shadow-md transition-shadow" title={evt.title}>
                      <span className="w-1.5 h-1.5 inline-block bg-football-purple rounded-full mr-1.5"></span>
                      {evt.title}
                    </div>
                  )}
                  {evt && evt.type === 'training' && (
                    <div className="mt-auto bg-football-green/20 text-football-green text-xs font-bold px-2.5 py-1.5 rounded-md border border-football-green/20 shadow-sm truncate group-hover:shadow-md transition-shadow" title={evt.title}>
                      <span className="w-1.5 h-1.5 inline-block bg-football-green rounded-full mr-1.5"></span>
                      {evt.title}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            // Week View
            weekDays.map((date, i) => {
              const today = isToday(date);
              const evt = getMockEvent(date);
              const isCurrentMonth = date.getMonth() === month;

              return (
                <div 
                  key={i} 
                  className={`bg-[#161920] p-5 flex flex-col hover:bg-slate-800 transition-colors cursor-pointer group ${
                    !isCurrentMonth ? 'opacity-30 text-slate-500' : 'text-slate-200'
                  }`}
                >
                  <span className={`text-xl font-black mb-5 transition-all ${
                    today ? 'w-12 h-12 rounded-full bg-[#FFE600] text-black flex items-center justify-center shadow-lg shadow-[#FFE600]/30 scale-110' : 'group-hover:scale-110 origin-left inline-block'
                  }`}>
                    {date.getDate()}
                  </span>
                  
                  <div className="flex-1 flex flex-col gap-3">
                    {evt && evt.type === 'match' && (
                      <div className="bg-football-red/15 text-football-red text-sm font-bold p-4 rounded-xl border border-football-red/20 shadow-sm group-hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-football-red/20 blur-xl rounded-full"></div>
                        <span className="w-2 h-2 inline-block bg-football-red rounded-full mr-2 animate-pulse"></span>
                        {evt.title}
                      </div>
                    )}
                    {evt && evt.type === 'analysis' && (
                      <div className="bg-football-purple/15 text-football-purple text-sm font-bold p-4 rounded-xl border border-football-purple/20 shadow-sm group-hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-football-purple/20 blur-xl rounded-full"></div>
                        <span className="w-2 h-2 inline-block bg-football-purple rounded-full mr-2"></span>
                        {evt.title}
                      </div>
                    )}
                    {evt && evt.type === 'training' && (
                      <div className="bg-football-green/15 text-football-green text-sm font-bold p-4 rounded-xl border border-football-green/20 shadow-sm group-hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-football-green/20 blur-xl rounded-full"></div>
                        <span className="w-2 h-2 inline-block bg-football-green rounded-full mr-2"></span>
                        {evt.title}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
