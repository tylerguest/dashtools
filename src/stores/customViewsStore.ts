import { create } from 'zustand';

export type CustomView = { id: string; name: string; layout: any[] };

interface CustomViewsStore {
  customViews: CustomView[];
  setCustomViews: (views: CustomView[]) => void;
  addCustomView: (view: CustomView) => void;
  removeCustomView: (id: string) => void;
}

export const useCustomViewsStore = create<CustomViewsStore>((set) => ({
  customViews: [],
  setCustomViews: (views) => set({ customViews: views }),
  addCustomView: (view) => set((state) => ({ customViews: [...state.customViews, view] })),
  removeCustomView: (id) => set((state) => ({ customViews: state.customViews.filter(v => v.id !== id) })),
}));
