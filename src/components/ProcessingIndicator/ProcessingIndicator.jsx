import React from 'react';
import { usePDF } from '../../contexts/PDFContext';

const ProcessingIndicator = ({ showProgress = true, showText = true }) => {
  const { isProcessing, processingProgress, jobStatus } = usePDF();
  
  // Don't render anything if not processing
  if (!isProcessing && jobStatus !== 'pending' && jobStatus !== 'processing') {
    return null;
  }
  
  // Determine status message based on jobStatus
  let statusMessage = 'Processing...';
  if (jobStatus) {
    switch (jobStatus) {
      case 'pending':
        statusMessage = 'Preparing your file...';
        break;
      case 'processing':
        statusMessage = 'Processing your PDF...';
        break;
      case 'completed':
        statusMessage = 'Processing complete!';
        break;
      case 'failed':
        statusMessage = 'Processing failed. Please try again.';
        break;
      default:
        statusMessage = 'Processing...';
    }
  }
  
  // Calculate progress percentage for display
  const displayProgress = processingProgress || 0;
  
  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      {/* Circular progress indicator */}
      <div className="relative h-16 w-16 mb-2">
        {/* Track circle */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
          <circle 
            className="text-gray-200" 
            strokeWidth="8" 
            stroke="currentColor" 
            fill="transparent" 
            r="42" 
            cx="50" 
            cy="50" 
          />
          
          {/* Progress circle - only show if progress is being tracked */}
          {showProgress && (
            <circle 
              className="text-blue-600 transition-all duration-300 ease-in-out" 
              strokeWidth="8" 
              strokeLinecap="round" 
              stroke="currentColor" 
              fill="transparent" 
              r="42" 
              cx="50" 
              cy="50" 
              // Calculate stroke-dasharray and stroke-dashoffset
              strokeDasharray="264" // 2 * π * r
              strokeDashoffset={264 - (displayProgress / 100) * 264} // Adjust offset based on progress
            />
          )}
        </svg>
        
        {/* Show spinner or checkmark based on status */}
        {(jobStatus === 'pending' || jobStatus === 'processing' || isProcessing) && (
          <div className="absolute inset-0 flex items-center justify-center animate-spin">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        
        {/* Display percentage in the middle if showing progress */}
        {showProgress && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold">{Math.round(displayProgress)}%</span>
          </div>
        )}
      </div>
      
      {/* Status message */}
      {showText && (
        <div className="text-center">
          <p className="text-base font-medium text-gray-700">{statusMessage}</p>
          <p className="text-sm text-gray-500 mt-1">Please wait while we process your file...</p>
        </div>
      )}
    </div>
  );
};

export default ProcessingIndicator;