import React, { useState, useRef, useEffect } from 'react';

interface WorkspaceSidebarProps {
  width?: number;
  onWidthChange?: (width: number) => void;
}

const minPaneWidth = 160;
const maxPaneWidth = 340;

const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({ width: controlledWidth, onWidthChange }) => {
  const [show, setShow] = useState(true);
  const [internalWidth, setInternalWidth] = useState(controlledWidth ?? 220);
  const width = controlledWidth ?? internalWidth;
  const isResizing = useRef(false);

  useEffect(() => {
    if (onWidthChange) onWidthChange(show ? width : 0);
  }, [width, show, onWidthChange]);

  useEffect(() => {
    if (controlledWidth !== undefined && controlledWidth !== internalWidth) {
      setInternalWidth(controlledWidth);
    }
  }, [controlledWidth]);

  useEffect(() => {
    if (!isResizing.current) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (controlledWidth !== undefined) {
        let newWidth = controlledWidth + e.movementX;
        if (newWidth < minPaneWidth) newWidth = minPaneWidth;
        if (newWidth > maxPaneWidth) newWidth = maxPaneWidth;
        if (onWidthChange) onWidthChange(newWidth);
      } else {
        setInternalWidth(prev => {
          let newWidth = prev + e.movementX;
          if (newWidth < minPaneWidth) newWidth = minPaneWidth;
          if (newWidth > maxPaneWidth) newWidth = maxPaneWidth;
          return newWidth;
        });
      }
    };
    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isResizing.current]);

  if (!show) {
    return (
      <div className="flex items-start">
        <button
          className="mt-3 ml-3 px-1 py-0 text-zinc-400 hover:text-zinc-200 text-sm border-none bg-transparent transition-all focus:outline-none flex items-center justify-center"
          onClick={() => setShow(true)}
          title="Show left pane"
          aria-label="Show left pane"
          style={{ minWidth: 24, minHeight: 24 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative h-full flex flex-col bg-zinc-900 border-r border-zinc-700 select-none"
      style={{ width, minWidth: minPaneWidth, maxWidth: maxPaneWidth, transition: 'width 0.2s', zIndex: 20 }}
    >
      {/* Sidebar content goes here */}
      <div className="flex-1 p-3 overflow-y-auto">
        {/* Example content, replace with your actual sidebar content */}
        <div className="text-zinc-200 font-bold text-lg mb-4">Workspace</div>
        <div className="text-zinc-400 text-xs mb-2">Sidebar content here</div>
      </div>
      {/* Resizer */}
      <div
        className="absolute top-0 right-0 w-2 h-full cursor-col-resize z-30 bg-transparent hover:bg-zinc-700/40 transition-colors"
        style={{ marginRight: -1 }}
        onMouseDown={() => { isResizing.current = true; }}
        role="separator"
        aria-orientation="vertical"
        tabIndex={0}
        title="Resize sidebar"
      />
      {/* Hide button */}
      <button
        className="absolute top-3 right-2 px-1 py-0 text-zinc-400 hover:text-zinc-200 text-sm border-none bg-transparent transition-all focus:outline-none flex items-center justify-center"
        onClick={() => setShow(false)}
        title="Hide left pane"
        aria-label="Hide left pane"
        style={{ minWidth: 24, minHeight: 24 }}
      >
        &lt;
      </button>
    </div>
  );
};

export default WorkspaceSidebar;
