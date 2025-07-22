import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface ZOrderContextType {
  zOrder: string[];
  bringToFront: (id: string) => void;
  getZIndex: (id: string) => number;
  setInitialOrder: (ids: string[]) => void;
}

const ZOrderContext = createContext<ZOrderContextType | undefined>(undefined);


export function useZOrder() {
  const ctx = useContext(ZOrderContext);
  if (!ctx) throw new Error("useZOrder must be used within a ZOrderProvider");
  return ctx;
}

export function ZOrderProvider({ children }: { children: ReactNode }) {
  const [zOrder, setZOrder] = useState<string[]>([]);
  const setInitialOrder = useCallback((ids: string[]) => {
    setZOrder(prev => {
      let filtered = prev.filter(id => ids.includes(id));
      ids.forEach(id => {
        if (!filtered.includes(id)) filtered.push(id);
      });
      return filtered;
    });
  }, []);
  const bringToFront = (id: string) => {
    setZOrder(prev => {
      const filtered = prev.filter(wid => wid !== id);
      return [...filtered, id];
    });
  };
  const getZIndex = (id: string) => {
    const idx = zOrder.indexOf(id);
    return idx === -1 ? 10 : 10 + idx;
  };
  return (
    <ZOrderContext.Provider value={{ zOrder, bringToFront, getZIndex, setInitialOrder }}>
      {children}
    </ZOrderContext.Provider>
  );
}
