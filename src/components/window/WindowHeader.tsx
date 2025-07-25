import React from 'react';
import { windowHeaderClassNames, buttonClassNames } from '../../styles/classNames';
import { WindowHeaderMenu } from './WindowHeaderMenu';
import { windowMenuData } from './windowMenuData';

interface WindowHeaderProps {
  title: string;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  onContentChange?: (content: string) => void;
  onClose: () => void;
}

function MenuButton({ onClick, isOpen }: { onClick: (e: React.MouseEvent) => void; isOpen: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`${buttonClassNames.base} ${buttonClassNames.icon}`}
      aria-label="Open window menu"
      tabIndex={0}
      type="button"
      aria-expanded={isOpen}
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect y="5" width="22" height="2.2" rx="1.1" fill="currentColor"/>
        <rect y="10" width="22" height="2.2" rx="1.1" fill="currentColor"/>
        <rect y="15" width="22" height="2.2" rx="1.1" fill="currentColor"/>
      </svg>
    </button>
  );
}

const WindowHeader: React.FC<WindowHeaderProps> = ({
  title,
  isDropdownOpen,
  setIsDropdownOpen,
  onContentChange,
  onClose,
}) => {
  return (
    <div className={windowHeaderClassNames.header}>
      <div className="relative flex items-center">
        <MenuButton
          onClick={e => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
          isOpen={isDropdownOpen}
        />
        <WindowHeaderMenu
          menuData={windowMenuData}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          onContentChange={onContentChange}
        />
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