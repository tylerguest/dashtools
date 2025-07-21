"use client";

import React, { useState } from 'react';

import StockChartView from './views/StockChartView';
import QuoteMonitorView from './views/QuoteMonitorView';

interface WindowProps {
  id:number;
  x:number;
  y:number;
  width:number;
  height:number;
  title:string;
  content?:'timeline'|'mixer'|'stockchart'|'quotemonitor'|null;
  workspaceBounds?:{width:number;height:number}|null;
  otherWindows?:Array<{id:number;x:number;y:number;width:number;height:number}>;
  onMouseDown:(e:React.MouseEvent,id:number)=>void;
  onResize:(id:number,x:number,y:number,width:number,height:number)=>void;
  onClose:(id:number)=>void;
  onContentChange?:(id:number,content:'timeline'|'mixer'|'stockchart'|'quotemonitor')=>void;
  transportState?:{isPlaying:boolean;playheadPosition:number;};
  onPlayheadMove?:(position:number)=>void;
}

export default function Window({ 
  id,x,y,width,height,title,content,workspaceBounds,otherWindows, 
  onMouseDown,onResize,onClose,onContentChange,transportState,onPlayheadMove 
}:WindowProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [resizing, setResizing] = useState<null | { x: number; y: number; width: number; height: number }> (null);

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWindowX = resizing ? resizing.x : x;
    const startWindowY = resizing ? resizing.y : y;
    const startWidth = resizing ? resizing.width : width;
    const startHeight = resizing ? resizing.height : height;
    document.body.style.userSelect = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      let newX = startWindowX;
      let newY = startWindowY;
      let newWidth = startWidth;
      let newHeight = startHeight;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      if (direction.includes('n')) {
        newY = Math.max(0, startWindowY + deltaY);
        newHeight = Math.max(100, startHeight - (newY - startWindowY));
      }
      if (direction.includes('s')) newHeight = Math.max(100, Math.min(startHeight + deltaY, workspaceBounds ? workspaceBounds.height - startWindowY : Infinity));
      if (direction.includes('w')) {
        newX = Math.max(0, startWindowX + deltaX);
        newWidth = Math.max(150, startWidth - (newX - startWindowX));
      }
      if (direction.includes('e')) newWidth = Math.max(150, Math.min(startWidth + deltaX, workspaceBounds ? workspaceBounds.width - startWindowX : Infinity));
      if (otherWindows && (direction.includes('e') || direction.includes('w') || direction.includes('s') || direction.includes('n'))) {
        const snapThreshold = 8;
        for (const otherWindow of otherWindows) {
          if (otherWindow.id === id) continue;
          if (direction.includes('e')) {
            const rightEdge = newX + newWidth;
            const otherLeft = otherWindow.x;
            if (Math.abs(rightEdge - otherLeft) < snapThreshold) {
              newWidth = otherLeft - newX;
            }
          }
        }
      }
      setResizing({ x: newX, y: newY, width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      document.body.style.userSelect = '';
      if (resizing) {
        onResize(id, resizing.x, resizing.y, resizing.width, resizing.height);
      }
      setResizing(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Use resizing state if present, otherwise props
  const renderX = resizing ? resizing.x : x;
  const renderY = resizing ? resizing.y : y;
  const renderWidth = resizing ? resizing.width : width;
  const renderHeight = resizing ? resizing.height : height;

  return (
    <div
      data-window-id={id}
      className="absolute z-50 bg-zinc-800 border border-zinc-700 rounded-sm shadow-2xl cursor-move flex flex-col"
      style={{ left: renderX, top: renderY, width: renderWidth, height: renderHeight }}
      onMouseDown={(e) => onMouseDown(e, id)}
    >
      <div className="p-2 bg-zinc-900 border-b border-zinc-700 text-zinc-200 font-normal text-sm flex justify-between items-center relative">
        <div className="relative flex items-center">
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
            <div className="absolute top-6 left-0 bg-zinc-800 border border-zinc-600 rounded shadow-lg z-50 min-w-32 py-1">
              <button
                className="block w-full text-left px-4 py-2 text-zinc-200 hover:bg-zinc-700 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onContentChange) onContentChange(id, 'stockchart');
                  setIsDropdownOpen(false);
                }}
              >
                Stock Chart
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-zinc-200 hover:bg-zinc-700 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onContentChange) onContentChange(id, 'quotemonitor');
                  setIsDropdownOpen(false);
                }}
              >
                Quote Monitor
              </button>
            </div>
          )}
        </div>
        <div className="flex-1 flex justify-center items-center select-none pointer-events-none">
          {content === 'stockchart' && (
            <span className="text-zinc-200 text-base font-bold">Stock Chart (Mock)</span>
          )}
          {content === 'quotemonitor' && (
            <span className="text-zinc-200 text-base font-bold">Quote Monitor</span>
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
      <div className="flex-1 p-1 overflow-auto">
        {content === 'stockchart' && <StockChartView />}
        {content === 'quotemonitor' && <QuoteMonitorView />}
        {!content && (
          <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
            Select a view from the dropdown menu
          </div>
        )}
      </div>
      <div className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize hover:bg-zinc-600" onMouseDown={(e)=>handleResizeMouseDown(e,'nw')}/>
      <div className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize hover:bg-zinc-600" onMouseDown={(e)=>handleResizeMouseDown(e,'ne')}/>
      <div className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize hover:bg-zinc-600" onMouseDown={(e)=>handleResizeMouseDown(e,'sw')} />
      <div className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize hover:bg-zinc-600" onMouseDown={(e)=>handleResizeMouseDown(e,'se')} />
      <div className="absolute top-0 left-2 right-2 h-1 cursor-n-resize hover:bg-zinc-600" onMouseDown={(e)=>handleResizeMouseDown(e,'n')} />
      <div className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize hover:bg-zinc-600" onMouseDown={(e)=>handleResizeMouseDown(e,'s')} />
      <div className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize hover:bg-zinc-600" onMouseDown={(e)=>handleResizeMouseDown(e,'w')} />
      <div className="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize hover:bg-zinc-600" onMouseDown={(e)=>handleResizeMouseDown(e,'e')} />
    </div>
  );
}