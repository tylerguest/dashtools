import React from 'react';
import { filesViewClassNames } from '../../../styles/classNames';
import { FileItem } from '../../../hooks/useFilesView';

interface FilesListProps {
  files: FileItem[];
  viewMode: 'list' | 'grid';
}

const FilesList: React.FC<FilesListProps> = ({ files, viewMode }) => {
  if (files.length === 0) {
    return <div className={filesViewClassNames.empty}>No files or folders.</div>;
  }
  if (viewMode === 'list') {
    return (
      <>
        {files.map(item => (
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
        ))}
      </>
    );
  }
  // grid
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {files.map(item => (
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
  );
};

export default FilesList;
