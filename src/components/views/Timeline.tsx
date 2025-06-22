import React, { useState } from 'react';
import TrackList from './timeline/TrackList';
import TimelineGrid from './timeline/TimelineGrid';

interface Track {id:number;name:string;color:string;type:'video'|'audio';muted:boolean;solo:boolean;volume:number;}
interface Clip {id:number;trackId:number;name:string;startTime:number;duration:number;color:string;type:'audio'|'video'|'midi';}
interface TimelineProps {
  transportState?:{isPlaying:boolean;playheadPosition:number};
  onPlayheadMove?:(position:number)=>void;
}

export default function Timeline({transportState,onPlayheadMove}:TimelineProps) {
  const [tracks,setTracks]=useState<Track[]>([]);
  const [clips,setClips]=useState<Clip[]>([]);
  const [zoom,setZoom]=useState(1);
  const getNextTrackId = () => tracks.length > 0 ? Math.max(...tracks.map(t=>t.id))+1 : 1;
  const handleAddTrack = () => {
    const id = getNextTrackId();
    setTracks(tracks => [
      ...tracks,
      {
        id,
        name: `Audio ${id}`,
        color: 'bg-blue-700',
        type: 'audio',
        muted: false,
        solo: false,
        volume: 1
      }
    ]);
  };

  const handleTrackUpdate=(id:number,updates:Partial<Track>)=>setTracks(tracks=>tracks.map(t=>t.id===id?{ ...t,...updates}:t));

  return (
    <div className="h-full w-full bg-zinc-800 border border-zinc-600 flex flex-col">
      <div className="h-10 bg-zinc-900 border-b border-zinc-600 flex items-center justify-end px-4 gap-3">
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
        <TrackList 
          tracks={tracks} 
          onTrackUpdate={handleTrackUpdate} 
          onAddTrack={handleAddTrack}
        />
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