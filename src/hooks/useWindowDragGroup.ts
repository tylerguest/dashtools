import { useEffect } from 'react';
import { useWindowStore } from '../stores/windowStore';

export function useWindowDragGroup({
  id,
  multiSelected,
  dragRect,
  setGroupDragRects,
  selectedWindowIds,
}: {
  id: number;
  multiSelected: boolean;
  dragRect: any;
  setGroupDragRects?: React.Dispatch<React.SetStateAction<Record<number, { x: number, y: number, width: number, height: number }> | null>>;
  selectedWindowIds?: number[];
}) {
  const getWindowById = (winId: number) => useWindowStore.getState().windowsById[winId];

  useEffect(() => {
    if (multiSelected && dragRect && setGroupDragRects && selectedWindowIds) {
      const base = getWindowById(id);
      const dx = dragRect.x - base.x;
      const dy = dragRect.y - base.y;
      const dWidth = dragRect.width - base.width;
      const dHeight = dragRect.height - base.height;
      const rects: Record<number, { x: number, y: number, width: number, height: number }> = {};
      selectedWindowIds.forEach(selId => {
        const win = getWindowById(selId);
        rects[selId] = {
          x: win.x + dx,
          y: win.y + dy,
          width: Math.max(100, win.width + dWidth),
          height: Math.max(100, win.height + dHeight)
        };
      });
      setGroupDragRects(rects);
    } else if (!dragRect && setGroupDragRects) {
      setGroupDragRects(null);
    }
  }, [multiSelected, dragRect, id, selectedWindowIds, setGroupDragRects]);
}