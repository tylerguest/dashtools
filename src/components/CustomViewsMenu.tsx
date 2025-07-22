import React, { useState } from "react";

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

  return (
    <div className="relative flex items-center">
      <button
        className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 mr-2"
        onClick={() => setShowInput(v => !v)}
      >
        Views
      </button>
      {showInput && (
        <div className="absolute top-8 left-0 bg-zinc-900 border border-zinc-700 rounded shadow-lg p-3 z-50 min-w-[220px]">
          <div className="mb-2">
            <input
              className="w-full px-2 py-1 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 mb-1"
              placeholder="View name"
              value={viewName}
              onChange={e => setViewName(e.target.value)}
            />
            <button
              className="w-full py-1 rounded bg-green-700 text-white font-bold mt-1"
              onClick={() => {
                if (viewName.trim()) {
                  onSave(viewName.trim(), currentLayout);
                  setViewName("");
                  setShowInput(false);
                }
              }}
            >
              Save Current View
            </button>
          </div>
          <div className="max-h-40 overflow-y-auto">
            {views.length === 0 && <div className="text-zinc-400 text-xs">No saved views</div>}
            {views.map(view => (
              <div key={view.id} className="flex items-center justify-between mb-1">
                <button
                  className="text-left text-zinc-200 hover:underline text-xs flex-1"
                  onClick={() => { onLoad(view); setShowInput(false); }}
                >
                  {view.name}
                </button>
                <button
                  className="ml-2 text-red-500 text-xs"
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
