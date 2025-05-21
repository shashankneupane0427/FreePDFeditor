import React, { useState, useEffect } from 'react';
import { usePDF } from '../../contexts/PDFContext';
import PDFViewer from '../PDFViewer/PDFViewer';
import ProcessingIndicator from '../ProcessingIndicator/ProcessingIndicator';

const PDFEditor = () => {
  const { files, currentFile, setCurrentFile, startProcessing, completeProcessing, isProcessing, processingProgress, updateProgress, setError } = usePDF();
  const [editedFile, setEditedFile] = useState(null);
  const [editorMode, setEditorMode] = useState('text'); // text, draw, image, etc.
  const [textAnnotations, setTextAnnotations] = useState([]);

  // Set current file when files change and none is selected
  useEffect(() => {
    if (files.length > 0 && !currentFile) {
      setCurrentFile(files[0]);
    }
  }, [files, currentFile, setCurrentFile]);

  // Tool selection handler
  const handleToolSelection = (mode) => {
    setEditorMode(mode);
  };

  // Add text annotation
  const addTextAnnotation = () => {
    const newAnnotation = {
      id: Date.now(),
      type: 'text',
      text: 'New text',
      x: 100,
      y: 100,
      fontSize: 12,
      color: '#000000'
    };
    
    setTextAnnotations([...textAnnotations, newAnnotation]);
  };

  // Save edited PDF
  const handleSave = async () => {
    if (!currentFile) {
      setError('Please upload a PDF file to edit.');
      return;
    }
    
    try {
      // Start processing
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
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Clear the progress interval
      clearInterval(interval);
      
      // Simulate the edited file (in reality, this would be the result from applying edits)
      setEditedFile({
        name: `edited-${currentFile.name}`,
        size: currentFile.size,
        type: currentFile.type,
        preview: currentFile.preview // In a real app, this would be the edited PDF
      });
      
      // Complete processing
      completeProcessing([]);
    } catch (error) {
      setError(`Failed to save edited PDF: ${error.message}`);
    }
  };

  // If no files, show a message
  if (files.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6 text-center">
        <p className="text-gray-600">Please upload a PDF file to start editing.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Show processing indicator if processing */}
      {isProcessing && (
        <div className="mb-6">
          <ProcessingIndicator />
        </div>
      )}
      
      {/* Show edited file download options if available */}
      {!isProcessing && editedFile && (
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
                  PDF successfully edited!
                </p>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-medium mb-3">Preview edited document:</h3>
          
          <PDFViewer file={editedFile} height="500px" />
          
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setEditedFile(null)}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Continue Editing
            </button>
            
            <button
              onClick={() => {
                // In a real app, this would download the edited file
                const link = document.createElement('a');
                link.href = editedFile.preview;
                link.download = editedFile.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Download Edited PDF
            </button>
          </div>
        </div>
      )}
      
      {/* Show PDF editor interface if not showing edited result */}
      {!isProcessing && !editedFile && (
        <div>
          {/* File selection dropdown if multiple files */}
          {files.length > 1 && (
            <div className="mb-4">
              <label htmlFor="file-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select PDF to edit:
              </label>
              <select
                id="file-select"
                value={files.indexOf(currentFile)}
                onChange={(e) => setCurrentFile(files[parseInt(e.target.value)])}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {files.map((file, index) => (
                  <option key={index} value={index}>
                    {file.name} ({Math.round(file.size / 1024)} KB)
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Editing tools */}
          <div className="bg-white rounded-lg border mb-4">
            <div className="p-3 border-b">
              <h3 className="font-medium">Editing Tools</h3>
            </div>
            <div className="p-3 flex flex-wrap gap-2">
              <button
                onClick={() => handleToolSelection('text')}
                className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
                  editorMode === 'text' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Text
              </button>
              
              <button
                onClick={() => handleToolSelection('draw')}
                className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
                  editorMode === 'draw' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Draw
              </button>
              
              <button
                onClick={() => handleToolSelection('image')}
                className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
                  editorMode === 'image' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Image
              </button>
              
              <button
                onClick={() => handleToolSelection('shape')}
                className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
                  editorMode === 'shape' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Shapes
              </button>
              
              <button
                onClick={() => handleToolSelection('highlight')}
                className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
                  editorMode === 'highlight' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Highlight
              </button>
              
              <button
                onClick={() => handleToolSelection('erase')}
                className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
                  editorMode === 'erase' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Erase
              </button>
            </div>
            
            {/* Tool-specific options */}
            {editorMode === 'text' && (
              <div className="p-3 border-t">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={addTextAnnotation}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm"
                  >
                    Add Text
                  </button>
                  
                  <select className="rounded-md border-gray-300 text-sm py-1.5">
                    <option value="12">12pt</option>
                    <option value="14">14pt</option>
                    <option value="16">16pt</option>
                    <option value="18">18pt</option>
                  </select>
                  
                  <select className="rounded-md border-gray-300 text-sm py-1.5">
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier">Courier</option>
                    <option value="Helvetica">Helvetica</option>
                  </select>
                  
                  <input type="color" defaultValue="#000000" className="h-8 w-8 rounded-md p-0" />
                </div>
              </div>
            )}
          </div>
          
          {/* PDF viewer */}
          <div className="mb-4 relative">
            {currentFile && (
              <PDFViewer file={currentFile} height="600px" />
            )}
            
            {/* Annotations (would be positioned absolutely over the PDF) */}
            {/* In a real implementation, these would be layered over the PDF with correct positioning */}
          </div>
          
          {/* Save button */}
          <div className="mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 w-full"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFEditor;