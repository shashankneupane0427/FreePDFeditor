import React from 'react';
import { Link } from 'react-router-dom';
import ToolSelector from '../components/ToolSelector/ToolSelector';
import FileUploader from '../components/FileUploader/FileUploader';
import { usePDF } from '../contexts/PDFContext';

const Home = () => {
  const { files, clearFiles } = usePDF();

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Your Free Online PDF Editor
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-2">
              No Sign-up. No Watermarks. 100% Free.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12">
            Edit, merge, split, compress and convert PDFs instantly. Powered by AI for smarter document workflows.
          </p>

          {/* Main Upload Button */}
          <div className="max-w-xl mx-auto">
            <FileUploader
              accept=".pdf"
              multiple={true}
              maxSize={100}
              instructions="Drag & drop your PDF files here, or click to select files"
            />

            {/* Show options if files are uploaded */}
            {files.length > 0 && (
              <div className="mt-6 bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                <h3 className="font-medium text-lg mb-3">
                  {files.length} {files.length === 1 ? 'file' : 'files'} selected. What would you like to do?
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <Link
                    to="/edit-pdf-online-free"
                    className="py-2 px-4 bg-blue-600 text-white rounded-md text-center hover:bg-blue-700 transition"
                  >
                    Edit PDF
                  </Link>
                  <Link
                    to="/merge-pdf-files"
                    className="py-2 px-4 bg-purple-600 text-white rounded-md text-center hover:bg-purple-700 transition"
                  >
                    Merge PDFs
                  </Link>
                  <Link
                    to="/split-pdf-online"
                    className="py-2 px-4 bg-green-600 text-white rounded-md text-center hover:bg-green-700 transition"
                  >
                    Split PDF
                  </Link>
                  <Link
                    to="/compress-pdf-online"
                    className="py-2 px-4 bg-yellow-600 text-white rounded-md text-center hover:bg-yellow-700 transition"
                  >
                    Compress PDF
                  </Link>
                </div>
                <button
                  onClick={clearFiles}
                  className="text-gray-600 font-medium text-sm hover:text-red-600 transition flex items-center justify-center w-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear selected files
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">All PDF Tools</h2>
          <ToolSelector />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-center">Why Choose FreePDFEditor.tech?</h2>
          <p className="text-gray-600 text-center mb-8">Powerful features that make PDF editing fast and easy</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">100% Secure</h3>
              <p className="text-gray-600">
                Your files are automatically deleted after processing. We never store or share your sensitive documents.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-green-50 text-green-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">No Watermarks</h3>
              <p className="text-gray-600">
                Unlike other free tools, we don't add watermarks or annoying branding to your processed documents.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-purple-50 text-purple-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">AI-Powered</h3>
              <p className="text-gray-600">
                Advanced AI capabilities for document summarization, content analysis, and smart editing suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-center">How It Works</h2>
          <p className="text-gray-600 text-center mb-8">Complete your PDF tasks in three simple steps</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 relative">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Upload Your Files</h3>
              <p className="text-gray-600">
                Drag and drop your PDFs or click to select files from your device
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Select Your Tool</h3>
              <p className="text-gray-600">
                Choose from our wide range of PDF editing and processing tools
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Download Result</h3>
              <p className="text-gray-600">
                Get your processed PDF instantly and ready to use
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to edit your PDF?</h2>
          <p className="text-lg mb-8 opacity-90">
            No sign-up required. No software to install. 100% free.
          </p>
          <div className="flex justify-center">
            <Link
              to="/edit-pdf-online-free"
              className="px-8 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;