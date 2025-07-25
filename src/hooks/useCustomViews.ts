import { useState, useCallback  } from "react";
import { fetchCustomViews, saveCustomView, deleteCustomView } from '@/utils/supabase/client';
import type { WindowData } from '../types/window';
import { CustomView } from "@/stores/customViewsStore";

export function useCustomViews(userId: string | undefined) {
  const [customViews, setCustomViews] = useState<CustomView[]>([]);
  const loadViews = useCallback(async () => {
    if (!userId) return;
    const { data: views } = await fetchCustomViews(userId);
    if (views) setCustomViews(views);
  }, [userId]);
  const saveView = useCallback(async (name: string, layout: WindowData[]) => {
    if (!userId) return;
    const { error } = await saveCustomView(userId, name, layout);
    if (!error) loadViews();
    else alert('Failed to save view: ' + error.message);
  }, [userId, loadViews]);
  const removeView = useCallback(async (id: string) => {
    if (!userId) return;
    const { error } = await deleteCustomView(id, userId);
    if (!error) setCustomViews(prev => prev.filter(v => v.id !== id));
    else alert('Failed to delete view: ' + error.message);
  }, [userId]);

  return { customViews, loadViews, saveView, removeView, setCustomViews };
}