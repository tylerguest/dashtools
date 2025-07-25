import React from 'react';
import { buttonClassNames } from '../../../styles/classNames';

interface FilesToolbarProps {
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;
  sortBy: 'name' | 'type';
  sortAsc: boolean;
  sortDropdownOpen: boolean;
  setSortDropdownOpen: (open: boolean | ((v: boolean) => boolean)) => void;
  handleSort: (by: 'name' | 'type') => void;
}

const FilesToolbar: React.FC<FilesToolbarProps> = ({
  viewMode,
  setViewMode,
  sortBy,
  sortAsc,
  sortDropdownOpen,
  setSortDropdownOpen,
  handleSort,
}) => (
  <div className="flex items-center gap-2 p-2 border-b border-zinc-800 bg-zinc-900">
    <button
      className={buttonClassNames.base}
      title="New Folder"
      aria-label="New Folder"
      onClick={() => alert('Create Folder (not implemented)')}
    >
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v6m3-3h-6" />
      </svg>
    </button>
    <button
      className={buttonClassNames.base}
      title="Upload File"
      aria-label="Upload File"
      onClick={() => alert('Upload File (not implemented)')}
    >
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l4-4 4 4m-4-4v12" />
      </svg>
    </button>
    <button
      className={buttonClassNames.base}
      title={viewMode === 'list' ? 'Switch to Grid View' : 'Switch to List View'}
      aria-label={viewMode === 'list' ? 'Switch to Grid View' : 'Switch to List View'}
      onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
    >
      {viewMode === 'list' ? (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
        </svg>
      ) : (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="4" y="6" width="16" height="2" rx="1"/>
          <rect x="4" y="11" width="16" height="2" rx="1"/>
          <rect x="4" y="16" width="16" height="2" rx="1"/>
        </svg>
      )}
    </button>
    <div className="flex-1" />
    <div className="relative">
      <button
        className={buttonClassNames.base}
        title="Sort"
        aria-label="Sort"
        onClick={() => setSortDropdownOpen(v => !v)}
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 12h12M9 17h6" />
        </svg>
      </button>
      {sortDropdownOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-zinc-900 border border-zinc-800 rounded shadow-lg z-10">
          <button
            className={`w-full text-left px-4 py-2 hover:bg-zinc-800 ${sortBy === 'name' ? 'font-bold text-zinc-100' : 'text-zinc-300'}`}
            onClick={() => { handleSort('name'); setSortDropdownOpen(false); }}
          >
            Name {sortBy === 'name' && (sortAsc ? '↑' : '↓')}
          </button>
          <button
            className={`w-full text-left px-4 py-2 hover:bg-zinc-800 ${sortBy === 'type' ? 'font-bold text-zinc-100' : 'text-zinc-300'}`}
            onClick={() => { handleSort('type'); setSortDropdownOpen(false); }}
          >
            Type {sortBy === 'type' && (sortAsc ? '↑' : '↓')}
          </button>
        </div>
      )}
    </div>
  </div>
);

export default FilesToolbar;
