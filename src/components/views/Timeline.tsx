import React, { useState } from 'react';
import TrackList from './timeline/TrackList';
import TimelineGrid from './timeline/TimelineGrid';

interface Track {
  id: number;
  name: string;
  color: string;
  type: 'video' | 'audio';
  muted: boolean;
  solo: boolean;
  volume: number;
}

interface Clip {
  id: number;
  trackId: number;
  name: string;
  startTime: number;
  duration: number;
  color: string;
  type: 'audio' | 'video' | 'midi';
}

interface TimelineProps {
  transportState?: {
    isPlaying: boolean;
    playheadPosition: number;
  };
  onPlayheadMove?: (position: number) => void;
}

export default function Timeline({ transportState, onPlayheadMove }: TimelineProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [zoom, setZoom] = useState(1);

  const handleTrackUpdate = (trackId: number, updates: Partial<Track>) => {
    setTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, ...updates } : track
    ));
  };

  return (
    <div className="h-full w-full bg-zinc-800 border border-zinc-600 flex flex-col">
      {/* Zoom Controls Header */}
      <div className="h-10 bg-zinc-900 border-b border-zinc-600 flex items-center justify-end px-4 gap-3">
        <span className="text-zinc-300 text-sm font-medium">Zoom:</span>
        
        {/* Zoom Preset Buttons */}
        <div className="flex items-center gap-1 bg-zinc-800 border border-zinc-600 rounded-lg p-1">
          {[
            { value: 0.25, label: '25%' },
            { value: 0.5, label: '50%' },
            { value: 1, label: '100%' },
            { value: 2, label: '200%' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={(e) => {
                e.stopPropagation();
                setZoom(value);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-all duration-200 ${
                zoom === value 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        
        {/* Zoom Slider */}
        <div className="flex items-center gap-2">
          <input 
            type="range" 
            min="0.25" 
            max="4" 
            step="0.25" 
            value={zoom} 
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="w-24 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="min-w-[3rem] px-2 py-1 bg-zinc-800 border border-zinc-600 rounded text-zinc-300 text-xs font-mono text-center">
            {(zoom * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <TrackList tracks={tracks} onTrackUpdate={handleTrackUpdate} />
        <TimelineGrid 
          tracks={tracks} 
          clips={clips} 
          zoom={zoom}
          playheadPosition={transportState?.playheadPosition || 0}
          onPlayheadMove={onPlayheadMove}
        />
      </div>
    </div>
  );
}