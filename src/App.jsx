import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import EditPDF from './pages/EditPDF';
import MergePDF from './pages/MergePDF';
import SplitPDF from './pages/SplitPDF';
import CompressPDF from './pages/CompressPDF';
import RotatePDF from './pages/RotatePDF';
import ConvertPDF from './pages/ConvertPDF';
import FormFillPDF from './pages/FormFillPDF';
import AISummarize from './pages/AISummarize';
import { PDFProvider } from './contexts/PDFContext';

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <PDFProvider>
      <Router>
        <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
          <Header theme={theme} toggleTheme={toggleTheme} />
          <main className="flex-grow container mx-auto px-4 py-6 md:py-12">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/edit-pdf-online-free" element={<EditPDF />} />
              <Route path="/merge-pdf-files" element={<MergePDF />} />
              <Route path="/split-pdf-online" element={<SplitPDF />} />
              <Route path="/compress-pdf-online" element={<CompressPDF />} />
              <Route path="/rotate-pdf-online" element={<RotatePDF />} />
              <Route path="/convert-pdf" element={<ConvertPDF />} />
              <Route path="/fill-pdf-form-online" element={<FormFillPDF />} />
              <Route path="/ai-pdf-summarizer" element={<AISummarize />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer theme={theme} />
        </div>
      </Router>
    </PDFProvider>
  );
}

export default App;