import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

export type EventCategory = 'attacking' | 'defensive' | 'other' | 'positive';

export interface MatchEvent {
  id: string;
  type: string;
  time: number; // in seconds
  player: string;
  team: string;
  description: string;
  category: EventCategory;
}

export interface PlayerStat {
  id: string;
  name: string;
  num: number;
  pos: string;
  dist: number;
  sprints: number;
  topSpeed: number;
  currentSpeed: number;
  actions: number;
}

interface MatchStatsType {
  fcScore: number;
  nvScore: number;
  fcPossession: number;
  nvPossession: number;
  fcShots: number;
  nvShots: number;
  fcShotsOnTarget: number;
  nvShotsOnTarget: number;
  fcCorners: number;
  nvCorners: number;
  fcFouls: number;
  nvFouls: number;
  fcXG: number;
  nvXG: number;
}

interface MatchContextType {
  currentTime: number;
  isPlaying: boolean;
  events: MatchEvent[];
  players: PlayerStat[];
  matchStats: MatchStatsType;
  videoSrc: string | null;
  setVideoSrc: (src: string | null) => void;
  togglePlay: () => void;
  pauseMatch: () => void;
  setCurrentTime: (time: number) => void;
  addEvent: (event: Omit<MatchEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;
  updateEvent: (id: string, updated: Partial<MatchEvent>) => void;
  exportToJSON: () => void;
}

const initialPlayers: PlayerStat[] = [
  { id: 'p1', name: 'Jasur Karimov', num: 9, pos: 'ST', dist: 7.8, sprints: 18, topSpeed: 31.2, currentSpeed: 0, actions: 4 },
  { id: 'p2', name: 'Azizbek Aliyev', num: 7, pos: 'RW', dist: 8.4, sprints: 21, topSpeed: 32.8, currentSpeed: 0, actions: 7 },
  { id: 'p3', name: 'Bekzod Umarov', num: 5, pos: 'CB', dist: 6.9, sprints: 9, topSpeed: 27.4, currentSpeed: 0, actions: 12 },
  { id: 'p4', name: 'Sardor Rashidov', num: 10, pos: 'CAM', dist: 8.1, sprints: 15, topSpeed: 29.5, currentSpeed: 0, actions: 24 },
  { id: 'p5', name: 'Otabek Shukurov', num: 8, pos: 'CM', dist: 9.2, sprints: 12, topSpeed: 28.1, currentSpeed: 0, actions: 31 },
];

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider = ({ children }: { children: ReactNode }) => {
  const [currentTime, setCurrentTimeState] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [players, setPlayers] = useState<PlayerStat[]>(initialPlayers);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    let interval: number;
    // Only simulate player speeds when a real video is loaded AND playing
    if (isPlaying && videoSrc) {
      interval = window.setInterval(() => {
        setCurrentTimeState((prev) => prev + 1);

        setPlayers(prev => prev.map(p => {
          // Position-based max speed and activity profiles
          const profile: Record<string, { maxSpeed: number; sprintChance: number; runChance: number; jogChance: number }> = {
            ST:  { maxSpeed: 34, sprintChance: 0.04, runChance: 0.20, jogChance: 0.45 },
            RW:  { maxSpeed: 35, sprintChance: 0.05, runChance: 0.25, jogChance: 0.40 },
            LW:  { maxSpeed: 35, sprintChance: 0.05, runChance: 0.25, jogChance: 0.40 },
            CAM: { maxSpeed: 30, sprintChance: 0.03, runChance: 0.18, jogChance: 0.50 },
            CM:  { maxSpeed: 29, sprintChance: 0.02, runChance: 0.15, jogChance: 0.55 },
            CDM: { maxSpeed: 28, sprintChance: 0.02, runChance: 0.12, jogChance: 0.55 },
            CB:  { maxSpeed: 28, sprintChance: 0.01, runChance: 0.10, jogChance: 0.50 },
            GK:  { maxSpeed: 22, sprintChance: 0.005, runChance: 0.05, jogChance: 0.30 },
          };

          const pos = profile[p.pos] ?? profile['CM'];
          const rand = Math.random();

          // Determine target speed based on position profile
          let targetSpeed: number;
          if (rand < pos.sprintChance) {
            targetSpeed = 25 + Math.random() * (pos.maxSpeed - 25); // Sprint
          } else if (rand < pos.sprintChance + pos.runChance) {
            targetSpeed = 14 + Math.random() * 11; // High-intensity run
          } else if (rand < pos.sprintChance + pos.runChance + pos.jogChance) {
            targetSpeed = 5 + Math.random() * 9;  // Jog
          } else {
            targetSpeed = Math.random() * 5; // Walk / stand
          }

          // Inertia: speed cannot jump instantly — max change 4 km/h per second
          const maxDelta = 4.0;
          const diff = targetSpeed - p.currentSpeed;
          const delta = Math.max(-maxDelta, Math.min(maxDelta, diff));
          const newCurrentSpeed = Math.max(0, +(p.currentSpeed + delta).toFixed(1));

          // Sprint: count only new sprint entries (cross 25 km/h threshold going up)
          const isNewSprint = newCurrentSpeed >= 25 && p.currentSpeed < 25;
          const newTopSpeed = Math.max(p.topSpeed, newCurrentSpeed);

          // Distance: km/h → km per second (÷ 3600)
          const distIncrement = newCurrentSpeed / 3600;

          return {
            ...p,
            dist: +(p.dist + distIncrement).toFixed(3),
            currentSpeed: newCurrentSpeed,
            topSpeed: newTopSpeed,
            sprints: p.sprints + (isNewSprint ? 1 : 0),
          };
        }));
      }, 1000);
    } else {
      // No video or paused — reset all current speeds to 0
      setPlayers(prev => prev.map(p => ({ ...p, currentSpeed: 0 })));
    }
    return () => clearInterval(interval);
  }, [isPlaying, videoSrc]);



  const togglePlay = () => setIsPlaying(!isPlaying);
  const pauseMatch = () => setIsPlaying(false);
  const setCurrentTime = (time: number) => setCurrentTimeState(time);

  const addEvent = (eventData: Omit<MatchEvent, 'id'>) => {
    const newEvent = { ...eventData, id: Date.now().toString() };
    setEvents((prev) => [...prev, newEvent]);

    // Update player actions if a known player is tagged
    if (eventData.team === 'Football Club') {
      setPlayers(prev => prev.map(p => {
        if (eventData.player.includes(p.name)) {
          return { ...p, actions: p.actions + 1 };
        }
        return p;
      }));
    }
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter(e => e.id !== id));
  };

  const updateEvent = (id: string, updated: Partial<MatchEvent>) => {
    setEvents((prev) => prev.map(e => e.id === id ? { ...e, ...updated } : e));
  };

  const exportToJSON = () => {
    const data = {
      matchInfo: { teamA: 'Football Club', teamB: 'Navbahor', date: new Date().toISOString() },
      events,
      players
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `match_analysis_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Dynamically calculate match stats based on events
  const matchStats = useMemo(() => {
    let stats = {
      fcScore: 0, nvScore: 0,
      fcPossession: 0, nvPossession: 0,
      fcShots: 0, nvShots: 0,
      fcShotsOnTarget: 0, nvShotsOnTarget: 0,
      fcCorners: 0, nvCorners: 0,
      fcFouls: 0, nvFouls: 0,
      fcXG: 0.0, nvXG: 0.0
    };

    events.forEach(e => {
      const isFC = e.team === 'Football Club';
      if (e.type === 'GOAL') {
        if (isFC) { stats.fcScore++; stats.fcXG += 0.8; stats.fcShots++; stats.fcShotsOnTarget++; }
        else { stats.nvScore++; stats.nvXG += 0.8; stats.nvShots++; stats.nvShotsOnTarget++; }
      }
      if (e.type === 'SHOT' || e.type === 'CHANCE') {
        if (isFC) { stats.fcShots++; stats.fcXG += 0.15; }
        else { stats.nvShots++; stats.nvXG += 0.15; }
      }
      if (e.type === 'CORNER') {
        if (isFC) stats.fcCorners++; else stats.nvCorners++;
      }
      if (e.type === 'FOUL') {
        if (isFC) stats.fcFouls++; else stats.nvFouls++;
      }
      if (e.type === 'KEY PASS' || e.type === 'ASSIST') {
        if (isFC) stats.fcXG += 0.1; else stats.nvXG += 0.1;
      }
    });

    stats.fcXG = +stats.fcXG.toFixed(2);
    stats.nvXG = +stats.nvXG.toFixed(2);

    return stats;
  }, [events]);

  return (
    <MatchContext.Provider value={{ 
      currentTime, isPlaying, events, players, matchStats,
      videoSrc, setVideoSrc,
      togglePlay, pauseMatch, setCurrentTime, addEvent, deleteEvent, updateEvent, exportToJSON 
    }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};
