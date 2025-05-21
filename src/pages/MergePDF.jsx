import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FileUploader from '../components/FileUploader/FileUploader';
import { usePDF } from '../contexts/PDFContext';
import PDFViewer from '../components/PDFViewer/PDFViewer';
import ProcessingIndicator from '../components/ProcessingIndicator/ProcessingIndicator';

const MergePDF = () => {
  const { 
    files, 
    addFiles, 
    startProcessing, 
    updateProgress, 
    completeProcessing, 
    isProcessing, 
    processingProgress,
    error,
    clearError,
    removeFile
  } = usePDF();
  
  const [mergedFile, setMergedFile] = useState(null);
  const [dragState, setDragState] = useState({
    isDragging: false,
    draggedItem: null,
    dragOverItem: null
  });

  // Handle file order rearrangement via drag and drop
  const handleDragStart = (e, position) => {
    setDragState({
      ...dragState,
      isDragging: true,
      draggedItem: position
    });
  };

  const handleDragEnter = (e, position) => {
    e.preventDefault();
    if (position !== dragState.draggedItem) {
      setDragState({
        ...dragState,
        dragOverItem: position
      });
    }
  };

  const handleDragEnd = () => {
    // Create a copy of the files array
    const filesCopy = [...files];
    
    // Only reorder if we have both source and destination
    if (dragState.draggedItem !== null && dragState.dragOverItem !== null) {
      // Remove the dragged item
      const draggedItemContent = filesCopy[dragState.draggedItem];
      
      // Remove the item from its original position
      filesCopy.splice(dragState.draggedItem, 1);
      
      // Insert the item at the new position
      filesCopy.splice(dragState.dragOverItem, 0, draggedItemContent);
      
      // Update the PDF context with the new file order
      addFiles([]);  // Clear existing files
      setTimeout(() => addFiles(filesCopy), 0);  // Add reordered files
    }
    
    // Reset the drag state
    setDragState({
      isDragging: false,
      draggedItem: null,
      dragOverItem: null
    });
  };

  // Handle merging the PDFs
  const handleMergePDFs = async () => {
    if (files.length < 2) {
      return;
    }

    try {
      // Start the processing state
      startProcessing();
      
      // Simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 95) {
          progress = 95;
          clearInterval(interval);
        }
        updateProgress(progress);
      }, 200);

      // Simulate PDF merging operation with a delay
      // In a real application, this would use PDF.js or a backend service to merge PDFs
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Clear the progress interval
      clearInterval(interval);
      
      // Create a mock merged file
      // In a real implementation, this would be the actual merged PDF
      setMergedFile({
        name: `merged-document-${new Date().getTime()}.pdf`,
        size: files.reduce((total, file) => total + file.size, 0),
        type: 'application/pdf',
        preview: files[0].preview // This would be the merged PDF URL in a real implementation
      });
      
      // Complete the processing
      updateProgress(100);
      completeProcessing([]);
      
    } catch (error) {
      console.error('Error merging PDFs:', error);
      clearError();
      // In a real app, you would set an error message here
    }
  };

  // Remove a file from the list
  const handleRemoveFile = (index) => {
    removeFile(index);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Merge PDF Files</h1>
        <p className="text-gray-600">
          Combine multiple PDF files into a single document. Upload, arrange the order, and merge your PDFs easily.
        </p>
      </div>

      {/* Alert for errors */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {error}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={clearError}
                  className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <div className="mb-6">
          <ProcessingIndicator />
        </div>
      )}

      {/* Merged PDF preview if available */}
      {!isProcessing && mergedFile && (
        <div className="mb-8">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  PDFs successfully merged!
                </p>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-medium mb-3">Preview merged document:</h3>
          
          <PDFViewer file={mergedFile} height="500px" />
          
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setMergedFile(null)}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Merge Different Files
            </button>
            
            <button
              onClick={() => {
                // In a real app, this would download the merged file
                const link = document.createElement('a');
                link.href = mergedFile.preview;
                link.download = mergedFile.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Download Merged PDF
            </button>
          </div>
        </div>
      )}
      
      {/* File uploader if no merged file */}
      {!mergedFile && (
        <div>
          {/* File uploader */}
          {files.length < 2 && (
            <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Upload PDFs to Merge</h2>
              <FileUploader
                accept=".pdf"
                multiple={true}
                maxSize={100}
                maxFiles={10}
                instructions="Drag & drop your PDF files here, or click to select files"
              />
              
              {files.length === 1 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700">
                  <p>You need at least 2 PDF files to merge. Please upload another file.</p>
                </div>
              )}
            </div>
          )}

          {/* Files list for reordering */}
          {files.length > 0 && (
            <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">
                  {files.length > 1 ? 'Arrange Files in Desired Order' : 'Selected Files'}
                </h2>
                
                {files.length > 1 && (
                  <button
                    onClick={handleMergePDFs}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                    Merge PDFs
                  </button>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                {files.length > 1 
                  ? 'Drag and drop files to rearrange the order. The first file will be the first page of the merged document.' 
                  : 'Upload more PDF files to merge them together.'}
              </p>
              
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center p-3 rounded border ${
                      dragState.dragOverItem === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    } hover:bg-gray-50 transition-colors cursor-move`}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center bg-blue-100 text-blue-700 mr-3">
                      <span className="font-medium text-sm">{index + 1}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="ml-2 p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              
              {files.length < 10 && (
                <div className="mt-4">
                  <FileUploader
                    accept=".pdf"
                    multiple={true}
                    maxSize={100}
                    maxFiles={10 - files.length}
                    instructions="Add more PDFs"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Features section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg border">
            <div className="text-blue-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Combine Multiple Files</h3>
            <p className="text-gray-600 text-sm">
              Merge any number of PDF files into a single document quickly and easily.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border">
            <div className="text-purple-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Rearrange Pages</h3>
            <p className="text-gray-600 text-sm">
              Drag and drop to reorder files before merging to get exactly the document structure you need.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border">
            <div className="text-green-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Secure Processing</h3>
            <p className="text-gray-600 text-sm">
              All PDF processing happens in your browser. Your files are never uploaded to a server.
            </p>
          </div>
        </div>
      </div>

      {/* Related tools */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Other PDF Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/split-pdf-online"
            className="bg-white p-4 rounded-lg border text-center hover:shadow-md transition"
          >
            <div className="text-purple-600 mb-2 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" />
              </svg>
            </div>
            <span className="text-sm font-medium">Split PDF</span>
          </Link>

          <Link
            to="/edit-pdf-online-free"
            className="bg-white p-4 rounded-lg border text-center hover:shadow-md transition"
          >
            <div className="text-blue-600 mb-2 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="text-sm font-medium">Edit PDF</span>
          </Link>

          <Link
            to="/compress-pdf-online"
            className="bg-white p-4 rounded-lg border text-center hover:shadow-md transition"
          >
            <div className="text-yellow-600 mb-2 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <span className="text-sm font-medium">Compress PDF</span>
          </Link>

          <Link
            to="/rotate-pdf-online"
            className="bg-white p-4 rounded-lg border text-center hover:shadow-md transition"
          >
            <div className="text-green-600 mb-2 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span className="text-sm font-medium">Rotate PDF</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MergePDF;