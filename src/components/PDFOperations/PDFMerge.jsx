import React, { useState, useEffect } from 'react';
import { usePDF } from '../../contexts/PDFContext';
import PDFViewer from '../PDFViewer/PDFViewer';
import ProcessingIndicator from '../ProcessingIndicator/ProcessingIndicator';

const PDFMerge = () => {
  const { files, removeFile, startProcessing, completeProcessing, isProcessing, processingProgress, updateProgress, setError } = usePDF();
  const [fileOrder, setFileOrder] = useState([]);
  const [mergedFile, setMergedFile] = useState(null);

  // Update file order when files change
  useEffect(() => {
    setFileOrder(files.map((_, index) => index));
  }, [files]);

  // Move a file up in the order
  const moveUp = (index) => {
    if (index <= 0) return;
    
    const newOrder = [...fileOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index - 1];
    newOrder[index - 1] = temp;
    setFileOrder(newOrder);
  };

  // Move a file down in the order
  const moveDown = (index) => {
    if (index >= fileOrder.length - 1) return;
    
    const newOrder = [...fileOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index + 1];
    newOrder[index + 1] = temp;
    setFileOrder(newOrder);
  };

  // Handle file removal
  const handleRemove = (index) => {
    removeFile(index);
    
    // Update file order
    const newOrder = fileOrder.filter(i => i !== index).map(i => i > index ? i - 1 : i);
    setFileOrder(newOrder);
  };
  
  // Process the merge operation
  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please upload at least two PDF files to merge.');
      return;
    }
    
    try {
      // Start processing
      startProcessing();
      
      // In a real app, this would call the backend or use PDF-lib to merge the files
      // For now, we'll simulate the process
      
      // Simulate processing progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 99) {
          progress = 99;
          clearInterval(interval);
        }
        updateProgress(progress);
      }, 200);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Clear the progress interval
      clearInterval(interval);
      
      // Simulate the merged file (in reality, this would be the result from the backend)
      // Here we just use the first file as a "mock" result
      if (files.length > 0) {
        setMergedFile({
          name: 'merged-document.pdf',
          size: files.reduce((total, file) => total + file.size, 0),
          type: 'application/pdf',
          preview: files[0].preview // Use the first file's preview as a mock
        });
      }
      
      // Complete processing
      completeProcessing([]);
    } catch (error) {
      setError(`Failed to merge PDFs: ${error.message}`);
    }
  };
  
  return (
    <div className="w-full">
      {/* Show processing indicator if merging in progress */}
      {isProcessing && (
        <div className="mb-6">
          <ProcessingIndicator />
        </div>
      )}
      
      {/* Show merged file preview if available */}
      {!isProcessing && mergedFile && (
        <div className="mb-6">
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
              Merge More Files
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
      
      {/* Show file list if not showing merged result */}
      {!isProcessing && !mergedFile && (
        <div>
          <h3 className="text-lg font-medium mb-3">
            Arrange your files in the order you want them merged:
          </h3>
          
          {files.length === 0 ? (
            <p className="text-gray-500">No files uploaded yet. Please upload PDF files to merge.</p>
          ) : (
            <ul className="space-y-3 mb-4">
              {fileOrder.map((fileIndex, orderIndex) => {
                const file = files[fileIndex];
                return (
                  <li 
                    key={`file-${fileIndex}`}
                    className="border rounded-lg p-3 bg-white flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-6 text-center">{orderIndex + 1}</span>
                      <span className="ml-3 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <span className="ml-2 truncate">{file.name}</span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({Math.round(file.size / 1024)} KB)
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => moveUp(orderIndex)}
                        disabled={orderIndex === 0}
                        className={`p-1 rounded ${
                          orderIndex === 0
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        aria-label="Move up"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => moveDown(orderIndex)}
                        disabled={orderIndex === fileOrder.length - 1}
                        className={`p-1 rounded ${
                          orderIndex === fileOrder.length - 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        aria-label="Move down"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleRemove(fileIndex)}
                        className="p-1 rounded text-gray-600 hover:bg-gray-100 hover:text-red-600"
                        aria-label="Remove"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          
          {/* Merge button */}
          <div className="mt-4">
            <button
              onClick={handleMerge}
              disabled={files.length < 2}
              className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                files.length < 2
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } w-full`}
            >
              Merge {files.length} PDFs
            </button>
            <p className="mt-2 text-sm text-gray-500 text-center">
              {files.length < 2
                ? 'Please upload at least 2 PDF files to merge.'
                : `Your ${files.length} files will be combined in the order shown above.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFMerge;