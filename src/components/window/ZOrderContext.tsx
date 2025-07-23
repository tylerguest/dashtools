import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

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
  
  const [zOrder, setZOrder] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("windowZOrder");
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {}
      }
    }
    return [];
  }); 

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("windowZOrder", JSON.stringify(zOrder));
    }
  }, [zOrder]);

  const setInitialOrder = useCallback((ids: string[]) => {
    setZOrder(prev => {
      let newOrder = [...prev];
      ids.forEach(id => {
        if (!newOrder.includes(id)) newOrder.push(id);
      });
      newOrder = newOrder.filter(id => ids.includes(id));
      return newOrder;
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
