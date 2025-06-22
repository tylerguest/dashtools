import React from 'react';

interface Track {id:number;name:string;color:string;type:'video'|'audio';muted:boolean;solo:boolean;volume:number;}
interface TrackListProps {tracks:Track[];onTrackUpdate?:(trackId:number,updates:Partial<Track>)=>void;}

export default function TrackList({tracks,onTrackUpdate}:TrackListProps) {
  return (
    <div className="w-64 bg-zinc-800 border-r border-zinc-600 flex flex-col">
      <div className="h-12 bg-zinc-900 border-zinc-600 flex items-center px-3 justify-between">
        <span className="text-zinc-300 text-sm font-medium">Tracks</span>
        <button
          className="w-7 h-7 flex items-center justify-center hover:bg-zinc-600 text-zinc-200 text-lg font-bold hover:border-zinc-500 transition"
          title="Add Track"
        >
          +
        </button>
      </div>
      
      {tracks.map((track) => (
        <div 
          key={track.id}
          className="h-16 border-b border-zinc-700 flex items-center px-3 hover:bg-zinc-750"
        >
          <div className={`w-3 h-3 rounded-full ${track.color} mr-3 flex-shrink-0`}></div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-zinc-300 text-sm truncate">{track.name}</span>
              <span className="text-zinc-500 text-xs">{track.type.toUpperCase()}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onTrackUpdate?.(track.id, { muted: !track.muted })}
                className={`w-7 h-5 text-xs rounded-md font-medium transition-all duration-200 ${
                  track.muted 
                    ? 'bg-red-600 text-white shadow-sm' 
                    : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white border border-zinc-600'
                }`}
              >
                M
              </button>
              <button
                onClick={() => onTrackUpdate?.(track.id, { solo: !track.solo })}
                className={`w-7 h-5 text-xs rounded-md font-medium transition-all duration-200 ${
                  track.solo 
                    ? 'bg-yellow-600 text-white shadow-sm' 
                    : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white border border-zinc-600'
                }`}
              >
                S
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={track.volume}
                onChange={(e) => onTrackUpdate?.(track.id, { volume: parseFloat(e.target.value) })}
                className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  '--slider-progress': `${track.volume * 100}%`
                } as React.CSSProperties}
              />
              <div className="min-w-[2rem] text-zinc-400 text-xs font-mono text-right bg-zinc-800 px-1 py-0.5 rounded border border-zinc-700">
                {Math.round(track.volume * 100)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
