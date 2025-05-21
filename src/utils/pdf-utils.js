// PDF utility functions to assist with client-side PDF operations
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/**
 * Gets information about a PDF file
 * @param {File|Blob} file - PDF file to analyze
 * @returns {Promise<Object>} - PDF information
 */
export const getPDFInfo = async (file) => {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Get basic information
    const pageCount = pdfDoc.getPageCount();
    const pages = [];
    
    // Get information about each page
    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();
      pages.push({
        pageNumber: i + 1,
        width,
        height,
        aspectRatio: width / height,
      });
    }
    
    // Get PDF metadata
    const title = pdfDoc.getTitle() || null;
    const author = pdfDoc.getAuthor() || null;
    const subject = pdfDoc.getSubject() || null;
    const keywords = pdfDoc.getKeywords() || null;
    const creator = pdfDoc.getCreator() || null;
    const producer = pdfDoc.getProducer() || null;
    const creationDate = pdfDoc.getCreationDate() || null;
    const modificationDate = pdfDoc.getModificationDate() || null;
    
    return {
      pageCount,
      pages,
      metadata: {
        title,
        author,
        subject,
        keywords,
        creator,
        producer,
        creationDate,
        modificationDate,
      },
      fileSize: file.size,
    };
  } catch (error) {
    console.error('Error analyzing PDF:', error);
    throw new Error('Failed to analyze PDF. The file might be corrupted or protected.');
  }
};

/**
 * Merges multiple PDF files into one
 * @param {Array<File|Blob>} files - Array of PDF files to merge
 * @param {Object} options - Merge options
 * @returns {Promise<Blob>} - Merged PDF file
 */
export const mergePDFs = async (files, options = {}) => {
  try {
    // Create a new PDF document
    const mergedPdf = await PDFDocument.create();
    
    // Process each file
    for (const file of files) {
      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load PDF document
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Copy all pages from the current document to the merged one
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach(page => {
        mergedPdf.addPage(page);
      });
    }
    
    // Save the merged PDF
    const mergedPdfBytes = await mergedPdf.save();
    
    // Convert to Blob and return
    return new Blob([mergedPdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error merging PDFs:', error);
    throw new Error('Failed to merge PDFs. One or more files might be corrupted or protected.');
  }
};

/**
 * Splits a PDF file into multiple files
 * @param {File|Blob} file - PDF file to split
 * @param {Array<Array<number>>} pageRanges - Array of page ranges, e.g. [[1,3], [4,5]] for pages 1-3 and 4-5
 * @returns {Promise<Array<Blob>>} - Array of split PDF files
 */
export const splitPDF = async (file, pageRanges) => {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Create a new PDF for each page range
    const splitPdfs = [];
    
    for (const range of pageRanges) {
      // Convert from 1-indexed to 0-indexed
      const start = range[0] - 1;
      const end = range[1] - 1;
      
      // Create a new PDF document
      const newPdf = await PDFDocument.create();
      
      // Copy the pages in the current range
      for (let i = start; i <= end; i++) {
        if (i < pdfDoc.getPageCount()) {
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
          newPdf.addPage(copiedPage);
        }
      }
      
      // Save the new PDF
      const newPdfBytes = await newPdf.save();
      
      // Convert to Blob and add to result array
      splitPdfs.push(new Blob([newPdfBytes], { type: 'application/pdf' }));
    }
    
    return splitPdfs;
  } catch (error) {
    console.error('Error splitting PDF:', error);
    throw new Error('Failed to split PDF. The file might be corrupted or protected.');
  }
};

/**
 * Rotates pages in a PDF file
 * @param {File|Blob} file - PDF file to modify
 * @param {number} degrees - Rotation angle in degrees (90, 180, 270)
 * @param {Array<number>} pageNumbers - Array of page numbers to rotate (1-indexed)
 * @returns {Promise<Blob>} - Modified PDF file
 */
export const rotatePDFPages = async (file, degrees, pageNumbers) => {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Normalize rotation angle
    const normalizedDegrees = ((degrees % 360) + 360) % 360;
    
    // Apply rotation to specified pages
    for (const pageNum of pageNumbers) {
      // Convert from 1-indexed to 0-indexed
      const index = pageNum - 1;
      
      if (index >= 0 && index < pdfDoc.getPageCount()) {
        const page = pdfDoc.getPage(index);
        page.setRotation(degrees);
      }
    }
    
    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    
    // Convert to Blob and return
    return new Blob([modifiedPdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error rotating PDF pages:', error);
    throw new Error('Failed to rotate PDF pages. The file might be corrupted or protected.');
  }
};

/**
 * Adds text to a PDF
 * @param {File|Blob} file - PDF file to modify
 * @param {Array<Object>} textItems - Array of text items to add, each with position, text, etc.
 * @returns {Promise<Blob>} - Modified PDF file
 */
export const addTextToPDF = async (file, textItems) => {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Embed the standard font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Process each text item
    for (const item of textItems) {
      const { pageNumber, text, x, y, fontSize = 12, color = rgb(0, 0, 0) } = item;
      
      // Get the specified page (convert from 1-indexed to 0-indexed)
      const page = pdfDoc.getPage(pageNumber - 1);
      
      // Add text to the page
      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font: helveticaFont,
        color,
      });
    }
    
    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    
    // Convert to Blob and return
    return new Blob([modifiedPdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error adding text to PDF:', error);
    throw new Error('Failed to add text to PDF. The file might be corrupted or protected.');
  }
};

/**
 * Extracts text from PDF using PDF.js
 * @param {File|Blob} file - PDF file to extract text from
 * @returns {Promise<Object>} - Extracted text by page
 */
export const extractTextFromPDF = async (file) => {
  try {
    // This function would use PDF.js for text extraction
    // In a real implementation, we'd initialize PDF.js and extract text
    
    // Mock implementation for now
    return {
      pages: [
        { pageNumber: 1, text: "Extracted text from page 1 would appear here." },
        { pageNumber: 2, text: "Extracted text from page 2 would appear here." },
      ]
    };
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Creates a downloadable URL for a Blob
 * @param {Blob} blob - The blob to create a URL for
 * @param {string} filename - Suggested filename for download
 * @returns {Object} - Download information
 */
export const createDownloadLink = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  
  return {
    url,
    filename,
    download: () => {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    revoke: () => {
      URL.revokeObjectURL(url);
    }
  };
};