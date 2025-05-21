import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FileUploader from '../components/FileUploader/FileUploader';
import { usePDF } from '../contexts/PDFContext';
import PDFViewer from '../components/PDFViewer/PDFViewer';
import ProcessingIndicator from '../components/ProcessingIndicator/ProcessingIndicator';

const AISummarize = () => {
  const {
    files,
    currentFile,
    setCurrentFile,
    error,
    clearError,
    startProcessing,
    updateProgress,
    completeProcessing,
    isProcessing,
  } = usePDF();

  const [summary, setSummary] = useState(null);
  const [summaryLength, setSummaryLength] = useState('medium'); // 'short', 'medium', 'long'
  const [summaryStyle, setSummaryStyle] = useState('concise'); // 'concise', 'detailed', 'bullet'
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const summaryRef = useRef(null);

  // Set current file when files change and none is selected
  useEffect(() => {
    if (files.length > 0 && !currentFile) {
      setCurrentFile(files[0]);
    }
  }, [files, currentFile, setCurrentFile]);

  // Simulate PDF text extraction
  const extractTextFromPDF = async (file) => {
    // In a real app, this would use PDF.js to extract text from PDF
    // For demo purposes, we'll just simulate the extraction
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis nec nunc aliquam " +
          "tincidunt at vel massa. Integer ac bibendum risus. Donec euismod, nisi id consectetur " +
          "aliquam, nunc nisi aliquam massa, id aliquam nunc nisi id nunc. Donec euismod, nisi id " +
          "consectetur aliquam, nunc nisi aliquam massa, id aliquam nunc nisi id nunc. " +
          "This is sample text extracted from the PDF file that would be used for AI summarization. " +
          "In a real implementation, we would use PDF.js to extract the actual text content from " +
          "the uploaded PDF document. The AI would then process this text to generate a concise summary."
        );
      }, 1500);
    });
  };

  // Handle generating summary
  const handleGenerateSummary = async () => {
    if (!currentFile) {
      return;
    }

    try {
      startProcessing();
      setIsLoading(true);

      // Simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 5;
        if (progress > 95) {
          progress = 95;
          clearInterval(interval);
        }
        updateProgress(progress);
      }, 200);

      // Step 1: Extract text from PDF (simulation)
      const extractedText = await extractTextFromPDF(currentFile);
      setExtractedText(extractedText);

      // Step 2: Generate AI summary (simulation)
      // In a real app, this would call an AI API like OpenAI
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Clear the progress interval
      clearInterval(interval);

      // Generate different summaries based on selected options
      let generatedSummary = '';
      
      if (summaryStyle === 'bullet') {
        generatedSummary = `
          <ul class="list-disc pl-5 space-y-2">
            <li>This document discusses various approaches to document understanding and summarization.</li>
            <li>The text emphasizes the importance of extracting key information from lengthy documents.</li>
            <li>Multiple methodologies for text summarization are presented, including extractive and abstractive approaches.</li>
            ${summaryLength === 'long' ? '<li>The document highlights the benefits of AI-powered summarization for improving productivity.</li><li>Various use cases for automatic document summarization are provided across different industries.</li>' : ''}
            ${summaryLength === 'short' ? '' : '<li>The conclusion suggests implementing these techniques can save significant time in document review processes.</li>'}
          </ul>
        `;
      } else if (summaryStyle === 'detailed') {
        if (summaryLength === 'short') {
          generatedSummary = `
            <p>This document provides an overview of document summarization techniques with a focus on AI-powered solutions. It covers both traditional and modern approaches to extracting key information from text documents.</p>
          `;
        } else if (summaryLength === 'medium') {
          generatedSummary = `
            <p>This document provides a comprehensive overview of document summarization techniques with a particular focus on AI-powered solutions. The content explores both traditional extractive methods and modern abstractive approaches to condensing text while maintaining critical information.</p>
            <p>The document highlights several key benefits of automatic summarization, including time savings and improved information retrieval efficiency across various industries and use cases.</p>
          `;
        } else {
          generatedSummary = `
            <p>This document provides a comprehensive overview of document summarization techniques with a particular focus on AI-powered solutions. The content explores both traditional extractive methods and modern abstractive approaches to condensing text while maintaining critical information.</p>
            <p>The authors present a detailed analysis of different methodologies, comparing their effectiveness across various document types and lengths. Case studies demonstrate the practical applications in fields such as legal document review, academic research, and business intelligence.</p>
            <p>The document highlights several key benefits of automatic summarization, including time savings and improved information retrieval efficiency. It concludes with recommendations for implementing these technologies in organizational workflows and suggests future directions for research in this field.</p>
          `;
        }
      } else { // concise
        if (summaryLength === 'short') {
          generatedSummary = `
            <p>The document discusses AI-based document summarization techniques and their applications in improving information processing efficiency.</p>
          `;
        } else if (summaryLength === 'medium') {
          generatedSummary = `
            <p>The document discusses AI-based document summarization techniques, comparing extractive and abstractive methods. It highlights applications across multiple industries and notes significant efficiency improvements in document processing workflows.</p>
          `;
        } else {
          generatedSummary = `
            <p>The document provides an in-depth analysis of AI-based document summarization techniques, comparing traditional extractive methods with modern abstractive approaches. It presents case studies across legal, academic, and business domains, demonstrating time savings and improved information retrieval. The authors recommend specific implementation strategies and suggest directions for future research in automated text summarization.</p>
          `;
        }
      }

      // Set the summary
      setSummary({
        html: generatedSummary,
        text: generatedSummary.replace(/<[^>]*>/g, ''), // Strip HTML for plain text version
        date: new Date().toISOString(),
      });

      // Complete the processing
      updateProgress(100);
      completeProcessing([]);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Copy summary to clipboard
  const handleCopySummary = () => {
    if (summary) {
      navigator.clipboard.writeText(summary.text);
      
      // Show temporary "Copied!" notification
      const originalText = document.getElementById('copy-button').innerText;
      document.getElementById('copy-button').innerText = 'Copied!';
      setTimeout(() => {
        document.getElementById('copy-button').innerText = originalText;
      }, 2000);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">AI PDF Summarizer</h1>
        <p className="text-gray-600">
          Upload a PDF document and get an AI-generated summary. Perfect for quickly understanding long documents.
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left side - PDF upload and viewer */}
        <div className="lg:col-span-3">
          {/* File uploader if no files selected */}
          {files.length === 0 ? (
            <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Upload a PDF to Summarize</h2>
              <FileUploader
                accept=".pdf"
                multiple={false}
                maxSize={100}
                instructions="Drag & drop your PDF here, or click to select file"
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">PDF Document</h2>
              {/* File selection dropdown if multiple files */}
              {files.length > 1 && (
                <div className="mb-4">
                  <label htmlFor="file-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Select PDF to summarize:
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
              
              {/* PDF viewer */}
              {currentFile && (
                <div className="mb-4">
                  <PDFViewer file={currentFile} height="500px" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side - Summary controls and results */}
        <div className="lg:col-span-2">
          {/* Summary settings */}
          <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Summary Options</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="summary-length" className="block text-sm font-medium text-gray-700 mb-1">
                  Summary Length:
                </label>
                <select
                  id="summary-length"
                  value={summaryLength}
                  onChange={(e) => setSummaryLength(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="short">Short (1-2 sentences)</option>
                  <option value="medium">Medium (1-2 paragraphs)</option>
                  <option value="long">Long (3+ paragraphs)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="summary-style" className="block text-sm font-medium text-gray-700 mb-1">
                  Summary Style:
                </label>
                <select
                  id="summary-style"
                  value={summaryStyle}
                  onChange={(e) => setSummaryStyle(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="concise">Concise</option>
                  <option value="detailed">Detailed</option>
                  <option value="bullet">Bullet Points</option>
                </select>
              </div>
              
              <button
                onClick={handleGenerateSummary}
                disabled={!currentFile || isProcessing}
                className={`w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white 
                  ${(!currentFile || isProcessing) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isProcessing ? 'Generating...' : 'Generate Summary'}
              </button>
            </div>
          </div>
          
          {/* Summary results */}
          {summary && (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Summary Results</h2>
                <button
                  id="copy-button"
                  onClick={handleCopySummary}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy
                </button>
              </div>
              
              <div className="prose max-w-none" ref={summaryRef} dangerouslySetInnerHTML={{ __html: summary.html }} />
              
              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                Generated on {new Date(summary.date).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg border">
            <div className="text-blue-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">AI-Powered Summarization</h3>
            <p className="text-gray-600 text-sm">
              Advanced AI analyzes your PDF document to extract key information and generate a concise summary.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border">
            <div className="text-purple-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Customizable Summaries</h3>
            <p className="text-gray-600 text-sm">
              Choose between different summary lengths and styles to get exactly the information you need.
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
              All PDF processing happens in your browser. Your documents are never uploaded to external servers.
            </p>
          </div>
        </div>
      </div>

      {/* Related tools */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Other PDF Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            to="/merge-pdf-files"
            className="bg-white p-4 rounded-lg border text-center hover:shadow-md transition"
          >
            <div className="text-purple-600 mb-2 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
            <span className="text-sm font-medium">Merge PDF</span>
          </Link>

          <Link
            to="/split-pdf-online"
            className="bg-white p-4 rounded-lg border text-center hover:shadow-md transition"
          >
            <div className="text-green-600 mb-2 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
            <span className="text-sm font-medium">Split PDF</span>
          </Link>

          <Link
            to="/fill-pdf-form-online"
            className="bg-white p-4 rounded-lg border text-center hover:shadow-md transition"
          >
            <div className="text-yellow-600 mb-2 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium">Fill PDF Forms</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AISummarize;