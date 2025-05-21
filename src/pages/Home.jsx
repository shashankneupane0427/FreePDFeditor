
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ToolSelector from '../components/ToolSelector/ToolSelector';
import FileUploader from '../components/FileUploader/FileUploader';
import { usePDF } from '../contexts/PDFContext';

const Home = () => {
  const { files, clearFiles } = usePDF();
  const [activeTab, setActiveTab] = useState('all');
  
  // Tool categories
  const toolCategories = {
    all: "All Tools",
    edit: "Editing Tools",
    convert: "Convert Tools",
    organize: "Organize Tools"
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Hero Section with Animated Background */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
        {/* Abstract shapes in background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-3/5 mb-10 md:mb-0 md:pr-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Professional PDF Editing
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                  Made Simple & Free
                </span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-2xl">
                Edit, merge, split, compress and convert PDFs with our powerful online tools. 
                No registration, no watermarks, no limits.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/edit-pdf-online-free" className="px-8 py-4 bg-white text-blue-800 font-semibold rounded-lg shadow-lg hover:bg-blue-50 transition transform hover:-translate-y-1 duration-200 text-center">
                  Edit PDF Now
                </Link>
                <Link to="/all-tools" className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition transform hover:-translate-y-1 duration-200 text-center">
                  Explore All Tools
                </Link>
              </div>
            </div>
            
            <div className="md:w-2/5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl transform rotate-3 scale-105 opacity-30 blur-lg"></div>
                <div className="bg-white rounded-xl shadow-xl p-6 relative">
                  <h3 className="text-gray-800 font-semibold text-xl mb-4">Upload Your PDF</h3>
                  <FileUploader
                    accept=".pdf"
                    multiple={true}
                    maxSize={100}
                    instructions="Drag & drop your PDF files here, or click to select files"
                  />
                  
                  {/* Show options if files are uploaded */}
                  {files.length > 0 && (
                    <div className="mt-6 bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-800">
                          {files.length} {files.length === 1 ? 'file' : 'files'} selected
                        </h3>
                        <button
                          onClick={clearFiles}
                          className="text-gray-500 hover:text-red-600 transition flex items-center text-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Clear selection
                        </button>
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">What would you like to do with your file(s)?</p>
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <Link
                          to="/edit-pdf-online-free"
                          className="py-3 px-4 bg-blue-600 text-white rounded-md text-center hover:bg-blue-700 transition flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit PDF
                        </Link>
                        <Link
                          to="/merge-pdf-files"
                          className="py-3 px-4 bg-purple-600 text-white rounded-md text-center hover:bg-purple-700 transition flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                          </svg>
                          Merge PDFs
                        </Link>
                        <Link
                          to="/split-pdf-online"
                          className="py-3 px-4 bg-green-600 text-white rounded-md text-center hover:bg-green-700 transition flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                          </svg>
                          Split PDF
                        </Link>
                        <Link
                          to="/compress-pdf-online"
                          className="py-3 px-4 bg-yellow-600 text-white rounded-md text-center hover:bg-yellow-700 transition flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                          Compress PDF
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-blue-600">5M+</p>
              <p className="text-gray-600">Monthly Users</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-blue-600">15+</p>
              <p className="text-gray-600">PDF Tools</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-blue-600">100%</p>
              <p className="text-gray-600">Free Service</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-blue-600">99.9%</p>
              <p className="text-gray-600">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section with Tabs */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Powerful PDF Tools</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to work with PDF files in one place. Our tools are designed to be intuitive and efficient.
            </p>
          </div>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center mb-10 gap-2">
            {Object.entries(toolCategories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-3 rounded-full font-medium transition ${
                  activeTab === key 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          {/* Tool Selector with animation */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <ToolSelector category={activeTab !== 'all' ? activeTab : null} />
          </div>
        </div>
      </section>

      {/* Features Section with Cards */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-3">Why Choose FreePDFEditor.tech?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform offers the perfect combination of powerful features, security, and ease of use.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition transform hover:-translate-y-2 duration-300">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <div className="p-8">
                <div className="bg-blue-100 text-blue-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">100% Secure & Private</h3>
                <p className="text-gray-600 mb-4">
                  We take your privacy seriously. Your files are automatically deleted after processing. 
                  We never store or share your documents.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    SSL encrypted connections
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Automatic file deletion
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition transform hover:-translate-y-2 duration-300">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
              <div className="p-8">
                <div className="bg-purple-100 text-purple-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered Capabilities</h3>
                <p className="text-gray-600 mb-4">
                  Advanced AI capabilities for document summarization, content analysis, and intelligent editing suggestions that save you time.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Smart text recognition
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Content summarization
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition transform hover:-translate-y-2 duration-300">
              <div className="h-2 bg-gradient-to-r from-green-500 to-green-600"></div>
              <div className="p-8">
                <div className="bg-green-100 text-green-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">No Limitations</h3>
                <p className="text-gray-600 mb-4">
                  Enjoy our service without the restrictions typically found on other platforms. No watermarks, no file size limitations.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    No watermarks
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    No registration required
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section with Timeline */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Complete your PDF tasks in three simple steps - no technical expertise required
            </p>
          </div>

          <div className="relative">
            {/* Desktop Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-100 z-0"></div>
            
            <div className="relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center mb-12 md:mb-16">
                <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">Upload Your Files</h3>
                  <p className="text-gray-600">
                    Drag and drop your PDFs directly into our interface or click to select files from your device. We support all PDF document types.
                  </p>
                </div>
                <div className="mx-auto md:mx-0 flex-shrink-0 relative">
                  <div className="bg-blue-500 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center z-10 relative shadow-lg">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12 hidden md:block"></div>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-center mb-12 md:mb-16">
                <div className="md:w-1/2 md:pr-12 hidden md:block"></div>
                <div className="mx-auto md:mx-0 flex-shrink-0 relative">
                  <div className="bg-purple-500 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center z-10 relative shadow-lg">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12 mb-6 md:mb-0">
                  <h3 className="text-xl font-bold text-purple-600 mb-2">Select Your Tool</h3>
                  <p className="text-gray-600">
                    Choose from our comprehensive suite of PDF tools. Whether you need to edit, convert, compress, or merge PDFs, we've got you covered.
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                  <h3 className="text-xl font-bold text-green-600 mb-2">Download Your Results</h3>
                  <p className="text-gray-600">
                    Once processing is complete, download your modified PDF instantly. It's that easy - no registration or software installation required.
                  </p>
                </div>
                <div className="mx-auto md:mx-0 flex-shrink-0 relative">
                  <div className="bg-green-500 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center z-10 relative shadow-lg">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12 hidden md:block"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied users who trust our PDF tools every day
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  JD
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">John Doe</h4>
                  <p className="text-gray-500 text-sm">Marketing Manager</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic">
                "This PDF editor saved me so much time! I was able to quickly edit and combine multiple PDFs for my presentation. The interface is intuitive and the results are perfect."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">
                  AS
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">Amanda Smith</h4>
                  <p className="text-gray-500 text-sm">Financial Analyst</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic">
                "As someone who works with financial documents daily, having a reliable PDF tool is essential. This service has been a game-changer - no watermarks, no hassle, just clean results."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                  MJ
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">Michael Johnson</h4>
                  <p className="text-gray-500 text-sm">Student</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic">
                "As a student, I'm always on a budget. Finding a free tool that doesn't compromise on quality is rare. This PDF editor has been perfect for my assignments and research papers."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our PDF editing service
            </p>
          </div>
          
          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Is this service really free?</h3>
              <p className="text-gray-600">
                Yes, our PDF editing service is completely free to use. There are no hidden fees, subscriptions, or limitations on basic features. We may offer premium features in the future, but our core tools will always remain free.
              </p>
            </div>
            
            {/* FAQ Item 2 */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Is my data secure?</h3>
              <p className="text-gray-600">
                We take data security very seriously. All file transfers are encrypted using SSL technology. Your files are processed on our secure servers and are automatically deleted after processing. We never store your documents permanently or share them with third parties.
              </p>
            </div>
            
            {/* FAQ Item 3 */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Are there any file size limitations?</h3>
              <p className="text-gray-600">
                For optimal performance, we recommend uploading files under 100MB. However, our system can handle larger files depending on your internet connection speed. There is no limit on the number of files you can process.
              </p>
            </div>
            
            {/* FAQ Item 4 */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Do I need to create an account?</h3>
              <p className="text-gray-600">
                No, you can use our PDF tools without creating an account or providing any personal information. Simply upload your files, process them, and download the results. If you'd like to save your work or access advanced features, we do offer free account creation.
              </p>
            </div>
            
            {/* FAQ Item 5 */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Which operating systems are supported?</h3>
              <p className="text-gray-600">
                Our online PDF editor works on any device with a modern web browser. Whether you're using Windows, macOS, Linux, iOS, or Android, you can access and use our tools without downloading any software or applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Edit Your PDFs?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who trust our PDF tools every day. No registration required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/upload"
              className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg shadow-lg hover:bg-blue-50 transition transform hover:-translate-y-1 duration-200"
            >
              Start Editing Now
            </Link>
            <Link
              to="/all-tools"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition transform hover:-translate-y-1 duration-200"
            >
              Explore All Tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;