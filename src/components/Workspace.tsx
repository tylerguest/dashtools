"use client";

import React, { useState } from 'react';
import Window from './window/Window';

interface WindowData {id:number;x:number;y:number;width:number;height:number;title:string;content?:'timeline'|'mixer'|'stockchart'|'quotemonitor'|'chatbot'|'notes'|null;notes?:string;}
interface WorkspaceProps {
  windows: WindowData[];
  setWindows: React.Dispatch<React.SetStateAction<WindowData[]>>;
  user?: any;
}

export default function Workspace({windows,setWindows,user}:WorkspaceProps) {
  console.log('[Workspace] windows state:', windows.map(w => ({ id: w.id, notes: w.notes })));
  const [workspaceRef,setWorkspaceRef]=useState<HTMLDivElement|null>(null);
  const handleMouseDown=(e:React.MouseEvent,windowId:number) => {
    e.preventDefault();
    const startX=e.clientX;
    const startY=e.clientY;
    const window=windows.find(w=>w.id===windowId)!;
    const startWindowX=window.x;
    const startWindowY=window.y;
    const windowElement=document.querySelector(`[data-window-id="${windowId}"]`) as HTMLElement;
    if (!windowElement) return;
    document.body.style.userSelect='none';
    let newX=startWindowX;
    let newY=startWindowY;
    const handleMouseMove=(e:MouseEvent) => {
      e.preventDefault();
      const deltaX=e.clientX-startX;
      const deltaY=e.clientY-startY;
      newX=startWindowX+deltaX;
      newY=startWindowY+deltaY;
      if (workspaceRef) {
        const workspaceRect=workspaceRef.getBoundingClientRect();
        const maxX=workspaceRect.width-window.width;
        const maxY=workspaceRect.height-window.height;
        newX=Math.max(0,Math.min(newX,maxX));
        newY=Math.max(0,Math.min(newY,maxY));
      }
      windowElement.style.transform=`translate(${newX-startWindowX}px,${newY-startWindowY}px)`;
    };
    const handleMouseUp = () => {
      document.body.style.userSelect='';
      windowElement.style.transform='';
      setWindows(prev=>prev.map(w=>w.id===windowId?{...w,x:newX,y:newY}:w));
      document.removeEventListener('mousemove',handleMouseMove);
      document.removeEventListener('mouseup',handleMouseUp);
    };
    document.addEventListener('mousemove',handleMouseMove);
    document.addEventListener('mouseup',handleMouseUp);
  };
  const handleResize=(id:number,x:number,y:number,width:number,height:number)=>setWindows(p=>p.map(w=>w.id===id?{...w,x,y,width,height}:w));
  const handleClose=(windowId:number)=>setWindows(prev=>prev.filter(w=>w.id!==windowId));
  const handleContentChange=(windowId:number,content:'timeline'|'mixer'|'stockchart'|'quotemonitor'|'chatbot'|'notes'|null)=>setWindows(prev=>prev.map(w=>w.id===windowId?{...w,content}:w));
  const handleNotesChange = (windowId: number, notes: string) => {
    console.log('[Workspace] handleNotesChange called', { windowId, notes });
    setWindows(prev => {
      const updated = prev.map(w => w.id === windowId ? { ...w, notes } : w);
      console.log('[Workspace] windows after notes change:', updated);
      return updated;
    });
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
          content={window.content}
          notes={window.notes}
          workspaceBounds={workspaceRef ? {
            width: workspaceRef.getBoundingClientRect().width,
            height: workspaceRef.getBoundingClientRect().height
          } : null}
          otherWindows={windows}
          onMouseDown={handleMouseDown}
          onResize={handleResize}
          onClose={handleClose}
          onContentChange={handleContentChange}
          onNotesChange={handleNotesChange}
          user={user}
        />
      ))}
    </div>
  );
}