"use client";
import React, { useState, useEffect } from 'react';

import Header from '../components/Header';
import Workspace from '../components/Workspace';
import { createClient, saveCustomView, fetchCustomViews, deleteCustomView, fetchUserWindowLayout, upsertUserWindowLayout } from '@/utils/supabase/client';
import type { WindowData } from '../types/window';
import CustomViewsMenu from '../components/CustomViewsMenu';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [customViews, setCustomViews] = useState<any[]>([]);
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
    const fetchUserAndViewsAndLayout = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: views, error: viewsError } = await fetchCustomViews(user.id);
        if (!viewsError && views) setCustomViews(views);
        const { data: layoutRow, error: layoutError } = await fetchUserWindowLayout(user.id);
        if (layoutError) {
          console.error('[App] Error fetching user window layout:', layoutError);
        }
        if (!layoutError && layoutRow && layoutRow.layout) {
          let layoutData = layoutRow.layout;
          if (typeof layoutData === 'string') {
            try {
              layoutData = JSON.parse(layoutData);
            } catch (e) {
              console.error('[App] Failed to parse layout JSON:', e, layoutData);
              layoutData = [];
            }
          }
          if (Array.isArray(layoutData) && layoutData.length > 0) {
            setWindows(layoutData);
            setNextId(layoutData.reduce((max: number, w: any) => Math.max(max, w.id), 0) + 1);
          } else {
            const defaultLayout = getWindowLayout(window.innerWidth, window.innerHeight);
            setWindows(defaultLayout);
            setNextId(defaultLayout.reduce((max: number, w: any) => Math.max(max, w.id), 0) + 1);
            if (user) {
              await upsertUserWindowLayout(user.id, defaultLayout);
            }
          }
        } else {
          const defaultLayout = getWindowLayout(window.innerWidth, window.innerHeight);
          setWindows(defaultLayout);
          setNextId(defaultLayout.reduce((max: number, w: any) => Math.max(max, w.id), 0) + 1);
          if (user) {
            await upsertUserWindowLayout(user.id, defaultLayout);
          }
        }
      } else {
        setWindows(getWindowLayout(window.innerWidth, window.innerHeight));
      }
    };
    fetchUserAndViewsAndLayout();
  }, []);

  const addNewWindow = () => {
    const browserWidth = typeof window !== 'undefined' ? window.innerWidth : 2400;
    const browserHeight = typeof window !== 'undefined' ? window.innerHeight : defaultWindowHeight + 40;
    const totalGap = gap * (windowCount + 1);
    const windowWidth = Math.max(320, Math.floor((browserWidth - totalGap) / windowCount));
    const availableHeight = Math.max(minWindowHeight, Math.floor(browserHeight - 120));
    const margin = 40;
    const maxX = Math.max(margin, browserWidth - windowWidth - margin);
    const maxY = Math.max(margin, browserHeight - availableHeight - margin - 120);
    const x = Math.floor(Math.random() * (maxX - margin + 1)) + margin;
    const y = Math.floor(Math.random() * (maxY - margin + 1)) + margin;
    const newWindow: WindowData = {
      id: nextId,
      x,
      y,
      width: windowWidth,
      height: availableHeight,
      title: `Window${nextId}`,
      content: 'quotemonitor',
      notes: ''
    };
    setWindows((prev: WindowData[]) => [...prev, newWindow]);
    setNextId((prev: number) => prev + 1);
  };

  const handleSaveView = async (name: string, layout: any) => {
    if (!user) return;
    const { error } = await saveCustomView(user.id, name, layout);
    if (!error) {
      const { data: views } = await fetchCustomViews(user.id);
      if (views) setCustomViews(views);
    } else {
      alert('Failed to save view: ' + error.message);
    }
  };
  const handleLoadView = (view: any) => {
    setWindows(view.layout);
    setNextId(view.layout.reduce((max: number, w: any) => Math.max(max, w.id), 0) + 1);
    if (user) upsertUserWindowLayout(user.id, view.layout);
  };
  const handleDeleteView = async (id: string) => {
    if (!user) return;
    const { error } = await deleteCustomView(id, user.id);
    if (!error) {
      setCustomViews(prev => prev.filter(v => v.id !== id));
    } else {
      alert('Failed to delete view: ' + error.message);
    }
  };

  useEffect(() => {
    if (!user) return;
    const timeout = setTimeout(() => {
      upsertUserWindowLayout(user.id, windows)
        .catch(err => console.error('[App] upsertUserWindowLayout error:', err));
    }, 600);
    return () => clearTimeout(timeout);
  }, [windows, user]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header onNewWindow={addNewWindow}>
        <CustomViewsMenu
          views={customViews}
          onSave={handleSaveView}
          onLoad={handleLoadView}
          onDelete={handleDeleteView}
          currentLayout={windows}
        />
      </Header>
      <main className="flex-1 flex">
        <Workspace 
          windows={windows} 
          setWindows={setWindows}
          user={user}
        />
      </main>
    </div>
  );
}
