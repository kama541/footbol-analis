import React, { useState } from 'react';
import { User, Shield, Clock, MoreVertical, Plus, X } from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  role: string;
  status: string;
  lastActive: string;
  access: string;
  avatar: string;
  email: string;
}

const initialUsers: UserData[] = [
  { id: 1, name: 'Kamronbek', role: 'Head Analyst', status: 'Online', lastActive: 'Just now', access: 'Admin', avatar: 'K', email: 'kamronbek@fc.uz' },
  { id: 2, name: 'Aziz Aliyev', role: 'Scout', status: 'Offline', lastActive: '2 hours ago', access: 'Editor', avatar: 'A', email: 'aziz.aliyev@fc.uz' },
  { id: 3, name: 'Bekzod Umarov', role: 'Assistant Coach', status: 'Offline', lastActive: '1 day ago', access: 'Viewer', avatar: 'B', email: 'bekzod.umarov@fc.uz' },
  { id: 4, name: 'Sardor Rashidov', role: 'Data Scientist', status: 'Online', lastActive: '5 mins ago', access: 'Admin', avatar: 'S', email: 'sardor.rashidov@fc.uz' },
];

const Users = () => {
  const [usersList, setUsersList] = useState<UserData[]>(initialUsers);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', role: 'Analyst', email: '' });

  const handleOpenAdd = () => {
    setFormData({ name: '', role: 'Analyst', email: '' });
    setShowAddModal(true);
  };

  const handleAddSubmit = () => {
    if (!formData.name.trim()) return;
    const newUser: UserData = {
      id: Date.now(),
      name: formData.name,
      role: formData.role,
      email: formData.email,
      status: 'Online',
      lastActive: 'Just now',
      access: formData.role.includes('Analyst') || formData.role.includes('Scientist') ? 'Admin' : 'Viewer',
      avatar: formData.name.charAt(0).toUpperCase()
    };
    setUsersList([newUser, ...usersList]);
    setShowAddModal(false);
  };

  const handleOpenEdit = () => {
    if (selectedUser) {
      setFormData({ name: selectedUser.name, role: selectedUser.role, email: selectedUser.email });
      setEditingUserId(selectedUser.id);
      setShowEditModal(true);
      setSelectedUser(null);
    }
  };

  const handleEditSubmit = () => {
    if (!formData.name.trim() || !editingUserId) return;
    setUsersList(usersList.map(u => 
      u.id === editingUserId 
      ? { ...u, name: formData.name, role: formData.role, email: formData.email, avatar: formData.name.charAt(0).toUpperCase() } 
      : u
    ));
    setShowEditModal(false);
    setEditingUserId(null);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsersList(usersList.filter(u => u.id !== selectedUser.id));
      setSelectedUser(null);
    }
  };

  const handleChangeRole = () => {
    if (selectedUser) {
      setUsersList(usersList.map(u => 
        u.id === selectedUser.id 
        ? { ...u, role: u.role === 'Viewer' ? 'Editor' : 'Viewer', access: u.access === 'Viewer' ? 'Editor' : 'Viewer' } 
        : u
      ));
      setSelectedUser(null);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-[#0f1115]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Users</h1>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-football-blue text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-sm text-sm"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      <div className="bg-[#161920] rounded-2xl border border-slate-800 shadow-lg overflow-hidden min-h-[400px]">
        {usersList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <User size={48} className="mb-4 opacity-50" />
            <p>Foydalanuvchilar yo'q</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#0f1115] text-xs text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold border-b border-slate-800">User</th>
                <th className="px-6 py-4 font-semibold border-b border-slate-800">Role</th>
                <th className="px-6 py-4 font-semibold border-b border-slate-800">Status</th>
                <th className="px-6 py-4 font-semibold border-b border-slate-800">Access Level</th>
                <th className="px-6 py-4 font-semibold border-b border-slate-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {usersList.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-football-blue/20 text-football-blue flex items-center justify-center font-bold">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{user.name}</div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <User size={16} className="text-slate-500" />
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${user.status === 'Online' ? 'bg-football-green animate-pulse' : 'bg-slate-500'}`}></span>
                      <div>
                        <div className={`font-semibold ${user.status === 'Online' ? 'text-football-green' : 'text-slate-400'}`}>
                          {user.status}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Clock size={10} /> {user.lastActive}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Shield size={14} className={user.access === 'Admin' ? 'text-[#FFE600]' : 'text-slate-500'} />
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        user.access === 'Admin' ? 'bg-[#FFE600]/10 text-[#FFE600] border border-[#FFE600]/20' : 
                        'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {user.access}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="p-2 hover:bg-slate-700 rounded-lg text-slate-500 transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* User Options Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center">
          <div className="bg-[#161920] rounded-2xl p-6 w-[350px] shadow-2xl animate-fade-in border border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-football-blue/20 text-football-blue flex items-center justify-center font-bold text-lg">
                  {selectedUser.avatar}
                </div>
                <div>
                  <h2 className="font-bold text-white leading-tight truncate w-40">{selectedUser.name}</h2>
                  <p className="text-xs text-slate-400">{selectedUser.role}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-2">
              <button onClick={handleOpenEdit} className="w-full text-left px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors text-sm font-semibold border border-slate-800 flex items-center justify-between group">
                Tahrirlash (Edit)
              </button>
              <button onClick={handleChangeRole} className="w-full text-left px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors text-sm font-semibold border border-slate-800">
                Rolni o'zgartirish (Toggle)
              </button>
              <button onClick={() => setSelectedUser(null)} className="w-full text-left px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors text-sm font-semibold border border-slate-800">
                Parolni tiklash
              </button>
              <button onClick={handleDeleteUser} className="w-full text-left px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors text-sm font-semibold border border-red-500/20 mt-2">
                Foydalanuvchini o'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit User Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center">
          <div className="bg-[#161920] rounded-2xl p-6 w-[400px] shadow-2xl animate-fade-in border border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {showEditModal ? 'Foydalanuvchini tahrirlash' : 'Yangi foydalanuvchi'}
              </h2>
              <button 
                onClick={() => { setShowAddModal(false); setShowEditModal(false); }} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">To'liq ism (Full Name)</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ism Familiya" 
                  className="w-full border border-slate-700 rounded-lg px-3 py-2 bg-slate-900 text-white outline-none focus:border-[#FFE600]" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Rol (Role)</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border border-slate-700 rounded-lg px-3 py-2 bg-slate-900 text-white outline-none focus:border-[#FFE600]"
                >
                  <option>Head Analyst</option>
                  <option>Data Scientist</option>
                  <option>Scout</option>
                  <option>Assistant Coach</option>
                  <option>Viewer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Elektron pochta (Email)</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@fc.uz" 
                  className="w-full border border-slate-700 rounded-lg px-3 py-2 bg-slate-900 text-white outline-none focus:border-[#FFE600]" 
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => { setShowAddModal(false); setShowEditModal(false); }} 
                className="flex-1 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition-colors"
              >
                Bekor qilish
              </button>
              <button 
                onClick={showEditModal ? handleEditSubmit : handleAddSubmit} 
                className="flex-1 py-2 bg-[#FFE600] text-black rounded-lg font-bold hover:bg-yellow-500 transition-colors"
              >
                {showEditModal ? 'Saqlash' : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
