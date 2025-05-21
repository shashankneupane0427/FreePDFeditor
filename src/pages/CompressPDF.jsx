import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import FileUploader from '../components/FileUploader/FileUploader';
import { usePDF } from '../contexts/PDFContext';
import ProcessingIndicator from '../components/ProcessingIndicator/ProcessingIndicator';
import PDFViewer from '../components/PDFViewer/PDFViewer';

const CompressionLevels = [
  { id: 'low', name: 'Low Compression', quality: 'High quality', reduction: '20-30%' },
  { id: 'medium', name: 'Medium Compression', quality: 'Good quality', reduction: '40-60%' },
  { id: 'high', name: 'High Compression', quality: 'Reduced quality', reduction: '70-80%' }
];

const CompressPDF = () => {
  const { files, clearFiles, startProcessing, completeProcessing, isProcessing, processingProgress, updateProgress, setError } = usePDF();
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [compressedFile, setCompressedFile] = useState(null);
  const [originalSize, setOriginalSize] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);

  const handleFileLoaded = (fileList) => {
    if (fileList && fileList.length > 0) {
      setOriginalSize(fileList[0].size);
    }
  };

  const handleCompression = async () => {
    if (!files.length) {
      setError('Please upload a PDF file first.');
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
      
      // Simulate processing time based on compression level
      const processingTime = {
        low: 2000,
        medium: 3000,
        high: 4000
      };
      
      await new Promise(resolve => setTimeout(resolve, processingTime[compressionLevel]));
      
      // Clear the progress interval
      clearInterval(interval);
      
      // Calculate compression ratio based on selected level
      const compressionRatio = {
        low: 0.7,  // 30% reduction
        medium: 0.5,  // 50% reduction
        high: 0.25  // 75% reduction
      };
      
      const newSize = Math.round(files[0].size * compressionRatio[compressionLevel]);
      setCompressedSize(newSize);
      
      // Create a mock compressed file
      const compressedFile = {
        name: files[0].name.replace('.pdf', '-compressed.pdf'),
        size: newSize,
        type: 'application/pdf',
        preview: files[0].preview,
        originalName: files[0].name,
        compressionLevel: compressionLevel
      };
      
      setCompressedFile(compressedFile);
      completeProcessing([]);
      
    } catch (error) {
      setError(`Failed to compress PDF: ${error.message}`);
    }
  };

  const handleRestart = () => {
    setCompressedFile(null);
    setOriginalSize(null);
    setCompressedSize(null);
    clearFiles();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  const calcCompression = () => {
    if (originalSize && compressedSize) {
      const percentage = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
      return `${percentage}%`;
    }
    return '0%';
  };

  const downloadCompressedFile = () => {
    if (!compressedFile) return;
    
    // In a real app, this would download the actual compressed file
    const link = document.createElement('a');
    link.href = compressedFile.preview;
    link.download = compressedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Helmet>
        <title>Compress PDF Online - Free PDF Compressor | FreePDFEditor.tech</title>
        <meta name="description" content="Reduce your PDF file size while maintaining quality. No signup, no installation, and no watermarks. Free online PDF compression tool." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3">Compress PDF Online</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Reduce your PDF file size without losing document quality. Perfect for email attachments, uploading to websites, or saving storage space.
          </p>
        </div>
        
        {/* Processing Indicator */}
        {isProcessing && (
          <div className="mb-8">
            <ProcessingIndicator />
          </div>
        )}
        
        {/* Results Section */}
        {!isProcessing && compressedFile && (
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
                    PDF successfully compressed by {calcCompression()}!
                  </p>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mb-4">Compression Results:</h3>
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Original Size</p>
                <p className="text-xl font-semibold">{formatFileSize(originalSize)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Compressed Size</p>
                <p className="text-xl font-semibold">{formatFileSize(compressedSize)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Reduced By</p>
                <p className="text-xl font-semibold text-green-600">{calcCompression()}</p>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden border border-gray-300 mb-6" style={{ height: '400px' }}>
              <PDFViewer file={compressedFile} height="400px" />
            </div>
            
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  You saved {formatFileSize(originalSize - compressedSize)} with {CompressionLevels.find(l => l.id === compressionLevel).name}.
                </p>
                <p className="text-sm text-gray-600">
                  Your file is ready to download or you can try another compression level.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Compress Another PDF
                </button>
                <button
                  onClick={downloadCompressedFile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Tool Section */}
        {!isProcessing && !compressedFile && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-6 text-center">Upload your PDF file to compress</h2>
              <FileUploader
                accept=".pdf"
                multiple={false}
                maxSize={100}
                onFileLoaded={handleFileLoaded}
                instructions="Drag & drop your PDF file here, or click to select file"
              />
            </div>

            {files.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Select Compression Level:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {CompressionLevels.map((level) => (
                    <div 
                      key={level.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                        compressionLevel === level.id 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setCompressionLevel(level.id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{level.name}</h4>
                        {compressionLevel === level.id && (
                          <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{level.quality}</p>
                      <p className="text-sm text-gray-500">Size reduction: ~{level.reduction}</p>
                    </div>
                  ))}
                </div>
                
                <div className="rounded-lg overflow-hidden border border-gray-300 mb-6" style={{ height: '300px' }}>
                  <PDFViewer file={files[0]} height="300px" />
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Original size: {formatFileSize(originalSize)}
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => clearFiles()}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCompression}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Compress PDF
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions Section */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">How to Compress a PDF Online</h3>
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
              <h4 className="text-lg font-medium mb-2">Choose Level</h4>
              <p className="text-gray-600">
                Select your desired compression level based on your quality needs.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h4 className="text-lg font-medium mb-2">Download</h4>
              <p className="text-gray-600">
                Get your compressed PDF with reduced file size instantly.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
            <div className="p-5">
              <h4 className="font-medium text-lg mb-2">How does PDF compression work?</h4>
              <p className="text-gray-600">
                PDF compression reduces file size by optimizing images, removing redundant information, and using efficient compression algorithms. Different compression levels prioritize either quality preservation or maximum size reduction.
              </p>
            </div>
            <div className="p-5">
              <h4 className="font-medium text-lg mb-2">Will compression affect the quality of my PDF?</h4>
              <p className="text-gray-600">
                It depends on the compression level you choose. Low compression maintains high quality with minimal size reduction. Medium offers a balanced approach, while high compression achieves maximum size reduction with some quality trade-offs, particularly in images.
              </p>
            </div>
            <div className="p-5">
              <h4 className="font-medium text-lg mb-2">Is my data secure when using this tool?</h4>
              <p className="text-gray-600">
                Yes, your security is our priority. Files are processed in your browser when possible, and any server-side processing is done securely with automatic file deletion after processing. We never store or access your document content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompressPDF;