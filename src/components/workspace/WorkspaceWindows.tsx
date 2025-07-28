import React from 'react';
import Window from '../window/Window';
import { useWindowStore } from '../../stores/windowStore';

export function WorkspaceWindows({
  zOrder,
  workspaceRef,
  user,
  getZIndex,
  selectedWindowIds,
  setSelectedWindowIds,
  groupDragRects,
  setGroupDragRects,
}: {
  zOrder: number[];
  workspaceRef: HTMLDivElement | null;
  user: any;
  getZIndex: (id: number) => number;
  selectedWindowIds: number[];
  setSelectedWindowIds: (ids: number[]) => void;
  groupDragRects: any;
  setGroupDragRects: any;
}) {
  const windowsById = useWindowStore(state => state.windowsById);
  const bringToFront = useWindowStore(state => state.bringToFront);
  const updateWindow = useWindowStore(state => state.updateWindow);
  const removeWindow = useWindowStore(state => state.removeWindow);
  return (
    <>
      {zOrder.map(id => {
        const win = windowsById[id];
        if (!win) return null;
        return (
          <div key={id}>
            <Window
              id={win.id}
              x={win.x}
              y={win.y}
              width={win.width}
              height={win.height}
              title={win.title}
              content={win.content}
              notes={win.notes}
              workspaceBounds={workspaceRef ? {
                width: workspaceRef.getBoundingClientRect().width,
                height: workspaceRef.getBoundingClientRect().height
              } : null}
              user={user}
              zIndex={getZIndex(id)}
              isSelected={selectedWindowIds.includes(id)}
              selectedWindowIds={selectedWindowIds}
              groupDragRects={groupDragRects}
              setGroupDragRects={setGroupDragRects}
              allWindowsCount={zOrder.length}
              onMouseDown={(e, id) => {
                setSelectedWindowIds([id]);
                bringToFront(id);
              }}
              onResize={(id, x, y, width, height) => {
                if (selectedWindowIds.includes(id) && selectedWindowIds.length > 1) {
                  const dx = x - win.x;
                  const dy = y - win.y;
                  const dw = width - win.width;
                  const dh = height - win.height;
                  selectedWindowIds.forEach(selId => {
                    const selWin = windowsById[selId];
                    if (!selWin) return;
                    updateWindow(selId, {
                      x: selWin.x + dx,
                      y: selWin.y + dy,
                      width: Math.max(50, selWin.width + dw),
                      height: Math.max(50, selWin.height + dh),
                    });
                  });
                } else {
                  updateWindow(id, { x, y, width, height });
                }
              }}
              onClose={id => removeWindow(id)}
              onContentChange={(id, content) => updateWindow(id, { content })}
            />
          </div>
        );
      })}
    </>
  );
}