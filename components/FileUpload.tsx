
import React, { useState, useCallback } from 'react';
import { UploadIcon, FileIcon, CloseIcon } from './icons';

interface FileUploadProps {
  onFileChange: (file: File) => void;
  clearFile: () => void;
  file: File | null;
  disabled: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, file, clearFile, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0]);
    }
  }, [onFileChange, disabled]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!file ? (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center w-full p-8 transition-all duration-300 border-2 border-dashed rounded-xl ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-blue-400'}`}
        >
          <input
            type="file"
            id="file-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileSelect}
            accept=".stl,.step,.stp,.iges,.igs,.obj,.3mf"
            disabled={disabled}
          />
          <UploadIcon className="w-12 h-12 text-gray-400" />
          <p className="mt-4 text-lg font-semibold text-gray-700">Drag & drop your CAD file here</p>
          <p className="mt-1 text-sm text-gray-500">or click to browse</p>
          <p className="mt-2 text-xs text-gray-400">Supported formats: STL, STEP, IGES, OBJ, 3MF</p>
        </div>
      ) : (
        <div className="relative p-6 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
          <button 
            onClick={clearFile} 
            className="absolute top-3 right-3 p-1 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Remove file"
            >
            <CloseIcon className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center justify-center">
            <FileIcon className="w-16 h-16 text-blue-500" />
            <p className="mt-4 font-medium text-gray-800 break-all">{file.name}</p>
            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
