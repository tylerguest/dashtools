"use client";
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Workspace from '../components/Workspace';
import { createClient } from '@/utils/supabase/client';
import { useTransportControls } from '../hooks/useTransportControls';
import type { WindowData } from '../types/window';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const gap = 24;
  const windowCount = 4;
  const defaultWindowWidth = 320;
  const defaultWindowHeight = 900;
  const minWindowHeight = 400;
  const contents: WindowData["content"][] = ['stockchart', 'quotemonitor', 'chatbot', 'notes'];
  const getWindowLayout = (
    browserWidth = defaultWindowWidth * windowCount + gap * (windowCount + 1),
    browserHeight = defaultWindowHeight + 40
  ) => {
    const totalGap = gap * (windowCount + 1);
    const windowWidth = Math.max(320, Math.floor((browserWidth - totalGap) / windowCount));
    const totalWindowsWidth = windowWidth * windowCount + totalGap;
    const leftOffset = Math.max(0, Math.floor((browserWidth - totalWindowsWidth) / 2));
    const availableHeight = Math.max(minWindowHeight, Math.floor(browserHeight - 120));
    return Array.from({ length: windowCount }, (_, i) => ({
      id: i + 1,
      x: leftOffset + gap * (i + 1) + windowWidth * i,
      y: 30,
      width: windowWidth,
      height: availableHeight,
      title: '',
      content: contents[i],
      notes: ''
    }));
  };
  const [windows, setWindows] = useState<WindowData[]>(() => getWindowLayout());
  const [nextId, setNextId] = useState(5);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
    const updateLayout = () => {
      setWindows(getWindowLayout(window.innerWidth, window.innerHeight));
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  const transport = useTransportControls();
  console.log('[Home] render, windows state:', windows.map(w => ({ id: w.id, notes: w.notes })));
  const addNewWindow = () => {
    const browserWidth = typeof window !== 'undefined' ? window.innerWidth : 2400;
    const browserHeight = typeof window !== 'undefined' ? window.innerHeight : defaultWindowHeight + 40;
    const totalGap = gap * (windowCount + 1);
    const windowWidth = Math.max(320, Math.floor((browserWidth - totalGap) / windowCount));
    const availableHeight = Math.max(minWindowHeight, Math.floor(browserHeight - 120));
    const newWindow: WindowData = {
      id: nextId,
      x: gap,
      y: 50,
      width: windowWidth,
      height: availableHeight,
      title: `Window${nextId}`,
      content: 'quotemonitor',
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
          user={user}
        />
      </main>
    </div>
  );
}
