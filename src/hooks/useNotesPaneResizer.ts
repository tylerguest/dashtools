import { useState, useCallback } from "react";

export function useNotesPaneResizer(initialWidth: number, minWidth: number, maxWidth: number) {
  const [notesPaneWidth, setNotesPaneWidth] = useState(initialWidth);

  const handleResizerMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = notesPaneWidth;
    const originalUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      let newWidth = startWidth + delta;
      if (newWidth < minWidth) newWidth = minWidth;
      if (newWidth > maxWidth) newWidth = maxWidth;
      setNotesPaneWidth(newWidth);
    };
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.userSelect = originalUserSelect;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [notesPaneWidth, minWidth, maxWidth]);

  return { notesPaneWidth, handleResizerMouseDown, setNotesPaneWidth };
}
