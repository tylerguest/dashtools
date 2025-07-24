import React, { useState, useRef, useEffect } from "react";

interface CustomView {
  id: string;
  name: string;
  layout: any;
}

export default function CustomViewsMenu({
  views,
  onSave,
  onLoad,
  onDelete,
  currentLayout
}: {
  views: CustomView[];
  onSave: (name: string, layout: any) => void;
  onLoad: (view: CustomView) => void;
  onDelete: (id: string) => void;
  currentLayout: any;
}) {
  const [showInput, setShowInput] = useState(false);
  const [viewName, setViewName] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownAlignRight, setDropdownAlignRight] = useState(false);

  useEffect(() => {
    if (!showInput) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowInput(false);
      }
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
    <div className="relative flex items-center">
      <button
        ref={buttonRef}
        className="text-xs px-2 py-1 bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 mr-2"
        onClick={() => setShowInput(v => !v)}
        aria-label="Custom views menu"
      >
        V
      </button>
      {showInput && (
        <div
          ref={dropdownRef}
          className={`absolute top-10 ${dropdownAlignRight ? 'right-0' : 'left-0'} min-w-[180px] max-w-[240px] bg-zinc-900/95 backdrop-blur border border-zinc-700 shadow-xl p-2 z-50 transition-all`}
        >
          <div className="mb-2">
            <input
              className="w-full px-2 py-1 bg-zinc-800/90 text-zinc-200 border border-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/20 outline-none mb-1 text-xs transition-all placeholder-zinc-400"
              placeholder="View name"
              value={viewName}
              onChange={e => setViewName(e.target.value)}
            />
            <button
              className="w-full py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 font-semibold text-xs shadow-sm transition-all mb-1"
              onClick={() => {
                if (viewName.trim()) {
                  onSave(viewName.trim(), currentLayout);
                  setViewName("");
                  setShowInput(false);
                }
              }}
            >
              Save View
            </button>
          </div>
          <div className="max-h-32 overflow-y-auto space-y-0.5">
            {views.length === 0 && <div className="text-zinc-400 text-xs text-center py-1">No saved views</div>}
            {views.map(view => (
              <div
                key={view.id}
                className="flex items-center group bg-zinc-800/70 hover:bg-zinc-700/80 px-1 py-0.5 transition-all"
              >
                <button
                  className="text-left text-zinc-200 group-hover:text-zinc-100 font-medium text-xs flex-1 truncate transition-all"
                  onClick={() => { onLoad(view); setShowInput(false); }}
                  title={view.name}
                >
                  {view.name}
                </button>
                <button
                  className="ml-1 text-red-500 opacity-70 hover:opacity-100 text-sm font-bold px-0.5 transition-all"
                  onClick={() => onDelete(view.id)}
                  title="Delete view"
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
