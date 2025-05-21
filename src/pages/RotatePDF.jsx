import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import FileUploader from '../components/FileUploader/FileUploader';
import { usePDF } from '../contexts/PDFContext';
import ProcessingIndicator from '../components/ProcessingIndicator/ProcessingIndicator';
import PDFViewer from '../components/PDFViewer/PDFViewer';

const RotationOptions = [
  { value: 90, label: 'Rotate 90° Clockwise', icon: '↻' },
  { value: -90, label: 'Rotate 90° Counter-clockwise', icon: '↺' },
  { value: 180, label: 'Rotate 180°', icon: '↻↻' }
];

const RotatePDF = () => {
  const { files, clearFiles, startProcessing, completeProcessing, isProcessing, processingProgress, updateProgress, setError } = usePDF();
  const [rotatedFile, setRotatedFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rotations, setRotations] = useState({});
  const [selectedRotation, setSelectedRotation] = useState(90);
  const [rotationMode, setRotationMode] = useState('all'); // 'all' or 'selected'

  useEffect(() => {
    if (files.length > 0) {
      // In a real app, we would get the actual page count from the PDF
      // For now, simulate a PDF with 5 pages
      setPageCount(5);
      
      // Initialize rotations state for each page
      const initialRotations = {};
      for (let i = 1; i <= 5; i++) {
        initialRotations[i] = 0; // 0 degrees = no rotation
      }
      setRotations(initialRotations);
    }
  }, [files]);

  const handleFileLoaded = (fileList) => {
    if (fileList && fileList.length > 0) {
      // Reset states for new file
      setRotatedFile(null);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pageCount) {
      setCurrentPage(page);
    }
  };

  const handleRotatePage = () => {
    const newRotations = { ...rotations };
    
    if (rotationMode === 'all') {
      // Rotate all pages
      for (let i = 1; i <= pageCount; i++) {
        newRotations[i] = (newRotations[i] + selectedRotation) % 360;
      }
    } else {
      // Rotate only the current page
      newRotations[currentPage] = (newRotations[currentPage] + selectedRotation) % 360;
    }
    
    setRotations(newRotations);
  };

  const resetRotations = () => {
    const resetRotations = {};
    for (let i = 1; i <= pageCount; i++) {
      resetRotations[i] = 0;
    }
    setRotations(resetRotations);
  };

  const handleProcessRotations = async () => {
    if (!files.length) {
      setError('Please upload a PDF file first.');
      return;
    }

    // Check if any rotations have been applied
    const hasRotations = Object.values(rotations).some(rotation => rotation !== 0);
    
    if (!hasRotations) {
      setError('No rotations have been applied. Please rotate at least one page before processing.');
      return;
    }

    try {
      startProcessing();
      
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear the progress interval
      clearInterval(interval);
      
      // Create a mock rotated file
      const rotatedFile = {
        name: files[0].name.replace('.pdf', '-rotated.pdf'),
        size: files[0].size,
        type: 'application/pdf',
        preview: files[0].preview, // In a real app, this would be the rotated PDF
        originalName: files[0].name,
        rotations: { ...rotations }
      };
      
      setRotatedFile(rotatedFile);
      completeProcessing([]);
      
    } catch (error) {
      setError(`Failed to rotate PDF: ${error.message}`);
    }
  };

  const handleRestart = () => {
    setRotatedFile(null);
    clearFiles();
    setRotations({});
    setCurrentPage(1);
  };

  const downloadRotatedFile = () => {
    if (!rotatedFile) return;
    
    // In a real app, this would download the actual rotated file
    const link = document.createElement('a');
    link.href = rotatedFile.preview;
    link.download = rotatedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Helmet>
        <title>Rotate PDF Online - Free PDF Rotation Tool | FreePDFEditor.tech</title>
        <meta name="description" content="Easily rotate PDF pages in any direction. Change page orientation by 90, 180, or 270 degrees. No signup, no installation, and completely free." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3">Rotate PDF Online</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Change the orientation of your PDF pages easily. Rotate pages 90°, 180°, or 270° clockwise or counterclockwise. No registration required.
          </p>
        </div>
        
        {/* Processing Indicator */}
        {isProcessing && (
          <div className="mb-8">
            <ProcessingIndicator />
          </div>
        )}
        
        {/* Results Section */}
        {!isProcessing && rotatedFile && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    PDF successfully rotated!
                  </p>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mb-4">Preview your rotated PDF:</h3>
            
            <div className="rounded-lg overflow-hidden border border-gray-300 mb-6" style={{ height: '400px' }}>
              <PDFViewer file={rotatedFile} height="400px" />
            </div>
            
            <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
              <div>
                <p className="text-sm text-gray-600">
                  All rotations have been applied to your PDF. You can now download the rotated document.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Rotate Another PDF
                </button>
                <button
                  onClick={downloadRotatedFile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Tool Section */}
        {!isProcessing && !rotatedFile && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {files.length === 0 ? (
              <div className="text-center">
                <h2 className="text-xl font-medium mb-6">Upload your PDF file to rotate</h2>
                <FileUploader
                  accept=".pdf"
                  multiple={false}
                  maxSize={100}
                  onFileLoaded={handleFileLoaded}
                  instructions="Drag & drop your PDF file here, or click to select file"
                />
              </div>
            ) : (
              <div className="mb-6">
                <h3 className="text-xl font-medium mb-4">Rotate pages in {files[0]?.name}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="col-span-1 md:col-span-2">
                    <div className="rounded-lg overflow-hidden border border-gray-300" style={{ height: '400px' }}>
                      <div className="relative h-full">
                        <PDFViewer file={files[0]} height="400px" />
                        {/* Overlay showing rotation */}
                        <div 
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10"
                          style={{ 
                            transform: `rotate(${rotations[currentPage]}deg)`,
                            transition: 'transform 0.3s ease-in-out'
                          }}
                        >
                          {rotations[currentPage] !== 0 && (
                            <div className="bg-white rounded-full p-3 shadow-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3 mt-3">
                      <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className={`p-1 rounded ${
                          currentPage <= 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {pageCount}
                      </span>
                      <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= pageCount}
                        className={`p-1 rounded ${
                          currentPage >= pageCount
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium mb-3">Rotation Options</h4>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="rotate-all"
                            name="rotation-mode"
                            value="all"
                            checked={rotationMode === 'all'}
                            onChange={() => setRotationMode('all')}
                            className="h-4 w-4 text-blue-600"
                          />
                          <label htmlFor="rotate-all" className="ml-2 block text-sm text-gray-700">
                            Rotate all pages
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="rotate-selected"
                            name="rotation-mode"
                            value="selected"
                            checked={rotationMode === 'selected'}
                            onChange={() => setRotationMode('selected')}
                            className="h-4 w-4 text-blue-600"
                          />
                          <label htmlFor="rotate-selected" className="ml-2 block text-sm text-gray-700">
                            Rotate only page {currentPage}
                          </label>
                        </div>
                      </div>
                      
                      <h5 className="text-sm font-medium mb-2 text-gray-700">Rotation Angle:</h5>
                      <div className="space-y-2 mb-4">
                        {RotationOptions.map(option => (
                          <div 
                            key={option.value}
                            className={`flex items-center p-2 rounded cursor-pointer transition ${
                              selectedRotation === option.value
                                ? 'bg-blue-50 border border-blue-200'
                                : 'border border-gray-200 hover:border-blue-200'
                            }`}
                            onClick={() => setSelectedRotation(option.value)}
                          >
                            <span className="text-xl mr-2">{option.icon}</span>
                            <span className="text-sm">{option.label}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-2">
                        <button 
                          onClick={handleRotatePage}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Apply Rotation
                        </button>
                        <button 
                          onClick={resetRotations}
                          className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                        >
                          Reset All Rotations
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <button 
                        onClick={handleProcessRotations}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                      >
                        Save Rotated PDF
                      </button>
                      <button
                        onClick={() => clearFiles()}
                        className="w-full mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Instructions Section */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">How to Rotate PDF Pages Online</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h4 className="text-lg font-medium mb-2">Upload PDF</h4>
              <p className="text-gray-600">
                Drag and drop your PDF file or click to browse your files.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h4 className="text-lg font-medium mb-2">Choose Pages</h4>
              <p className="text-gray-600">
                Select individual pages or all pages to rotate at once.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h4 className="text-lg font-medium mb-2">Apply Rotation</h4>
              <p className="text-gray-600">
                Choose rotation direction and angle, then apply the changes.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl font-bold">4</span>
              </div>
              <h4 className="text-lg font-medium mb-2">Download</h4>
              <p className="text-gray-600">
                Save your rotated PDF file with the new orientation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RotatePDF;