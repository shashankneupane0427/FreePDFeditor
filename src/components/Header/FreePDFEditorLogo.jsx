import React from 'react';

const FreePDFEditorLogo = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';
  
  return (
    <div className="flex items-center group">
      {/* Modern PDF Logo with Document Stack Effect */}
      <div className="relative mr-3">
        {/* Base document */}
        <div className={`w-10 h-12 rounded-lg transform rotate-1 absolute -right-0.5 -bottom-0.5 ${
          isDark ? 'bg-purple-700' : 'bg-purple-600'
        }`}></div>
        
        {/* Middle document */}
        <div className={`w-10 h-12 rounded-lg transform -rotate-1 absolute -left-0.5 -bottom-0.5 ${
          isDark ? 'bg-blue-700' : 'bg-blue-600'
        }`}></div>
        
        {/* Front document with PDF text */}
        <div className={`w-10 h-12 rounded-lg flex flex-col items-center justify-between py-1 relative z-10 ${
          isDark ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'
        }`}>
          {/* PDF text */}
          <div className="text-white font-bold text-xs">PDF</div>
          
          {/* Document lines */}
          <div className="w-6 h-1 bg-white/70 rounded my-0.5"></div>
          <div className="w-6 h-1 bg-white/70 rounded my-0.5"></div>
          <div className="w-6 h-1 bg-white/70 rounded my-0.5"></div>
          
          {/* Edit icon */}
          <div className="absolute -right-2 -bottom-1 bg-white rounded-full p-1 shadow-md border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Text Logo */}
      <div className="flex flex-col">
        <div className="flex items-baseline">
          <span className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Free</span>
            <span className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>PDF</span>
            <span className={`${isDark ? 'text-purple-400' : 'text-purple-600'}`}>Editor</span>
          </span>
        </div>
        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium tracking-wider`}>
          SIMPLIFY • MODIFY • TRANSFORM
        </span>
      </div>
    </div>
  );
};

export default FreePDFEditorLogo;