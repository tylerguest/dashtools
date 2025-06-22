"use client";

import React, { useState } from 'react';
import Timeline from './views/Timeline';
import Mixer from './views/Mixer';

interface WindowProps {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  content?: 'timeline' | 'mixer' | null;
  workspaceBounds?: { width: number; height: number } | null;
  otherWindows?: Array<{ id: number; x: number; y: number; width: number; height: number }>;
  onMouseDown: (e: React.MouseEvent, id: number) => void;
  onResize: (id: number, x: number, y: number, width: number, height: number) => void;
  onClose: (id: number) => void;
  onContentChange?: (id: number, content: 'timeline' | 'mixer') => void;
}

export default function Window({ id, x, y, width, height, title, content, workspaceBounds, otherWindows, onMouseDown, onResize, onClose, onContentChange }: WindowProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        newY = Math.max(0, startWindowY + deltaY);
        newHeight = Math.max(100, startHeight - (newY - startWindowY));
      }
      if (direction.includes('s')) {
        const maxHeight = workspaceBounds ? workspaceBounds.height - startWindowY : Infinity;
        newHeight = Math.max(100, Math.min(startHeight + deltaY, maxHeight));
      }
      if (direction.includes('w')) {
        newX = Math.max(0, startWindowX + deltaX);
        newWidth = Math.max(150, startWidth - (newX - startWindowX));
      }
      if (direction.includes('e')) {
        const maxWidth = workspaceBounds ? workspaceBounds.width - startWindowX : Infinity;
        newWidth = Math.max(150, Math.min(startWidth + deltaX, maxWidth));
      }

      // Apply snapping to other windows
      if (otherWindows) {
        const snapThreshold = 8;
        
        for (const otherWindow of otherWindows) {
          if (otherWindow.id === id) continue;
          
          if (direction.includes('e')) {
            const rightEdge = newX + newWidth;
            const otherLeft = otherWindow.x;
            const otherRight = otherWindow.x + otherWindow.width;
            
            if (Math.abs(rightEdge - otherLeft) < snapThreshold) {
              newWidth = otherLeft - newX;
            } else if (Math.abs(rightEdge - otherRight) < snapThreshold) {
              newWidth = otherRight - newX;
            }
          }
          
          if (direction.includes('w')) {
            const otherLeft = otherWindow.x;
            const otherRight = otherWindow.x + otherWindow.width;
            
            if (Math.abs(newX - otherRight) < snapThreshold) {
              const deltaX = newX - otherRight;
              newX = otherRight;
              newWidth = newWidth + deltaX;
            } else if (Math.abs(newX - otherLeft) < snapThreshold) {
              const deltaX = newX - otherLeft;
              newX = otherLeft;
              newWidth = newWidth + deltaX;
            }
          }
          
          if (direction.includes('s')) {
            const bottomEdge = newY + newHeight;
            const otherTop = otherWindow.y;
            const otherBottom = otherWindow.y + otherWindow.height;
            
            if (Math.abs(bottomEdge - otherTop) < snapThreshold) {
              newHeight = otherTop - newY;
            } else if (Math.abs(bottomEdge - otherBottom) < snapThreshold) {
              newHeight = otherBottom - newY;
            }
          }
          
          if (direction.includes('n')) {
            const otherTop = otherWindow.y;
            const otherBottom = otherWindow.y + otherWindow.height;
            
            if (Math.abs(newY - otherBottom) < snapThreshold) {
              const deltaY = newY - otherBottom;
              newY = otherBottom;
              newHeight = newHeight + deltaY;
            } else if (Math.abs(newY - otherTop) < snapThreshold) {
              const deltaY = newY - otherTop;
              newY = otherTop;
              newHeight = newHeight + deltaY;
            }
          }
        }
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
      className="absolute bg-zinc-800 border border-zinc-700 rounded-sm shadow-2xl cursor-move flex flex-col"
      style={{ left: x, top: y, width, height }}
      onMouseDown={(e) => onMouseDown(e, id)}
    >
      <div className="p-2 bg-zinc-900 border-b border-zinc-700 text-zinc-200 font-normal text-sm flex justify-between items-center relative">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="w-4 h-4 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 rounded text-xs font-bold"
          >
            ☰
          </button>
          {isDropdownOpen && (
            <div className="absolute top-6 left-0 bg-zinc-800 border border-zinc-600 rounded shadow-lg z-50 min-w-32">
              <div className="py-1">
                <button 
                  className="w-full px-3 py-1 text-left text-zinc-300 hover:bg-zinc-700 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(false);
                    onContentChange?.(id, 'timeline');
                  }}
                >
                  Timeline
                </button>
                <button 
                  className="w-full px-3 py-1 text-left text-zinc-300 hover:bg-zinc-700 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(false);
                    onContentChange?.(id, 'mixer');
                  }}
                >
                  Mixer
                </button>
              </div>
            </div>
          )}
        </div>
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
      
      {/* Window Content */}
      <div className="flex-1 p-1 overflow-auto">
        {content === 'timeline' && <Timeline />}
        {content === 'mixer' && <Mixer />}
        {!content && (
          <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
            Select a view from the dropdown menu
          </div>
        )}
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