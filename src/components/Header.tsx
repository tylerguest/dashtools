"use client";

import React from 'react';
import UserMenu from './UserMenu';
import FPSMonitor from './FPSMonitor';
import { headerClassNames } from '../styles/classNames';

interface HeaderProps {
  onNewWindow: () => void;
  children?: React.ReactNode;
}

export default function Header({ onNewWindow, children }: HeaderProps) {
  return (
    <header className={headerClassNames.header}>
      <div className={headerClassNames.left}>
        <h1 className={headerClassNames.title}>dashtools</h1>
      </div>
      <div className={headerClassNames.right}>
        <FPSMonitor />
        <button onClick={onNewWindow} className={headerClassNames.newWindowButton}>+</button>
        {children}
        <UserMenu />
      </div>
    </header>
  );
}