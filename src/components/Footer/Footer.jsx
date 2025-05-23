import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ theme }) => {
  const year = new Date().getFullYear();

  return (
    <footer className={`py-8 ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FreePDF<span className="font-extrabold">Editor</span>
              </span>
              <span className="text-xs text-blue-600 ml-1">.tech</span>
            </Link>
            <p className="mt-3 text-sm">
              100% free online PDF editor with no watermarks, no sign-up required. Edit, merge, split, compress, and convert PDFs easily.
            </p>
          </div>

          {/* Tools Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">PDF Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/edit-pdf-online-free" className="text-sm hover:text-blue-600 transition">Edit PDF</Link>
              </li>
              <li>
                <Link to="/merge-pdf-files" className="text-sm hover:text-blue-600 transition">Merge PDF</Link>
              </li>
              <li>
                <Link to="/split-pdf-online" className="text-sm hover:text-blue-600 transition">Split PDF</Link>
              </li>
              <li>
                <Link to="/compress-pdf-online" className="text-sm hover:text-blue-600 transition">Compress PDF</Link>
              </li>
              <li>
                <Link to="/convert-pdf" className="text-sm hover:text-blue-600 transition">Convert PDF</Link>
              </li>
            </ul>
          </div>

          {/* AI Tools Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">AI Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/ai-pdf-summarizer" className="text-sm hover:text-blue-600 transition">AI Summarizer</Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-blue-600 transition">Chat with PDF</Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-blue-600 transition">OCR (Text Recognition)</Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-blue-600 transition">Content Analysis</Link>
              </li>
            </ul>
          </div>

          {/* Company/Legal Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm hover:text-blue-600 transition">About Us</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm hover:text-blue-600 transition">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-sm hover:text-blue-600 transition">Terms of Service</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-blue-600 transition">Contact</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright and Social Links */}
        <div className="mt-8 pt-6 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm">
            &copy; {year} FreePDFEditor.tech. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="hover:text-blue-600" aria-label="Facebook">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="hover:text-blue-600" aria-label="Twitter">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="hover:text-blue-600" aria-label="GitHub">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;