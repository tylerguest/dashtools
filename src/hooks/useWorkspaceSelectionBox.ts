import { RefObject } from 'react';
import { useWindowStore } from '../stores/windowStore';
import { useSelectionBox } from './useSelectionBox';

export function useWorkspaceSelectionBox(
  setSelectedWindowIds: (ids: number[]) => void,
  workspaceRef: RefObject<HTMLDivElement | null>
) {
  return useSelectionBox<number>({
    getItems: () => {
      const state = useWindowStore.getState();
      console.log('[SelectionBox] useWindowStore.getState():', state);
      return state.zOrder;
    },
    getItemRect: (id) => {
      const win = useWindowStore.getState().windowsById[id];
      if (!win) return { left: 0, top: 0, width: 0, height: 0 };
      if (workspaceRef && workspaceRef.current) {
        const bounds = workspaceRef.current.getBoundingClientRect();
        const rect = {
          left: win.x + bounds.left,
          top: win.y + bounds.top,
          width: win.width,
          height: win.height,
        };
        console.log('[SelectionBox] Window', id, 'rect', rect, 'workspace bounds', bounds);
        return rect;
      }
      const rect = { left: win.x, top: win.y, width: win.width, height: win.height };
      console.log('[SelectionBox] Window', id, 'rect (no workspaceRef)', rect);
      return rect;
    },
    onSelect: (ids) => {
      if (typeof window !== 'undefined' && window.__selectionBoxRect) {
        console.log('[SelectionBox] Final selection rect:', window.__selectionBoxRect);
      }
      console.log('[SelectionBox] Selected window IDs:', ids);
      setSelectedWindowIds(ids);
    },
  });
}