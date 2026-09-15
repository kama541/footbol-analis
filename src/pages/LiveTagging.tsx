import React from 'react';
import VideoPlayer from '../components/VideoPlayer';
import TaggingPanel from '../components/TaggingPanel';
import GameTimeline from '../components/GameTimeline';
import RecentEvents from '../components/RecentEvents';
import MatchStats from '../components/MatchStats';
import PlayerTracking from '../components/PlayerTracking';
import { useTranslation } from 'react-i18next';

const LiveTagging = () => {
  const { t } = useTranslation();

  return (
    <div className="h-full flex flex-col p-4 gap-4 overflow-y-auto">
      {/* Top Section: Video & Tagging */}
      <div className="flex gap-4 shrink-0 min-h-[500px]" style={{ height: '65%' }}>
        {/* Video Player */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-colors">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="font-semibold text-football-navy dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-football-red animate-pulse"></span>
              {t('live_tagging.live_match_feed')}
            </h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <VideoPlayer />
          </div>
        </div>

        {/* Tagging Panel */}
        <div className="w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden shrink-0 transition-colors">
          <TaggingPanel />
        </div>
      </div>

      {/* Middle Section: Timeline */}
      <div className="h-24 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 shrink-0 transition-colors">
        <GameTimeline />
      </div>

      {/* Bottom Section: Events, Stats, Tracking */}
      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
          <RecentEvents />
        </div>
        <div className="w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
          <MatchStats />
        </div>
        <div className="w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
          <PlayerTracking />
        </div>
      </div>
    </div>
  );
};

export default LiveTagging;
