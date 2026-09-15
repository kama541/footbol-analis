import React, { useState } from 'react';
import { useMatch, EventCategory } from '../context/MatchContext';

interface TagButtonProps {
  label: string;
  category: EventCategory;
  isSelected?: boolean;
  onClick: () => void;
}

const TagButton = ({ label, category, isSelected, onClick }: TagButtonProps) => {
  const getColors = () => {
    switch (category) {
      case 'attacking': return 'bg-football-purple/10 text-football-purple hover:bg-football-purple hover:text-white border-football-purple/20';
      case 'defensive': return 'bg-football-red/10 text-football-red hover:bg-football-red hover:text-white border-football-red/20';
      case 'positive': return 'bg-football-green/10 text-football-green hover:bg-football-green hover:text-white border-football-green/20';
      case 'other': return 'bg-football-orange/10 text-football-orange hover:bg-football-orange hover:text-white border-football-orange/20';
      default: return 'bg-slate-100 text-slate-700 hover:bg-slate-200';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`h-12 rounded-xl font-bold text-sm tracking-wide border transition-all active:scale-95 ${getColors()} ${isSelected ? 'ring-2 ring-offset-2 ring-football-blue shadow-lg scale-[1.02]' : ''}`}
    >
      {label}
    </button>
  );
};

const TaggingPanel = () => {
  const { addEvent, currentTime, players, events, setCurrentTime } = useMatch();
  const [toast, setToast] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState(players[0].id);
  const [note, setNote] = useState('');
  const [pendingTag, setPendingTag] = useState<{type: string, category: EventCategory, time: number} | null>(null);

  const handleTag = (type: string, category: EventCategory) => {
    // Stage the tag instead of sending immediately
    setPendingTag({ type, category, time: currentTime });
  };

  const handleSendNote = () => {
    const player = players.find(p => p.id === selectedPlayerId) || players[0];
    
    if (pendingTag) {
      // Send the staged tag with the note
      addEvent({
        type: pendingTag.type,
        time: pendingTag.time,
        player: `${player.name} (#${player.num})`,
        team: 'Football Club',
        description: note.trim() ? note.trim() : `Tagged ${pendingTag.type} during live match`,
        category: pendingTag.category
      });
      setToast(`Added ${pendingTag.type}`);
    } else {
      // Just send a generic note if no tag selected
      if (!note.trim()) return;
      addEvent({
        type: 'NOTE',
        time: currentTime,
        player: `${player.name} (#${player.num})`,
        team: 'Football Club',
        description: note.trim(),
        category: 'other' as EventCategory
      });
      setToast('Note added');
    }
    
    setPendingTag(null);
    setNote('');
    setTimeout(() => setToast(null), 2000);
  };

  const sections = [
    {
      title: 'Attacking',
      category: 'attacking' as EventCategory,
      tags: ['GOAL', 'ASSIST', 'SHOT', 'CHANCE', 'CROSS', 'KEY PASS']
    },
    {
      title: 'Defensive',
      category: 'defensive' as EventCategory,
      tags: ['TACKLE', 'INTERCEPT', 'BLOCK', 'CLEARANCE', 'ERROR']
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl relative z-10 overflow-hidden shadow-[-10px_0_20px_rgba(0,0,0,0.05)] border-l border-slate-200/50 dark:border-slate-800/50">
      <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shrink-0">
        <h2 className="font-black text-slate-900 dark:text-white tracking-tight text-lg">Match Events</h2>
        {toast && (
          <span className="text-[10px] font-black text-football-green animate-slide-up bg-football-green/10 border border-football-green/20 px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-sm">
            {toast}
          </span>
        )}
      </div>
      
      <div className="p-5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50 shrink-0 space-y-4">
        <div>
          <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
            Active Player
          </label>
          <select 
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            className="w-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 text-slate-800 dark:text-slate-100 text-sm font-bold rounded-xl p-3 outline-none focus:border-football-blue focus:ring-2 focus:ring-football-blue/20 transition-all shadow-sm"
          >
            {players.map(p => (
              <option key={p.id} value={p.id} className="font-bold">
                #{p.num} {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 mt-2">
            IZOH (NOTE)
          </label>
          <div className="flex gap-2">
            <input 
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendNote(); }}
              placeholder="Izoh yozing..."
              className="flex-1 w-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 text-slate-800 dark:text-slate-100 text-sm font-bold rounded-xl p-3 outline-none focus:border-football-blue focus:ring-2 focus:ring-football-blue/20 transition-all shadow-sm placeholder:text-slate-400 placeholder:font-medium"
            />
            <button
              onClick={handleSendNote}
              disabled={!note.trim()}
              className="glass-button bg-football-blue text-white px-5 py-3 rounded-xl text-sm font-bold disabled:opacity-50 transition-all shadow-md shadow-football-blue/20 hover:shadow-football-blue/40"
            >
              Jo'natish
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        <div className="glass-panel p-5 rounded-2xl space-y-6">
          {sections.map(section => (
            <div key={section.title}>
              <div className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${section.category === 'attacking' ? 'bg-football-purple' : 'bg-football-red'}`}></span>
                {section.title}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {section.tags.map(tag => (
                  <TagButton
                    key={tag}
                    label={tag}
                    category={section.category}
                    isSelected={pendingTag?.type === tag}
                    onClick={() => handleTag(tag, section.category)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mini Recent Events List inside Tagging Panel */}
        {events.length > 0 && (
          <div className="glass-panel p-5 rounded-2xl">
            <div className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 px-1">
              Oxirgi qo'shilganlar
            </div>
            <div className="space-y-3">
              {events.slice(-3).reverse().map(event => (
                <div 
                  key={event.id} 
                  onClick={() => setCurrentTime(event.time)}
                  className="group bg-white/50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 flex flex-col gap-1.5 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-football-blue transition-colors">{event.type}</span>
                    <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-700/50 px-2 py-0.5 rounded">
                      {Math.floor(event.time / 60).toString().padStart(2, '0')}:{(event.time % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  {event.description && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">{event.description}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaggingPanel;
