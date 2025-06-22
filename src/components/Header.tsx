"use client";

import React from 'react';
import TransportControls from './TransportControls';

interface HeaderProps {
  onNewWindow: () => void;
  isPlaying: boolean;
  playheadPosition: number;
  zoom: number;
  onTogglePlayPause: () => void;
  onStop: () => void;
  onRewind: () => void;
  onFastForward: () => void;
  onZoomChange: (zoom: number) => void;
}

export default function Header({ 
  onNewWindow,
  isPlaying,
  playheadPosition,
  zoom,
  onTogglePlayPause,
  onStop,
  onRewind,
  onFastForward,
  onZoomChange,
}: HeaderProps) {
  return (
    <header className="bg-zinc-900 border-b border-zinc-700 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <h1 className="text-zinc-200 text-lg font-black">WebTools</h1>
        <TransportControls
          isPlaying={isPlaying}
          playheadPosition={playheadPosition}
          zoom={zoom}
          onTogglePlayPause={onTogglePlayPause}
          onStop={onStop}
          onRewind={onRewind}
          onFastForward={onFastForward}
          onZoomChange={onZoomChange}
        />
      </div>
      <button
        onClick={onNewWindow}
        className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm rounded border border-zinc-600 hover:border-zinc-500 transition-colors"
      >
        + New Window
      </button>
    </header>
  );
}