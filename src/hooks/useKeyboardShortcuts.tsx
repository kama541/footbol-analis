import { useEffect } from 'react';
import { useMatch, EventCategory } from '../context/MatchContext';

export const useKeyboardShortcuts = (
  videoRef: React.RefObject<HTMLVideoElement>,
  isPlaying: boolean,
  togglePlay: () => void,
  currentTime: number,
  setCurrentTime: (time: number) => void
) => {
  const { addEvent, players } = useMatch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const duration = videoRef.current?.duration || 5400;

      // Tagging Shortcuts (1-5)
      const tagMap: Record<string, { type: string, category: EventCategory }> = {
        '1': { type: 'Goal', category: 'attacking' },
        '2': { type: 'Shot', category: 'attacking' },
        '3': { type: 'Key Play', category: 'attacking' },
        '4': { type: 'Cross', category: 'attacking' },
        '5': { type: 'Tackle', category: 'defensive' }
      };

      if (tagMap[e.key]) {
        e.preventDefault();
        const tag = tagMap[e.key];
        const player = players[0]; // Default to first player or we can fetch selected from somewhere
        addEvent({
          type: tag.type,
          time: currentTime,
          player: `${player.name} (#${player.num})`,
          team: 'Football Club',
          description: `Quick Tag via Shortcut (${e.key})`,
          category: tag.category
        });
        return;
      }

      switch (e.key) {
        case ' ':
        case 'k':
        case 'K':
          e.preventDefault();
          togglePlay();
          break;
        
        case 'j':
        case 'J':
          e.preventDefault();
          setCurrentTime(Math.max(0, currentTime - 10));
          break;
          
        case 'l':
        case 'L':
          e.preventDefault();
          setCurrentTime(Math.min(duration, currentTime + 10));
          break;

        case 'ArrowLeft':
          e.preventDefault();
          // Frame by frame backwards (assuming 30fps = ~0.033s)
          if (!isPlaying && videoRef.current) {
            videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 0.033);
            setCurrentTime(videoRef.current.currentTime);
          } else {
            setCurrentTime(Math.max(0, currentTime - 5));
          }
          break;

        case 'ArrowRight':
          e.preventDefault();
          // Frame by frame forwards
          if (!isPlaying && videoRef.current) {
            videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 0.033);
            setCurrentTime(videoRef.current.currentTime);
          } else {
            setCurrentTime(Math.min(duration, currentTime + 5));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, togglePlay, currentTime, setCurrentTime, addEvent, players, videoRef]);
};
