import { useCallback } from 'react';

interface UseGroupResizeProps {
  id: number;
  multiSelected: boolean;
  selectedWindowIds?: number[];
  setGroupDragRects?: React.Dispatch<React.SetStateAction<Record<number, { x: number, y: number, width: number, height: number }> | null>>;
  getWindowById: (id: number) => { x: number; y: number; width: number; height: number };
  updateWindow: (id: number, data: { x: number; y: number; width: number; height: number }) => void;
}

export function useGroupResize({
  id,
  multiSelected,
  selectedWindowIds,
  setGroupDragRects,
  getWindowById,
  updateWindow,
}: UseGroupResizeProps) {
  return useCallback(
    (id: number, newX: number, newY: number, newWidth: number, newHeight: number) => {
      if (multiSelected && selectedWindowIds && setGroupDragRects) {
        const base = getWindowById(id);
        const dx = newX - base.x;
        const dy = newY - base.y;
        const dWidth = newWidth - base.width;
        const dHeight = newHeight - base.height;
        const updates: { id: number; x: number; y: number; width: number; height: number }[] = selectedWindowIds.map(selId => {
          const win = getWindowById(selId);
          return {
            id: selId,
            x: win.x + dx,
            y: win.y + dy,
            width: Math.max(100, win.width + dWidth),
            height: Math.max(100, win.height + dHeight)
          };
        });
        updates.forEach(win => updateWindow(win.id, { x: win.x, y: win.y, width: win.width, height: win.height }));
        setGroupDragRects(null);
      } else {
        updateWindow(id, { x: newX, y: newY, width: newWidth, height: newHeight });
      }
    },
    [multiSelected, selectedWindowIds, setGroupDragRects, getWindowById, updateWindow]
  );
}