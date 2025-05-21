import React, { useState, useRef, useCallback } from 'react';
import { usePDF } from '../../contexts/PDFContext';

const FileUploader = ({ 
  accept = '.pdf',
  multiple = false,
  maxSize = 100, // Max size in MB
  maxFiles = 10,
  instructions = 'Drag & drop your PDF here, or click to select file'
}) => {
  const { addFiles, setCurrentFile, setError, clearError, files } = usePDF();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Handle drag events
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    if (droppedFiles.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files at once.`);
      return;
    }
    
    processPDFFiles(droppedFiles);
  }, [maxFiles, setError]);

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files at once.`);
      return;
    }
    
    processPDFFiles(selectedFiles);
    
    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Process and validate PDF files
  const processPDFFiles = (selectedFiles) => {
    clearError();
    
    // Filter files by type if accept is specified
    const filteredByType = selectedFiles.filter(file => {
      if (accept === '*') return true;
      const fileType = file.type || '';
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      // Check if the file type matches the accepted types
      if (accept.includes(fileType)) return true;
      
      // Check file extension if type checking fails
      if (accept.includes(`.${fileExtension}`)) return true;
      
      return false;
    });
    
    if (filteredByType.length < selectedFiles.length) {
      setError(`Only ${accept} files are accepted.`);
      return;
    }
    
    // Check file size
    const filteredBySize = filteredByType.filter(file => {
      const fileSizeInMB = file.size / (1024 * 1024);
      return fileSizeInMB <= maxSize;
    });
    
    if (filteredBySize.length < filteredByType.length) {
      setError(`Files must be smaller than ${maxSize}MB.`);
      return;
    }
    
    // Add files to the context
    if (filteredBySize.length > 0) {
      // Convert File objects to objects with preview URLs
      const filesWithPreview = filteredBySize.map(file => {
        return {
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: URL.createObjectURL(file)
        };
      });
      
      addFiles(filesWithPreview);
      
      // Set the first file as current if none is selected
      if (!multiple && filesWithPreview.length > 0) {
        setCurrentFile(filesWithPreview[0]);
      }
    }
  };

  return (
    <div className="w-full">
      <div
        onClick={() => fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          flex flex-col items-center justify-center
          border-2 border-dashed rounded-lg
          p-6 md:p-10 cursor-pointer
          transition-all duration-300
          ${isDragging 
            ? 'border-blue-600 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }
        `}
      >
        {/* Upload icon */}
        <svg 
          className={`w-12 h-12 mb-3 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        
        {/* Instructions */}
        <p className={`text-sm md:text-base text-center ${isDragging ? 'text-blue-600' : 'text-gray-600'}`}>
          {instructions}
        </p>
        
        {/* Accept file types and size limit */}
        <p className="mt-2 text-xs text-gray-500">
          {accept !== '*' ? `Accepted file types: ${accept}` : 'All file types accepted'} · 
          Max file size: {maxSize}MB {multiple ? `· Max files: ${maxFiles}` : ''}
        </p>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default FileUploader;