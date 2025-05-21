import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import FileUploader from '../components/FileUploader/FileUploader';
import { usePDF } from '../contexts/PDFContext';
import ProcessingIndicator from '../components/ProcessingIndicator/ProcessingIndicator';
import PDFViewer from '../components/PDFViewer/PDFViewer';

// Define the format options with appropriate icons
const ConversionFormats = {
  fromPDF: [
    { id: 'word', name: 'PDF to Word', description: 'Convert PDF to editable DOCX', extension: '.docx', icon: 'document-text' },
    { id: 'jpg', name: 'PDF to JPG', description: 'Convert PDF pages to JPG images', extension: '.jpg', icon: 'photograph' },
    { id: 'png', name: 'PDF to PNG', description: 'Convert PDF pages to PNG images', extension: '.png', icon: 'photograph' },
    { id: 'ppt', name: 'PDF to PowerPoint', description: 'Convert PDF to editable PPTX', extension: '.pptx', icon: 'presentation-chart-bar' },
    { id: 'excel', name: 'PDF to Excel', description: 'Convert PDF tables to Excel', extension: '.xlsx', icon: 'table' },
    { id: 'txt', name: 'PDF to Text', description: 'Extract all text from PDF', extension: '.txt', icon: 'document' },
  ],
  toPDF: [
    { id: 'word-pdf', name: 'Word to PDF', description: 'Convert DOCX to PDF', inputFormat: '.docx', icon: 'document-text' },
    { id: 'jpg-pdf', name: 'JPG to PDF', description: 'Convert JPG images to PDF', inputFormat: '.jpg,.jpeg', icon: 'photograph' },
    { id: 'png-pdf', name: 'PNG to PDF', description: 'Convert PNG images to PDF', inputFormat: '.png', icon: 'photograph' },
    { id: 'ppt-pdf', name: 'PowerPoint to PDF', description: 'Convert PPTX to PDF', inputFormat: '.pptx,.ppt', icon: 'presentation-chart-bar' },
    { id: 'excel-pdf', name: 'Excel to PDF', description: 'Convert XLSX to PDF', inputFormat: '.xlsx,.xls', icon: 'table' },
  ]
};

// Icons mapping
const Icons = {
  'document-text': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
  ),
  'photograph': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
  ),
  'presentation-chart-bar': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  'table': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
    </svg>
  ),
  'document': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
    </svg>
  ),
};

const ConvertPDF = () => {
  const { files, clearFiles, startProcessing, completeProcessing, isProcessing, processingProgress, updateProgress, setError } = usePDF();
  const [convertedFile, setConvertedFile] = useState(null);
  const [conversionType, setConversionType] = useState('fromPDF'); // 'fromPDF' or 'toPDF'
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [conversionOptions, setConversionOptions] = useState({
    quality: 'high',
    includeImages: true,
    preserveFormatting: true
  });

  const handleFileLoaded = (fileList) => {
    if (fileList && fileList.length > 0) {
      // Clear any previous conversion results
      setConvertedFile(null);
    }
  };

  const handleFormatSelect = (format) => {
    setSelectedFormat(format);
  };

  const toggleConversionType = (type) => {
    setConversionType(type);
    setSelectedFormat(null);
    clearFiles();
  };

  const handleOptionChange = (option, value) => {
    setConversionOptions({
      ...conversionOptions,
      [option]: value
    });
  };

  const getAcceptedFileTypes = () => {
    if (conversionType === 'fromPDF') {
      return '.pdf';
    } else if (selectedFormat) {
      return selectedFormat.inputFormat;
    }
    return '*'; // Default to all files if no format is selected
  };

  const getExpectedOutputExtension = () => {
    if (conversionType === 'fromPDF' && selectedFormat) {
      return selectedFormat.extension;
    } else if (conversionType === 'toPDF') {
      return '.pdf';
    }
    return '';
  };

  const handleConversion = async () => {
    if (!files.length) {
      setError('Please upload a file first.');
      return;
    }

    if (!selectedFormat) {
      setError('Please select a conversion format.');
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
      
      // Simulate processing time based on file size
      const processingTime = 2000 + Math.random() * 2000;
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // Clear the progress interval
      clearInterval(interval);
      
      // Determine output file name based on conversion type
      let outputFileName;
      if (conversionType === 'fromPDF') {
        outputFileName = files[0].name.replace('.pdf', getExpectedOutputExtension());
      } else {
        outputFileName = files[0].name.split('.').slice(0, -1).join('.') + '.pdf';
      }
      
      // Create a mock converted file
      const mockConvertedFile = {
        name: outputFileName,
        size: Math.round(files[0].size * (conversionType === 'fromPDF' ? 0.8 : 1.2)), // Simulate different file sizes
        type: conversionType === 'fromPDF' ? 'application/' + selectedFormat.id : 'application/pdf',
        preview: files[0].preview, // In a real app, this would be the converted file preview
        originalName: files[0].name,
        conversionType,
        format: selectedFormat.id
      };
      
      setConvertedFile(mockConvertedFile);
      completeProcessing([]);
      
    } catch (error) {
      setError(`Failed to convert file: ${error.message}`);
    }
  };

  const handleRestart = () => {
    setConvertedFile(null);
    clearFiles();
  };

  const downloadConvertedFile = () => {
    if (!convertedFile) return;
    
    // In a real app, this would download the actual converted file
    const link = document.createElement('a');
    link.href = convertedFile.preview;
    link.download = convertedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  return (
    <>
      <Helmet>
        <title>
          {conversionType === 'fromPDF' 
            ? 'Convert PDF to Word, JPG, and More | FreePDFEditor.tech'
            : 'Convert to PDF - Word, Images to PDF | FreePDFEditor.tech'}
        </title>
        <meta 
          name="description" 
          content={
            conversionType === 'fromPDF'
              ? 'Convert your PDF files to Word, JPG, PNG, PowerPoint, Excel, or Text. Free online PDF converter with no watermarks.'
              : 'Convert Word documents, JPG images, PNG, PowerPoint, and Excel files to PDF format. Fast, free, and secure.'
          }
        />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3">
            {conversionType === 'fromPDF' 
              ? 'Convert PDF to Other Formats' 
              : 'Convert Files to PDF'}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {conversionType === 'fromPDF'
              ? 'Convert your PDF files to Word, JPG, PNG, PowerPoint, Excel, or Text. No registration required, 100% free and secure.'
              : 'Convert your Word documents, images, presentations, or spreadsheets to PDF format quickly and easily.'}
          </p>
        </div>
        
        {/* Conversion Type Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => toggleConversionType('fromPDF')}
              className={`px-4 py-2 text-sm font-medium border ${
                conversionType === 'fromPDF'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } rounded-l-lg`}
            >
              PDF to Other Formats
            </button>
            <button
              type="button"
              onClick={() => toggleConversionType('toPDF')}
              className={`px-4 py-2 text-sm font-medium border ${
                conversionType === 'toPDF'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } rounded-r-lg`}
            >
              Convert to PDF
            </button>
          </div>
        </div>
        
        {/* Processing Indicator */}
        {isProcessing && (
          <div className="mb-8">
            <ProcessingIndicator />
          </div>
        )}
        
        {/* Results Section */}
        {!isProcessing && convertedFile && (
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
                    File successfully converted!
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="mr-4 text-blue-500">
                {selectedFormat && Icons[selectedFormat.icon]}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg">{convertedFile.name}</h3>
                <p className="text-sm text-gray-500">
                  {formatFileSize(convertedFile.size)} • {conversionType === 'fromPDF' ? 'PDF converted to' : 'Converted to PDF from'} {selectedFormat.name.split(' to ')[1]}
                </p>
              </div>
              <button
                onClick={downloadConvertedFile}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Download
              </button>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleRestart}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Convert Another File
              </button>
            </div>
          </div>
        )}
        
        {/* Tool Section */}
        {!isProcessing && !convertedFile && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-4">1. Select conversion format</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {ConversionFormats[conversionType].map(format => (
                  <div
                    key={format.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                      selectedFormat && selectedFormat.id === format.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleFormatSelect(format)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`mb-2 ${selectedFormat && selectedFormat.id === format.id ? 'text-blue-600' : 'text-gray-500'}`}>
                        {Icons[format.icon]}
                      </div>
                      <h3 className="font-medium">{format.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{format.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedFormat && (
              <div className="mb-8">
                <h2 className="text-xl font-medium mb-4">
                  2. Upload your {conversionType === 'fromPDF' ? 'PDF file' : selectedFormat.name.split(' to ')[0]} file
                </h2>
                {files.length === 0 ? (
                  <FileUploader
                    accept={getAcceptedFileTypes()}
                    multiple={false}
                    maxSize={100}
                    onFileLoaded={handleFileLoaded}
                    instructions={`Drag & drop your ${conversionType === 'fromPDF' ? 'PDF' : selectedFormat.name.split(' to ')[0]} file here, or click to select`}
                  />
                ) : (
                  <div className="mb-6">
                    <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50 mb-4">
                      <div className="mr-4 text-blue-500">
                        {Icons[selectedFormat.icon]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{files[0].name}</h3>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(files[0].size)}
                        </p>
                      </div>
                      <button
                        onClick={clearFiles}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* File Preview */}
                    {files[0].type === 'application/pdf' && (
                      <div className="rounded-lg overflow-hidden border border-gray-300 mb-6" style={{ height: '300px' }}>
                        <PDFViewer file={files[0]} height="300px" />
                      </div>
                    )}
                    
                    {/* Conversion Options */}
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">3. Conversion Options</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quality:</label>
                          <div className="flex space-x-4">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="quality-high"
                                name="quality"
                                checked={conversionOptions.quality === 'high'}
                                onChange={() => handleOptionChange('quality', 'high')}
                                className="h-4 w-4 text-blue-600"
                              />
                              <label htmlFor="quality-high" className="ml-2 block text-sm text-gray-700">
                                High
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="quality-medium"
                                name="quality"
                                checked={conversionOptions.quality === 'medium'}
                                onChange={() => handleOptionChange('quality', 'medium')}
                                className="h-4 w-4 text-blue-600"
                              />
                              <label htmlFor="quality-medium" className="ml-2 block text-sm text-gray-700">
                                Medium
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="quality-low"
                                name="quality"
                                checked={conversionOptions.quality === 'low'}
                                onChange={() => handleOptionChange('quality', 'low')}
                                className="h-4 w-4 text-blue-600"
                              />
                              <label htmlFor="quality-low" className="ml-2 block text-sm text-gray-700">
                                Low
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="include-images"
                              checked={conversionOptions.includeImages}
                              onChange={(e) => handleOptionChange('includeImages', e.target.checked)}
                              className="h-4 w-4 text-blue-600 rounded"
                            />
                            <label htmlFor="include-images" className="ml-2 block text-sm text-gray-700">
                              Include images
                            </label>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="preserve-formatting"
                              checked={conversionOptions.preserveFormatting}
                              onChange={(e) => handleOptionChange('preserveFormatting', e.target.checked)}
                              className="h-4 w-4 text-blue-600 rounded"
                            />
                            <label htmlFor="preserve-formatting" className="ml-2 block text-sm text-gray-700">
                              Preserve formatting
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <button
                        onClick={handleConversion}
                        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Convert to {conversionType === 'fromPDF' ? selectedFormat.extension.substring(1).toUpperCase() : 'PDF'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Instructions Section */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">
            How to {conversionType === 'fromPDF' ? 'Convert PDF to Other Formats' : 'Convert Files to PDF'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h4 className="text-lg font-medium mb-2">Choose Format</h4>
              <p className="text-gray-600">
                Select your desired {conversionType === 'fromPDF' ? 'output' : 'input'} format from the available options.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h4 className="text-lg font-medium mb-2">Upload File</h4>
              <p className="text-gray-600">
                {conversionType === 'fromPDF'
                  ? 'Upload your PDF file that you want to convert.'
                  : 'Upload the file you want to convert to PDF format.'}
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h4 className="text-lg font-medium mb-2">Download</h4>
              <p className="text-gray-600">
                Wait for the conversion to complete and download your {conversionType === 'fromPDF' ? 'converted file' : 'PDF file'}.
              </p>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
            <div className="p-5">
              <h4 className="font-medium text-lg mb-2">
                {conversionType === 'fromPDF'
                  ? 'How accurate is the PDF to Word conversion?'
                  : 'Will my formatting be preserved when converting to PDF?'}
              </h4>
              <p className="text-gray-600">
                {conversionType === 'fromPDF'
                  ? 'Our PDF to Word converter maintains high accuracy for text, tables, and basic formatting. Complex layouts and special elements may have slight variations, but we strive to preserve the document structure as closely as possible.'
                  : 'Yes, our conversion tool is designed to maintain your original document\'s formatting, including fonts, images, tables, and layouts when converting to PDF. The high-quality setting ensures maximum fidelity to the source document.'}
              </p>
            </div>
            <div className="p-5">
              <h4 className="font-medium text-lg mb-2">Is there a file size limit for conversion?</h4>
              <p className="text-gray-600">
                Free users can convert files up to 100MB in size. For larger files, you may need to consider splitting your document first or compressing it before conversion.
              </p>
            </div>
            <div className="p-5">
              <h4 className="font-medium text-lg mb-2">Is my data secure during conversion?</h4>
              <p className="text-gray-600">
                Yes, your security is our priority. Files are processed securely with automatic deletion after conversion is complete. We never store or access your document content. All processing is done through secure, encrypted connections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConvertPDF;