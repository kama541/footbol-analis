import React, { useState } from 'react';
import { MonitorSmartphone, Battery, Wifi, WifiOff, RefreshCw, X } from 'lucide-react';

const Devices = () => {
  const [showAddDevice, setShowAddDevice] = useState(false);

  const devices = [
    { name: 'Head Coach iPad', type: 'Tablet', status: 'Online', battery: 85, lastSync: 'Just now', location: 'Bench' },
    { name: 'Analyst MacBook Pro', type: 'Laptop', status: 'Online', battery: 100, lastSync: 'Just now', location: 'Stands (Tactical Cam)' },
    { name: 'Scout iPad Mini', type: 'Tablet', status: 'Offline', battery: 12, lastSync: '2 hours ago', location: 'Unknown' },
    { name: 'Locker Room TV', type: 'Display', status: 'Online', battery: null, lastSync: '10 mins ago', location: 'Locker Room' },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto bg-[#0f1115]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Devices</h1>
        <button 
          onClick={() => setShowAddDevice(true)}
          className="flex items-center gap-2 px-4 py-2 bg-football-blue text-white rounded-lg font-semibold hover:bg-football-blue/90 transition-colors shadow-sm text-sm"
        >
          <MonitorSmartphone size={18} />
          Register Device
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {devices.map((device, i) => (
          <div key={i} className="bg-[#161920] rounded-2xl p-6 border border-slate-800 shadow-sm hover:shadow-md hover:border-slate-600 transition-all group flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${device.status === 'Online' ? 'bg-football-blue/10 text-football-blue' : 'bg-slate-800 text-slate-400'}`}>
                  <MonitorSmartphone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">{device.name}</h3>
                  <span className="text-xs text-slate-400">{device.type} • {device.location}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {device.status === 'Online' ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-football-green bg-football-green/10 px-2 py-1 rounded">
                    <Wifi size={14} /> Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded">
                    <WifiOff size={14} /> Offline
                  </span>
                )}
              </div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Battery</div>
                <div className="flex items-center gap-2 font-semibold text-slate-300">
                  {device.battery !== null ? (
                    <>
                      <Battery size={16} className={device.battery < 20 ? 'text-red-500' : 'text-football-green'} />
                      {device.battery}%
                    </>
                  ) : (
                    <span className="text-slate-500">Plugged In</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Last Sync</div>
                <div className="flex items-center gap-2 font-semibold text-slate-300">
                  <RefreshCw size={14} className="text-football-blue" />
                  {device.lastSync}
                </div>
              </div>
            </div>
            
            {/* Action button inside card */}
            <button 
              onClick={() => alert(`Pinging ${device.name}...`)}
              className="mt-4 w-full py-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-400 transition-colors border border-slate-800 hover:border-slate-700"
            >
              Ping Device
            </button>
          </div>
        ))}
      </div>

      {/* Register Device Modal */}
      {showAddDevice && (
        <div className="fixed inset-0 bg-football-navy/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-[400px] shadow-2xl animate-fade-in border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-football-navy dark:text-white">Register Device</h2>
              <button onClick={() => setShowAddDevice(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Pairing Code</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5,6].map(i => (
                    <input key={i} type="text" maxLength={1} className="w-12 h-12 text-center text-xl font-bold border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-football-blue" />
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">Enter the 6-digit code shown on the device screen.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowAddDevice(false)} className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-lg font-bold hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowAddDevice(false)} className="flex-1 py-2 bg-football-blue text-white rounded-lg font-bold hover:bg-football-blue/90 transition-colors">
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Devices;
