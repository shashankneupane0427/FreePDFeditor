// Mock API implementation for PDF operations
// In a real app, these would make actual API calls to a backend

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate a random progress update
const simulateProgress = async (onProgress) => {
  let progress = 0;
  while (progress < 100) {
    await delay(200 + Math.random() * 300); // Random delay between 200-500ms
    progress += Math.floor(Math.random() * 15) + 5; // Random increment between 5-20
    progress = Math.min(progress, 99); // Don't reach 100 until complete
    if (onProgress) {
      onProgress(progress);
    }
  }
};

export const uploadFile = async (file) => {
  try {
    // Simulate network delay
    await delay(1000);
    
    // Create a mock document object
    const documentId = 'doc_' + Math.random().toString(36).substr(2, 9);
    const previewUrl = URL.createObjectURL(file);
    
    return {
      documentId,
      previewUrl,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
};

export const processPDF = async (operation, params, onProgress) => {
  try {
    // Start a job
    const jobId = 'job_' + Math.random().toString(36).substr(2, 9);
    
    // Simulate job processing with progress updates
    simulateProgress(onProgress);
    
    // Simulate processing time based on operation
    let processingTime;
    switch (operation) {
      case 'edit':
        processingTime = 2000;
        break;
      case 'merge':
        processingTime = 3000;
        break;
      case 'split':
        processingTime = 2500;
        break;
      case 'compress':
        processingTime = 4000;
        break;
      case 'convert':
        processingTime = 3500;
        break;
      case 'rotate':
        processingTime = 1500;
        break;
      case 'form-fill':
        processingTime = 2000;
        break;
      default:
        processingTime = 2000;
    }
    
    await delay(processingTime);
    
    // Simulate processed file result
    const processedFileUrl = params.file?.preview || 'processed-file.pdf';
    
    // Return job result
    return {
      jobId,
      status: 'completed',
      result: {
        fileUrl: processedFileUrl,
        fileName: `${operation}-result.pdf`,
      },
    };
  } catch (error) {
    console.error(`Error processing PDF (${operation}):`, error);
    throw new Error(`Failed to ${operation} PDF`);
  }
};

export const getJobStatus = async (jobId) => {
  try {
    // Simulate network delay
    await delay(500);
    
    // In a real app, this would check the status from the server
    return {
      jobId,
      status: 'completed',
      progress: 100,
      result: {
        fileUrl: 'processed-file.pdf',
        fileName: 'processed-file.pdf'
      }
    };
  } catch (error) {
    console.error('Error getting job status:', error);
    throw new Error('Failed to get job status');
  }
};

export const processAI = async (operation, documentId, options, onProgress) => {
  try {
    // Start a job
    const jobId = 'ai_job_' + Math.random().toString(36).substr(2, 9);
    
    // Simulate job processing with progress updates
    simulateProgress(onProgress);
    
    // Simulate AI processing time
    const processingTime = 5000; // AI operations take longer
    await delay(processingTime);
    
    // Simulate AI result based on operation
    let result;
    switch (operation) {
      case 'summarize':
        result = {
          summary: 'This is an AI-generated summary of the document. It highlights the key points and main ideas present in the text while condensing the content into a more digestible format. The summary focuses on the most important information without unnecessary details.',
          keyPoints: [
            'First key point extracted from the document',
            'Second key point with important information',
            'Third key insight from the document content',
            'Final conclusion from the document analysis'
          ]
        };
        break;
      case 'extract':
        result = {
          text: 'Full extracted text would appear here. This represents the complete textual content of the PDF document, maintaining formatting where possible.',
          pages: 5
        };
        break;
      case 'ocr':
        result = {
          text: 'Text extracted via OCR would appear here. This represents text recognized from images or scanned pages in the PDF.',
          confidence: 0.92
        };
        break;
      case 'chat':
        result = {
          answer: 'This is an AI-generated answer to your question about the document content. It provides specific information based on the query while referencing relevant sections of the document.',
          relevantText: 'The specific portion of the document that answers the question would appear here.'
        };
        break;
      default:
        result = { message: 'Operation completed successfully' };
    }
    
    // Return job result
    return {
      jobId,
      status: 'completed',
      result
    };
  } catch (error) {
    console.error(`Error processing AI operation (${operation}):`, error);
    throw new Error(`Failed to perform ${operation} operation`);
  }
};

export const downloadFile = async (documentId) => {
  try {
    // Simulate network delay
    await delay(1000);
    
    // In a real app, this would generate a download URL from the server
    return {
      downloadUrl: 'processed-file.pdf',
      fileName: 'processed-file.pdf'
    };
  } catch (error) {
    console.error('Error generating download link:', error);
    throw new Error('Failed to generate download link');
  }
};