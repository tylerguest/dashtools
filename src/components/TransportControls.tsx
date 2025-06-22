"use client";

import React from 'react';

interface TransportControlsProps {
  isPlaying: boolean;
  playheadPosition: number;
  zoom: number;
  onTogglePlayPause: () => void;
  onStop: () => void;
  onRewind: () => void;
  onFastForward: () => void;
  onZoomChange: (zoom: number) => void;
}

function TransportControls({
  isPlaying,
  playheadPosition,
  zoom,
  onTogglePlayPause,
  onStop,
  onRewind,
  onFastForward,
  onZoomChange,
}: TransportControlsProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Transport Buttons */}
      <div className="flex items-center gap-1">
        <button 
          onClick={onTogglePlayPause}
          className={`w-8 h-8 rounded-md flex items-center justify-center ${
            isPlaying 
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' 
              : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200 border border-zinc-600 hover:border-zinc-500'
          } transition-all duration-200 text-sm font-medium`}
        >
          {isPlaying ? '⏸' : '▶'}
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
      
      {/* Time Display */}
      <div className="px-3 py-1 bg-zinc-800 border border-zinc-600 rounded-md">
        <span className="text-zinc-200 text-sm font-mono tracking-wider">
          {Math.floor(playheadPosition / 60)}:{(playheadPosition % 60).toFixed(2).padStart(5, '0')}
        </span>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-3">
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
              onClick={() => onZoomChange(value)}
              className={`px-2 py-1 text-xs rounded-md font-medium transition-all duration-200 ${
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
            onChange={(e) => onZoomChange(parseFloat(e.target.value))}
            className="w-20 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="min-w-[3rem] px-2 py-1 bg-zinc-800 border border-zinc-600 rounded text-zinc-300 text-xs font-mono text-center">
            {(zoom * 100).toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransportControls;