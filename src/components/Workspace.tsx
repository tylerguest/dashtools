"use client";

import React, { useState } from 'react';
import Window from './Window';

interface WindowData {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
}

interface WorkspaceProps {
  windows: WindowData[];
  setWindows: React.Dispatch<React.SetStateAction<WindowData[]>>;
}

export default function Workspace({ windows, setWindows }: WorkspaceProps) {
  const [workspaceRef, setWorkspaceRef] = useState<HTMLDivElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent, windowId: number) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const window = windows.find(w => w.id === windowId)!;
    const startWindowX = window.x;
    const startWindowY = window.y;

    // Prevent text selection during drag
    document.body.style.userSelect = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newX = startWindowX + deltaX;
      let newY = startWindowY + deltaY;

      // Apply workspace boundaries
      if (workspaceRef) {
        const workspaceRect = workspaceRef.getBoundingClientRect();
        const maxX = workspaceRect.width - window.width;
        const maxY = workspaceRect.height - window.height;
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
      }
      
      setWindows(prev => prev.map(w => 
        w.id === windowId 
          ? { ...w, x: newX, y: newY }
          : w
      ));
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

  const handleResize = (windowId: number, x: number, y: number, width: number, height: number) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, x, y, width, height } : w
    ));
  };

  const handleClose = (windowId: number) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
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
          x={window.x}
          y={window.y}
          width={window.width}
          height={window.height}
          title={window.title}
          onMouseDown={handleMouseDown}
          onResize={handleResize}
          onClose={handleClose}
        />
      ))}
    </div>
  );
}