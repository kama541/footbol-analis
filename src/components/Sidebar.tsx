import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { PlaySquare, ListVideo, Calendar, Users, MonitorSmartphone, Moon, Sun, Settings, LogOut, Activity, X } from 'lucide-react';

const Sidebar = () => {
  const [isDark, setIsDark] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const navItems = [
    { name: 'Matches', path: '/matches', icon: <PlaySquare size={20} /> },
    { name: 'Live Tagging', path: '/live', icon: <Activity size={20} /> },
    { name: 'Playlists', path: '/playlists', icon: <ListVideo size={20} /> },
    { name: 'Calendar', path: '/calendar', icon: <Calendar size={20} /> },
    { name: 'Users', path: '/users', icon: <Users size={20} /> },
    { name: 'Devices', path: '/devices', icon: <MonitorSmartphone size={20} /> },
  ];

  return (
    <>
      <div className="w-20 lg:w-64 bg-football-navy flex flex-col h-full text-slate-400 transition-all duration-300 z-20">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
          <div className="w-8 h-8 rounded-full bg-football-purple flex items-center justify-center text-white font-bold">
            FV
          </div>
          <span className="hidden lg:block ml-3 font-bold text-white text-lg tracking-wide">
            Football Vision
          </span>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-2 px-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-center lg:justify-start px-3 py-3 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-football-blue/10 text-football-blue'
                        : 'hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  {item.icon}
                  <span className="hidden lg:block ml-3 font-medium text-sm">
                    {item.name}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="w-full flex items-center justify-center lg:justify-start px-3 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="hidden lg:block ml-3 font-medium text-sm">
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
          
          <button 
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center justify-center lg:justify-start px-3 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Settings size={20} />
            <span className="hidden lg:block ml-3 font-medium text-sm">Settings</span>
          </button>
          
          <button 
            onClick={() => setShowLogout(true)}
            className="w-full flex items-center justify-center lg:justify-start px-3 py-3 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut size={20} />
            <span className="hidden lg:block ml-3 font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-football-navy/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-[400px] shadow-2xl animate-fade-in border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-football-navy dark:text-white">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span>Account Email</span>
                <span className="font-semibold text-slate-900 dark:text-white">analyst@fc.uz</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span>Notifications</span>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex justify-between items-center py-2">
                <span>App Version</span>
                <span className="font-mono">v1.2.4</span>
              </div>
            </div>
            <button onClick={() => setShowSettings(false)} className="mt-8 w-full py-2 bg-football-blue text-white rounded-lg font-bold">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogout && (
        <div className="fixed inset-0 bg-football-navy/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-[350px] shadow-2xl animate-fade-in border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut size={24} />
            </div>
            <h2 className="text-xl font-bold text-football-navy dark:text-white mb-2">Tizimdan chiqish</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Rostdan ham tizimdan chiqmoqchimisiz? Barcha saqlanmagan teglaringiz yo'qolishi mumkin.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogout(false)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-lg font-bold hover:bg-slate-200 transition-colors">
                Bekor qilish
              </button>
              <button onClick={() => { setShowLogout(false); alert("Logged out (Mock)"); }} className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors">
                Chiqish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
