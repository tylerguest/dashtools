import { useState, useEffect, useRef } from 'react';

export interface TransportState {
  isPlaying: boolean;
  playheadPosition: number;
}

export function useTransportControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [zoom, setZoom] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Playback simulation
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setPlayheadPosition(prev => prev + 0.1); // Advance by 0.1 seconds
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const stop = () => {
    setIsPlaying(false);
    setPlayheadPosition(0);
  };
  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const rewind = () => setPlayheadPosition(prev => Math.max(0, prev - 10));
  const fastForward = () => setPlayheadPosition(prev => prev + 10);

  return {
    // State
    isPlaying,
    playheadPosition,
    zoom,
    // Actions
    play,
    pause,
    stop,
    togglePlayPause,
    rewind,
    fastForward,
    setPlayheadPosition,
    setZoom,
  };
}
