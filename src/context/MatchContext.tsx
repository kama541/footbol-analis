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
  speed: number;
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
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  addEvent: (event: Omit<MatchEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;
  updateEvent: (id: string, updated: Partial<MatchEvent>) => void;
  exportToJSON: () => void;
}

const initialPlayers: PlayerStat[] = [
  { id: 'p1', name: 'Jasur Karimov', num: 9, pos: 'ST', dist: 7.8, sprints: 18, speed: 31.2, actions: 4 },
  { id: 'p2', name: 'Azizbek Aliyev', num: 7, pos: 'RW', dist: 8.4, sprints: 21, speed: 32.8, actions: 7 },
  { id: 'p3', name: 'Bekzod Umarov', num: 5, pos: 'CB', dist: 6.9, sprints: 9, speed: 27.4, actions: 12 },
  { id: 'p4', name: 'Sardor Rashidov', num: 10, pos: 'CAM', dist: 8.1, sprints: 15, speed: 29.5, actions: 24 },
  { id: 'p5', name: 'Otabek Shukurov', num: 8, pos: 'CM', dist: 9.2, sprints: 12, speed: 28.1, actions: 31 },
];

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider = ({ children }: { children: ReactNode }) => {
  const [currentTime, setCurrentTimeState] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [players, setPlayers] = useState<PlayerStat[]>(initialPlayers);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTimeState((prev) => prev + 1);
        
        // Simulate distance running over time
        setPlayers(prev => prev.map(p => ({
          ...p,
          dist: +(p.dist + 0.002).toFixed(2)
        })));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const setCurrentTime = (time: number) => setCurrentTimeState(time);

  const addEvent = (eventData: Omit<MatchEvent, 'id'>) => {
    const newEvent = { ...eventData, id: Date.now().toString() };
    setEvents((prev) => [newEvent, ...prev]);

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
      fcPossession: 55, nvPossession: 45, // Default base
      fcShots: 0, nvShots: 4,
      fcShotsOnTarget: 0, nvShotsOnTarget: 2,
      fcCorners: 0, nvCorners: 2,
      fcFouls: 0, nvFouls: 5,
      fcXG: 0.0, nvXG: 0.64
    };

    events.forEach(e => {
      const isFC = e.team === 'Football Club';
      if (e.type === 'GOAL') {
        if (isFC) stats.fcScore++; else stats.nvScore++;
        if (isFC) stats.fcXG += 0.8;
      }
      if (e.type === 'SHOT' || e.type === 'CHANCE' || e.type === 'GOAL') {
        if (isFC) stats.fcShots++; else stats.nvShots++;
        if (e.type === 'GOAL') {
            if (isFC) stats.fcShotsOnTarget++; else stats.nvShotsOnTarget++;
        }
      }
      if (e.type === 'CORNER') {
        if (isFC) stats.fcCorners++; else stats.nvCorners++;
      }
      if (e.type === 'FOUL') {
        if (isFC) stats.fcFouls++; else stats.nvFouls++;
      }
    });

    return stats;
  }, [events]);

  return (
    <MatchContext.Provider value={{ 
      currentTime, isPlaying, events, players, matchStats, 
      togglePlay, setCurrentTime, addEvent, deleteEvent, updateEvent, exportToJSON 
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
