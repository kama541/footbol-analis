import React from 'react';
import VideoPlayer from '../components/VideoPlayer';
import TaggingPanel from '../components/TaggingPanel';
import GameTimeline from '../components/GameTimeline';
import RecentEvents from '../components/RecentEvents';
import MatchStats from '../components/MatchStats';
import PlayerTracking from '../components/PlayerTracking';

const LiveTagging = () => {
  return (
    <div className="h-full flex flex-col p-4 gap-4 overflow-hidden">
      {/* Top Section: Video & Tagging */}
      <div className="flex gap-4 min-h-0 shrink-0" style={{ height: '55%' }}>
        {/* Video Player */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="font-semibold text-football-navy flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-football-red animate-pulse"></span>
              Live Match Feed
            </h2>
          </div>
          <div className="flex-1 p-3">
            <VideoPlayer />
          </div>
        </div>

        {/* Tagging Panel */}
        <div className="w-80 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden shrink-0">
          <TaggingPanel />
        </div>
      </div>

      {/* Middle Section: Timeline */}
      <div className="h-24 bg-white rounded-2xl shadow-sm border border-slate-200 shrink-0">
        <GameTimeline />
      </div>

      {/* Bottom Section: Events, Stats, Tracking */}
      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <RecentEvents />
        </div>
        <div className="w-72 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <MatchStats />
        </div>
        <div className="w-96 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <PlayerTracking />
        </div>
      </div>
    </div>
  );
};

export default LiveTagging;
