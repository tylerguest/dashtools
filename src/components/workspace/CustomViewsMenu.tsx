import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useCustomViewsStore } from '../../stores/customViewsStore';
import { customViewsMenuClassNames, buttonClassNames } from '../../styles/classNames';
import { useClickAway } from '../../hooks/useClickAway';
import { useDropdownAlignRight } from '../../hooks/useDropdownAlignRight';
import { CustomViewsDropdown } from './CustomViewsDropdown';

interface CustomViewsMenuProps {
  views: Array<{ id: string; name: string; layout: any }>;
  onSave: (name: string, layout: any) => Promise<void>;
  onLoad: (view: any) => void;
  onDelete: (id: string) => Promise<void>;
  currentLayout: any;
}

function CustomViewsMenu({ views, onSave, onLoad, onDelete, currentLayout }: CustomViewsMenuProps) {
  const [showInput, setShowInput] = useState(false);
  const [viewName, setViewName] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickAway(
    [dropdownRef as React.RefObject<Element>, buttonRef as React.RefObject<Element>],
    () => setShowInput(false),
    showInput
  );
  const dropdownAlignRight = useDropdownAlignRight(
    showInput,
    buttonRef as React.RefObject<Element>,
    dropdownRef as React.RefObject<Element>
  );

  const customViews = useCustomViewsStore(state => state.customViews);
  const addCustomView = useCustomViewsStore(state => state.addCustomView);
  const removeCustomView = useCustomViewsStore(state => state.removeCustomView);

  return (
    <div className={customViewsMenuClassNames.container}>
      <button
        ref={buttonRef}
        className={`${buttonClassNames.base} ${buttonClassNames.icon}`}
        onClick={() => setShowInput(v => !v)}
        aria-label="Custom views menu"
        type="button"
      >
        V
      </button>
      {showInput && typeof window !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          style={(() => {
            if (!buttonRef.current) return { position: 'absolute', top: 40, left: 0, zIndex: 9999 };
            const rect = buttonRef.current.getBoundingClientRect();
            return {
              position: 'absolute',
              top: rect.bottom - 32,
              left: dropdownAlignRight ? rect.right - 150 : rect.left,
              zIndex: 9999,
              minWidth: 180,
              maxWidth: 240,
            };
          })()}
        >
          <CustomViewsDropdown
            customViews={customViews}
            viewName={viewName}
            setViewName={setViewName}
            addCustomView={addCustomView}
            removeCustomView={removeCustomView}
            currentLayout={currentLayout}
            setShowInput={setShowInput}
            dropdownAlignRight={dropdownAlignRight}
          />
        </div>,
        document.body
      )}
    </div>
  );
}

export default React.memo(CustomViewsMenu);