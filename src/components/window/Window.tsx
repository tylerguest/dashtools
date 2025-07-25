"use client";

import React, { useState } from 'react';
import WindowHeaderBar from './WindowHeaderBar';
import WindowBody from './WindowBody';
import WindowResizer from './WindowResizer';
import { windowClassNames } from '../../styles/classNames';
import { useWindowDragResize } from '../../hooks/useWindowDragResize';
import { useWindowDragGroup } from '../../hooks/useWindowDragGroup';
import { getWindowTitle } from '../../utils/getWindowTitle';
import { useWindowSelectors } from '../../hooks/useWindowSelectors';
import { useWindowStore } from '../../stores/windowStore';
import { useWindowDrag } from '../../hooks/useWindowDrag';
import { useGroupResize } from '../../hooks/useGroupResize';
import { useRenderRect } from '../../hooks/useRenderRect';

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
  const windowData = useWindowStore((state: any) => state.windowsById[id]);
  const updateWindow = useWindowStore((state: any) => state.updateWindow);
  const removeWindow = useWindowStore((state: any) => state.removeWindow);
  const bringToFront = useWindowStore((state: any) => state.bringToFront);

  const { getWindowById, getAllWindows } = useWindowSelectors(id);

  if (!windowData) return null;
  const { x, y, width, height, title, content, notes } = windowData;
  const multiSelected = !!(selectedWindowIds && selectedWindowIds.length > 1);

  const handleGroupResize = useGroupResize({
    id,
    multiSelected,
    selectedWindowIds,
    setGroupDragRects,
    getWindowById,
    updateWindow,
  });

  const { dragRect, handleResizeMouseDown, setDragRect } = useWindowDragResize({
    x, y, width, height, workspaceBounds,
    otherWindows: getAllWindows(),
    onResize: handleGroupResize,
    id
  });

  const { renderX, renderY, renderWidth, renderHeight } = useRenderRect({
    multiSelected,
    groupDragRects,
    dragRect,
    x,
    y,
    width,
    height,
    id,
  });

  const handleDragMouseDown = useWindowDrag({
    id,
    isSelected: !!isSelected,
    selectedWindowIds,
    getWindowById,
    bringToFront,
    updateWindow,
    workspaceBounds,
  });

  const selectedStyle = isSelected ? { boxShadow: '0 0 0 2px #aaa' } : {};

  useWindowDragGroup({
    id,
    multiSelected,
    dragRect,
    setGroupDragRects,
    selectedWindowIds,
  });

  return (
    <div
      data-window-id={id}
      className={windowClassNames.window}
      style={{
        left: renderX,
        top: renderY,
        width: renderWidth,
        height: renderHeight,
        zIndex: zIndex || 10,
        willChange: 'transform',
        ...selectedStyle,
      }}
    >
      <WindowHeaderBar
        id={id}
        content={content}
        title={getWindowTitle(content, title)}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        updateWindow={updateWindow}
        removeWindow={removeWindow}
      />
      <WindowBody
        content={content}
        notes={notes}
        updateNotes={(notesVal: string) => updateWindow(id, { notes: notesVal })}
        user={user}
      />
      <WindowResizer onResizeMouseDown={handleResizeMouseDown} />
    </div>
  );
};

export default React.memo(Window);