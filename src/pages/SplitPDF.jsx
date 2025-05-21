import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import FileUploader from '../components/FileUploader/FileUploader';
import { usePDF } from '../contexts/PDFContext';
import ProcessingIndicator from '../components/ProcessingIndicator/ProcessingIndicator';
import PDFViewer from '../components/PDFViewer/PDFViewer';

const SplitPDF = () => {
  const { files, clearFiles, startProcessing, completeProcessing, isProcessing, processingProgress, updateProgress, setError } = usePDF();
  const [pageRanges, setPageRanges] = useState('');
  const [splitFiles, setSplitFiles] = useState([]);
  const [currentPageCount, setCurrentPageCount] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);

  const handleFileLoaded = async (fileList) => {
    if (fileList.length > 0) {
      try {
        // In a real implementation, we would detect the number of pages
        // For now, let's simulate that we got a PDF with 10 pages
        setCurrentPageCount(10);
        setPreviewMode(true);
      } catch (error) {
        setError(`Error loading PDF: ${error.message}`);
      }
    }
  };

  const validatePageRanges = () => {
    if (!pageRanges.trim()) {
      setError('Please enter page ranges to split the document.');
      return false;
    }

    const ranges = pageRanges.split(',').map(range => range.trim());
    for (const range of ranges) {
      if (range.includes('-')) {
        const [start, end] = range.split('-').map(Number);
        if (isNaN(start) || isNaN(end) || start < 1 || end > currentPageCount || start > end) {
          setError(`Invalid page range: ${range}. Please use format like 1-3,5,8-10.`);
          return false;
        }
      } else {
        const page = Number(range);
        if (isNaN(page) || page < 1 || page > currentPageCount) {
          setError(`Invalid page number: ${range}. Please use format like 1-3,5,8-10.`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSplit = async () => {
    if (!files.length) {
      setError('Please upload a PDF file first.');
      return;
    }

    if (!validatePageRanges()) {
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
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Clear the progress interval
      clearInterval(interval);
      
      // Parse the page ranges and simulate creating split files
      const ranges = pageRanges.split(',').map(range => range.trim());
      const splitResults = ranges.map((range, index) => {
        let rangeDescription;
        
        if (range.includes('-')) {
          rangeDescription = `Pages ${range}`;
        } else {
          rangeDescription = `Page ${range}`;
        }
        
        return {
          name: `split-${index + 1}_${rangeDescription}.pdf`,
          size: Math.floor(files[0].size / ranges.length),
          type: 'application/pdf',
          preview: files[0].preview, // Use the first file's preview as a mock
          pages: range
        };
      });
      
      setSplitFiles(splitResults);
      completeProcessing([]);
      
    } catch (error) {
      setError(`Failed to split PDF: ${error.message}`);
    }
  };

  const handleRestart = () => {
    setSplitFiles([]);
    setPreviewMode(false);
    clearFiles();
    setPageRanges('');
  };

  const downloadSplitFile = (file) => {
    // In a real app, this would download the actual split file
    const link = document.createElement('a');
    link.href = file.preview;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Helmet>
        <title>Split PDF Online - Free PDF Splitter | FreePDFEditor.tech</title>
        <meta name="description" content="Split your PDF into multiple documents by page ranges. No signup, no installation, and no watermarks. Free online PDF splitter tool." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3">Split PDF Online</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Separate your PDF into multiple files by selecting specific pages or page ranges. No registration required, 100% free and secure.
          </p>
        </div>
        
        {/* Processing Indicator */}
        {isProcessing && (
          <div className="mb-8">
            <ProcessingIndicator />
          </div>
        )}
        
        {/* Results Section */}
        {!isProcessing && splitFiles.length > 0 && (
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
                    PDF successfully split into {splitFiles.length} {splitFiles.length === 1 ? 'file' : 'files'}!
                  </p>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mb-4">Your split files are ready to download:</h3>
            
            <div className="space-y-4 mb-6">
              {splitFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {Math.round(file.size / 1024)} KB • Pages: {file.pages}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadSplitFile(file)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleRestart}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Split Another PDF
              </button>
            </div>
          </div>
        )}
        
        {/* Tool Section */}
        {!isProcessing && splitFiles.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {!previewMode ? (
              <div className="text-center">
                <h2 className="text-xl font-medium mb-6">Upload your PDF file to split</h2>
                <FileUploader
                  accept=".pdf"
                  multiple={false}
                  maxSize={100}
                  onFileLoaded={handleFileLoaded}
                  instructions="Drag & drop your PDF file here, or click to select file"
                />
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-2">Your PDF ({files[0]?.name})</h3>
                  <div className="rounded-lg overflow-hidden border border-gray-300 mb-6" style={{ height: '400px' }}>
                    <PDFViewer file={files[0]} height="400px" />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Total pages: {currentPageCount}</p>
                  
                  <div className="mb-6">
                    <label htmlFor="pageRanges" className="block text-sm font-medium text-gray-700 mb-2">
                      Enter page ranges to split (e.g., 1-3,5,8-10):
                    </label>
                    <input
                      type="text"
                      id="pageRanges"
                      value={pageRanges}
                      onChange={(e) => setPageRanges(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1-3,5,8-10"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Separate page ranges with commas. Use a hyphen for consecutive pages.
                    </p>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSplit}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Split PDF
                    </button>
                    <button
                      onClick={() => {
                        clearFiles();
                        setPreviewMode(false);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions Section */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">How to Split a PDF Online</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <h4 className="text-lg font-medium mb-2">Select Pages</h4>
              <p className="text-gray-600">
                Enter page ranges you want to extract (e.g., 1-3,5,7-10).
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h4 className="text-lg font-medium mb-2">Download Files</h4>
              <p className="text-gray-600">
                Click the download button to save each split PDF file.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SplitPDF;