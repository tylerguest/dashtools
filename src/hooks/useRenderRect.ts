interface UseRenderRectProps {
  multiSelected: boolean;
  groupDragRects?: Record<number, { x: number, y: number, width: number, height: number }> | null;
  dragRect: { x: number; y: number; width: number; height: number } | null;
  x: number;
  y: number;
  width: number;
  height: number;
  id: number;
}

export function useRenderRect({
  multiSelected,
  groupDragRects,
  dragRect,
  x,
  y,
  width,
  height,
  id,
}: UseRenderRectProps) {
  const renderRect =
    multiSelected && groupDragRects && groupDragRects[id]
      ? groupDragRects[id]
      : dragRect;

  return {
    renderX: renderRect ? renderRect.x : x,
    renderY: renderRect ? renderRect.y : y,
    renderWidth: renderRect ? renderRect.width : width,
    renderHeight: renderRect ? renderRect.height : height,
  };
}