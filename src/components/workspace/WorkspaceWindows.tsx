import React from 'react';
import Window from '../window/Window';

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
  return (
    <>
      {zOrder.map(id => (
        <div key={id}>
          <Window
            id={id}
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
          />
        </div>
      ))}
    </>
  );
}