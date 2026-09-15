import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, FastForward, Rewind, Maximize, Volume2, Upload } from 'lucide-react';
import { useMatch } from '../context/MatchContext';

const VideoPlayer = () => {
  const { isPlaying, togglePlay, currentTime, setCurrentTime } = useMatch();
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state -> video element
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync time if difference is large (to handle dragging timeline)
  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 1.5) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && isPlaying) {
      setCurrentTime(Math.floor(videoRef.current.currentTime));
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // 90 mins max logic for UI if no video duration is known, otherwise use real duration
  const duration = videoRef.current?.duration || 5400; 
  const progressPercent = (currentTime / duration) * 100;

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col rounded-xl overflow-hidden bg-slate-900 relative group">
      
      {videoSrc ? (
        <video 
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onClick={togglePlay}
        />
      ) : (
        /* Video Content Placeholder */
        <div className="flex-1 relative bg-gradient-to-b from-green-800 to-green-900 overflow-hidden flex items-center justify-center cursor-pointer" onClick={togglePlay}>
          {/* Fake Pitch Lines */}
          <div className="absolute inset-x-8 inset-y-12 border-2 border-white/30 rounded-lg"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/30 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-full bg-white/30"></div>
          <div className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-40 border-2 border-l-0 border-white/30"></div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-40 border-2 border-r-0 border-white/30"></div>
          
          {/* Fake Players animated by time */}
          <div className="absolute w-3 h-3 bg-red-500 rounded-full shadow border border-white transition-all duration-1000" style={{ top: `${30 + (currentTime % 20)}%`, left: `${40 + (currentTime % 15)}%` }}></div>
          <div className="absolute w-3 h-3 bg-blue-500 rounded-full shadow border border-white transition-all duration-1000" style={{ top: `${60 - (currentTime % 25)}%`, left: `${35 + (currentTime % 10)}%` }}></div>
          <div className="absolute top-[50%] left-[50%] w-2 h-2 bg-white rounded-full shadow-lg"></div> {/* Ball */}

          {/* Live Overlay */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur rounded text-white text-xs font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            LIVE
          </div>

          <label className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur text-white px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition-colors flex items-center gap-2 border border-white/30">
            <Upload size={14} />
            Upload Video
            <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={handleVideoUpload} />
          </label>
        </div>
      )}

      {/* Controls Container */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Timeline */}
        <div className="h-1.5 bg-white/30 rounded-full mb-4 cursor-pointer relative" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            setCurrentTime(Math.floor(pct * duration));
        }}>
          <div 
            className="absolute top-0 left-0 h-full bg-football-purple rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm"
            style={{ left: `calc(${progressPercent}% - 6px)` }}
          ></div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="hover:text-football-blue transition-colors">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button onClick={() => setCurrentTime(Math.max(0, currentTime - 10))} className="hover:text-football-blue transition-colors"><Rewind size={20} /></button>
            <button onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))} className="hover:text-football-blue transition-colors"><FastForward size={20} /></button>
            <div className="text-sm font-medium ml-2 font-mono">
              {Math.floor(currentTime / 60).toString().padStart(2, '0')}:{(currentTime % 60).toString().padStart(2, '0')} 
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="hover:text-football-blue transition-colors"><Volume2 size={20} /></button>
            <button onClick={toggleFullscreen} className="hover:text-football-blue transition-colors"><Maximize size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
