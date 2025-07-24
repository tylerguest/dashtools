"use client";

import React, { useState } from "react";
import { buttonClassNames } from '../../styles/classNames';
import { filesViewClassNames } from '../../styles/classNames';
import { useState as useDropdownState } from 'react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  date?: string;
}

const initialFiles: FileItem[] = [
  { id: '1', name: 'Documents', type: 'folder' },
  { id: '2', name: 'Photos', type: 'folder' },
  { id: '3', name: 'Resume.pdf', type: 'file' },
  { id: '4', name: 'Notes.txt', type: 'file' },
];

export default function FilesView() {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [sortBy, setSortBy] = useState<'name' | 'type'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const sortedFiles = [...files].sort((a, b) => {
    if (sortBy === 'name') {
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else {
      if (a.type === b.type) return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      return sortAsc ? (a.type === 'folder' ? -1 : 1) : (a.type === 'folder' ? 1 : -1);
    }
  });

  const handleSort = (by: 'name' | 'type') => {
    if (sortBy === by) setSortAsc(!sortAsc);
    else { setSortBy(by); setSortAsc(true); }
  };

  const [sortDropdownOpen, setSortDropdownOpen] = useDropdownState(false);
  return (
    <div className={filesViewClassNames.container}>
      {/* Toolbar */}
      <div className={filesViewClassNames.toolbar}>
        {/* Icon-only buttons with tooltips */}
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
        {/* Sort dropdown */}
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
      {/* File/Folder List */}
      <div className={filesViewClassNames.list}>
        {sortedFiles.length === 0 ? (
          <div className={filesViewClassNames.empty}>No files or folders.</div>
        ) : viewMode === 'list' ? (
          sortedFiles.map(item => (
            <div
              key={item.id}
              className={filesViewClassNames.rowBase}
              onClick={() => alert(`Open ${item.type}: ${item.name}`)}
            >
              <span className={filesViewClassNames.icon}>
                {item.type === 'folder' ? '📁' : '📄'}
              </span>
              <span className={filesViewClassNames.name}>{item.name}</span>
              <span className={filesViewClassNames.type}>{item.type}</span>
            </div>
          ))
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {sortedFiles.map(item => (
              <div
                key={item.id}
                className={filesViewClassNames.gridItem}
                onClick={() => alert(`Open ${item.type}: ${item.name}`)}
              >
                <span className="text-4xl mb-2">
                  {item.type === 'folder' ? '📁' : '📄'}
                </span>
                <span className="text-zinc-100 font-medium truncate w-full text-center">{item.name}</span>
                <span className="text-zinc-400 text-xs mt-1">{item.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
