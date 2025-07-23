"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Workspace from '../components/Workspace';
import CustomViewsMenu from '../components/CustomViewsMenu';
import {
  createClient,
  saveCustomView,
  fetchCustomViews,
  deleteCustomView,
  fetchUserWindowLayout,
  upsertUserWindowLayout,
} from '@/utils/supabase/client';
import type { WindowData } from '../types/window';
import { getWindowLayout } from '@/lib/windowUtils';

type CustomView = {
  id: string;
  name: string;
  layout: WindowData[];
};

const DEFAULT_WINDOW_COUNT = 4;

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [customViews, setCustomViews] = useState<CustomView[]>([]);
  const [windows, setWindows] = useState<WindowData[]>(() => getWindowLayout());
  const [nextId, setNextId] = useState<number>(5);

  // Fetch user, custom views, and layout on mount
  useEffect(() => {
    const fetchUserAndViewsAndLayout = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: views, error: viewsError } = await fetchCustomViews(user.id);
        if (!viewsError && views) setCustomViews(views);
        const { data: layoutRow, error: layoutError } = await fetchUserWindowLayout(user.id);
        let layoutData = layoutRow?.layout;
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
          await upsertUserWindowLayout(user.id, defaultLayout);
        }
      } else {
        setWindows(getWindowLayout(window.innerWidth, window.innerHeight));
      }
    };
    fetchUserAndViewsAndLayout();
  }, []);

  // Add a new window to the layout
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
    setWindows(prev => [...prev, newWindow]);
    setNextId(prev => prev + 1);
  }, [nextId]);

  // Handlers for custom views
  const handleSaveView = useCallback(async (name: string, layout: WindowData[]) => {
    if (!user) return;
    const { error } = await saveCustomView(user.id, name, layout);
    if (!error) {
      const { data: views } = await fetchCustomViews(user.id);
      if (views) setCustomViews(views);
    } else {
      alert('Failed to save view: ' + error.message);
    }
  }, [user]);

  const handleLoadView = useCallback((view: CustomView) => {
    setWindows(view.layout);
    setNextId(view.layout.reduce((max: number, w: any) => Math.max(max, w.id), 0) + 1);
    if (user) upsertUserWindowLayout(user.id, view.layout);
  }, [user]);

  const handleDeleteView = useCallback(async (id: string) => {
    if (!user) return;
    const { error } = await deleteCustomView(id, user.id);
    if (!error) {
      setCustomViews(prev => prev.filter(v => v.id !== id));
    } else {
      alert('Failed to delete view: ' + error.message);
    }
  }, [user]);

  // Persist window layout on change
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
