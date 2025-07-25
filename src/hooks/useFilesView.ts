import { useState } from 'react';

export interface FileItem {
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

export function useFilesView() {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [sortBy, setSortBy] = useState<'name' | 'type'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

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

  return {
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
  };
}
