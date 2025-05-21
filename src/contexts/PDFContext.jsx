import React, { createContext, useContext, useState, useReducer } from 'react';

// Define the initial state for the PDF context
const initialState = {
  files: [],
  currentFile: null,
  isProcessing: false,
  processingProgress: 0,
  processedFiles: [],
  error: null,
  jobId: null,
  jobStatus: null,
  selectedOperation: null,
};

// Define action types for the reducer
const ActionTypes = {
  ADD_FILES: 'ADD_FILES',
  SET_CURRENT_FILE: 'SET_CURRENT_FILE',
  START_PROCESSING: 'START_PROCESSING',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS',
  COMPLETE_PROCESSING: 'COMPLETE_PROCESSING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_JOB: 'SET_JOB',
  UPDATE_JOB_STATUS: 'UPDATE_JOB_STATUS',
  CLEAR_FILES: 'CLEAR_FILES',
  SET_OPERATION: 'SET_OPERATION',
  REMOVE_FILE: 'REMOVE_FILE',
};

// Define reducer function to handle state updates
function pdfReducer(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_FILES:
      return {
        ...state,
        files: [...state.files, ...action.payload],
        error: null,
      };
    
    case ActionTypes.SET_CURRENT_FILE:
      return {
        ...state,
        currentFile: action.payload,
        error: null,
      };
    
    case ActionTypes.START_PROCESSING:
      return {
        ...state,
        isProcessing: true,
        processingProgress: 0,
        error: null,
      };
    
    case ActionTypes.UPDATE_PROGRESS:
      return {
        ...state,
        processingProgress: action.payload,
      };
    
    case ActionTypes.COMPLETE_PROCESSING:
      return {
        ...state,
        isProcessing: false,
        processingProgress: 100,
        processedFiles: [...state.processedFiles, ...action.payload],
      };
    
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isProcessing: false,
      };
    
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    case ActionTypes.SET_JOB:
      return {
        ...state,
        jobId: action.payload.jobId,
        jobStatus: 'pending',
      };
    
    case ActionTypes.UPDATE_JOB_STATUS:
      return {
        ...state,
        jobStatus: action.payload.status,
        processingProgress: action.payload.progress || state.processingProgress,
      };
    
    case ActionTypes.CLEAR_FILES:
      return {
        ...state,
        files: [],
        currentFile: null,
        processedFiles: [],
        error: null,
        jobId: null,
        jobStatus: null,
      };
    
    case ActionTypes.SET_OPERATION:
      return {
        ...state,
        selectedOperation: action.payload,
      };
    
    case ActionTypes.REMOVE_FILE:
      return {
        ...state,
        files: state.files.filter((_, index) => index !== action.payload),
        currentFile: state.currentFile && state.files.indexOf(state.currentFile) === action.payload 
          ? (state.files.length > 1 ? state.files[action.payload === 0 ? 1 : 0] : null) 
          : state.currentFile,
      };

    default:
      return state;
  }
}

// Create the context
const PDFContext = createContext();

// Create a custom hook to use the PDF context
export const usePDF = () => {
  const context = useContext(PDFContext);
  if (!context) {
    throw new Error('usePDF must be used within a PDFProvider');
  }
  return context;
};

// Create the PDF provider component
export const PDFProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pdfReducer, initialState);
  
  // Action creators
  const addFiles = (files) => {
    dispatch({ type: ActionTypes.ADD_FILES, payload: files });
  };
  
  const setCurrentFile = (file) => {
    dispatch({ type: ActionTypes.SET_CURRENT_FILE, payload: file });
  };
  
  const startProcessing = () => {
    dispatch({ type: ActionTypes.START_PROCESSING });
  };
  
  const updateProgress = (progress) => {
    dispatch({ type: ActionTypes.UPDATE_PROGRESS, payload: progress });
  };
  
  const completeProcessing = (processedFiles) => {
    dispatch({ type: ActionTypes.COMPLETE_PROCESSING, payload: processedFiles });
  };
  
  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };
  
  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };
  
  const setJob = (jobId) => {
    dispatch({ type: ActionTypes.SET_JOB, payload: { jobId } });
  };
  
  const updateJobStatus = (status, progress) => {
    dispatch({ 
      type: ActionTypes.UPDATE_JOB_STATUS, 
      payload: { status, progress } 
    });
  };
  
  const clearFiles = () => {
    dispatch({ type: ActionTypes.CLEAR_FILES });
  };
  
  const setOperation = (operation) => {
    dispatch({ type: ActionTypes.SET_OPERATION, payload: operation });
  };
  
  const removeFile = (index) => {
    dispatch({ type: ActionTypes.REMOVE_FILE, payload: index });
  };

  // Combine state and actions to create the context value
  const value = {
    ...state,
    addFiles,
    setCurrentFile,
    startProcessing,
    updateProgress,
    completeProcessing,
    setError,
    clearError,
    setJob,
    updateJobStatus,
    clearFiles,
    setOperation,
    removeFile,
  };
  
  // Provide the context value to children components
  return (
    <PDFContext.Provider value={value}>
      {children}
    </PDFContext.Provider>
  );
};

export default PDFContext;