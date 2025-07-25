import React from 'react';
import WindowHeader from './WindowHeader';
import { windowClassNames } from '../../styles/classNames';
import { WindowContent as WindowContentType } from '../../types/window';

interface WindowHeaderBarProps {
  id: number;
  content: string;
  title: string;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  updateWindow: (id: number, data: any) => void;
  removeWindow: (id: number) => void;
}

const WindowHeaderBar: React.FC<WindowHeaderBarProps> = ({
  id,
  content,
  title,
  isDropdownOpen,
  setIsDropdownOpen,
  updateWindow,
  removeWindow,
}) => (
  <div className={windowClassNames.header}>
    <WindowHeader
      title={title}
      isDropdownOpen={isDropdownOpen}
      setIsDropdownOpen={setIsDropdownOpen}
      onContentChange={(option: string) => {
        updateWindow(id, { content: option as WindowContentType, title });
      }}
      onClose={() => removeWindow(id)}
    />
  </div>
);

export default WindowHeaderBar;