
"use client";
import React, { useState } from 'react';
import Header from '../components/Header';
import Workspace from '../components/Workspace';
import { useTransportControls } from '../hooks/useTransportControls';
import type { WindowData } from '../types/window';

export default function Home() {
  const [windows, setWindows] = useState<WindowData[]>([
    { id: 1, x: 50, y: 50, width: 1400, height: 800, title: '', content: null, notes: '' }
  ]);
  const [nextId, setNextId] = useState(2);
  const transport = useTransportControls();
  console.log('[Home] render, windows state:', windows.map(w => ({ id: w.id, notes: w.notes })));
  const addNewWindow = () => {
    const newWindow: WindowData = {
      id: nextId,
      x: 50 + (nextId - 1) * 30,
      y: 50 + (nextId - 1) * 30,
      width: 1400,
      height: 800,
      title: `Window${nextId}`,
      content: null,
      notes: ''
    };
    setWindows((prev: WindowData[]) => [...prev, newWindow]);
    setNextId((prev: number) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header onNewWindow={addNewWindow} />
      <main className="flex-1 flex">
        <Workspace 
          windows={windows} 
          setWindows={setWindows}
          transportState={{isPlaying:transport.isPlaying,playheadPosition:transport.playheadPosition}}
          onPlayheadMove={transport.setPlayheadPosition}
        />
      </main>
    </div>
  );
}
