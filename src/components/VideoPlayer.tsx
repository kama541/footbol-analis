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
    <div ref={containerRef} className="w-full h-full flex flex-col rounded-3xl overflow-hidden bg-slate-900 relative group shadow-2xl shadow-slate-900/50 border border-slate-800">
      
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
        <div className="flex-1 relative bg-gradient-to-b from-green-800 to-green-950 overflow-hidden flex items-center justify-center cursor-pointer" onClick={togglePlay}>
          {/* Subtle noise texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen-2.png')] opacity-30 mix-blend-overlay"></div>
          
          {/* Fake Pitch Lines */}
          <div className="absolute inset-x-12 inset-y-16 border-[3px] border-white/20 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-[3px] border-white/20 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] h-full bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]"></div>
          <div className="absolute left-12 top-1/2 -translate-y-1/2 w-24 h-48 border-[3px] border-l-0 border-white/20 rounded-r-lg"></div>
          <div className="absolute right-12 top-1/2 -translate-y-1/2 w-24 h-48 border-[3px] border-r-0 border-white/20 rounded-l-lg"></div>
          
          {/* Fake Players animated by time */}
          <div className="absolute w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] border-2 border-white/80 transition-all duration-1000 ease-in-out" style={{ top: `${30 + (currentTime % 20)}%`, left: `${40 + (currentTime % 15)}%` }}></div>
          <div className="absolute w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] border-2 border-white/80 transition-all duration-1000 ease-in-out" style={{ top: `${60 - (currentTime % 25)}%`, left: `${35 + (currentTime % 10)}%` }}></div>
          <div className="absolute top-[50%] left-[50%] w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)]"></div> {/* Ball */}

          {/* Live Overlay */}
          <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-lg text-white text-xs font-black tracking-widest flex items-center gap-2 border border-white/10 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-football-red shadow-[0_0_8px_rgba(239,68,68,1)] animate-pulse"></span>
            LIVE
          </div>

          <label className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-2 border border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            <Upload size={16} />
            Upload Video
            <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={handleVideoUpload} />
          </label>
        </div>
      )}

      {/* Controls Container */}
      <div className="absolute bottom-6 inset-x-6 bg-black/50 backdrop-blur-xl border border-white/10 p-5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-2xl">
        {/* Timeline */}
        <div className="h-2 bg-white/20 rounded-full mb-5 cursor-pointer relative group/timeline" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            setCurrentTime(Math.floor(pct * duration));
        }}>
          {/* Hover highlight */}
          <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover/timeline:opacity-100 transition-opacity"></div>
          
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-football-blue to-football-purple rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
            style={{ width: `${progressPercent}%` }}
          ></div>
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-0 group-hover/timeline:opacity-100 transition-all scale-75 group-hover/timeline:scale-100"
            style={{ left: `calc(${progressPercent}% - 8px)` }}
          ></div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-6">
            <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 hover:text-football-blue hover:scale-110 transition-all">
              {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentTime(Math.max(0, currentTime - 10))} className="text-white/70 hover:text-white hover:scale-110 transition-all"><Rewind size={20} /></button>
              <button onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))} className="text-white/70 hover:text-white hover:scale-110 transition-all"><FastForward size={20} /></button>
            </div>
            <div className="text-sm font-bold tracking-wider font-mono bg-white/10 px-3 py-1 rounded-md">
              {Math.floor(currentTime / 60).toString().padStart(2, '0')}:{(currentTime % 60).toString().padStart(2, '0')} 
            </div>
          </div>

          <div className="flex items-center gap-5 text-white/70">
            <button className="hover:text-white hover:scale-110 transition-all"><Volume2 size={20} /></button>
            <button onClick={toggleFullscreen} className="hover:text-white hover:scale-110 transition-all"><Maximize size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
