import { useLayoutEffect, useRef } from 'react';
import type { WindowContent } from '../types/window';

export function useInitialWorkspaceLayout({
  zOrder,
  addWindow,
  workspaceRef,
}: {
  zOrder: number[];
  addWindow: (win: any) => void;
  workspaceRef: HTMLDivElement | null;
}) {
 
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
          { x: sidebarWidth, y: 0, width: centerWidth, height: topHeight, title: 'Calendar', content: 'calendar' as WindowContent, notes: '' },
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
}