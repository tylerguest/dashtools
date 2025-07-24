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
  const zOrder = useWindowStore(state => state.zOrder);
  const windowsById = useWindowStore(state => state.windowsById);
  const addWindow = useWindowStore(state => state.addWindow);
  const updateWindow = useWindowStore(state => state.updateWindow);


  const windows = useMemo(
    () => zOrder.map(id => windowsById[id]).filter(Boolean),
    [zOrder, windowsById]
  );

  const didInit = useRef(false);
  useLayoutEffect(() => {
    if (!didInit.current && zOrder.length === 0 && workspaceRef) {
      const rect = workspaceRef.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        didInit.current = true;
        let w = rect.width, h = rect.height;
        const winW = Math.max(300, w / 2 - 24);
        const winH = Math.max(200, h / 2 - 24);
        const windows = [
          { x: 12, y: 12, width: winW, height: winH, title: 'Stock Chart', content: 'stockchart' as WindowContent, notes: '' },
          { x: winW + 24, y: 12, width: winW, height: winH, title: 'Quote Monitor', content: 'quotemonitor' as WindowContent, notes: '' },
          { x: 12, y: winH + 24, width: winW, height: winH, title: 'Chatbot', content: 'chatbot' as WindowContent, notes: '' },
          { x: winW + 24, y: winH + 24, width: winW, height: winH, title: 'Notes', content: 'notes' as WindowContent, notes: 'Welcome!' },
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

  return (
    <div className={workspaceClassNames.container}>
      <div
        ref={setWorkspaceRef}
        className={workspaceClassNames.workspaceArea}
        style={{ minWidth: 0 }}
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
    </div>
  );
}