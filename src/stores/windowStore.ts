import { create } from 'zustand';
import type { WindowData, WindowContent } from '../types/window';

interface WindowStore {
  windowsById: Record<number, WindowData>;
  zOrder: number[];
  nextId: number;
  addWindow: (window: Omit<WindowData, 'id'>) => number;
  updateWindow: (id: number, data: Partial<WindowData>) => void;
  updateWindows: (ids: number[], data: Partial<WindowData>) => void;
  removeWindow: (id: number) => void;
  bringToFront: (id: number) => void;
  setZOrder: (zOrder: number[]) => void;
  getWindow: (id: number) => WindowData | undefined;
  getAllWindows: () => WindowData[];
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windowsById: {},
  zOrder: [],
  nextId: 1,

  addWindow: (window) => {
    const id = get().nextId;
    set(state => ({
      windowsById: { ...state.windowsById, [id]: { ...window, id } },
      zOrder: [...state.zOrder, id],
      nextId: id + 1,
    }));
    return id;
  },


  updateWindow: (id, data) => set(state => ({
    windowsById: {
      ...state.windowsById,
      [id]: { ...state.windowsById[id], ...data },
    },
  })),

  updateWindows: (ids, data) => set(state => {
    const updated: Record<number, WindowData> = { ...state.windowsById };
    ids.forEach(id => {
      if (updated[id]) {
        updated[id] = { ...updated[id], ...data };
      }
    });
    return { windowsById: updated };
  }),

  removeWindow: (id) => set(state => {
    const { [id]: _, ...rest } = state.windowsById;
    return {
      windowsById: rest,
      zOrder: state.zOrder.filter(zid => zid !== id),
    };
  }),

  bringToFront: (id) => set(state => {
    const filtered = state.zOrder.filter(zid => zid !== id);
    return { zOrder: [...filtered, id] };
  }),
  setZOrder: (zOrder) => set({ zOrder }),
  getWindow: (id) => get().windowsById[id],
  getAllWindows: () => get().zOrder.map(id => get().windowsById[id]).filter(Boolean),
}));
