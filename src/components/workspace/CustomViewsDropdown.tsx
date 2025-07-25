import React from "react";
import { customViewsMenuClassNames, buttonClassNames } from '../../styles/classNames';

export function CustomViewsDropdown({
  customViews,
  viewName,
  setViewName,
  addCustomView,
  removeCustomView,
  currentLayout,
  setShowInput,
  dropdownAlignRight,
}: any) {
  return (
    <div
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
        {customViews.map((view: any) => (
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
  );
}