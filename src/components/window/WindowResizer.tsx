import React from 'react';

interface WindowResizerProps {
  onResizeMouseDown: (e: React.MouseEvent, direction: string) => void;
}

const WindowResizer: React.FC<WindowResizerProps> = ({ onResizeMouseDown }) => (
  <>
    <div className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize hover:bg-zinc-600" onMouseDown={e => onResizeMouseDown(e, 'nw')} />
    <div className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize hover:bg-zinc-600" onMouseDown={e => onResizeMouseDown(e, 'ne')} />
    <div className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize hover:bg-zinc-600" onMouseDown={e => onResizeMouseDown(e, 'sw')} />
    <div className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize hover:bg-zinc-600" onMouseDown={e => onResizeMouseDown(e, 'se')} />
    <div className="absolute top-0 left-2 right-2 h-1 cursor-n-resize hover:bg-zinc-600" onMouseDown={e => onResizeMouseDown(e, 'n')} />
    <div className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize hover:bg-zinc-600" onMouseDown={e => onResizeMouseDown(e, 's')} />
    <div className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize hover:bg-zinc-600" onMouseDown={e => onResizeMouseDown(e, 'w')} />
    <div className="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize hover:bg-zinc-600" onMouseDown={e => onResizeMouseDown(e, 'e')} />
  </>
);

export default WindowResizer;
