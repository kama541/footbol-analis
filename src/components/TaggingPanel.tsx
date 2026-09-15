import React, { useState } from 'react';
import { useMatch, EventCategory } from '../context/MatchContext';

interface TagButtonProps {
  label: string;
  category: EventCategory;
  onClick: () => void;
}

const TagButton = ({ label, category, onClick }: TagButtonProps) => {
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
      className={`h-12 rounded-xl font-bold text-sm tracking-wide border transition-all active:scale-95 ${getColors()}`}
    >
      {label}
    </button>
  );
};

const TaggingPanel = () => {
  const { addEvent, currentTime, players } = useMatch();
  const [toast, setToast] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState(players[0].id);

  const handleTag = (type: string, category: EventCategory) => {
    const player = players.find(p => p.id === selectedPlayerId) || players[0];
    
    addEvent({
      type,
      time: currentTime,
      player: `${player.name} (#${player.num})`,
      team: 'Football Club',
      description: `Tagged ${type} during live match`,
      category
    });
    setToast(`Added ${type}`);
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
    },
    {
      title: 'Other',
      category: 'other' as EventCategory,
      tags: ['FOUL', 'OFFSIDE', 'CORNER', 'FREE KICK', 'CARD', 'SUB']
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        <h2 className="font-semibold text-football-navy">Match Events</h2>
        {toast && (
          <span className="text-xs font-bold text-football-green animate-fade-in bg-football-green/10 px-2 py-1 rounded">
            {toast}
          </span>
        )}
      </div>
      
      <div className="p-3 bg-white border-b border-slate-100 shrink-0">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Active Player
        </label>
        <select 
          value={selectedPlayerId}
          onChange={(e) => setSelectedPlayerId(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 text-sm font-semibold rounded-lg p-2 outline-none focus:border-football-blue"
        >
          {players.map(p => (
            <option key={p.id} value={p.id}>#{p.num} {p.name}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-white">
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
                  onClick={() => handleTag(tag, section.category)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaggingPanel;
