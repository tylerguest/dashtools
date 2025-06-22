"use client";

import React from 'react';

interface TransportControlsProps {isPlaying:boolean;playheadPosition:number;onTogglePlayPause:()=>void;onStop:()=>void;onRewind:()=>void;onFastForward:()=>void;}

function TransportControls({isPlaying,playheadPosition,onTogglePlayPause,onStop,onRewind,onFastForward,
}: TransportControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <button 
          onClick={onTogglePlayPause}
          className={`w-8 h-8 rounded-md flex items-center justify-center ${
            isPlaying 
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' 
              : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200 border border-zinc-600 hover:border-zinc-500'
          } transition-all duration-200 text-sm font-medium`}
        >
          {isPlaying?'⏸':'▶'}
        </button>
        <button 
          onClick={onStop}
          className="w-8 h-8 rounded-md flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 text-zinc-200 border border-zinc-600 hover:border-zinc-500 transition-all duration-200 text-sm"
        >
          ⏹
        </button>
        <button 
          onClick={onRewind}
          className="w-8 h-8 rounded-md flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 text-zinc-200 border border-zinc-600 hover:border-zinc-500 transition-all duration-200 text-sm"
        >
          ⏮
        </button>
        <button 
          onClick={onFastForward}
          className="w-8 h-8 rounded-md flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 text-zinc-200 border border-zinc-600 hover:border-zinc-500 transition-all duration-200 text-sm"
        >
          ⏭
        </button>
      </div>
      <div className="px-3 py-1 bg-zinc-800 border border-zinc-600 rounded-md">
        <span className="text-zinc-200 text-sm font-mono tracking-wider">
          {Math.floor(playheadPosition/60)}:{(playheadPosition%60).toFixed(2).padStart(5,'0')}
        </span>
      </div>
    </div>
  );
}

export default TransportControls;