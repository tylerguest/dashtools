"use client";

import React from "react";
import { filesViewClassNames } from '../../styles/classNames';
import { useFilesView } from '../../hooks/useFilesView';
import FilesToolbar from './FilesToolbar';
import FilesList from './FilesList';

export default function FilesView() {
  const {
    files,
    setFiles,
    sortBy,
    setSortBy,
    sortAsc,
    setSortAsc,
    viewMode,
    setViewMode,
    sortDropdownOpen,
    setSortDropdownOpen,
    sortedFiles,
    handleSort,
  } = useFilesView();

  return (
    <div className={filesViewClassNames.container}>
      <FilesToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        sortAsc={sortAsc}
        sortDropdownOpen={sortDropdownOpen}
        setSortDropdownOpen={setSortDropdownOpen}
        handleSort={handleSort}
      />
      <div className={filesViewClassNames.list}>
        <FilesList files={sortedFiles} viewMode={viewMode} />
      </div>
    </div>
  );
}
