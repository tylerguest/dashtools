import React, { useState, useRef, useEffect } from 'react';
import { workspaceSidebarClassNames, buttonClassNames } from '../styles/classNames';

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
          className={`${buttonClassNames.base} ${buttonClassNames.icon}`}
          onClick={() => setShow(true)}
          title="Show left pane"
          aria-label="Show left pane"
          type="button"
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
      className={workspaceSidebarClassNames.container}
      style={{ width, minWidth: minPaneWidth, maxWidth: maxPaneWidth, transition: 'width 0.2s', zIndex: 20 }}
    >
      {/* Sidebar content goes here */}
      <div className={workspaceSidebarClassNames.sidebarContent}>
        {/* Example content, replace with your actual sidebar content */}
        <div className={workspaceSidebarClassNames.sidebarTitle}>Workspace</div>
        <div className={workspaceSidebarClassNames.sidebarSubtitle}>Sidebar content here</div>
      </div>
      {/* Resizer */}
      <div
        className={workspaceSidebarClassNames.resizer}
        style={{ marginRight: -1 }}
        onMouseDown={() => { isResizing.current = true; }}
        role="separator"
        aria-orientation="vertical"
        tabIndex={0}
        title="Resize sidebar"
      />
      {/* Hide button */}
      <button
        className={`${buttonClassNames.base} ${buttonClassNames.icon}`}
        onClick={() => setShow(false)}
        title="Hide left pane"
        aria-label="Hide left pane"
        type="button"
        style={{ minWidth: 24, minHeight: 24 }}
      >
        &lt;
      </button>
    </div>
  );
};

export default WorkspaceSidebar;
