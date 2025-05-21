import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import FileUploader from "../components/FileUploader/FileUploader";
import { usePDF } from "../contexts/PDFContext";
import PDFViewer from "../components/PDFViewer/PDFViewer";
import ProcessingIndicator from "../components/ProcessingIndicator/ProcessingIndicator";

const FormFillPDF = () => {
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

  const [filledFile, setFilledFile] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [formValues, setFormValues] = useState({});

  // Set current file when files change and none is selected
  useEffect(() => {
    if (files.length > 0 && !currentFile) {
      setCurrentFile(files[0]);
    }

    // Reset form fields and values when file changes
    if (currentFile) {
      extractFormFields();
    }
  }, [files, currentFile, setCurrentFile]);

  // Extract form fields from the PDF (simulated)
  const extractFormFields = () => {
    // In a real app, this would use PDF.js to extract form fields
    // For demo purposes, we will simulate form fields
    const simulatedFields = [
      { id: "name", type: "text", label: "Full Name", placeholder: "John Doe", required: true },
      { id: "email", type: "email", label: "Email Address", placeholder: "john@example.com", required: true },
      { id: "phone", type: "tel", label: "Phone Number", placeholder: "(123) 456-7890", required: false },
      { id: "address", type: "text", label: "Address", placeholder: "123 Main St, City, State", required: false },
      { id: "dob", type: "date", label: "Date of Birth", required: true },
      { id: "signature", type: "signature", label: "Signature", required: true },
      { id: "agree", type: "checkbox", label: "I agree to the terms and conditions", required: true },
    ];

    setFormFields(simulatedFields);
    
    // Initialize form values
    const initialValues = {};
    simulatedFields.forEach(field => {
      if (field.type === "checkbox") {
        initialValues[field.id] = false;
      } else if (field.type === "signature") {
        initialValues[field.id] = null;
      } else {
        initialValues[field.id] = "";
      }
    });
    
    setFormValues(initialValues);
  };

  // Handle form value changes
  const handleInputChange = (fieldId, value) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Handle form submission
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    
    // Check for required fields
    const missingRequiredFields = formFields
      .filter(field => field.required && (formValues[field.id] === "" || 
         formValues[field.id] === null || 
         formValues[field.id] === false))
      .map(field => field.label);
    
    if (missingRequiredFields.length > 0) {
      const missingFieldsList = missingRequiredFields.join(", ");
      alert(`Please fill in all required fields: ${missingFieldsList}`);
      return;
    }

    try {
      startProcessing();
      
      // Simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 95) {
          progress = 95;
          clearInterval(interval);
        }
        updateProgress(progress);
      }, 200);

      // Simulate PDF form filling
      // In a real app, this would use PDF.js or a backend service to fill the form
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Clear the progress interval
      clearInterval(interval);
      
      // Create a mock filled file
      setFilledFile({
        name: `filled-${currentFile.name}`,
        size: currentFile.size,
        type: currentFile.type,
        preview: currentFile.preview // This would be the filled PDF URL in a real implementation
      });
      
      // Complete the processing
      updateProgress(100);
      completeProcessing([]);
      
    } catch (error) {
      console.error("Error filling PDF form:", error);
    }
  };

  // Signature pad component
  const SignaturePad = ({ fieldId, onChange }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [signatureExists, setSignatureExists] = useState(false);
    
    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.lineWidth = 2;
      context.strokeStyle = "#000";
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }, []);
    
    const startDrawing = (e) => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      
      context.beginPath();
      context.moveTo(x, y);
      setIsDrawing(true);
    };
    
    const draw = (e) => {
      if (!isDrawing) return;
      
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      
      context.lineTo(x, y);
      context.stroke();
      setSignatureExists(true);
      
      // Save signature as data URL
      const signatureDataUrl = canvas.toDataURL();
      onChange(fieldId, signatureDataUrl);
    };
    
    const endDrawing = () => {
      setIsDrawing(false);
    };
    
    const clearSignature = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      setSignatureExists(false);
      onChange(fieldId, null);
    };
    
    return (
      <div className="border rounded-md p-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Draw your signature below</span>
          <button 
            type="button" 
            onClick={clearSignature}
            className="text-xs text-blue-600 hover:underline"
          >
            Clear
          </button>
        </div>
        
        <canvas
          ref={canvasRef}
          width={350}
          height={150}
          className="border border-gray-300 rounded cursor-crosshair w-full"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
        
        <p className="text-xs text-gray-500 mt-1">
          {signatureExists ? "Signature captured" : "Click and drag to sign"}
        </p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Fill PDF Forms Online</h1>
        <p className="text-gray-600">
          Upload a PDF form and fill it out easily. Add text, checkmarks, signatures, and more.
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

      {/* Filled PDF preview if available */}
      {!isProcessing && filledFile && (
        <div className="mb-8">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Form filled successfully!
                </p>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-medium mb-3">Preview filled document:</h3>
          
          <PDFViewer file={filledFile} height="500px" />
          
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setFilledFile(null)}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Edit Form Again
            </button>
            
            <button
              onClick={() => {
                // In a real app, this would download the filled file
                const link = document.createElement("a");
                link.href = filledFile.preview;
                link.download = filledFile.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Download Filled PDF
            </button>
          </div>
        </div>
      )}
      
      {/* Main content when no filled file */}
      {!filledFile && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - PDF upload and viewer */}
          <div>
            {/* File uploader if no files selected */}
            {files.length === 0 ? (
              <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
                <h2 className="text-lg font-medium mb-4">Upload a PDF Form</h2>
                <FileUploader
                  accept=".pdf"
                  multiple={false}
                  maxSize={100}
                  instructions="Drag & drop your PDF form here, or click to select file"
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
                <h2 className="text-lg font-medium mb-4">PDF Form</h2>
                {/* File selection dropdown if multiple files */}
                {files.length > 1 && (
                  <div className="mb-4">
                    <label htmlFor="file-select" className="block text-sm font-medium text-gray-700 mb-1">
                      Select PDF form:
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
                <PDFViewer file={currentFile} height="600px" />
              </div>
            )}
          </div>
          
          {/* Right side - Form fields */}
          <div>
            {currentFile && formFields.length > 0 && (
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <h2 className="text-lg font-medium mb-4">Fill Form Fields</h2>
                
                <form onSubmit={handleSubmitForm} className="space-y-6">
                  {formFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label 
                        htmlFor={field.id} 
                        className="block text-sm font-medium text-gray-700"
                      >
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {field.type === "checkbox" && (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={field.id}
                            checked={formValues[field.id]}
                            onChange={(e) => handleInputChange(field.id, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={field.id} className="ml-2 block text-sm text-gray-600">
                            {field.label}
                          </label>
                        </div>
                      )}
                      
                      {field.type === "signature" && (
                        <SignaturePad 
                          fieldId={field.id}
                          onChange={handleInputChange}
                        />
                      )}
                      
                      {(field.type !== "checkbox" && field.type !== "signature") && (
                        <input
                          type={field.type}
                          id={field.id}
                          value={formValues[field.id]}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required={field.required}
                        />
                      )}
                      
                      {field.description && (
                        <p className="text-xs text-gray-500">{field.description}</p>
                      )}
                    </div>
                  ))}
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Submit Form
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

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
            <h3 className="font-medium mb-2">Easy Form Filling</h3>
            <p className="text-gray-600 text-sm">
              Fill out PDF forms with an intuitive interface. No need for specialized software.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border">
            <div className="text-purple-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Digital Signatures</h3>
            <p className="text-gray-600 text-sm">
              Add your signature to documents electronically without printing or scanning.
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
              All PDF processing happens in your browser. Your documents remain private and secure.
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
        </div>
      </div>
    </div>
  );
};

export default FormFillPDF;
