import { useWindowStore } from '../stores/windowStore';

export function useWindowSelectors(id: number) {
  const getWindowById = (winId: number) => useWindowStore.getState().windowsById[winId];
  const getAllWindows = () => {
    const state = useWindowStore.getState();
    return state.zOrder.map((id: number) => state.windowsById[id]).filter(Boolean);
  };
  return { getWindowById, getAllWindows };
}