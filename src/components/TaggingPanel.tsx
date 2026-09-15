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
  const { addEvent, currentTime, players, events } = useMatch();
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
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
      <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
        <h2 className="font-semibold text-football-navy dark:text-white">Match Events</h2>
        {toast && (
          <span className="text-xs font-bold text-football-green animate-fade-in bg-football-green/10 px-2 py-1 rounded">
            {toast}
          </span>
        )}
      </div>
      
      <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0 space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Active Player
          </label>
          <select 
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg p-2 outline-none focus:border-football-blue"
          >
            {players.map(p => (
              <option key={p.id} value={p.id} className="text-slate-900 bg-white dark:bg-slate-800 dark:text-white">
                #{p.num} {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 mt-2">
            IZOH (NOTE)
          </label>
          <div className="flex gap-2">
            <input 
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendNote(); }}
              placeholder="Izoh yozing..."
              className="flex-1 w-full bg-white dark:bg-slate-800 border border-blue-400 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg p-2 outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSendNote}
              disabled={!note.trim()}
              className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 transition-colors"
            >
              Jo'natish
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
          {sections.map(section => (
            <div key={section.title}>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                {section.title}
              </div>
              <div className="grid grid-cols-2 gap-2">
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
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
              Oxirgi qo'shilganlar
            </div>
            <div className="space-y-2">
              {events.slice(-3).reverse().map(event => (
                <div key={event.id} className="text-sm bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-football-navy dark:text-white">{event.type}</span>
                    <span className="font-mono text-xs text-slate-400">
                      {Math.floor(event.time / 60).toString().padStart(2, '0')}:{(event.time % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  {event.description && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{event.description}</span>
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
