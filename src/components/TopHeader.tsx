import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { PlaySquare, ListVideo, Calendar, Users, MonitorSmartphone, Activity, Target, Settings, LogOut, Search, User, X, Globe, Moon, Sun, Shield, Camera, Edit2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TopHeaderProps {
  onOpenAi: () => void;
}

const TopHeader = ({ onOpenAi }: TopHeaderProps) => {
  const { t, i18n } = useTranslation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Profile state
  const [userName, setUserName] = useState('Analyst User');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(userName);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openProfileModal = () => {
    setEditName(userName);
    setIsEditingProfile(false);
    setShowProfileModal(true);
    setShowProfileMenu(false);
  };

  const saveProfile = () => {
    if (editName.trim()) {
      setUserName(editName);
    }
    setIsEditingProfile(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setShowProfileMenu(false);
  };

  const confirmLogout = () => {
    window.location.href = '/';
  };

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
    <>
      <header className="flex flex-col shrink-0 z-40 relative">
        {/* Top Yellow Bar - Main Navigation */}
        <div className="h-8 bg-[#FFE600] flex items-center justify-between px-4 text-black font-semibold text-xs tracking-tight shadow-md border-b border-yellow-500">
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar no-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1 rounded transition-colors whitespace-nowrap ${isActive ? 'bg-black text-[#FFE600]' : 'hover:bg-yellow-300'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0 pl-4 border-l border-yellow-500 ml-4 relative">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center gap-1 hover:text-slate-800 transition-colors"
            >
              <Settings size={14} /> <span>{t('sidebar.settings', 'Настройки')}</span>
            </button>
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-1 text-red-700 hover:text-red-900 transition-colors font-bold"
            >
              <LogOut size={14} /> <span>{t('sidebar.logout', 'Выйти')}</span>
            </button>
          </div>
        </div>

        {/* Secondary Dark Bar - Actions & Search */}
        <div className="h-10 bg-[#1a1e2e] border-b border-slate-800 px-4 flex items-center justify-between shadow-lg relative">
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
            <div className="flex items-center bg-[#1e2235] border border-slate-800 rounded px-2 py-1 w-48 transition-colors focus-within:border-[#FFE600]">
              <Search size={12} className="text-slate-500 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-[11px] text-slate-200 w-full placeholder:text-slate-600 font-medium"
              />
            </div>
            <div className="w-px h-4 bg-slate-700"></div>

            {/* Profile Section */}
            <div className="relative" ref={profileMenuRef}>
              <div
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="w-6 h-6 bg-[#FFE600] rounded-full border border-yellow-600 flex items-center justify-center shadow-[0_0_8px_rgba(255,230,0,0.3)] overflow-hidden">
                  {userAvatar ? <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" /> : <User size={12} className="text-black" />}
                </div>
                <span className="text-[10px] font-bold text-white">{userName}</span>
              </div>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-3 w-48 bg-[#1e2235] border border-slate-800 rounded-md shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-800 mb-1">
                    <p className="text-sm font-bold text-white">{userName}</p>
                    <p className="text-[10px] text-slate-400">analyst@footballvision.com</p>
                  </div>
                  <button onClick={openProfileModal} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2">
                    <User size={12} /> My Profile
                  </button>
                  <button onClick={() => { setShowSettingsModal(true); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2">
                    <Settings size={12} /> Account Settings
                  </button>
                  <div className="h-px bg-slate-800 my-1"></div>
                  <button onClick={handleLogoutClick} className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-slate-800 hover:text-red-400 transition-colors flex items-center gap-2">
                    <LogOut size={12} /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
          <div className="bg-[#1e2235] border border-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#252a3d]">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings size={18} className="text-[#FFE600]" />
                {t('sidebar.settings', 'Settings')}
              </h2>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Language Settings */}
              <div>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Globe size={12} /> Language / Язык
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => i18n.changeLanguage('en')}
                    className={`p-2 rounded text-sm font-bold border transition-colors ${i18n.language === 'en' ? 'bg-[#FFE600] text-black border-yellow-500' : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => i18n.changeLanguage('ru')}
                    className={`p-2 rounded text-sm font-bold border transition-colors ${i18n.language === 'ru' ? 'bg-[#FFE600] text-black border-yellow-500' : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'}`}
                  >
                    Русский
                  </button>
                </div>
              </div>

              {/* Appearance Settings */}
              <div>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <MonitorSmartphone size={12} /> Appearance
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="p-2 rounded text-sm font-bold border bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500 transition-colors flex items-center justify-center gap-2">
                    <Sun size={14} /> Light
                  </button>
                  <button className="p-2 rounded text-sm font-bold border bg-black text-white border-slate-700 shadow-[0_0_0_1px_#FFE600] transition-colors flex items-center justify-center gap-2">
                    <Moon size={14} className="text-[#FFE600]" /> Dark
                  </button>
                </div>
              </div>

              {/* Account Settings */}
              <div>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Shield size={12} /> Account
                </h3>
                <div className="space-y-2">
                  <div className="bg-slate-900/50 p-3 rounded border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-slate-200">{userName}</p>
                      <p className="text-xs text-slate-500">analyst@footballvision.com</p>
                    </div>
                    <span className="text-[10px] bg-[#FFE600] text-black px-2 py-1 rounded font-bold">PRO</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-[#252a3d] flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-[#FFE600] text-black text-sm font-bold rounded hover:bg-yellow-400 transition-colors"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
          <div className="bg-[#1e2235] border border-slate-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut size={24} />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">
                {t('logout.confirm_title', 'Tizimdan chiqish')}
              </h2>
              <p className="text-sm text-slate-400">
                {t('logout.confirm_message', 'Haqiqatan ham tizimdan chiqmoqchimisiz? Barcha saqlanmagan o\'zgarishlar yo\'qolishi mumkin.')}
              </p>
            </div>
            <div className="flex border-t border-slate-800">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-3 text-sm font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 border-l border-slate-800 transition-colors"
              >
                Ha, chiqish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
          <div className="bg-[#1e2235] border border-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#252a3d]">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User size={18} className="text-[#FFE600]" />
                Mening Profilim
              </h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 bg-[#FFE600] rounded-full border-4 border-slate-800 flex items-center justify-center shadow-lg mb-3 overflow-hidden">
                    {userAvatar ? (
                      <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={48} className="text-black" />
                    )}
                  </div>
                  {isEditingProfile && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity mb-3 border-4 border-transparent"
                    >
                      <Camera size={24} />
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {isEditingProfile ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-xl font-bold bg-slate-900 border border-slate-700 text-white rounded px-3 py-1 text-center outline-none focus:border-[#FFE600] w-full max-w-[200px]"
                  />
                ) : (
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {userName}
                    <button onClick={() => setIsEditingProfile(true)} className="text-slate-500 hover:text-[#FFE600] transition-colors ml-1">
                      <Edit2 size={14} />
                    </button>
                  </h3>
                )}
                <p className="text-sm text-slate-400 mt-1">analyst@footballvision.com</p>
                <span className="mt-3 bg-[#FFE600] text-black px-3 py-1 rounded-full text-xs font-black tracking-wider shadow-[0_0_8px_rgba(255,230,0,0.3)]">
                  PRO MEMBER
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900/50 p-4 rounded border border-slate-800">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Statistika</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400">Tahlil qilingan o'yinlar</p>
                      <p className="text-lg font-bold text-white">124</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Yaratilgan kliplar</p>
                      <p className="text-lg font-bold text-white">892</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded border border-slate-800">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Jamoa</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center font-bold text-white">FC</div>
                    <div>
                      <p className="text-sm font-bold text-white">Football Club</p>
                      <p className="text-xs text-slate-400">Bosh tahlilchi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-[#252a3d] flex justify-end gap-2">
              {isEditingProfile ? (
                <>
                  <button
                    onClick={() => { setIsEditingProfile(false); setEditName(userName); }}
                    className="px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded hover:bg-slate-700 transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={saveProfile}
                    className="px-4 py-2 bg-[#FFE600] text-black text-sm font-bold rounded hover:bg-yellow-400 transition-colors"
                  >
                    Saqlash
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded hover:bg-slate-700 transition-colors"
                >
                  Yopish
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopHeader;
