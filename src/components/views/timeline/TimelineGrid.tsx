import React, { useRef, useEffect } from 'react';

interface Clip {
  id: number;
  trackId: number;
  name: string;
  startTime: number;
  duration: number;
  color: string;
  type: 'audio' | 'video' | 'midi';
}

interface Track {
  id: number;
  name: string;
  color: string;
  type: 'video' | 'audio';
  muted: boolean;
  solo: boolean;
  volume: number;
}

interface TimelineGridProps {
  tracks: Track[];
  clips: Clip[];
  zoom?: number;
  playheadPosition?: number;
  onPlayheadMove?: (position: number) => void;
}

export default function TimelineGrid({ 
  tracks, 
  clips, 
  zoom = 1, 
  playheadPosition = 0,
  onPlayheadMove 
}: TimelineGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Base pixels per second, affected by zoom
  const basePixelsPerSecond = 20;
  const pixelsPerSecond = Math.max(5, basePixelsPerSecond * zoom); // Minimum 5px per second
  
  // Total timeline duration (in seconds)
  const totalDuration = 300; // 5 minutes
  const totalWidth = Math.max(1000, totalDuration * pixelsPerSecond); // Minimum width

  // Generate time markers based on zoom level
  const generateTimeMarkers = () => {
    const markers = [];
    // Adjust interval based on zoom - more markers when zoomed in
    let interval;
    if (zoom >= 3) interval = 1;      // 1 second intervals
    else if (zoom >= 2) interval = 2; // 2 second intervals  
    else if (zoom >= 1) interval = 5; // 5 second intervals
    else if (zoom >= 0.5) interval = 10; // 10 second intervals
    else interval = 30; // 30 second intervals
    
    for (let i = 0; i <= totalDuration; i += interval) {
      const minutes = Math.floor(i / 60);
      const seconds = i % 60;
      markers.push({
        time: i,
        label: `${minutes}:${seconds.toString().padStart(2, '0')}`,
        position: i * pixelsPerSecond
      });
    }
    return markers;
  };

  const timeMarkers = generateTimeMarkers();

  // Generate sub-divisions for better precision
  const generateSubMarkers = () => {
    const subMarkers = [];
    // More granular sub-intervals based on zoom
    let subInterval;
    let majorInterval;
    
    if (zoom >= 3) {
      subInterval = 0.5;  // Half-second marks
      majorInterval = 1;   // Major marks every second
    } else if (zoom >= 2) {
      subInterval = 1;     // Second marks
      majorInterval = 2;   // Major marks every 2 seconds
    } else if (zoom >= 1) {
      subInterval = 1;     // Second marks
      majorInterval = 5;   // Major marks every 5 seconds
    } else if (zoom >= 0.5) {
      subInterval = 5;     // 5-second marks
      majorInterval = 10;  // Major marks every 10 seconds
    } else {
      subInterval = 10;    // 10-second marks
      majorInterval = 30;  // Major marks every 30 seconds
    }
    
    for (let i = 0; i <= totalDuration; i += subInterval) {
      subMarkers.push({
        time: i,
        position: i * pixelsPerSecond,
        isMajor: i % majorInterval === 0
      });
    }
    return subMarkers;
  };

  const subMarkers = generateSubMarkers();

  const handleGridClick = (e: React.MouseEvent) => {
    if (!gridRef.current || !onPlayheadMove) return;
    
    const rect = gridRef.current.getBoundingClientRect();
    const scrollLeft = gridRef.current.parentElement?.scrollLeft || 0;
    const x = e.clientX - rect.left + scrollLeft;
    const time = Math.max(0, x / pixelsPerSecond);
    onPlayheadMove(Math.min(time, totalDuration));
  };

  // Simple waveform representation
  const generateWaveform = (clipDuration: number, clipWidth: number) => {
    const points = Math.floor(clipWidth / 4);
    const waveform = [];
    
    for (let i = 0; i < points; i++) {
      const amplitude = Math.sin((i / points) * Math.PI * 8) * 0.7 + 
                       Math.sin((i / points) * Math.PI * 16) * 0.3;
      waveform.push(amplitude);
    }
    return waveform;
  };

  return (
    <div className="flex-1 bg-zinc-800 relative overflow-auto">
      {/* Time ruler */}
      <div className="h-12 bg-zinc-900 border-b border-zinc-600 sticky top-0 z-20 relative">
        <div 
          className="relative h-full"
          style={{ width: `${totalWidth}px` }}
        >
          {/* Sub-markers */}
          {subMarkers.map((marker, index) => (
            <div 
              key={`sub-${index}`}
              className={`absolute top-0 ${marker.isMajor ? 'h-full bg-zinc-600' : 'h-2 bg-zinc-700'} w-px`}
              style={{ left: `${marker.position}px` }}
            />
          ))}
          
          {/* Time labels */}
          {timeMarkers.map((marker) => (
            <div 
              key={marker.time}
              className="absolute top-1 text-zinc-300 text-xs font-mono pointer-events-none"
              style={{ left: `${marker.position + 4}px` }}
            >
              {marker.label}
            </div>
          ))}
          
          {/* Playhead in ruler */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30 pointer-events-none"
            style={{ left: `${playheadPosition * pixelsPerSecond}px` }}
          />
        </div>
      </div>
      
      {/* Grid area */}
      <div 
        ref={gridRef}
        className="relative bg-zinc-800 cursor-crosshair"
        style={{ width: `${totalWidth}px`, minHeight: `${tracks.length * 64}px` }}
        onClick={handleGridClick}
      >
        {/* Vertical grid lines */}
        {subMarkers.map((marker, index) => (
          <div 
            key={`grid-${index}`}
            className={`absolute top-0 bottom-0 w-px ${marker.isMajor ? 'bg-zinc-600' : 'bg-zinc-700'}`}
            style={{ left: `${marker.position}px` }}
          />
        ))}
        
        {/* Track rows */}
        {tracks.map((track, trackIndex) => (
          <div 
            key={track.id}
            className="h-16 border-b border-zinc-700 relative hover:bg-zinc-750"
            style={{ top: `${trackIndex * 64}px` }}
          >
            {/* Track background */}
            <div className="absolute inset-0 bg-zinc-800" />
            
            {/* Render clips for this track */}
            {clips
              .filter(clip => clip.trackId === track.id)
              .map(clip => {
                const clipWidth = clip.duration * pixelsPerSecond;
                const clipLeft = clip.startTime * pixelsPerSecond;
                
                return (
                  <div 
                    key={clip.id}
                    className={`absolute top-1 bottom-1 ${clip.color} rounded border border-opacity-60 flex flex-col overflow-hidden cursor-pointer hover:brightness-110 transition-all`}
                    style={{ 
                      left: `${clipLeft}px`, 
                      width: `${clipWidth}px` 
                    }}
                  >
                    {/* Clip header */}
                    <div className="px-2 py-1 bg-black bg-opacity-20 border-b border-white border-opacity-20">
                      <span className="text-white text-xs font-medium truncate block">
                        {clip.name}
                      </span>
                    </div>
                    
                    {/* Clip content area */}
                    <div className="flex-1 relative px-1">
                      {clip.type === 'audio' && (
                        <div className="h-full flex items-center">
                          <svg 
                            className="w-full h-6 opacity-60"
                            viewBox={`0 0 ${clipWidth} 24`}
                            preserveAspectRatio="none"
                          >
                            <polyline
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1"
                              points={generateWaveform(clip.duration, clipWidth)
                                .map((amp, i) => `${i * 4},${12 + amp * 8}`)
                                .join(' ')}
                            />
                            <polyline
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1"
                              points={generateWaveform(clip.duration, clipWidth)
                                .map((amp, i) => `${i * 4},${12 - amp * 8}`)
                                .join(' ')}
                            />
                          </svg>
                        </div>
                      )}
                      
                      {clip.type === 'video' && (
                        <div className="h-full flex items-center justify-center text-white text-opacity-60">
                          <div className="text-lg">🎬</div>
                        </div>
                      )}
                      
                      {clip.type === 'midi' && (
                        <div className="h-full flex items-center">
                          {/* Simple MIDI visualization */}
                          <div className="w-full h-2 bg-white bg-opacity-30 rounded"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Resize handles */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white bg-opacity-0 hover:bg-opacity-50 cursor-w-resize"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white bg-opacity-0 hover:bg-opacity-50 cursor-e-resize"></div>
                  </div>
                );
              })
            }
          </div>
        ))}
        
        {/* Playhead */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none shadow-lg"
          style={{ left: `${playheadPosition * pixelsPerSecond}px` }}
        >
          {/* Playhead marker */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rotate-45"></div>
        </div>
      </div>
    </div>
  );
}
