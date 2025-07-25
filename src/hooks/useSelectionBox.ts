import { useRef, useState, useCallback } from "react";

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
  const startPoint = useRef<{ x: number; y: number } | null>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setSelecting(true);
    const { clientX, clientY } = e;
    startPoint.current = { x: clientX, y: clientY };
    setRect({ left: clientX, top: clientY, width: 0, height: 0 });
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
    setRect({ left, top, width, height });
  }, []);

  const onMouseUp = useCallback(() => {
    setSelecting(false);
    if (rect) {
      const items = getItems();
      const selected = items.filter((item) => {
        const itemRect = getItemRect(item);
        return (
          itemRect.left < rect.left + rect.width &&
          itemRect.left + itemRect.width > rect.left &&
          itemRect.top < rect.top + rect.height &&
          itemRect.top + itemRect.height > rect.top
        );
      });
      onSelect(selected);
    }
    setRect(null);
    startPoint.current = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }, [rect, getItems, getItemRect, onSelect, onMouseMove]);

  return {
    selecting,
    rect,
    onMouseDown,
  };
}