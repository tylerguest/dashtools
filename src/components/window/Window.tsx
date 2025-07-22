"use client";

import React, { useState } from 'react';
import WindowHeader from './WindowHeader';
import WindowContent from './WindowContent';
import WindowResizer from './WindowResizer';
import { useWindowDragResize } from './useWindowDragResize';
import { WindowProps, WindowContent as WindowContentType } from '../../types/window';

const Window: React.FC<WindowProps> = ({
  id, x, y, width, height, title, content, notes, workspaceBounds, otherWindows,
  onMouseDown, onResize, onClose, onContentChange, onNotesChange
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {
    dragRect,
    handleResizeMouseDown,
  } = useWindowDragResize({
    x, y, width, height, workspaceBounds, otherWindows, onResize, id
  });

  const renderX = dragRect ? dragRect.x : x;
  const renderY = dragRect ? dragRect.y : y;
  const renderWidth = dragRect ? dragRect.width : width;
  const renderHeight = dragRect ? dragRect.height : height;

  return (
    <div
      data-window-id={id}
      className="absolute z-50 bg-zinc-800 border border-zinc-700 rounded-sm shadow-2xl flex flex-col"
      style={{ left: renderX, top: renderY, width: renderWidth, height: renderHeight }}
      onMouseDown={e => {
        const tag = (e.target as HTMLElement).tagName.toLowerCase();
        if (["input", "textarea", "select", "button"].includes(tag)) return;
        onMouseDown(e, id);
      }}
    >
      <div className="cursor-move">
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
        onContentChange={option => onContentChange && onContentChange(id, option as WindowContentType)}
        onClose={() => onClose(id)}
        />
      </div>
      <div className="flex-1 p-1 overflow-auto">
        <WindowContent 
          content={content as WindowContentType}
          notes={notes}
          onNotesChange={onNotesChange ? (notesVal => onNotesChange(id, notesVal)) : undefined}
        />
      </div>
      <WindowResizer onResizeMouseDown={handleResizeMouseDown} />
    </div>
  );
};

export default Window;
