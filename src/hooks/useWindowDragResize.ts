import { useRef, useState } from 'react';
import { clamp } from '../lib/windowUtils';

export function useWindowDragResize({ x, y, width, height, workspaceBounds, otherWindows, onResize, id,
}: { 
  x: number; y: number; width: number; height: number;
  workspaceBounds?: { width: number; height: number } | null;
  otherWindows?: Array<{ id: number; x: number; y: number; width: number; height: number }>;
  onResize: (id: number, x: number, y: number, width: number, height: number) => void;
  id: number;
}) {
  const [dragRect, setDragRect] = useState<null | { x: number; y: number; width: number; height: number }>(null);
  const dragRectRef = useRef<null | { x: number; y: number; width: number; height: number }>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    e.preventDefault();
    setDragActive(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const startWindowX = x;
    const startWindowY = y;
    const startWidth = width;
    const startHeight = height;
    document.body.style.userSelect = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      let newX = startWindowX;
      let newY = startWindowY;
      let newWidth = startWidth;
      let newHeight = startHeight;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      if (direction.includes('n')) {
        newY = clamp(startWindowY + deltaY, 0, workspaceBounds ? workspaceBounds.height : Infinity);
        newHeight = Math.max(100, startHeight - (newY - startWindowY));
      }
      if (direction.includes('s')) newHeight = Math.max(100, Math.min(startHeight + deltaY, workspaceBounds ? workspaceBounds.height - startWindowY : Infinity));
      if (direction.includes('w')) {
        newX = clamp(startWindowX + deltaX, 0, workspaceBounds ? workspaceBounds.width : Infinity);
        newWidth = Math.max(150, startWidth - (newX - startWindowX));
      }
      if (direction.includes('e')) newWidth = Math.max(150, Math.min(startWidth + deltaX, workspaceBounds ? workspaceBounds.width - startWindowX : Infinity));
      if (otherWindows && (direction.includes('e') || direction.includes('w') || direction.includes('s') || direction.includes('n'))) {
        const snapThreshold = 8;
        for (const otherWindow of otherWindows) {
          if (otherWindow.id === id) continue;
          if (direction.includes('e')) {
            const rightEdge = newX + newWidth;
            const otherLeft = otherWindow.x;
            if (Math.abs(rightEdge - otherLeft) < snapThreshold) { newWidth = otherLeft - newX; }
          }
        }
      }
      const rect = { x: newX, y: newY, width: newWidth, height: newHeight };
      setDragRect(rect);
      dragRectRef.current = rect;
    };

    const handleMouseUp = () => {
      document.body.style.userSelect = '';
      setDragActive(false);
      const rect = dragRectRef.current;
      if (rect) { setDragRect(null); dragRectRef.current = null; onResize(id, rect.x, rect.y, rect.width, rect.height); } 
      else { setDragRect(null); dragRectRef.current = null; }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return { dragRect, dragActive, handleResizeMouseDown, setDragRect, };
}
