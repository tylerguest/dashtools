import { useState, useRef, useEffect, useCallback } from 'react';
import { getWindowLayout } from '@/lib/windowUtils';
import { fetchUserWindowLayout, upsertUserWindowLayout } from '@/utils/supabase/client';
import type { WindowData } from '../types/window';

type UseWindowLayoutOptions = {
  userId?: string;
  hydrated: boolean;
  setNextId?: (id: number) => void;
};

export function useWindowLayout({ userId, hydrated, setNextId }: UseWindowLayoutOptions) {
  const [windows, setWindows] = useState<WindowData[]>(() => getWindowLayout());
  const windowsRef = useRef<WindowData[]>([]);
  const baseLayoutRef = useRef<WindowData[] | null>(null);
  const baseSizeRef = useRef<{ width: number; height: number } | null>(null);
  const resizingRef = useRef(false);

  useEffect(() => { windowsRef.current = windows; }, [windows]);

  useEffect(() => {
    if (!hydrated) return;
    if (typeof window === 'undefined') return;

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
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || !userId) return;
    const fetchLayout = async () => {
      const { data: layoutRow } = await fetchUserWindowLayout(userId);
      let layoutData = layoutRow?.layout;
      if (typeof layoutData === 'string') {
        try { layoutData = JSON.parse(layoutData); } catch { layoutData = []; }
      }
      if (Array.isArray(layoutData) && layoutData.length > 0) {
        setWindows(layoutData);
        if (setNextId) {
          setNextId(layoutData.reduce((max: number, w: any) => Math.max(max, w.id), 0) + 1);
        }
      } else {
        const defaultLayout = getWindowLayout(window.innerWidth, window.innerHeight);
        setWindows(defaultLayout);
        if (setNextId) {
          setNextId(defaultLayout.reduce((max: number, w: any) => Math.max(max, w.id), 0) + 1);
        }
        await upsertUserWindowLayout(userId, defaultLayout);
      }
    };
    fetchLayout();
  }, [hydrated, userId]);

  useEffect(() => {
    if (!userId) return;
    const timeout = setTimeout(() => {
      upsertUserWindowLayout(userId, windows)
        .catch(err => console.error('[useWindowLayout] upsertUserWindowLayout error:', err));
    }, 600);
    return () => clearTimeout(timeout);
  }, [windows, userId]);

  const setWindowsAndBase = useCallback(
    (updater: React.SetStateAction<WindowData[]>) => {
      setWindows(prev => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        baseLayoutRef.current = next.map((w: WindowData) => ({ ...w }));
        if (typeof window !== 'undefined') {
          baseSizeRef.current = { width: window.innerWidth, height: window.innerHeight };
        }
        return next;
      });
    },
    []
  );

  return { windows, setWindows: setWindowsAndBase };
}