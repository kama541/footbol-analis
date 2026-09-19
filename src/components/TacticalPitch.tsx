import React, { useState, useRef } from 'react';
import { Circle } from 'lucide-react';

interface PlayerMarker {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  team: 'home' | 'away' | 'ball';
  number?: string;
}

const initialMarkers: PlayerMarker[] = [
  // Home Team (e.g. 4-3-3)
  { id: 'h1', team: 'home', x: 10, y: 50, number: '1' },
  { id: 'h2', team: 'home', x: 25, y: 20, number: '2' },
  { id: 'h3', team: 'home', x: 20, y: 40, number: '4' },
  { id: 'h4', team: 'home', x: 20, y: 60, number: '5' },
  { id: 'h5', team: 'home', x: 25, y: 80, number: '3' },
  { id: 'h6', team: 'home', x: 40, y: 50, number: '6' },
  { id: 'h7', team: 'home', x: 45, y: 30, number: '8' },
  { id: 'h8', team: 'home', x: 45, y: 70, number: '10' },
  { id: 'h9', team: 'home', x: 60, y: 20, number: '7' },
  { id: 'h10', team: 'home', x: 65, y: 50, number: '9' },
  { id: 'h11', team: 'home', x: 60, y: 80, number: '11' },

  // Away Team (e.g. 4-4-2)
  { id: 'a1', team: 'away', x: 90, y: 50, number: '1' },
  { id: 'a2', team: 'away', x: 75, y: 20, number: '2' },
  { id: 'a3', team: 'away', x: 80, y: 40, number: '4' },
  { id: 'a4', team: 'away', x: 80, y: 60, number: '5' },
  { id: 'a5', team: 'away', x: 75, y: 80, number: '3' },
  { id: 'a6', team: 'away', x: 60, y: 15, number: '7' },
  { id: 'a7', team: 'away', x: 55, y: 40, number: '8' },
  { id: 'a8', team: 'away', x: 55, y: 60, number: '6' },
  { id: 'a9', team: 'away', x: 60, y: 85, number: '11' },
  { id: 'a10', team: 'away', x: 45, y: 40, number: '9' },
  { id: 'a11', team: 'away', x: 45, y: 60, number: '10' },

  // Ball
  { id: 'ball', team: 'ball', x: 50, y: 50 }
];

const TacticalPitch = () => {
  const [markers, setMarkers] = useState<PlayerMarker[]>(initialMarkers);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [links, setLinks] = useState<[string, string][]>([]);
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [drawingStart, setDrawingStart] = useState<string | null>(null);
  const pitchRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    if (isDrawMode) {
      if (!drawingStart) {
        setDrawingStart(id);
      } else {
        if (drawingStart !== id) {
          // Check if link already exists
          const exists = links.some(l => (l[0] === drawingStart && l[1] === id) || (l[0] === id && l[1] === drawingStart));
          if (!exists) {
            setLinks(prev => [...prev, [drawingStart, id]]);
          }
          setDrawingStart(id); // Chain
        } else {
          setDrawingStart(null); // Finish chain
        }
      }
    } else {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDraggingId(id);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId || !pitchRef.current || isDrawMode) return;
    
    const rect = pitchRef.current.getBoundingClientRect();
    
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));

    setMarkers(prev => prev.map(m => m.id === draggingId ? { ...m, x, y } : m));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingId) {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      setDraggingId(null);
    }
  };

  const handlePitchClick = () => {
    if (isDrawMode && drawingStart) {
      setDrawingStart(null); // cancel drawing chain if click on empty pitch
    }
  };

  return (
    <div 
      className="flex-1 bg-[#161920] flex flex-col relative border-[4px] md:border-[10px] border-slate-900 w-full h-full overflow-hidden select-none"
      ref={pitchRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={handlePitchClick}
    >
      {/* Background Grass Pattern */}
      <div className="absolute inset-0 opacity-20" 
           style={{
             backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.2) 20%)'
           }}
      ></div>

      {/* Pitch Markings (White Lines) */}
      <div className="absolute inset-4 md:inset-8 border-2 border-white/60 pointer-events-none z-0"></div>
      
      {/* Center Line */}
      <div className="absolute top-4 md:top-8 bottom-4 md:bottom-8 left-1/2 w-[2px] bg-white/60 -translate-x-1/2 pointer-events-none z-0"></div>
      
      {/* Center Circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-40 md:h-40 border-2 border-white/60 rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/60 rounded-full pointer-events-none z-0"></div>
      
      {/* Left Penalty Area */}
      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-[16%] h-[44%] border-2 border-l-0 border-white/60 pointer-events-none z-0"></div>
      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-[5%] h-[20%] border-2 border-l-0 border-white/60 pointer-events-none z-0"></div>
      <div className="absolute left-[16%] md:left-[calc(16%+2rem)] top-1/2 -translate-y-1/2 w-[8%] h-[20%] border-2 border-l-0 border-white/60 rounded-r-full pointer-events-none z-0" style={{ clipPath: 'inset(0 0 0 50%)' }}></div>

      {/* Right Penalty Area */}
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-[16%] h-[44%] border-2 border-r-0 border-white/60 pointer-events-none z-0"></div>
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-[5%] h-[20%] border-2 border-r-0 border-white/60 pointer-events-none z-0"></div>
      <div className="absolute right-[16%] md:right-[calc(16%+2rem)] top-1/2 -translate-y-1/2 w-[8%] h-[20%] border-2 border-r-0 border-white/60 rounded-l-full pointer-events-none z-0" style={{ clipPath: 'inset(0 50% 0 0)' }}></div>

      {/* Toolbar */}
      <div className="absolute top-2 left-2 z-20 flex gap-2">
        <button 
          onClick={() => {
            setIsDrawMode(!isDrawMode);
            setDrawingStart(null);
          }}
          className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest backdrop-blur-sm border transition-colors ${isDrawMode ? 'bg-[#FFE600] text-black border-[#FFE600]' : 'bg-black/60 text-white/80 border-white/10 hover:bg-black hover:text-white'}`}
        >
          {isDrawMode ? 'Drawing...' : 'Draw Lines'}
        </button>
        {links.length > 0 && (
          <button 
            onClick={() => {
              setLinks([]);
              setDrawingStart(null);
            }}
            className="bg-red-500/80 text-white hover:bg-red-500 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest backdrop-blur-sm border border-red-500/50 transition-colors"
          >
            Clear Lines
          </button>
        )}
        <button 
          onClick={() => {
            setMarkers(initialMarkers);
            setLinks([]);
            setDrawingStart(null);
            setIsDrawMode(false);
          }}
          className="bg-black/60 text-white/80 hover:text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest backdrop-blur-sm border border-white/10 hover:bg-black transition-colors"
        >
          Reset
        </button>
      </div>

      {/* SVG Lines Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {links.map((link, idx) => {
          const p1 = markers.find(m => m.id === link[0]);
          const p2 = markers.find(m => m.id === link[1]);
          if (!p1 || !p2) return null;
          return (
            <line 
              key={idx} 
              x1={`${p1.x}%`} 
              y1={`${p1.y}%`} 
              x2={`${p2.x}%`} 
              y2={`${p2.y}%`} 
              stroke="white" 
              strokeWidth="3" 
              strokeOpacity="0.8"
            />
          );
        })}
      </svg>

      {/* Interactive Markers */}
      {markers.map(marker => (
        <div 
          key={marker.id}
          onPointerDown={(e) => handlePointerDown(e, marker.id)}
          className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform ${isDrawMode ? 'cursor-crosshair hover:scale-125' : 'cursor-grab active:cursor-grabbing hover:scale-110'} ${draggingId === marker.id ? 'z-50 scale-125' : 'z-30'} ${drawingStart === marker.id ? 'ring-4 ring-[#FFE600] rounded-full' : ''}`}
          style={{ 
            left: `${marker.x}%`, 
            top: `${marker.y}%`,
            width: marker.team === 'ball' ? '18px' : '26px',
            height: marker.team === 'ball' ? '18px' : '26px',
            touchAction: 'none'
          }}
        >
          {marker.team === 'home' && (
            <div className="w-full h-full bg-[#FFE600] rounded-full border-2 border-[#161920] flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
              <span className="text-black text-[10px] font-black">{marker.number}</span>
            </div>
          )}
          {marker.team === 'away' && (
            <div className="w-full h-full bg-slate-700 rounded-full border-2 border-white flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
              <span className="text-white text-[10px] font-black">{marker.number}</span>
            </div>
          )}
          {marker.team === 'ball' && (
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.5)] border border-slate-300">
              <Circle size={10} className="text-black" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TacticalPitch;
