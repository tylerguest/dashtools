import { useWindowStore } from '../stores/windowStore';
import { useSelectionBox } from './useSelectionBox';

export function useWorkspaceSelectionBox(setSelectedWindowIds: (ids: number[]) => void) {
  const zOrder = useWindowStore(state => state.zOrder);

  return useSelectionBox<number>({
    getItems: () => zOrder,
    getItemRect: (id) => {
      const win = useWindowStore.getState().windowsById[id];
      return win
        ? { left: win.x, top: win.y, width: win.width, height: win.height }
        : { left: 0, top: 0, width: 0, height: 0 };
    },
    onSelect: setSelectedWindowIds,
  });
}