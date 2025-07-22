import React from 'react';

interface WindowHeaderProps {
  title: string;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  onContentChange?: (content: string) => void;
  onClose: () => void;
}

const WindowHeader: React.FC<WindowHeaderProps> = ({
  title,
  isDropdownOpen,
  setIsDropdownOpen,
  onContentChange,
  onClose,
}) => (
  <div className="p-2 bg-zinc-900 border-b border-zinc-700 text-zinc-200 font-normal text-sm flex justify-between items-center relative">
    <div className="relative flex items-center">
      <button
        onClick={e => {
          e.stopPropagation();
          setIsDropdownOpen(!isDropdownOpen);
        }}
        className="w-4 h-4 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 rounded text-xs font-bold"
      >
        ☰
      </button>
      {isDropdownOpen && (
        <div className="absolute top-6 left-0 bg-zinc-800 border border-zinc-600 rounded shadow-lg z-50 min-w-32 py-1">
          {['stockchart', 'quotemonitor', 'chatbot', 'notes'].map(option => (
            <button
              key={option}
              className="block w-full text-left px-4 py-2 text-zinc-200 hover:bg-zinc-700 text-sm"
              onClick={e => {
                e.stopPropagation();
                onContentChange && onContentChange(option);
                setIsDropdownOpen(false);
              }}
            >
              {option.charAt(0).toUpperCase() + option.slice(1).replace('chart', ' Chart').replace('monitor', ' Monitor')}
            </button>
          ))}
        </div>
      )}
    </div>
    <div className="flex-1 flex justify-center items-center select-none">
      <span className="text-zinc-200 text-base font-bold">{title}</span>
    </div>
    <button
      onClick={e => {
        e.stopPropagation();
        onClose();
      }}
      className="w-4 h-4 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 rounded text-xs font-bold"
    >
      ×
    </button>
  </div>
);

export default WindowHeader;
