import React from 'react';

interface WindowHeaderProps {
  title: string;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  onContentChange?: (content: string) => void;
  onClose: () => void;
}

const menuData = [
  {
    label: 'Market',
    children: [
      { key: 'stockchart', label: 'Stock Chart' },
      { key: 'quotemonitor', label: 'Quote Monitor' },
    ],
  },
  {
    label: 'Productivity',
    children: [
      { key: 'notes', label: 'Notes' },
    ],
  },
  {
    label: 'AI',
    children: [
      { key: 'chatbot', label: 'Chatbot' },
    ],
  },
];

const WindowHeader: React.FC<WindowHeaderProps> = ({
  title,
  isDropdownOpen,
  setIsDropdownOpen,
  onContentChange,
  onClose,
}) => {
  const [submenuOpen, setSubmenuOpen] = React.useState<string | null>(null);
  // Close submenu when dropdown closes
  React.useEffect(() => { if (!isDropdownOpen) setSubmenuOpen(null); }, [isDropdownOpen]);
  return (
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
            className="absolute top-8 left-0 min-w-[170px] max-w-[220px] bg-zinc-900/95 backdrop-blur border border-zinc-700 rounded-none shadow-xl z-50 py-1 flex flex-col gap-0 animate-fadeIn"
            tabIndex={-1}
            role="menu"
          >
            {menuData.map(category => (
              <div
                key={category.label}
                className="relative group"
                onMouseEnter={() => setSubmenuOpen(category.label)}
                onMouseLeave={() => setSubmenuOpen(null)}
                onFocus={() => setSubmenuOpen(category.label)}
                onBlur={() => setSubmenuOpen(null)}
              >
                <button
                  className="block w-full text-left px-3 py-2 text-zinc-100 hover:bg-zinc-700/60 hover:text-white text-sm rounded-none transition-all focus:outline-none focus:bg-zinc-700/80 focus:text-white flex justify-between items-center"
                  tabIndex={0}
                  aria-haspopup={category.children ? 'menu' : undefined}
                  aria-expanded={submenuOpen === category.label}
                >
                  <span>{category.label}</span>
                  {category.children && (
                    <svg className="ml-2 w-3 h-3 text-zinc-400 group-hover:text-zinc-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  )}
                </button>
                {category.children && submenuOpen === category.label && (
                  <div
                    className="absolute left-full top-0 min-w-[150px] max-w-[200px] bg-zinc-900/95 backdrop-blur border border-zinc-700 rounded-none shadow-xl z-50 py-1 flex flex-col gap-0 animate-fadeIn"
                    role="menu"
                  >
                    {category.children.map(item => (
                      <button
                        key={item.key}
                        className="block w-full text-left px-3 py-2 text-zinc-100 hover:bg-zinc-700/60 hover:text-white text-sm rounded-none transition-all focus:outline-none focus:bg-zinc-700/80 focus:text-white"
                        onClick={e => {
                          e.stopPropagation();
                          onContentChange && onContentChange(item.key);
                          setIsDropdownOpen(false);
                          setSubmenuOpen(null);
                        }}
                        tabIndex={0}
                        role="menuitem"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
};

export default WindowHeader;
