import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { PlaySquare, ListVideo, Calendar, Users, MonitorSmartphone, Moon, Sun, Settings, LogOut, Activity, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const [isDark, setIsDark] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const navItems = [
    { name: t('sidebar.matches'), path: '/matches', icon: <PlaySquare size={20} /> },
    { name: t('sidebar.live_tagging'), path: '/live', icon: <Activity size={20} /> },
    { name: t('sidebar.playlists'), path: '/playlists', icon: <ListVideo size={20} /> },
    { name: t('sidebar.calendar'), path: '/calendar', icon: <Calendar size={20} /> },
    { name: t('sidebar.users'), path: '/users', icon: <Users size={20} /> },
    { name: t('sidebar.devices'), path: '/devices', icon: <MonitorSmartphone size={20} /> },
  ];

  return (
    <>
      <div className="w-20 lg:w-64 bg-football-navy/95 backdrop-blur-xl border-r border-slate-800/50 flex flex-col h-full text-slate-400 transition-all duration-300 z-20 relative overflow-hidden">
        {/* Subtle gradient background effect */}
        <div className="absolute top-0 left-0 w-full h-64 bg-football-blue/10 blur-[100px] pointer-events-none rounded-full transform -translate-y-1/2"></div>
        
        {/* Logo */}
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800/50 shrink-0 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-football-blue to-football-purple flex items-center justify-center text-white font-black shadow-lg shadow-football-purple/20 relative group">
            <span className="relative z-10">FV</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-xl"></div>
          </div>
          <span className="hidden lg:block ml-4 font-black text-white text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Football Vision
          </span>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 overflow-y-auto relative z-10 custom-scrollbar">
          <ul className="space-y-2 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `group relative flex items-center justify-center lg:justify-start px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-football-blue/10 text-football-blue shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                        : 'hover:bg-slate-800/50 hover:text-slate-200'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator bar */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-football-blue rounded-r-md shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-fade-in"></div>
                      )}
                      <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-white'}`}>
                        {item.icon}
                      </div>
                      <span className={`hidden lg:block ml-4 font-bold text-sm tracking-wide transition-colors ${isActive ? 'text-football-blue' : 'group-hover:text-white'}`}>
                        {item.name}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800/50 space-y-2 shrink-0 relative z-10">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="group w-full flex items-center justify-center lg:justify-start px-4 py-3 rounded-xl hover:bg-slate-800/50 hover:text-white transition-all duration-300"
          >
            <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              {isDark ? <Sun size={20} className="text-football-orange" /> : <Moon size={20} className="text-football-purple" />}
            </div>
            <span className="hidden lg:block ml-4 font-bold text-sm tracking-wide group-hover:text-white transition-colors">
              {isDark ? t('sidebar.light_mode') : t('sidebar.dark_mode')}
            </span>
          </button>
          
          <button 
            onClick={() => setShowSettings(true)}
            className="group w-full flex items-center justify-center lg:justify-start px-4 py-3 rounded-xl hover:bg-slate-800/50 hover:text-white transition-all duration-300"
          >
            <Settings size={20} className="transition-transform duration-300 group-hover:rotate-90" />
            <span className="hidden lg:block ml-4 font-bold text-sm tracking-wide group-hover:text-white transition-colors">{t('sidebar.settings')}</span>
          </button>
          
          <button 
            onClick={() => setShowLogout(true)}
            className="group w-full flex items-center justify-center lg:justify-start px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all duration-300"
          >
            <LogOut size={20} className="transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="hidden lg:block ml-4 font-bold text-sm tracking-wide group-hover:text-red-300 transition-colors">{t('sidebar.logout')}</span>
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-football-navy/80 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
          <div className="glass-panel rounded-2xl p-8 w-[450px] animate-slide-up">
            <div className="flex justify-between items-center mb-8 relative">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-football-blue to-football-purple">{t('sidebar.settings')}</h2>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-800/50 group hover:border-football-blue/50 transition-colors">
                <span className="font-semibold tracking-wide">Account Email</span>
                <span className="font-bold text-football-blue group-hover:text-football-purple transition-colors">analyst@fc.uz</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-800/50 group hover:border-football-blue/50 transition-colors">
                <span className="font-semibold tracking-wide">Notifications</span>
                <input type="checkbox" defaultChecked className="toggle toggle-primary" />
              </div>
            </div>
            <button onClick={() => setShowSettings(false)} className="glass-button mt-10 w-full py-3.5 bg-gradient-to-r from-football-blue to-football-purple text-white rounded-xl font-bold tracking-wide shadow-lg shadow-football-blue/25 hover:shadow-football-blue/40">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogout && (
        <div className="fixed inset-0 bg-football-navy/80 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
          <div className="glass-panel rounded-2xl p-8 w-[400px] text-center animate-slide-up">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <LogOut size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">{t('sidebar.logout')}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Are you sure you want to end your session?</p>
            <div className="flex gap-4 mt-6">
              <button onClick={() => setShowLogout(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-white rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                Cancel
              </button>
              <button onClick={() => { setShowLogout(false); }} className="glass-button flex-1 py-3 bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:bg-red-600 transition-colors">
                {t('sidebar.logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
