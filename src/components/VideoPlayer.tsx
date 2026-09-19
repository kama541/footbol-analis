import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, FastForward, Rewind, Maximize, Volume2, VolumeX, Upload, Settings, Keyboard, MonitorPlay, StepForward, StepBack, SkipBack, SkipForward } from 'lucide-react';
import { useMatch, EventCategory } from '../context/MatchContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

const VideoPlayer = () => {
  const { isPlaying, togglePlay, currentTime, setCurrentTime, events } = useMatch();
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hook for keyboard shortcuts
  useKeyboardShortcuts(videoRef, isPlaying, togglePlay, currentTime, setCurrentTime);

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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Sync time if difference is large
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

  const togglePiP = async () => {
    try {
      if (videoRef.current && document.pictureInPictureElement !== videoRef.current) {
        await videoRef.current.requestPictureInPicture();
      } else if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      }
    } catch (error) {
      console.error('PiP failed', error);
    }
  };

  const stepFrame = (forward: boolean) => {
    if (videoRef.current) {
      if (isPlaying) togglePlay();
      videoRef.current.currentTime += forward ? 0.033 : -0.033;
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const jumpToNearestEvent = (forward: boolean) => {
    if (events.length === 0) return;
    const sorted = [...events].sort((a, b) => a.time - b.time);
    let targetEvent;
    if (forward) {
      targetEvent = sorted.find(e => e.time > currentTime + 1);
      if (!targetEvent) targetEvent = sorted[0];
    } else {
      targetEvent = [...sorted].reverse().find(e => e.time < currentTime - 1);
      if (!targetEvent) targetEvent = sorted[sorted.length - 1];
    }
    setCurrentTime(targetEvent.time);
  };

  const duration = videoRef.current?.duration || 5400; 
  const progressPercent = (currentTime / duration) * 100;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getMarkerColor = (category: EventCategory) => {
    switch (category) {
      case 'attacking': return 'bg-[#FFE600] border-[#332e00]';
      case 'defensive': return 'bg-white border-slate-400';
      case 'positive': return 'bg-slate-300 border-slate-500';
      case 'other': return 'bg-slate-500 border-slate-700';
      default: return 'bg-slate-400 border-slate-400';
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col bg-[#0f1115] relative group">
      
      {/* Live AI Tracking Overlay (Only when playing video) */}
      {videoSrc && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {/* Top Left Camera Info */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white font-mono text-[10px] px-2 py-1 rounded shadow-sm border border-white/10">
            <div>CAM X: {(Math.sin(currentTime / 5) * 0.05).toFixed(2)}</div>
            <div>CAM Y: {(Math.cos(currentTime / 5) * 0.02).toFixed(2)}</div>
          </div>
          
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <defs>
              <marker id="arrowhead-red" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                <polygon points="0 0, 4 2, 0 4" fill="#ef4444" />
              </marker>
            </defs>
            <ellipse cx="65" cy="55" rx="3" ry="1" fill="none" stroke="#4ade80" strokeWidth="0.4" />
            <text x="65" y="51" fill="white" fontSize="1.8" textAnchor="middle" className="drop-shadow-md font-black">7</text>
            <line x1="60" y1="55" x2="50" y2="55" stroke="#ef4444" strokeWidth="0.5" markerEnd="url(#arrowhead-red)" />
          </svg>
        </div>
      )}

      {/* Video Content or Empty State */}
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden" onClick={togglePlay}>
        {videoSrc ? (
          <video 
            ref={videoRef}
            src={videoSrc}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="absolute inset-0 bg-[#1a2e1f] flex flex-col items-center justify-center cursor-pointer relative border-[10px] border-[#0f1115]">
            <div className="absolute inset-0 border-2 border-white/20 m-4 rounded"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/20 rounded-full"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20"></div>
            
            <div className="z-10 bg-black/60 backdrop-blur-md p-6 rounded-xl border border-white/10 text-center shadow-2xl">
              <Upload size={32} className="mx-auto mb-4 text-[#FFE600]" />
              <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wide">Upload Match Video</h3>
              <p className="text-xs text-slate-400 font-medium mb-6">Supported formats: MP4, WebM, MOV</p>
              <label className="bg-[#FFE600] hover:bg-yellow-500 text-black px-6 py-2.5 rounded text-sm font-bold cursor-pointer transition-colors inline-block">
                Select Video
                <input type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={handleVideoUpload} />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Custom Professional Player Controls */}
      <div className="bg-[#161920] border-t border-slate-800 p-3 flex flex-col gap-2 shrink-0 z-20">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between text-slate-300">
          
          <div className="flex items-center gap-2">
            <button onClick={togglePlay} className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors">
              {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current" />}
            </button>
            <button onClick={() => jumpToNearestEvent(false)} className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors" title="Previous Event">
              <SkipBack size={16} />
            </button>
            <button onClick={() => jumpToNearestEvent(true)} className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors" title="Next Event">
              <SkipForward size={16} />
            </button>
            
            <div className="w-px h-4 bg-slate-700 mx-2"></div>
            
            <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            
            <div className="font-mono text-[11px] font-bold ml-2">
              <span className="text-white">{formatTime(currentTime)}</span>
              <span className="text-slate-500 mx-1">/</span>
              <span className="text-slate-500">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Frame Controls */}
            <div className="flex items-center bg-black rounded border border-slate-800 overflow-hidden mr-2">
              <button onClick={() => stepFrame(false)} className="p-1.5 hover:bg-slate-800 hover:text-white transition-colors border-r border-slate-800" title="Previous Frame (Left Arrow)">
                <StepBack size={14} />
              </button>
              <div className="px-2 text-[9px] font-mono font-bold text-slate-400">FRAME</div>
              <button onClick={() => stepFrame(true)} className="p-1.5 hover:bg-slate-800 hover:text-white transition-colors border-l border-slate-800" title="Next Frame (Right Arrow)">
                <StepForward size={14} />
              </button>
            </div>

            {/* Speed Control */}
            <select 
              value={playbackRate}
              onChange={(e) => setPlaybackRate(Number(e.target.value))}
              className="bg-black border border-slate-800 text-[10px] font-bold text-white rounded p-1 outline-none mr-2"
            >
              <option value={0.25}>0.25x</option>
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>

            <button onClick={() => setShowShortcuts(!showShortcuts)} className={`p-1.5 rounded transition-colors ${showShortcuts ? 'bg-[#FFE600] text-black' : 'hover:text-white hover:bg-slate-800'}`} title="Keyboard Shortcuts">
              <Keyboard size={16} />
            </button>
            <button onClick={togglePiP} className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors" title="Picture in Picture">
              <MonitorPlay size={16} />
            </button>
            <div className="relative">
              <button onClick={() => setShowSettings(!showSettings)} className={`p-1.5 rounded transition-colors ${showSettings ? 'bg-[#FFE600] text-black' : 'hover:text-white hover:bg-slate-800'}`} title="Settings">
                <Settings size={16} />
              </button>
              
              {/* Settings Dropdown */}
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-black/95 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl z-50 text-xs text-slate-300 py-2">
                  <div className="px-3 py-1 font-bold text-white border-b border-slate-800 mb-1">Video Settings</div>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-800 transition-colors flex justify-between items-center">
                    Quality <span className="text-[#FFE600] font-bold">1080p</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-800 transition-colors flex justify-between items-center">
                    Aspect Ratio <span className="text-slate-500">Auto</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-800 transition-colors flex justify-between items-center">
                    Show Grid <span className="text-slate-500">Off</span>
                  </button>
                </div>
              )}
            </div>
            <button onClick={toggleFullscreen} className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors" title="Fullscreen">
              <Maximize size={16} />
            </button>
          </div>
        </div>

        {/* Timeline Bar */}
        <div className="relative h-6 mt-1 mb-1 group/timeline" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            setCurrentTime(Math.floor(pct * duration));
        }}>
          {/* Base Track */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-slate-800 rounded-full cursor-pointer overflow-hidden border border-slate-700/50">
            <div 
              className="absolute top-0 left-0 h-full bg-slate-500/50 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          
          {/* Current Time Indicator */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow cursor-pointer z-10 pointer-events-none"
            style={{ left: `calc(${progressPercent}% - 5px)` }}
          ></div>

          {/* Event Markers on Timeline */}
          {events.map((event) => {
            const positionPercent = (event.time / duration) * 100;
            return (
              <div 
                key={event.id}
                className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 border cursor-pointer hover:scale-150 transition-transform group/event shadow-sm z-20 ${getMarkerColor(event.category)}`}
                style={{ 
                  left: `calc(${positionPercent}% - 4px)`, 
                  borderRadius: event.category === 'attacking' ? '50%' : event.category === 'defensive' ? '2px' : '0px',
                  transform: event.category === 'other' ? 'translateY(-50%) rotate(45deg)' : 'translateY(-50%)'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentTime(event.time);
                }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-[200%] left-1/2 -translate-x-1/2 mb-1 bg-black border border-slate-700 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/event:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-30 shadow-lg">
                  <span className="font-bold">{event.type}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Shortcuts Help Overlay */}
      {showShortcuts && (
        <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl z-50 text-xs w-64 text-slate-300">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <h4 className="font-bold text-white flex items-center gap-2"><Keyboard size={14}/> Shortcuts</h4>
            <button onClick={() => setShowShortcuts(false)} className="text-slate-500 hover:text-white">✕</button>
          </div>
          <div className="space-y-2 font-mono">
            <div className="flex justify-between"><span>Play/Pause</span><span className="text-white bg-slate-800 px-1 rounded">Space</span></div>
            <div className="flex justify-between"><span>Rewind 10s</span><span className="text-white bg-slate-800 px-1 rounded">J</span></div>
            <div className="flex justify-between"><span>Forward 10s</span><span className="text-white bg-slate-800 px-1 rounded">L</span></div>
            <div className="flex justify-between"><span>Prev Frame</span><span className="text-white bg-slate-800 px-1 rounded">←</span></div>
            <div className="flex justify-between"><span>Next Frame</span><span className="text-white bg-slate-800 px-1 rounded">→</span></div>
            <div className="border-t border-slate-800 my-2 pt-2 text-[10px] text-slate-500 font-sans">TAGGING</div>
            <div className="flex justify-between"><span>Goal</span><span className="text-white bg-slate-800 px-1 rounded">1</span></div>
            <div className="flex justify-between"><span>Shot</span><span className="text-white bg-slate-800 px-1 rounded">2</span></div>
            <div className="flex justify-between"><span>Key Play</span><span className="text-white bg-slate-800 px-1 rounded">3</span></div>
            <div className="flex justify-between"><span>Cross</span><span className="text-white bg-slate-800 px-1 rounded">4</span></div>
            <div className="flex justify-between"><span>Tackle</span><span className="text-white bg-slate-800 px-1 rounded">5</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
