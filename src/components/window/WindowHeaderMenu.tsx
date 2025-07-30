import React from 'react';
import { windowHeaderClassNames, windowHeaderMenuButton, windowHeaderMenuItem } from '../../styles/classNames';
import { useClickAway } from '../../hooks/useClickAway';

interface MenuCategory {
  label: string;
  children?: { key: string; label: string }[];
}

interface WindowHeaderMenuProps {
  menuData: MenuCategory[];
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  onContentChange?: (content: string) => void;
}

export function WindowHeaderMenu({
  menuData,
  isDropdownOpen,
  setIsDropdownOpen,
  onContentChange,
}: WindowHeaderMenuProps) {
  const [submenuOpen, setSubmenuOpen] = React.useState<string | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  useClickAway(
    [dropdownRef as React.RefObject<Element>],
    () => setIsDropdownOpen(false),
    isDropdownOpen
  );

  React.useEffect(() => { if (!isDropdownOpen) setSubmenuOpen(null); }, [isDropdownOpen]);

  if (!isDropdownOpen) return null;

  return (
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
            className={windowHeaderMenuButton() + ' justify-start'}
            tabIndex={0}
            aria-haspopup={category.children ? 'menu' : undefined}
            aria-expanded={submenuOpen === category.label}
            type="button"
          >
            <span className="block w-full text-left">{category.label}</span>
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
                  className={windowHeaderMenuItem() + ' justify-start'}
                  onClick={e => { e.stopPropagation(); onContentChange && onContentChange(item.key); setIsDropdownOpen(false); setSubmenuOpen(null); }}
                  tabIndex={0}
                  role="menuitem"
                  type="button"
                >
                  <span className="block w-full text-left">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}