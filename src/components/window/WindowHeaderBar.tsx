import React from 'react';
import WindowHeader from './WindowHeader';
import { windowClassNames } from '../../styles/classNames';
import { WindowContent as WindowContentType } from '../../types/window';

interface WindowHeaderBarProps {
  id: number;
  content: string;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  updateWindow: (id: number, data: any) => void;
  removeWindow: (id: number) => void;
  onDragMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const WindowHeaderBar: React.FC<WindowHeaderBarProps> = ({
  id,
  content,
  isDropdownOpen,
  setIsDropdownOpen,
  updateWindow,
  removeWindow,
  onDragMouseDown,
}) => (
  <div className={windowClassNames.header} onMouseDown={onDragMouseDown}>
    <WindowHeader
      isDropdownOpen={isDropdownOpen}
      setIsDropdownOpen={setIsDropdownOpen}
      onContentChange={(option: string) => {
        updateWindow(id, { content: option as WindowContentType });
      }}
      onClose={() => removeWindow(id)}
    />
  </div>
);

export default WindowHeaderBar;