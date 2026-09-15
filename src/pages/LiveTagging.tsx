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
      <div className="flex flex-col lg:flex-row gap-4 shrink-0 lg:h-[65vh] min-h-min lg:min-h-[500px]">
        {/* Video Player */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-colors h-[350px] sm:h-[450px] lg:h-auto">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
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
        <div className="w-full lg:w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden shrink-0 transition-colors h-[600px] lg:h-auto">
          <TaggingPanel />
        </div>
      </div>

      {/* Middle Section: Timeline */}
      <div className="h-24 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 shrink-0 transition-colors overflow-hidden">
        <GameTimeline />
      </div>

      {/* Bottom Section: Events, Stats, Tracking */}
      <div className="flex flex-col xl:flex-row gap-4 shrink-0 xl:flex-1 xl:min-h-0">
        <div className="w-full xl:flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors h-[400px] xl:h-auto">
          <RecentEvents />
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto shrink-0">
          <div className="w-full md:w-1/2 xl:w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors h-[400px] xl:h-auto">
            <MatchStats />
          </div>
          <div className="w-full md:w-1/2 xl:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors h-[400px] xl:h-auto">
            <PlayerTracking />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTagging;
