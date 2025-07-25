import React from 'react';

export function SelectionRectangle({ selectionRect }: { selectionRect: { left: number, top: number, width: number, height: number } }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: selectionRect.left,
        top: selectionRect.top,
        width: selectionRect.width,
        height: selectionRect.height,
        background: 'rgba(200, 200, 200, 0.10)',
        border: '1.5px solid #aaa',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  );
}