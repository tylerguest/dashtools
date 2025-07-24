import React, { useState } from 'react';
import WindowHeader from './window/WindowHeader';
import WindowContent from './window/WindowContent';
import WindowResizer from './window/WindowResizer';
import { useWindowDragResize } from './window/useWindowDragResize';
import { windowClassNames } from '../styles/classNames';

interface WindowProps {
  id: number; x: number; y: number; width: number; height: number; title: string;
  content?: 'stockchart' | 'quotemonitor' | 'chatbot' | 'notes' | 'files' | null;
  notes?: string; workspaceBounds?: { width: number; height: number } | null;
  otherWindows?: Array<{ id: number; x: number; y: number; width: number; height: number }>;
  onMouseDown: (e: React.MouseEvent, id: number) => void;
  onResize: (id: number, x: number, y: number, width: number, height: number) => void;
  onClose: (id: number) => void;
  onContentChange?: (id: number, content: 'stockchart' | 'quotemonitor' | 'chatbot' | 'notes' | 'files') => void;
  onNotesChange?: (id: number, notes: string) => void;
}

export default function Window({
  id, x, y, width, height, title, content, notes, workspaceBounds, otherWindows,
  onMouseDown, onResize, onClose, onContentChange, onNotesChange
}: WindowProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { dragRect, handleResizeMouseDown, } = useWindowDragResize({ x, y, width, height, workspaceBounds, otherWindows, onResize, id });
  const renderX = dragRect ? dragRect.x : x;
  const renderY = dragRect ? dragRect.y : y;
  const renderWidth = dragRect ? dragRect.width : width;
  const renderHeight = dragRect ? dragRect.height : height;

  return (
    <div
      data-window-id={id}
      className={windowClassNames.window}
      style={{ left: renderX, top: renderY, width: renderWidth, height: renderHeight }}
      onMouseDown={e => onMouseDown(e, id)}
    >
      <WindowHeader
        title={(() => {
          if (content === 'files') return 'Files';
          if (content === 'stockchart') return 'Stock Chart';
          if (content === 'quotemonitor') return 'Quote Monitor';
          if (content === 'chatbot') return 'Chatbot';
          if (content && typeof content === 'string') return content.charAt(0).toUpperCase() + content.slice(1);
          return title;
        })()}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        onContentChange={option => onContentChange && onContentChange(id, option as any)}
        onClose={() => onClose(id)}
      />
      <div className={windowClassNames.content}>
        <WindowContent
          content={content as any}
          notes={notes}
          onNotesChange={onNotesChange ? (val: string) => onNotesChange(id, val) : undefined}
        />
      </div>
      <WindowResizer onResizeMouseDown={handleResizeMouseDown} />
    </div>
  );
}