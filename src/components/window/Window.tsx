"use client";

import React, { useState } from 'react';
import { useWindowStore } from '../../stores/windowStore';
import { WindowContent as WindowContentType } from '../../types/window';
import WindowHeader from './WindowHeader';
import WindowContent from './WindowContent';
import WindowResizer from './WindowResizer';
import { windowClassNames } from '../../styles/classNames';
import { useWindowDragResize } from './useWindowDragResize';

interface WindowProps {
  id: number;
  workspaceBounds?: { width: number; height: number } | null;
  user?: any;
  zIndex?: number;
}

const Window: React.FC<WindowProps> = ({ id, workspaceBounds, user, zIndex }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const windowData = useWindowStore((state: any) => state.getWindow(id));
  const updateWindow = useWindowStore((state: any) => state.updateWindow);
  const removeWindow = useWindowStore((state: any) => state.removeWindow);
  const bringToFront = useWindowStore((state: any) => state.bringToFront);
  const zOrder = useWindowStore((state: any) => state.zOrder);
  const windowsById = useWindowStore((state: any) => state.windowsById);
  const allWindows = React.useMemo(
    () => zOrder.map((id: number) => windowsById[id]).filter(Boolean),
    [zOrder, windowsById]
  );

  if (!windowData) return null;
  const { x, y, width, height, title, content, notes } = windowData;

  const { dragRect, handleResizeMouseDown } = useWindowDragResize({
    x, y, width, height, workspaceBounds,
    otherWindows: allWindows,
    onResize: (id: number, x: number, y: number, width: number, height: number) => updateWindow(id, { x, y, width, height }),
    id
  });
  const renderX = dragRect ? dragRect.x : x;
  const renderY = dragRect ? dragRect.y : y;
  const renderWidth = dragRect ? dragRect.width : width;
  const renderHeight = dragRect ? dragRect.height : height;

  const handleDragMouseDown = (e: React.MouseEvent) => {
    const tag = (e.target as HTMLElement).tagName.toLowerCase();
    if (["input", "textarea", "select", "button"].includes(tag)) return;
    bringToFront(id);
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWindowX = x;
    const startWindowY = y;
    document.body.style.userSelect = 'none';
    let newX = startWindowX;
    let newY = startWindowY;
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      newX = startWindowX + deltaX;
      newY = startWindowY + deltaY;
      if (workspaceBounds) {
        const maxX = workspaceBounds.width - width;
        const maxY = workspaceBounds.height - height;
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
      }
      updateWindow(id, { x: newX, y: newY });
    };
    const handleMouseUp = () => {
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      data-window-id={id}
      className={windowClassNames.window}
      style={{ left: renderX, top: renderY, width: renderWidth, height: renderHeight, zIndex: zIndex || 10, willChange: 'transform', }}
    >
      <div className={windowClassNames.header} onMouseDown={handleDragMouseDown}>
        <WindowHeader
          title={
            content === 'stockchart' ? 'Stock Chart'
            : content === 'quotemonitor' ? 'Quote Monitor'
            : content === 'chatbot' ? 'Chatbot'
            : content === 'notes' ? 'Notes'
            : title
          }
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          onContentChange={(option: string) => updateWindow(id, { content: option as WindowContentType })}
          onClose={() => removeWindow(id)}
        />
      </div>
      <div className={windowClassNames.content}>
        <WindowContent
          content={content as WindowContentType}
          notes={notes}
          onNotesChange={(notesVal: string) => updateWindow(id, { notes: notesVal })}
          user={user}
        />
      </div>
      <WindowResizer onResizeMouseDown={handleResizeMouseDown} />
    </div>
  );
};

export default Window;
