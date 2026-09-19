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
      case 'attacking': return 'bg-[#1a1d24] text-[#FFE600] hover:bg-[#FFE600] hover:text-black border-slate-700';
      case 'defensive': return 'bg-[#1a1d24] text-white hover:bg-slate-200 hover:text-black border-slate-700';
      case 'positive': return 'bg-[#1a1d24] text-slate-300 hover:bg-slate-400 hover:text-black border-slate-700';
      case 'other': return 'bg-[#1a1d24] text-slate-400 hover:bg-slate-500 hover:text-black border-slate-700';
      default: return 'bg-[#1a1d24] text-slate-300 hover:bg-[#FFE600] hover:text-black border-slate-700';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`px-2 py-1.5 rounded-md font-bold text-[10px] tracking-wide border transition-all active:scale-95 ${getColors()} ${isSelected ? 'ring-1 ring-offset-1 ring-offset-[#161920] ring-white scale-[1.02]' : ''}`}
    >
      {label}
    </button>
  );
};

const TaggingPanel = () => {
  const { addEvent, currentTime, players } = useMatch();
  const [selectedPlayerId, setSelectedPlayerId] = useState(players[0]?.id || '');
  const [note, setNote] = useState('');

  const handleTag = (type: string, category: EventCategory) => {
    const player = players.find(p => p.id === selectedPlayerId) || players[0];
    addEvent({
      type: type,
      time: currentTime,
      player: player ? `${player.name} (#${player.num})` : 'Unknown Player',
      team: 'Football Club',
      description: note.trim() ? note.trim() : `Tagged ${type}`,
      category: category
    });
    setNote('');
  };

  const handleSendNote = () => {
    if (!note.trim()) return;
    const player = players.find(p => p.id === selectedPlayerId) || players[0];
    
    addEvent({
      type: 'NOTE',
      time: currentTime,
      player: player ? `${player.name} (#${player.num})` : 'Unknown Player',
      team: 'Football Club',
      description: note.trim(),
      category: 'other'
    });
    
    setNote('');
  };

  const sections = [
    {
      title: 'Attacking / In Possession',
      category: 'attacking' as EventCategory,
      tags: ['Goal', 'Shot', 'Key Play', 'Carries', 'Switch of Play', 'Long Pass', 'Cross', 'Build Up', 'Progression', 'Final Third']
    },
    {
      title: 'Defensive / Out of Possession',
      category: 'defensive' as EventCategory,
      tags: ['Tackle', 'Clearance', 'Interception', 'Duel', 'Recovery', 'Save', 'Low Block', 'Mid Block', 'High Press']
    },
    {
      title: 'Transitions & Tactical',
      category: 'positive' as EventCategory,
      tags: ['Transition to Attack', 'Transition to Defence', 'Positioning', 'Movement', 'Receiving']
    },
    {
      title: 'Set Pieces & Other',
      category: 'other' as EventCategory,
      tags: ['Kick Off', 'Throw In', 'Corner', 'Goal Kick', 'Free Kick', 'Fouls', 'Substitution']
    },
    {
      title: 'Opponent Actions',
      category: 'defensive' as EventCategory,
      tags: ['Opp. Shot', 'Opp. Long Ball', 'Opp. Pass']
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#161920] relative z-10 overflow-hidden">
      {/* Player and Note Entry */}
      <div className="p-3 border-b border-slate-800 bg-[#1a1d24] shrink-0 space-y-3">
        <div>
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
            Active Player
          </label>
          <select 
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            className="w-full bg-black border border-slate-800 text-slate-200 text-xs font-bold rounded p-2 outline-none focus:border-[#FFE600]"
          >
            {players.map(p => (
              <option key={p.id} value={p.id} className="font-bold">
                #{p.num} {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
            Event Note (Optional)
          </label>
          <div className="flex gap-2">
            <input 
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendNote(); }}
              placeholder="Add note..."
              className="flex-1 w-full bg-black border border-slate-800 text-slate-200 text-xs font-bold rounded p-2 outline-none focus:border-[#FFE600] placeholder:text-slate-600"
            />
            <button
              onClick={handleSendNote}
              disabled={!note.trim()}
              className="bg-slate-700 text-white px-3 py-1.5 rounded text-xs font-bold disabled:opacity-50 hover:bg-slate-600 transition-colors"
            >
              Note
            </button>
          </div>
        </div>
      </div>

      {/* Button Groups */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5 custom-scrollbar">
        {sections.map(section => (
          <div key={section.title}>
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">
              {section.title}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {section.tags.map(tag => (
                <TagButton
                  key={tag}
                  label={tag}
                  category={section.category}
                  isSelected={false}
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
