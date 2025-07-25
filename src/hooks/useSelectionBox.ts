import { useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    __selectionBoxRect?: { left: number; top: number; width: number; height: number };
  }
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface UseSelectionBoxProps<T> {
  getItems: () => T[];
  getItemRect: (item: T) => Rect;
  onSelect: (selected: T[]) => void;
}

export function useSelectionBox<T>({
  getItems,
  getItemRect,
  onSelect,
}: UseSelectionBoxProps<T>) {
  const [selecting, setSelecting] = useState(false);
  const [rect, setRect] = useState<Rect | null>(null);
  const rectRef = useRef<Rect | null>(null);
  const startPoint = useRef<{ x: number; y: number } | null>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setSelecting(true);
    const { clientX, clientY } = e;
    startPoint.current = { x: clientX, y: clientY };
    const initialRect = { left: clientX, top: clientY, width: 0, height: 0 };
    setRect(initialRect);
    rectRef.current = initialRect;
    if (typeof window !== 'undefined') {
      window.__selectionBoxRect = initialRect;
    }
    console.log('[SelectionBox] MouseDown at', clientX, clientY);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!startPoint.current) return;
    const { x, y } = startPoint.current;
    const left = Math.min(x, e.clientX);
    const top = Math.min(y, e.clientY);
    const width = Math.abs(e.clientX - x);
    const height = Math.abs(e.clientY - y);
    const newRect = { left, top, width, height };
    setRect(newRect);
    rectRef.current = newRect;
    if (typeof window !== 'undefined') {
      window.__selectionBoxRect = newRect;
    }
  }, []);

  const onMouseUp = useCallback(() => {
    const currentRect = rectRef.current;
    console.log('[SelectionBox] onMouseUp fired. rect is:', currentRect);
    setSelecting(false);
    if (currentRect) {
      if (typeof window !== 'undefined') {
        window.__selectionBoxRect = currentRect;
      }
      const items = getItems();
      console.log('[SelectionBox] MouseUp rect', currentRect);
      console.log('[SelectionBox] getItems() returned:', items);
      const selected = items.filter((item) => {
        console.log('[SelectionBox] Filtering item:', item);
        const itemRect = getItemRect(item);
        console.log('[SelectionBox] Checking item', item, 'rect', itemRect, 'against selection rect', currentRect);
        const overlap = (
          itemRect.left < currentRect.left + currentRect.width &&
          itemRect.left + itemRect.width > currentRect.left &&
          itemRect.top < currentRect.top + currentRect.height &&
          itemRect.top + itemRect.height > currentRect.top
        );
        console.log('[SelectionBox] Overlap:', overlap);
        return overlap;
      });
      console.log('[SelectionBox] Selected items:', selected);
      onSelect(selected);
    }
    setRect(null);
    rectRef.current = null;
    startPoint.current = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }, [getItems, getItemRect, onSelect, onMouseMove]);

  return {
    selecting,
    rect,
    onMouseDown,
  };
}