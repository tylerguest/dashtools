"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../components/Header';
import Workspace from '../components/Workspace';
import CustomViewsMenu from '../components/CustomViewsMenu';
import { createClient, saveCustomView, fetchCustomViews, deleteCustomView, fetchUserWindowLayout, upsertUserWindowLayout,
} from '@/utils/supabase/client';
import type { WindowData } from '../types/window';
import { getWindowLayout } from '@/lib/windowUtils';

type CustomView = { id: string; name: string; layout: WindowData[]; };

const DEFAULT_WINDOW_COUNT = 4;

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [customViews, setCustomViews] = useState<CustomView[]>([]);
  const [windows, setWindows] = useState<WindowData[]>(() => getWindowLayout());
  const windowsRef = useRef<WindowData[]>([]);
  const baseLayoutRef = useRef<WindowData[] | null>(null);
  const baseSizeRef = useRef<{ width: number; height: number } | null>(null);
  const resizingRef = useRef(false);
  const [nextId, setNextId] = useState<number>(5);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { windowsRef.current = windows; }, [windows]);

  useEffect(() => {
    setHydrated(true);
    if (typeof window !== 'undefined') {
      const baseLayout = getWindowLayout(window.innerWidth, window.innerHeight);
      setWindows(baseLayout);
      baseLayoutRef.current = baseLayout;
      baseSizeRef.current = { width: window.innerWidth, height: window.innerHeight };

      let resizeTimeout: NodeJS.Timeout | null = null;
      const handleResize = () => {
        if (!baseLayoutRef.current || !baseSizeRef.current) return;
        resizingRef.current = true;
        if (resizeTimeout) clearTimeout(resizeTimeout);
        const { width: baseWidth, height: baseHeight } = baseSizeRef.current;
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        const scaleX = newWidth / baseWidth;
        const scaleY = newHeight / baseHeight;
        const newLayout = baseLayoutRef.current.map(w => ({
          ...w,
          x: Math.round(w.x * scaleX),
          y: Math.round(w.y * scaleY),
          width: Math.round(w.width * scaleX),
          height: Math.round(w.height * scaleY),
        }));
        setWindows(newLayout);
        resizeTimeout = setTimeout(() => {
          baseLayoutRef.current = windowsRef.current.map(w => ({ ...w }));
          baseSizeRef.current = { width: window.innerWidth, height: window.innerHeight };
          resizingRef.current = false;
        }, 300);
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        if (resizeTimeout) clearTimeout(resizeTimeout);
      };
    }
  }, []);

  const setWindowsAndBase = useCallback(
    (updater: React.SetStateAction<WindowData[]>) => {
      setWindows(prev => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        baseLayoutRef.current = next.map((w: WindowData) => ({ ...w }));
        if (typeof window !== 'undefined') { baseSizeRef.current = { width: window.innerWidth, height: window.innerHeight }; }
        return next;
      });
    },
    []
  );

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
          setWindowsAndBase(layoutData);
          setNextId(layoutData.reduce((max: number, w: any) => Math.max(max, w.id), 0) + 1);
        } else {
          const defaultLayout = getWindowLayout(window.innerWidth, window.innerHeight);
          setWindowsAndBase(defaultLayout);
          setNextId(defaultLayout.reduce((max: number, w: any) => Math.max(max, w.id), 0) + 1);
          await upsertUserWindowLayout(user.id, defaultLayout);
        }
      } else { setWindowsAndBase(getWindowLayout(window.innerWidth, window.innerHeight)); }
    };
    fetchUserAndViewsAndLayout();
  }, []);

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
      id: nextId, x, y,
      width: windowWidth,
      height: availableHeight,
      title: `Window${nextId}`,
      content: 'quotemonitor',
      notes: ''
    };
    setWindowsAndBase((prev: WindowData[]) => [...prev, newWindow]);
    setNextId(prev => prev + 1);
  }, [nextId, setWindowsAndBase]);

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
    setWindowsAndBase(view.layout);
    setNextId(view.layout.reduce((max: number, w: any) => Math.max(max, w.id), 0) + 1);
    if (user) upsertUserWindowLayout(user.id, view.layout);
  }, [user, setWindowsAndBase]);

  const handleDeleteView = useCallback(async (id: string) => {
    if (!user) return;
    const { error } = await deleteCustomView(id, user.id);
    if (!error) {
      setCustomViews(prev => prev.filter(v => v.id !== id));
    } else {
      alert('Failed to delete view: ' + error.message);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const timeout = setTimeout(() => {
      upsertUserWindowLayout(user.id, windows)
        .catch(err => console.error('[App] upsertUserWindowLayout error:', err));
    }, 600);
    return () => clearTimeout(timeout);
  }, [windows, user]);

  if (!hydrated) return null;
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
          setWindows={setWindowsAndBase}
          user={user}
        />
      </main>
    </div>
  );
}
