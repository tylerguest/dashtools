"use client";

import React, { useState, useRef, useLayoutEffect } from 'react';
import { useWindowStore } from '../../stores/windowStore';
import type { WindowContent, WindowData } from '../../types/window';
import { workspaceClassNames } from '../../styles/classNames';
import { useInitialWorkspaceLayout } from '../../hooks/useInitialWorkspaceLayout';
import { useZIndex } from '../../hooks/useZIndex';
import { useWorkspaceSelectionBox } from '../../hooks/useWorkspaceSelectionBox';
import { WorkspaceWindows } from './WorkspaceWindows';
import { SelectionRectangle } from './SelectionRectangle';

interface WorkspaceProps {
  user?: any;
  windows?: WindowData[];
  setWindows?: React.Dispatch<React.SetStateAction<WindowData[]>>;
}

export default function Workspace({ user }: WorkspaceProps) {
  const [workspaceRef, setWorkspaceRef] = useState<HTMLDivElement | null>(null);
  const [selectedWindowIds, setSelectedWindowIds] = useState<number[]>([]);
  const zOrder = useWindowStore(state => state.zOrder);
  const addWindow = useWindowStore(state => state.addWindow);
  const [groupDragRects, setGroupDragRects] = useState<Record<number, { x: number, y: number, width: number, height: number }> | null>(null);
  const didInit = useRef(false);
  const getZIndex = useZIndex(zOrder);
  const { selecting, rect, onMouseDown } = useWorkspaceSelectionBox(setSelectedWindowIds);
  useInitialWorkspaceLayout({ zOrder, addWindow, workspaceRef });
  return (
    <div className={workspaceClassNames.container}>
      <div
        ref={setWorkspaceRef}
        className={workspaceClassNames.workspaceArea}
        style={{ minWidth: 0, position: 'relative', userSelect: selecting ? 'none' : undefined }}
        onMouseDown={e => {
          if (e.target === e.currentTarget) {
            onMouseDown(e);
          }
        }}
      >
        <WorkspaceWindows
          zOrder={zOrder}
          workspaceRef={workspaceRef}
          user={user}
          getZIndex={getZIndex}
          selectedWindowIds={selectedWindowIds}
          groupDragRects={groupDragRects}
          setGroupDragRects={setGroupDragRects}
        />
        {selecting && rect && (
          <SelectionRectangle selectionRect={rect} />
        )}
      </div>
    </div>
  );
}