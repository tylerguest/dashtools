"use client";



import React, { useState, useMemo, useEffect } from 'react';
import Window from './window/Window';
import { useWindowStore } from '../stores/windowStore';
import type { WindowContent } from '../types/window';

interface WorkspaceProps { user?: any; }


export default function Workspace({ user }: WorkspaceProps) {
  const [workspaceRef, setWorkspaceRef] = useState<HTMLDivElement | null>(null);
  const zOrder = useWindowStore(state => state.zOrder);
  const windowsById = useWindowStore(state => state.windowsById);
  const addWindow = useWindowStore(state => state.addWindow);
  const windows = useMemo(
    () => zOrder.map(id => windowsById[id]).filter(Boolean),
    [zOrder, windowsById]
  );

  useEffect(() => {
    if (zOrder.length === 0 && workspaceRef) {
      const w = workspaceRef.getBoundingClientRect().width;
      const h = workspaceRef.getBoundingClientRect().height;
      const winW = Math.max(300, w / 2 - 24);
      const winH = Math.max(200, h / 2 - 24);
      const windows = [
        { x: 12, y: 12, width: winW, height: winH, title: 'Stock Chart', content: 'stockchart' as WindowContent, notes: '' },
        { x: winW + 24, y: 12, width: winW, height: winH, title: 'Quote Monitor', content: 'quotemonitor' as WindowContent, notes: '' },
        { x: 12, y: winH + 24, width: winW, height: winH, title: 'Chatbot', content: 'chatbot' as WindowContent, notes: '' },
        { x: winW + 24, y: winH + 24, width: winW, height: winH, title: 'Notes', content: 'notes' as WindowContent, notes: 'Welcome!' },
      ];
      windows.forEach(win => addWindow(win));
    }
  }, [zOrder.length, addWindow, workspaceRef]);

  const getZIndex = (id: number) => {
    const idx = zOrder.indexOf(id);
    return idx === -1 ? 10 : 10 + idx;
  };

  return (
    <div
      ref={setWorkspaceRef}
      className="workspace bg-zinc-800 flex-1 relative overflow-hidden"
    >
      {windows.map(window => (
        <Window
          key={window.id}
          id={window.id}
          workspaceBounds={workspaceRef ? {
            width: workspaceRef.getBoundingClientRect().width,
            height: workspaceRef.getBoundingClientRect().height
          } : null}
          user={user}
          zIndex={getZIndex(window.id)}
        />
      ))}
    </div>
  );
}