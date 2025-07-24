
import React from 'react';
import { windowResizerClassNames } from '../../styles/classNames';

interface WindowResizerProps { onResizeMouseDown: (e: React.MouseEvent, direction: string) => void; }

const WindowResizer: React.FC<WindowResizerProps> = ({ onResizeMouseDown }) => (
  <>
    <div className={windowResizerClassNames.nw} onMouseDown={e => onResizeMouseDown(e, 'nw')} />
    <div className={windowResizerClassNames.ne} onMouseDown={e => onResizeMouseDown(e, 'ne')} />
    <div className={windowResizerClassNames.sw} onMouseDown={e => onResizeMouseDown(e, 'sw')} />
    <div className={windowResizerClassNames.se} onMouseDown={e => onResizeMouseDown(e, 'se')} />
    <div className={windowResizerClassNames.n} onMouseDown={e => onResizeMouseDown(e, 'n')} />
    <div className={windowResizerClassNames.s} onMouseDown={e => onResizeMouseDown(e, 's')} />
    <div className={windowResizerClassNames.w} onMouseDown={e => onResizeMouseDown(e, 'w')} />
    <div className={windowResizerClassNames.e} onMouseDown={e => onResizeMouseDown(e, 'e')} />
  </>
);

export default WindowResizer;
