"use client";

import React, { useState, useEffect } from 'react';
import Window from './window/Window';
import { ZOrderProvider, useZOrder } from './window/ZOrderContext';

interface WindowData {id:number;x:number;y:number;width:number;height:number;title:string;content?:'timeline'|'mixer'|'stockchart'|'quotemonitor'|'chatbot'|'notes'|null;notes?:string;}
interface WorkspaceProps {
  windows: WindowData[];
  setWindows: React.Dispatch<React.SetStateAction<WindowData[]>>;
  user?: any;
}

function WorkspaceInner({windows,setWindows,user}:WorkspaceProps) {
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
    setWindows(prev => prev.map(w => w.id === windowId ? { ...w, notes } : w));
  };

  const { bringToFront, getZIndex, setInitialOrder } = useZOrder();
  // Keep z-order in sync with window list
  useEffect(() => {
    setInitialOrder(windows.map(w => String(w.id)));
  }, [windows]);
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
          onMouseDown={(e, id) => {
            // Only bring to front if this window is not already on top
            const currentZ = getZIndex(String(id));
            const maxZ = Math.max(...windows.map(w => getZIndex(String(w.id))));
            if (currentZ !== maxZ) {
              bringToFront(String(id));
            }
            handleMouseDown(e, id);
          }}
          onResize={handleResize}
          onClose={handleClose}
          onContentChange={handleContentChange}
          onNotesChange={handleNotesChange}
          user={user}
          zIndex={getZIndex(String(window.id))}
        />
      ))}
    </div>
  );
}

export default function Workspace(props: WorkspaceProps) {
  return (
    <ZOrderProvider>
      <WorkspaceInner {...props} />
    </ZOrderProvider>
  );
}