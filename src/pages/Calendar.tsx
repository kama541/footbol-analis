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
    <div className="p-8 h-full overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-football-navy tracking-tight">
            Taqvim <span className="text-slate-400 font-normal ml-2">{monthNames[month]} {year}</span>
          </h1>
          <div className="flex bg-slate-100 rounded-lg p-1 ml-4 border border-slate-200">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${viewMode === 'week' ? 'bg-white shadow-sm text-football-blue' : 'text-slate-500 hover:text-slate-700'}`}
            >
              1 Haftalik
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${viewMode === 'month' ? 'bg-white shadow-sm text-football-blue' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Oylik
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePrev}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-sm text-sm"
          >
            Oldingi
          </button>
          <button 
            onClick={handleNext}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-sm text-sm"
          >
            Keyingi
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
          {['Du', 'Se', 'Chor', 'Pay', 'Ju', 'Shan', 'Yak'].map(day => (
            <div key={day} className="p-4 text-center border-r border-slate-200 last:border-r-0">{day}</div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className={`flex-1 grid grid-cols-7 bg-slate-100 gap-px ${viewMode === 'month' ? 'grid-rows-6' : 'grid-rows-1'}`}>
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
                  className={`bg-white p-3 flex flex-col hover:bg-slate-50 transition-colors cursor-pointer ${
                    !currentDay ? 'bg-slate-50/50 text-slate-400' : 'text-slate-700'
                  }`}
                >
                  <span className={`text-sm font-semibold mb-2 ${
                    today ? 'w-7 h-7 rounded-full bg-football-blue text-white flex items-center justify-center' : ''
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
                  className={`bg-white p-4 flex flex-col hover:bg-slate-50 transition-colors cursor-pointer ${
                    !isCurrentMonth ? 'text-slate-400' : 'text-slate-700'
                  }`}
                >
                  <span className={`text-lg font-bold mb-4 ${
                    today ? 'w-10 h-10 rounded-full bg-football-blue text-white flex items-center justify-center' : ''
                  }`}>
                    {date.getDate()}
                  </span>
                  
                  <div className="flex-1 flex flex-col gap-2">
                    {evt && evt.type === 'match' && (
                      <div className="bg-red-100 text-red-600 text-sm font-bold p-3 rounded-lg border border-red-200 shadow-sm">
                        {evt.title}
                      </div>
                    )}
                    {evt && evt.type === 'analysis' && (
                      <div className="bg-football-purple/10 text-football-purple text-sm font-bold p-3 rounded-lg border border-football-purple/20 shadow-sm">
                        {evt.title}
                      </div>
                    )}
                    {evt && evt.type === 'training' && (
                      <div className="bg-football-green/10 text-football-green text-sm font-bold p-3 rounded-lg border border-football-green/20 shadow-sm">
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
