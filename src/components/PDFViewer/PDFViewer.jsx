import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { usePDF } from '../../contexts/PDFContext';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFViewer = ({ file, width = '100%', height = '500px', zoom = 1 }) => {
  const canvasRef = useRef(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const { setError: setPDFContextError } = usePDF();

  // Load the PDF document when file changes
  useEffect(() => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    let fileUrl;
    
    // If file is an object with preview URL
    if (typeof file === 'object' && file.preview) {
      fileUrl = file.preview;
    } 
    // If file is an object with file property (from FileUploader)
    else if (typeof file === 'object' && file.file) {
      fileUrl = URL.createObjectURL(file.file);
    }
    // If file is a string URL
    else if (typeof file === 'string') {
      fileUrl = file;
    }
    // If file is a File object
    else if (file instanceof File) {
      fileUrl = URL.createObjectURL(file);
    }
    else {
      setError('Invalid file format');
      setLoading(false);
      return;
    }
    
    // Load the PDF document
    pdfjsLib.getDocument(fileUrl)
      .promise
      .then(doc => {
        setPdfDocument(doc);
        setTotalPages(doc.numPages);
        setCurrentPage(1);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading PDF:', err);
        setError('Failed to load PDF. Please make sure it\'s a valid PDF file.');
        setPDFContextError('Failed to load PDF. Please make sure it\'s a valid PDF file.');
        setLoading(false);
      });
      
    // Cleanup function to revoke object URLs
    return () => {
      if (fileUrl && (fileUrl.startsWith('blob:') || fileUrl.startsWith('data:'))) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [file, setPDFContextError]);
  
  // Render the PDF page when currentPage or zoom changes
  useEffect(() => {
    if (!pdfDocument) return;
    
    const renderPage = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      try {
        const page = await pdfDocument.getPage(currentPage);
        
        const viewport = page.getViewport({ scale: currentZoom });
        
        // Adjust canvas dimensions
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: canvas.getContext('2d'),
          viewport: viewport
        };
        
        await page.render(renderContext).promise;
      } catch (err) {
        console.error('Error rendering page:', err);
        setError('Failed to render PDF page.');
      }
    };
    
    renderPage();
  }, [pdfDocument, currentPage, currentZoom]);
  
  // Navigate to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Navigate to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Zoom in
  const zoomIn = () => {
    setCurrentZoom(prev => Math.min(prev + 0.25, 3));
  };
  
  // Zoom out
  const zoomOut = () => {
    setCurrentZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center bg-red-50 border border-red-200 rounded-lg p-6 w-full" style={{ height }}>
        <svg className="w-12 h-12 text-red-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-red-600 font-medium text-center">{error}</p>
        <p className="text-gray-500 mt-2 text-sm text-center">
          Please try uploading a different file or check if the file is a valid PDF.
        </p>
      </div>
    );
  }

  if (loading || !pdfDocument) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-6 w-full" style={{ height }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
        <p className="text-gray-600">Loading PDF...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* PDF Viewer controls */}
      <div className="flex flex-wrap items-center justify-between bg-gray-100 border border-gray-200 rounded-t-lg p-2 mb-1">
        <div className="flex items-center space-x-2">
          <button
            onClick={prevPage}
            disabled={currentPage <= 1}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={nextPage}
            disabled={currentPage >= totalPages}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={zoomOut}
            disabled={currentZoom <= 0.5}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          
          <span className="text-sm">
            {Math.round(currentZoom * 100)}%
          </span>
          
          <button
            onClick={zoomIn}
            disabled={currentZoom >= 3}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom in"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* PDF Canvas */}
      <div 
        className="overflow-auto border border-gray-200 rounded-b-lg bg-gray-50 flex justify-center"
        style={{ width, height: typeof height === 'string' ? height : `${height}px` }}
      >
        <canvas ref={canvasRef} className="pdf-canvas" />
      </div>
    </div>
  );
};

export default PDFViewer;