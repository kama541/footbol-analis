import React, { useState } from 'react';
import { User, Shield, Clock, MoreVertical, Plus, X } from 'lucide-react';

const Users = () => {
  const [showAddUser, setShowAddUser] = useState(false);

  const users = [
    { name: 'Kamronbek', role: 'Head Analyst', status: 'Online', lastActive: 'Just now', access: 'Admin', avatar: 'K' },
    { name: 'Aziz Aliyev', role: 'Scout', status: 'Offline', lastActive: '2 hours ago', access: 'Editor', avatar: 'A' },
    { name: 'Bekzod Umarov', role: 'Assistant Coach', status: 'Offline', lastActive: '1 day ago', access: 'Viewer', avatar: 'B' },
    { name: 'Sardor Rashidov', role: 'Data Scientist', status: 'Online', lastActive: '5 mins ago', access: 'Admin', avatar: 'S' },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-football-navy dark:text-white tracking-tight">Users</h1>
        <button 
          onClick={() => setShowAddUser(true)}
          className="flex items-center gap-2 px-4 py-2 bg-football-blue text-white rounded-lg font-semibold hover:bg-football-blue/90 transition-colors shadow-sm text-sm"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold border-b border-slate-100 dark:border-slate-800">User</th>
              <th className="px-6 py-4 font-semibold border-b border-slate-100 dark:border-slate-800">Role</th>
              <th className="px-6 py-4 font-semibold border-b border-slate-100 dark:border-slate-800">Status</th>
              <th className="px-6 py-4 font-semibold border-b border-slate-100 dark:border-slate-800">Access Level</th>
              <th className="px-6 py-4 font-semibold border-b border-slate-100 dark:border-slate-800 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((user, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-football-blue/10 text-football-blue dark:bg-football-blue/20 flex items-center justify-center font-bold">
                      {user.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-football-navy dark:text-white">{user.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{user.name.toLowerCase().replace(' ', '.')}@fc.uz</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <User size={16} className="text-slate-400" />
                    {user.role}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${user.status === 'Online' ? 'bg-football-green animate-pulse' : 'bg-slate-300'}`}></span>
                    <div>
                      <div className={`font-semibold ${user.status === 'Online' ? 'text-football-green' : 'text-slate-500 dark:text-slate-400'}`}>
                        {user.status}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                        <Clock size={10} /> {user.lastActive}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <Shield size={14} className={user.access === 'Admin' ? 'text-football-purple' : 'text-slate-400'} />
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      user.access === 'Admin' ? 'bg-football-purple/10 text-football-purple border border-football-purple/20' : 
                      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}>
                      {user.access}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => alert(`Options for ${user.name}`)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-football-navy/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-[400px] shadow-2xl animate-fade-in border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-football-navy dark:text-white">Add New User</h2>
              <button onClick={() => setShowAddUser(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-football-blue" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Role</label>
                <select className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-football-blue">
                  <option>Analyst</option>
                  <option>Scout</option>
                  <option>Coach</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
                <input type="email" placeholder="email@fc.uz" className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-football-blue" />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowAddUser(false)} className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-lg font-bold hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowAddUser(false)} className="flex-1 py-2 bg-football-blue text-white rounded-lg font-bold hover:bg-football-blue/90 transition-colors">
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
