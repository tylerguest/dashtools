"use client";

import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import Window from './window/Window';
import { useWindowStore } from '../stores/windowStore';
import type { WindowContent, WindowData } from '../types/window';
import { workspaceClassNames } from '../styles/classNames';
import { useCallback } from 'react';

interface WorkspaceProps {
  user?: any;
  windows?: WindowData[];
  setWindows?: React.Dispatch<React.SetStateAction<WindowData[]>>;
}

export default function Workspace({ user, windows: propWindows, setWindows }: WorkspaceProps) {
  const [workspaceRef, setWorkspaceRef] = useState<HTMLDivElement | null>(null);
  const [selectedWindowIds, setSelectedWindowIds] = useState<number[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{x: number, y: number} | null>(null);
  const [selectionRect, setSelectionRect] = useState<{left: number, top: number, width: number, height: number} | null>(null);
  const zOrder = useWindowStore(state => state.zOrder);
  const windowsById = useWindowStore(state => state.windowsById);
  const addWindow = useWindowStore(state => state.addWindow);
  const updateWindow = useWindowStore(state => state.updateWindow);
  const windows = useMemo(
    () => zOrder.map(id => windowsById[id]).filter(Boolean),
    [zOrder, windowsById]
  );
  const [groupDragRects, setGroupDragRects] = useState<Record<number, { x: number, y: number, width: number, height: number }> | null>(null);
  const didInit = useRef(false);

  useLayoutEffect(() => {
    if (!didInit.current && zOrder.length === 0 && workspaceRef) {
      const rect = workspaceRef.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        didInit.current = true;
        const w = rect.width;
        const h = rect.height;
        const sidebarWidth = Math.max(300, Math.floor(w * 0.18));
        const rightWidth = Math.max(320, Math.floor(w * 0.22));
        const centerWidth = w - sidebarWidth - rightWidth;
        const topHeight = Math.floor(h * 0.55);
        const bottomHeight = h - topHeight;
        const windows = [
          { x: 0, y: 0, width: sidebarWidth, height: h, title: 'Files', content: 'files' as WindowContent, notes: '' },
          { x: sidebarWidth, y: 0, width: centerWidth, height: topHeight, title: 'Stock Chart', content: 'stockchart' as WindowContent, notes: '' },
          { x: sidebarWidth + centerWidth, y: 0, width: rightWidth, height: topHeight, title: 'Quote Monitor', content: 'quotemonitor' as WindowContent, notes: '' },
          { x: sidebarWidth, y: topHeight, width: centerWidth, height: bottomHeight, title: 'Chatbot', content: 'chatbot' as WindowContent, notes: '' },
          { x: sidebarWidth + centerWidth, y: topHeight, width: rightWidth, height: bottomHeight, title: 'Notes', content: 'notes' as WindowContent, notes: 'Welcome!' },
        ];
        windows.forEach(win => {
          addWindow(win);
        });
      }
    }
  }, [zOrder.length, addWindow, workspaceRef]);

  const getZIndex = (id: number) => {
    const idx = zOrder.indexOf(id);
    return idx === -1 ? 10 : 10 + idx;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; 
    if (e.target !== workspaceRef) {
      return;
    }
    setSelectedWindowIds([]);
    const rect = workspaceRef!.getBoundingClientRect();
    setIsSelecting(true);
    setSelectionStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setSelectionRect(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelecting) return;
    setIsSelecting(false);
    setSelectionStart(null);
    if (selectionRect && workspaceRef) {
      const rect = workspaceRef.getBoundingClientRect();
      const selected = windows.filter(win => {
        const winLeft = win.x;
        const winTop = win.y;
        const winRight = win.x + win.width;
        const winBottom = win.y + win.height;
        const selLeft = selectionRect.left;
        const selTop = selectionRect.top;
        const selRight = selectionRect.left + selectionRect.width;
        const selBottom = selectionRect.top + selectionRect.height;
        return (
          winRight > selLeft &&
          winLeft < selRight &&
          winBottom > selTop &&
          winTop < selBottom
        );
      });
      setSelectedWindowIds(selected.map(w => w.id));
    }
  };

  return (
    <div className={workspaceClassNames.container}>
      <div
        ref={setWorkspaceRef}
        className={workspaceClassNames.workspaceArea}
        style={{ minWidth: 0, position: 'relative', userSelect: isSelecting ? 'none' : undefined }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {windows.map(window => (
          <div key={window.id} style={isSelecting ? { userSelect: 'none' } : undefined}>
            <Window
              id={window.id}
              workspaceBounds={workspaceRef ? {
                width: workspaceRef.getBoundingClientRect().width,
                height: workspaceRef.getBoundingClientRect().height
              } : null}
              user={user}
              zIndex={getZIndex(window.id)}
              isSelected={selectedWindowIds.includes(window.id)}
              selectedWindowIds={selectedWindowIds}
              groupDragRects={groupDragRects}
              setGroupDragRects={setGroupDragRects}
              allWindowsCount={windows.length}
            />
          </div>
        ))}
        {isSelecting && selectionRect && (
          <div
            style={{
              position: 'absolute',
              left: selectionRect.left,
              top: selectionRect.top,
              width: selectionRect.width,
              height: selectionRect.height,
              background: 'rgba(200, 200, 200, 0.10)',
              border: '1.5px solid #aaa', 
              pointerEvents: 'none',
              zIndex: 9999
            }}
          />
        )}
      </div>
    </div>
  );
}