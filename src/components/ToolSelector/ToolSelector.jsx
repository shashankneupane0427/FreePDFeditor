import React from 'react';
import { Link } from 'react-router-dom';

const ToolSelector = ({ compact = false }) => {
  const tools = [
    {
      name: 'Edit PDF',
      description: 'Modify text, images, and content in your PDF files',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      href: '/edit-pdf-online-free',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      name: 'Merge PDF',
      description: 'Combine multiple PDFs into a single document',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      ),
      href: '/merge-pdf-files',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      name: 'Split PDF',
      description: 'Divide a PDF into multiple separate files',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      ),
      href: '/split-pdf-online',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      name: 'Compress PDF',
      description: 'Reduce PDF file size while preserving quality',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      ),
      href: '/compress-pdf-online',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      name: 'PDF to Word',
      description: 'Convert PDF documents to editable Word files',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      ),
      href: '/convert-pdf',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      name: 'Rotate PDF',
      description: 'Change the orientation of PDF pages',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      href: '/rotate-pdf-online',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      name: 'AI Summarizer',
      description: 'Extract key information from PDFs with AI',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      href: '/ai-pdf-summarizer',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
    {
      name: 'Fill PDF Forms',
      description: 'Complete PDF forms easily and efficiently',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      href: '/fill-pdf-form-online',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
  ];

  if (compact) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {tools.map((tool) => (
          <Link
            key={tool.name}
            to={tool.href}
            className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all bg-white"
          >
            <div className={`${tool.bgColor} ${tool.iconColor} p-2 rounded-full mb-2`}>
              {tool.icon}
            </div>
            <span className="text-sm font-medium text-center">{tool.name}</span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tools.map((tool) => (
        <Link
          key={tool.name}
          to={tool.href}
          className="flex flex-col p-5 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all bg-white"
        >
          <div className={`${tool.bgColor} ${tool.iconColor} p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3`}>
            {tool.icon}
          </div>
          <h3 className="text-lg font-medium mb-1">{tool.name}</h3>
          <p className="text-sm text-gray-600 flex-grow">{tool.description}</p>
          <div className="mt-3 text-blue-600 text-sm font-medium flex items-center">
            Use Tool
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ToolSelector;