import { RefObject } from 'react';
import { useWindowStore } from '../stores/windowStore';
import { useSelectionBox } from './useSelectionBox';

export function useWorkspaceSelectionBox(
  setSelectedWindowIds: (ids: number[]) => void,
  workspaceRef: RefObject<HTMLDivElement | null>
) {
  const zOrder = useWindowStore(state => state.zOrder);

  return useSelectionBox<number>({
    getItems: () => zOrder,
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
        // Debug log
        console.log('Window', id, 'rect', rect, 'workspace bounds', bounds);
        return rect;
      }
      const rect = { left: win.x, top: win.y, width: win.width, height: win.height };
      console.log('Window', id, 'rect (no workspaceRef)', rect);
      return rect;
    },
    onSelect: (ids) => {
      console.log('Selected window IDs:', ids);
      setSelectedWindowIds(ids);
    },
  });
}