"use client";

import React from 'react';

interface WindowProps {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  onMouseDown: (e: React.MouseEvent, id: number) => void;
  onResize: (id: number, x: number, y: number, width: number, height: number) => void;
  onClose: (id: number) => void;
}

export default function Window({ id, x, y, width, height, title, onMouseDown, onResize, onClose }: WindowProps) {
  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWindowX = x;
    const startWindowY = y;
    const startWidth = width;
    const startHeight = height;

    // Prevent text selection during resize
    document.body.style.userSelect = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newX = startWindowX;
      let newY = startWindowY;
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('n')) {
        newY = startWindowY + deltaY;
        newHeight = Math.max(100, startHeight - deltaY);
      }
      if (direction.includes('s')) {
        newHeight = Math.max(100, startHeight + deltaY);
      }
      if (direction.includes('w')) {
        newX = startWindowX + deltaX;
        newWidth = Math.max(150, startWidth - deltaX);
      }
      if (direction.includes('e')) {
        newWidth = Math.max(150, startWidth + deltaX);
      }

      onResize(id, newX, newY, newWidth, newHeight);
    };

    const handleMouseUp = () => {
      // Restore text selection
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className="absolute bg-zinc-800 border border-zinc-700 rounded-sm shadow-2xl cursor-move"
      style={{ left: x, top: y, width, height }}
      onMouseDown={(e) => onMouseDown(e, id)}
    >
      <div className="p-2 bg-zinc-900 border-b border-zinc-700 text-zinc-200 font-normal text-sm flex justify-between items-center">
        <span>{title}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose(id);
          }}
          className="w-4 h-4 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 rounded text-xs font-bold"
        >
          ×
        </button>
      </div>
      <div className="p-3 text-zinc-300 bg-zinc-800">
        Window content
      </div>
      
      {/* Resize handles */}
      {/* Corners */}
      <div className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize hover:bg-zinc-600" onMouseDown={(e) => handleResizeMouseDown(e, 'nw')} />
      <div className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize hover:bg-zinc-600" onMouseDown={(e) => handleResizeMouseDown(e, 'ne')} />
      <div className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize hover:bg-zinc-600" onMouseDown={(e) => handleResizeMouseDown(e, 'sw')} />
      <div className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize hover:bg-zinc-600" onMouseDown={(e) => handleResizeMouseDown(e, 'se')} />
      
      {/* Edges */}
      <div className="absolute top-0 left-2 right-2 h-1 cursor-n-resize hover:bg-zinc-600" onMouseDown={(e) => handleResizeMouseDown(e, 'n')} />
      <div className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize hover:bg-zinc-600" onMouseDown={(e) => handleResizeMouseDown(e, 's')} />
      <div className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize hover:bg-zinc-600" onMouseDown={(e) => handleResizeMouseDown(e, 'w')} />
      <div className="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize hover:bg-zinc-600" onMouseDown={(e) => handleResizeMouseDown(e, 'e')} />
    </div>
  );
}