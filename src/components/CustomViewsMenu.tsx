import React, { useState, useRef, useEffect } from "react";
import { useCustomViewsStore } from '../stores/customViewsStore';
import { customViewsMenuClassNames, buttonClassNames } from '../styles/classNames';

interface CustomViewsMenuProps {
  views: Array<{ id: string; name: string; layout: any }>;
  onSave: (name: string, layout: any) => Promise<void>;
  onLoad: (view: any) => void;
  onDelete: (id: string) => Promise<void>;
  currentLayout: any;
}

export default function CustomViewsMenu({ views, onSave, onLoad, onDelete, currentLayout }: CustomViewsMenuProps) {
  const [showInput, setShowInput] = useState(false);
  const [viewName, setViewName] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownAlignRight, setDropdownAlignRight] = useState(false);
  const customViews = useCustomViewsStore(state => state.customViews);
  const setCustomViews = useCustomViewsStore(state => state.setCustomViews);
  const addCustomView = useCustomViewsStore(state => state.addCustomView);
  const removeCustomView = useCustomViewsStore(state => state.removeCustomView);

  useEffect(() => {
    if (!showInput) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) { setShowInput(false); }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showInput]);

  useEffect(() => {
    if (showInput && buttonRef.current && dropdownRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const workspace = document.querySelector('main') || document.body;
      const workspaceRect = workspace.getBoundingClientRect();
      if (buttonRect.left + dropdownRect.width > workspaceRect.right) {
        setDropdownAlignRight(true);
      } else {
        setDropdownAlignRight(false);
      }
    }
  }, [showInput]);

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
      {showInput && (
        <div
          ref={dropdownRef}
          className={
            customViewsMenuClassNames.dropdownBase + ' ' + (dropdownAlignRight ? 'right-0' : 'left-0')
          }
        >
          <div className="mb-2">
            <input
              className={customViewsMenuClassNames.input}
              placeholder="View name"
              value={viewName}
              onChange={e => setViewName(e.target.value)}
            />
            <button
              className={`${buttonClassNames.base} ${buttonClassNames.primary} ${buttonClassNames.sizes.sm} w-full`}
              onClick={() => {
                if (viewName.trim()) {
                  addCustomView({ id: Date.now().toString(), name: viewName.trim(), layout: currentLayout });
                  setViewName("");
                  setShowInput(false);
                }
              }}
              type="button"
            >
              Save View
            </button>
          </div>
          <div className={customViewsMenuClassNames.viewsList}>
            {customViews.length === 0 && <div className={customViewsMenuClassNames.emptyViews}>No saved views</div>}
            {customViews.map(view => (
              <div
                key={view.id}
                className={customViewsMenuClassNames.viewRow}
              >
                <button
                  className={`${buttonClassNames.base} ${buttonClassNames.ghost} ${buttonClassNames.sizes.sm} flex-1 truncate text-left`}
                  onClick={() => { /* handle load view logic here */ setShowInput(false); }}
                  title={view.name}
                  type="button"
                >
                  {view.name}
                </button>
                <button
                  className={`${buttonClassNames.base} ${buttonClassNames.danger} ${buttonClassNames.sizes.xs} ml-1`}
                  onClick={() => removeCustomView(view.id)}
                  title="Delete view"
                  type="button"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
