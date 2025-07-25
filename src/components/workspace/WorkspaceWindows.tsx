import React from 'react';
import Window from '../window/Window';
import { useWindowStore } from '../../stores/windowStore';

export function WorkspaceWindows({
  zOrder,
  workspaceRef,
  user,
  getZIndex,
  selectedWindowIds,
  groupDragRects,
  setGroupDragRects,
}: {
  zOrder: number[];
  workspaceRef: HTMLDivElement | null;
  user: any;
  getZIndex: (id: number) => number;
  selectedWindowIds: number[];
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
              groupDragRects={groupDragRects}
              setGroupDragRects={setGroupDragRects}
              allWindowsCount={zOrder.length}
              onMouseDown={(e, id) => bringToFront(id)}
              onResize={(id, x, y, width, height) => updateWindow(id, { x, y, width, height })}
              onClose={id => removeWindow(id)}
            />
          </div>
        );
      })}
    </>
  );
}