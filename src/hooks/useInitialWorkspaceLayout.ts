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
        const GAP = 16;
        const w = rect.width - GAP * 2;
        const h = rect.height - GAP * 2;
        const sidebarWidth = Math.max(300, Math.floor(w * 0.18));
        const rightWidth = Math.max(320, Math.floor(w * 0.22));
        const centerWidth = w - sidebarWidth - rightWidth - GAP * 2;
        const topHeight = Math.floor(h * 0.55) - GAP / 2;
        const bottomHeight = h - topHeight - GAP;
        const windows = [
          { x: GAP, y: GAP, width: sidebarWidth, height: h, title: 'Files', content: 'files' as WindowContent, notes: '' },
          { x: GAP + sidebarWidth + GAP, y: GAP, width: centerWidth, height: topHeight, title: 'Calendar', content: 'calendar' as WindowContent, notes: '' },
          { x: GAP + sidebarWidth + GAP + centerWidth + GAP, y: GAP, width: rightWidth, height: topHeight, title: 'Quote Monitor', content: 'quotemonitor' as WindowContent, notes: '' },
          { x: GAP + sidebarWidth + GAP, y: GAP + topHeight + GAP, width: centerWidth, height: bottomHeight, title: 'Chatbot', content: 'chatbot' as WindowContent, notes: '' },
          { x: GAP + sidebarWidth + GAP + centerWidth + GAP, y: GAP + topHeight + GAP, width: rightWidth, height: bottomHeight, title: 'Notes', content: 'notes' as WindowContent, notes: 'Welcome!' },
        ];
        windows.forEach(win => {
          addWindow(win);
        });
      }
    }
  }, [zOrder.length, addWindow, workspaceRef]);
}