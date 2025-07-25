import { useEffect, useState, RefObject } from "react";

export function useDropdownAlignRight(
  show: boolean,
  buttonRef: RefObject<Element>,
  dropdownRef: RefObject<Element>
) {
  const [alignRight, setAlignRight] = useState(false);

  useEffect(() => {
    if (show && buttonRef.current && dropdownRef.current) {
      const buttonRect = (buttonRef.current as HTMLElement).getBoundingClientRect();
      const dropdownRect = (dropdownRef.current as HTMLElement).getBoundingClientRect();
      const workspace = document.querySelector('main') || document.body;
      const workspaceRect = workspace.getBoundingClientRect();
      setAlignRight(buttonRect.left + dropdownRect.width > workspaceRect.right);
    }
  }, [show, buttonRef, dropdownRef]);

  return alignRight;
}