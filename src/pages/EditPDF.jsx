import React from 'react';
import { Link } from 'react-router-dom';
import FileUploader from '../components/FileUploader/FileUploader';
import PDFEditor from '../components/PDFEditor/PDFEditor';
import { usePDF } from '../contexts/PDFContext';

const EditPDF = () => {
  const { files, error, clearError } = usePDF();

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Edit PDF Online - Free</h1>
        <p className="text-gray-600">
          Upload your PDF file to add text, images, shapes, and more. Make changes directly online without any watermarks.
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

      {/* File uploader if no files selected */}
      {files.length === 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Upload a PDF to Edit</h2>
          <FileUploader
            accept=".pdf"
            multiple={false}
            maxSize={100}
            instructions="Drag & drop your PDF here, or click to select file"
          />
        </div>
      )}

      {/* PDF Editor when files are uploaded */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <PDFEditor />
      </div>

      {/* Features section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">PDF Editor Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg border">
            <div className="text-blue-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Add Text & Images</h3>
            <p className="text-gray-600 text-sm">
              Add text, images, and shapes to your PDF documents. Customize fonts, sizes, and colors.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border">
            <div className="text-purple-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Draw & Annotate</h3>
            <p className="text-gray-600 text-sm">
              Draw directly on your PDF, highlight important sections, and add comments or annotations.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border">
            <div className="text-green-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Fill & Sign Forms</h3>
            <p className="text-gray-600 text-sm">
              Complete PDF forms by adding text, checkmarks, and signatures to documents.
            </p>
          </div>
        </div>
      </div>

      {/* Related tools */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Other PDF Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            to="/ai-pdf-summarizer"
            className="bg-white p-4 rounded-lg border text-center hover:shadow-md transition"
          >
            <div className="text-pink-600 mb-2 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-medium">AI Summarizer</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditPDF;