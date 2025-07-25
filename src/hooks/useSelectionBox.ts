import { useState } from 'react';

export interface SelectionRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface UseSelectionBoxProps<T> {
  getItems: () => T[];
  getItemRect: (item: T) => SelectionRect;
  onSelect: (selected: T[]) => void;
}

export function useSelectionBox<T = any>({
  getItems,
  getItemRect,
  onSelect,
}: UseSelectionBoxProps<T>) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    workspaceRef: HTMLDivElement | null
  ) => {
    if (e.button !== 0 || e.target !== workspaceRef) return;
    if (!workspaceRef) return;
    const rect = workspaceRef.getBoundingClientRect();
    setIsSelecting(true);
    setSelectionStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setSelectionRect(null);
    onSelect([]); 
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    workspaceRef: HTMLDivElement | null
  ) => {
    if (!isSelecting || !selectionStart || !workspaceRef) return;
    const rect = workspaceRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const left = Math.min(selectionStart.x, x);
    const top = Math.min(selectionStart.y, y);
    const width = Math.abs(selectionStart.x - x);
    const height = Math.abs(selectionStart.y - y);
    setSelectionRect({ left, top, width, height });
  };

  const handleMouseUp = (workspaceRef: HTMLDivElement | null) => {
    if (!isSelecting || !selectionRect || !workspaceRef) {
      setIsSelecting(false);
      setSelectionStart(null);
      setSelectionRect(null);
      return;
    }
    const selected = getItems().filter(item => {
      const win = getItemRect(item);
      const sel = selectionRect;
      return (
        win.left + win.width > sel.left &&
        win.left < sel.left + sel.width &&
        win.top + win.height > sel.top &&
        win.top < sel.top + sel.height
      );
    });
    onSelect(selected);
    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionRect(null);
  };

  return {
    isSelecting,
    selectionRect,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}