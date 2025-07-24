
import React from 'react';
import clsx from 'clsx';
import { windowHeaderClassNames, buttonClassNames } from '../../styles/classNames';

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
  {
    label: 'Files',
    children: [
      { key: 'files', label: 'Files' },
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
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => { if (!isDropdownOpen) setSubmenuOpen(null); }, [isDropdownOpen]);

  React.useEffect(() => {
    if (!isDropdownOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, setIsDropdownOpen]);


  return (
    <div className={windowHeaderClassNames.header}>
      <div className="relative flex items-center">
        <button
          onClick={e => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
          className={`${buttonClassNames.base} ${buttonClassNames.icon}`}
          aria-label="Open window menu"
          tabIndex={0}
          type="button"
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
            ref={dropdownRef}
            className={windowHeaderClassNames.dropdown}
            tabIndex={-1}
            role="menu"
          >
            {menuData.map(category => (
              <div
                key={category.label}
                className={windowHeaderClassNames.menuCategory}
                onMouseEnter={() => setSubmenuOpen(category.label)}
                onMouseLeave={() => setSubmenuOpen(null)}
                onFocus={() => setSubmenuOpen(category.label)}
                onBlur={() => setSubmenuOpen(null)}
              >
                <button
                  className={`${buttonClassNames.base} ${buttonClassNames.ghost} ${buttonClassNames.sizes.md} w-full flex justify-between items-center`}
                  tabIndex={0}
                  aria-haspopup={category.children ? 'menu' : undefined}
                  aria-expanded={submenuOpen === category.label}
                  type="button"
                >
                  <span>{category.label}</span>
                  {category.children && (
                    <svg className="ml-2 w-3 h-3 text-zinc-400 group-hover:text-zinc-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  )}
                </button>
                {category.children && submenuOpen === category.label && (
                  <div
                    className={windowHeaderClassNames.submenu}
                    role="menu"
                  >
                    {category.children.map(item => (
                      <button
                        key={item.key}
                        className={`${buttonClassNames.base} ${buttonClassNames.ghost} ${buttonClassNames.sizes.sm} w-full text-left`}
                        onClick={e => { e.stopPropagation(); onContentChange && onContentChange(item.key); setIsDropdownOpen(false); setSubmenuOpen(null); }}
                        tabIndex={0}
                        role="menuitem"
                        type="button"
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
      <div className={windowHeaderClassNames.titleContainer}>
        <span className={windowHeaderClassNames.title}>{title}</span>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onClose(); }}
        className={`${buttonClassNames.base} ${buttonClassNames.icon}`}
        aria-label="Close window"
        type="button"
      >
        ×
      </button>
    </div>
  );
};

export default WindowHeader;
