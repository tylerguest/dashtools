import { useEffect, RefObject } from "react";

export function useClickAway(
  refs: Array<RefObject<Element>>,
  onClickAway: () => void,
  active: boolean
) {
  useEffect(() => {
    if (!active) return;
    function handleClick(e: MouseEvent) {
      if (refs.every(ref => ref.current && !ref.current.contains(e.target as Node))) {
        onClickAway();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [active, refs, onClickAway]);
}