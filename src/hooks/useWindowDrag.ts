import { useCallback } from 'react';

interface UseWindowDragProps {
  id: number;
  isSelected: boolean;
  selectedWindowIds?: number[];
  getWindowById: (id: number) => any;
  bringToFront: (id: number) => void;
  updateWindow: (id: number, pos: { x: number; y: number }) => void;
  workspaceBounds?: { width: number; height: number } | null;
}

export function useWindowDrag({
  id,
  isSelected,
  selectedWindowIds,
  getWindowById,
  bringToFront,
  updateWindow,
  workspaceBounds,
}: UseWindowDragProps) {
  return useCallback(
    (e: React.MouseEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      if (["input", "textarea", "select", "button"].includes(tag)) return;
      bringToFront(id);
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const selectedIds = isSelected && selectedWindowIds && selectedWindowIds.length > 1 ? selectedWindowIds : [id];
      const initialPositions = selectedIds.map(selId => {
        const win = getWindowById(selId);
        return { id: selId, x: win.x, y: win.y, width: win.width, height: win.height };
      });
      document.body.style.userSelect = 'none';
      const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const updates: Record<number, { x: number; y: number }> = {};
        initialPositions.forEach(win => {
          let newX = win.x + deltaX;
          let newY = win.y + deltaY;
          if (workspaceBounds) {
            const maxX = workspaceBounds.width - win.width;
            const maxY = workspaceBounds.height - win.height;
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));
          }
          updates[win.id] = { x: newX, y: newY };
        });
        Object.entries(updates).forEach(([id, pos]) => updateWindow(Number(id), pos));
      };
      const handleMouseUp = () => {
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [id, isSelected, selectedWindowIds, getWindowById, bringToFront, updateWindow, workspaceBounds]
  );
}