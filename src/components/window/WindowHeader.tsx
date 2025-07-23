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
        className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/60 rounded-none transition-all focus:outline-none focus:ring-2 focus:ring-zinc-500 shadow-md bg-zinc-800/80 backdrop-blur"
        aria-label="Open window menu"
        tabIndex={0}
      >
        {/* Modern hamburger icon */}
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="5" width="22" height="2.2" rx="1.1" fill="currentColor"/>
          <rect y="10" width="22" height="2.2" rx="1.1" fill="currentColor"/>
          <rect y="15" width="22" height="2.2" rx="1.1" fill="currentColor"/>
        </svg>
      </button>
      {isDropdownOpen && (
        <div
          className="absolute top-8 left-0 min-w-[150px] max-w-[200px] bg-zinc-900/95 backdrop-blur border border-zinc-700 rounded-none shadow-xl z-50 py-1 flex flex-col gap-0 animate-fadeIn"
          tabIndex={-1}
          role="menu"
        >
          {['stockchart', 'quotemonitor', 'chatbot', 'notes'].map(option => {
            const displayNames: Record<string, string> = {
              stockchart: 'Stock Chart',
              quotemonitor: 'Quote Monitor',
              chatbot: 'Chatbot',
              notes: 'Notes'
            };
            return (
              <button
                key={option}
                className="block w-full text-left px-3 py-2 text-zinc-100 hover:bg-zinc-700/60 hover:text-white text-sm rounded-none transition-all focus:outline-none focus:bg-zinc-700/80 focus:text-white"
                onClick={e => {
                  e.stopPropagation();
                  onContentChange && onContentChange(option);
                  setIsDropdownOpen(false);
                }}
                tabIndex={0}
                role="menuitem"
              >
                {displayNames[option]}
              </button>
            );
          })}
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
