"use client";
import React, { useState, useCallback, useEffect } from 'react';
import Header from '../components/common/Header';
import Workspace from '../components/workspace/Workspace';
import CustomViewsMenu from '../components/workspace/CustomViewsMenu';
import { getWindowLayout } from '@/lib/windowUtils';
import { useWindowStore } from '../stores/windowStore';
import { useCustomViews } from '../hooks/useCustomViews';
import { useWindowLayout } from '../hooks/useWindowLayout';
import { mainContent, rootContainer } from '@/styles/classNames';
import { useAuth } from '../hooks/useAuth';
import type { WindowContent } from '../types/window';
import type { WindowData } from '../types/window';

type CustomView = { id: string; name: string; layout: WindowData[]; };

export default function Home() {
  const user = useAuth();
  const [hydrated, setHydrated] = useState(false);
  const [nextId, setNextId] = useState<number>(5);
  const { windows, setWindows } = useWindowLayout({ userId: user?.id, hydrated, setNextId });
  const { customViews, saveView, removeView, setCustomViews, } = useCustomViews(user?.id);
  const addWindow = useWindowStore(state => state.addWindow);
  useEffect(() => { setHydrated(true); }, []);
  const addNewWindow = useCallback(() => {
    const browserWidth = typeof window !== 'undefined' ? window.innerWidth : 2400;
    const browserHeight = typeof window !== 'undefined' ? window.innerHeight : 940;
    const layout = getWindowLayout(browserWidth, browserHeight);
    const windowWidth = layout[0]?.width || 320;
    const availableHeight = layout[0]?.height || 400;
    const margin = 40;
    const maxX = Math.max(margin, browserWidth - windowWidth - margin);
    const maxY = Math.max(margin, browserHeight - availableHeight - margin - 120);
    const x = Math.floor(Math.random() * (maxX - margin + 1)) + margin;
    const y = Math.floor(Math.random() * (maxY - margin + 1)) + margin;
    const newWindow = { x, y, width: windowWidth, height: availableHeight, title: `Window`,
                        content: 'quotemonitor' as WindowContent, notes: '', };
    addWindow(newWindow);
  }, [addWindow]);
  const handleLoadView = useCallback((view: CustomView) => {
    setWindows(view.layout);
    setNextId(view.layout.reduce((max, w) => Math.max(max, w.id), 0) + 1);
  }, [setWindows, setNextId]);
  if (!hydrated) return null;
  return (
    <div className={rootContainer}>
      <Header onNewWindow={addNewWindow}>
        <CustomViewsMenu
          views={customViews}
          onSave={saveView}
          onLoad={handleLoadView}
          onDelete={removeView}
          currentLayout={windows}
        />
      </Header>
      <main className={mainContent}>
        <Workspace user={user} windows={windows} setWindows={setWindows} />
      </main>
    </div>
  );
}