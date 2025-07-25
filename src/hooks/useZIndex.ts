export function useZIndex(zOrder: number[]) {
  return (id: number) => {
    const idx = zOrder.indexOf(id);
    return idx === -1 ? 10 : 10 + idx;
  };
}