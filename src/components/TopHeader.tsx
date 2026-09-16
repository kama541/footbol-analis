import React from 'react';
import { NavLink } from 'react-router-dom';
import { PlaySquare, ListVideo, Calendar, Users, MonitorSmartphone, Activity, Target, Settings, LogOut, Search, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TopHeaderProps {
  onOpenAi: () => void;
}

const TopHeader = ({ onOpenAi }: TopHeaderProps) => {
  const { t } = useTranslation();

  const navItems = [
    { name: t('sidebar.matches'), path: '/matches', icon: <PlaySquare size={14} /> },
    { name: t('sidebar.live_tagging'), path: '/live', icon: <Activity size={14} /> },
    { name: t('sidebar.playlists'), path: '/playlists', icon: <ListVideo size={14} /> },
    { name: t('sidebar.training'), path: '/training', icon: <Target size={14} /> },
    { name: t('sidebar.calendar'), path: '/calendar', icon: <Calendar size={14} /> },
    { name: t('sidebar.users'), path: '/users', icon: <Users size={14} /> },
    { name: t('sidebar.devices'), path: '/devices', icon: <MonitorSmartphone size={14} /> },
  ];

  return (
    <header className="flex flex-col shrink-0 z-50">
      {/* Top Yellow Bar - Main Navigation */}
      <div className="h-8 bg-[#FFE600] flex items-center justify-between px-4 text-black font-semibold text-xs tracking-tight shadow-md border-b border-yellow-500">
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar no-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  isActive ? 'bg-black text-[#FFE600]' : 'hover:bg-yellow-300'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
        
        <div className="flex items-center gap-3 shrink-0 pl-4 border-l border-yellow-500 ml-4">
          <button className="flex items-center gap-1 hover:text-slate-800 transition-colors">
            <Settings size={14} /> <span>{t('sidebar.settings')}</span>
          </button>
          <button className="flex items-center gap-1 text-red-700 hover:text-red-900 transition-colors font-bold">
            <LogOut size={14} /> <span>{t('sidebar.logout')}</span>
          </button>
        </div>
      </div>

      {/* Secondary Dark Bar - Actions & Search */}
      <div className="h-10 bg-[#0f1115] border-b border-slate-800 px-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#FFE600] rounded flex items-center justify-center font-black text-black text-[9px] shadow-[0_0_8px_rgba(255,230,0,0.4)]">
              FV
            </div>
            <span className="font-bold text-white text-sm tracking-wide">Football Vision</span>
          </div>
          <div className="w-px h-4 bg-slate-700 mx-2"></div>
          <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Professional Version 2.4</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#161920] border border-slate-800 rounded px-2 py-1 w-48 transition-colors focus-within:border-[#FFE600]">
            <Search size={12} className="text-slate-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none text-[11px] text-slate-200 w-full placeholder:text-slate-600 font-medium"
            />
          </div>
          <div className="w-px h-4 bg-slate-700"></div>
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 bg-[#FFE600] rounded-full border border-yellow-600 flex items-center justify-center shadow-[0_0_8px_rgba(255,230,0,0.3)]">
              <User size={12} className="text-black" />
            </div>
            <span className="text-[10px] font-bold text-white">Analyst</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
