"use client";

import React, { useState } from 'react';
import { WindowContent as WindowContentType } from '../../types/window';
import WindowHeader from './WindowHeader';
import WindowContent from './WindowContent';
import WindowResizer from './WindowResizer';
import { windowClassNames } from '../../styles/classNames';
import { useWindowDragResize } from './useWindowDragResize';
import { useEffect } from 'react';

interface WindowProps {
  id: number;
  workspaceBounds?: { width: number; height: number } | null;
  user?: any;
  zIndex?: number;
  isSelected?: boolean;
  selectedWindowIds?: number[];
  groupDragRects?: Record<number, { x: number, y: number, width: number, height: number }> | null;
  setGroupDragRects?: React.Dispatch<React.SetStateAction<Record<number, { x: number, y: number, width: number, height: number }> | null>>;
  allWindowsCount?: number;
}

import { useWindowStore } from '../../stores/windowStore';
const Window: React.FC<WindowProps> = ({
  id,
  workspaceBounds,
  user,
  zIndex,
  isSelected,
  selectedWindowIds,
  groupDragRects,
  setGroupDragRects,
  allWindowsCount
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const windowData = useWindowStore((state: any) => state.getWindow(id));
  const updateWindow = useWindowStore((state: any) => state.updateWindow);
  const updateWindows = useWindowStore((state: any) => state.updateWindows);
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
  const multiSelected = selectedWindowIds && selectedWindowIds.length > 1;
  const handleGroupResize = (id: number, newX: number, newY: number, newWidth: number, newHeight: number) => {
    if (multiSelected && selectedWindowIds && setGroupDragRects) {
      const base = windowsById[id];
      const dx = newX - base.x;
      const dy = newY - base.y;
      const dWidth = newWidth - base.width;
      const dHeight = newHeight - base.height;
      const updates: { id: number; x: number; y: number; width: number; height: number }[] = selectedWindowIds.map(selId => {
        const win = windowsById[selId];
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
  };

  const { dragRect, handleResizeMouseDown, setDragRect } = useWindowDragResize({
    x, y, width, height, workspaceBounds,
    otherWindows: allWindows,
    onResize: handleGroupResize,
    id
  });

  useEffect(() => {
    if (multiSelected && dragRect && setGroupDragRects && selectedWindowIds) {
      const base = windowsById[id];
      const dx = dragRect.x - base.x;
      const dy = dragRect.y - base.y;
      const dWidth = dragRect.width - base.width;
      const dHeight = dragRect.height - base.height;
      const rects: Record<number, { x: number, y: number, width: number, height: number }> = {};
      selectedWindowIds.forEach(selId => {
        const win = windowsById[selId];
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
  }, [multiSelected, dragRect, id, selectedWindowIds, windowsById, setGroupDragRects]);

  const renderRect = multiSelected && groupDragRects && groupDragRects[id] ? groupDragRects[id] : dragRect;
  const renderX = renderRect ? renderRect.x : x;
  const renderY = renderRect ? renderRect.y : y;
  const renderWidth = renderRect ? renderRect.width : width;
  const renderHeight = renderRect ? renderRect.height : height;
  const selectedStyle = isSelected ? { boxShadow: '0 0 0 2px #aaa' } : {};
  const handleDragMouseDown = (e: React.MouseEvent) => {
    const tag = (e.target as HTMLElement).tagName.toLowerCase();
    if (["input", "textarea", "select", "button"].includes(tag)) return;
    bringToFront(id);
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const selectedIds = isSelected && selectedWindowIds && selectedWindowIds.length > 1 ? selectedWindowIds : [id];
    const initialPositions = selectedIds.map(selId => {
      const win = windowsById[selId];
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
  };

  return (
    <div
      data-window-id={id}
      className={windowClassNames.window}
      style={{ left: renderX, top: renderY, width: renderWidth, height: renderHeight, zIndex: zIndex || 10, willChange: 'transform', ...selectedStyle }}
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
          onContentChange={(option: string) => {
            if (option === 'files') {
              updateWindow(id, { content: option as WindowContentType, title: 'Files' });
            } else if (option === 'stockchart') {
              updateWindow(id, { content: option as WindowContentType, title: 'Stock Chart' });
            } else if (option === 'quotemonitor') {
              updateWindow(id, { content: option as WindowContentType, title: 'Quote Monitor' });
            } else if (option === 'chatbot') {
              updateWindow(id, { content: option as WindowContentType, title: 'Chatbot' });
            } else if (option === 'notes') {
              updateWindow(id, { content: option as WindowContentType, title: 'Notes' });
            } else {
              updateWindow(id, { content: option as WindowContentType });
            }
          }}
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
