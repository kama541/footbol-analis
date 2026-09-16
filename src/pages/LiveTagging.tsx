import React, { useState, useRef } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import TaggingPanel from '../components/TaggingPanel';
import TacticalPitch from '../components/TacticalPitch';
import { useTranslation } from 'react-i18next';
import { Maximize2, Columns } from 'lucide-react';

const LiveTagging = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'video' | 'pitch' | 'split'>('video');
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const renderWorkspace = () => {
    if (viewMode === 'video') return <VideoPlayer />;
    if (viewMode === 'pitch') return <TacticalPitch />;
    if (viewMode === 'split') {
      return (
        <div className="flex-1 flex flex-row">
          <div className="flex-1 border-r border-slate-800"><VideoPlayer /></div>
          <div className="flex-1 flex"><TacticalPitch /></div>
        </div>
      );
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0f1115] text-slate-200 overflow-hidden font-sans text-sm" ref={containerRef}>
      
      {/* Main 3-column area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden border-b border-slate-800">
        
        {/* LEFT TOOLBAR (Tagging Panel) */}
        <div className="w-full md:w-56 border-r border-slate-800 bg-[#161920] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          <TaggingPanel />
        </div>

        {/* CENTER MAIN AREA (Video/Pitch) */}
        <div className="flex-1 flex flex-col bg-black overflow-hidden relative shadow-2xl z-10">
          
          {/* Match Info Bar */}
          <div className="h-14 bg-[#161920] border-b border-slate-800 flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Uzb Super League</span>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-300">FC</span>
                <span className="bg-slate-800 text-white font-mono px-2 py-0.5 rounded text-sm">2</span>
                <span className="text-slate-600">-</span>
                <span className="bg-slate-800 text-white font-mono px-2 py-0.5 rounded text-sm">1</span>
                <span className="font-black text-slate-300">NV</span>
              </div>
              <span className="text-football-red text-[10px] font-bold flex items-center gap-1.5 ml-2">
                <span className="w-1.5 h-1.5 bg-football-red rounded-full animate-pulse"></span>
                67:32
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-900 rounded p-1 border border-slate-800">
                <button 
                  onClick={() => setViewMode('video')}
                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${viewMode === 'video' ? 'bg-football-blue text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  Video
                </button>
                <button 
                  onClick={() => setViewMode('pitch')}
                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${viewMode === 'pitch' ? 'bg-[#234d31] text-[#FFE600] shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  Pitch
                </button>
                <button 
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors flex items-center gap-1 ${viewMode === 'split' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  <Columns size={12}/> Split
                </button>
              </div>
              <div className="w-px h-6 bg-slate-700 mx-2"></div>
              <button className="text-slate-400 hover:text-white transition-colors p-1" title="Toggle Fullscreen" onClick={toggleFullscreen}>
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          {/* Central Workspace */}
          <div className="flex-1 relative overflow-hidden flex flex-col bg-black">
            {renderWorkspace()}
          </div>
        </div>

        {/* RIGHT SIDEBAR (Analysis & Filters) */}
        <div className="w-full md:w-80 border-l border-slate-800 bg-[#161920] flex flex-col shrink-0 overflow-y-auto custom-scrollbar shadow-xl z-20">
          
          <div className="p-4 border-b border-slate-800">
            <h3 className="font-bold text-slate-300 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
              <LayoutDashboard size={14} /> Analytics & Filters
            </h3>
            
            {/* Quick Filters */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <select className="bg-slate-900 border border-slate-700 text-xs rounded p-2 text-slate-300 outline-none">
                <option>All Teams</option>
                <option>Football Club</option>
                <option>Navbahor</option>
              </select>
              <select className="bg-slate-900 border border-slate-700 text-xs rounded p-2 text-slate-300 outline-none">
                <option>All Events</option>
                <option>Goals</option>
                <option>Shots</option>
              </select>
            </div>
            
            <MatchStats />
          </div>

          <div className="p-4 border-b border-slate-800 flex-1 min-h-[300px] overflow-hidden flex flex-col">
            <h3 className="font-bold text-slate-300 text-xs uppercase tracking-wider mb-3">Event Log</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2">
              <RecentEvents />
            </div>
          </div>
          
          <div className="p-4 bg-slate-900/50 shrink-0">
             <PlayerTracking />
          </div>
        </div>

      </div>
    </div>
  );
};

export default LiveTagging;
