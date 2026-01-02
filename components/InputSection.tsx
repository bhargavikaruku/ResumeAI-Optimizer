import React, { useCallback, useState, useEffect } from 'react';
import { FileText, Briefcase, Upload, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

interface InputSectionProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  jobDescription: string;
  setJobDescription: (text: string) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  resumeText,
  setResumeText,
  jobDescription,
  setJobDescription,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Set up the PDF.js worker using a Blob URL to avoid cross-origin issues
  useEffect(() => {
    const setupWorker = async () => {
      // If worker is already configured, skip
      if (pdfjsLib.GlobalWorkerOptions.workerSrc) return;

      const workerUrl = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
      
      try {
        // Fetch the worker script and create a Blob URL
        // This is necessary because browsers often block workers loaded from cross-origin CDNs
        const response = await fetch(workerUrl);
        if (!response.ok) throw new Error('Failed to fetch PDF worker');
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        pdfjsLib.GlobalWorkerOptions.workerSrc = blobUrl;
      } catch (error) {
        console.warn("Failed to load PDF worker via Blob, falling back to direct URL:", error);
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
      }
    };

    setupWorker();
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setIsProcessing(true);
    try {
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        
        // Use Uint8Array to ensure compatibility with all browser environments
        const data = new Uint8Array(arrayBuffer);

        const loadingTask = pdfjsLib.getDocument({
          data,
          // CMaps are required for correctly extracting text from PDFs with non-standard fonts
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
          cMapPacked: true,
        });
        
        try {
          const pdf = await loadingTask.promise;
          let fullText = '';
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            
            // Join items with space, but preserve some structure if needed.
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ');
              
            fullText += pageText + '\n\n';
          }
          
          if (!fullText.trim()) {
            throw new Error("The extracted text is empty. This PDF might be an image scan without OCR.");
          }
          
          setResumeText(fullText.trim());
        } catch (pdfError: any) {
          console.error("PDF Parsing Inner Error:", pdfError);
          if (pdfError.name === 'PasswordException') {
            throw new Error("This PDF is password protected. Please provide an unlocked version.");
          } else {
             // Surface the actual error message
             throw new Error(`PDF processing failed: ${pdfError.message || "Unknown error"}. Try copy-pasting the text.`);
          }
        }
      } else if (file.type === "text/plain" || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setResumeText(e.target.result as string);
          }
        };
        reader.readAsText(file);
      } else {
        alert("Unsupported file type. Please upload PDF, TXT, or MD.");
      }
    } catch (error: any) {
      console.error("Error reading file:", error);
      alert(error.message || "Failed to read the file.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto p-4">
      {/* Resume Input */}
      <div className="flex flex-col h-full space-y-2">
        <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
          <FileText className="w-4 h-4 text-indigo-600" />
          <span>Your Resume / CV</span>
        </label>
        
        <div 
          className={`relative flex-grow flex flex-col bg-white rounded-xl shadow-sm border transition-all ${dragActive ? "border-indigo-500 ring-2 ring-indigo-100" : "border-slate-200"}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isProcessing && (
            <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
              <p className="text-sm font-medium text-slate-600">Extracting text...</p>
            </div>
          )}
          
          <textarea
            className="w-full h-64 md:h-96 p-4 resize-none rounded-t-xl focus:outline-none text-slate-600 text-sm leading-relaxed"
            placeholder="Paste your resume content here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            disabled={isProcessing}
          />
          <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-between items-center">
             <span className="text-xs text-slate-400 hidden sm:inline-block">Supports PDF, TXT, MD</span>
             <label className={`cursor-pointer inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
                <Upload className="w-3 h-3 mr-2" />
                Upload Resume
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleChange} 
                  accept=".pdf,.txt,.md"
                  disabled={isProcessing}
                />
             </label>
          </div>
        </div>
      </div>

      {/* Job Description Input */}
      <div className="flex flex-col h-full space-y-2">
        <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
          <Briefcase className="w-4 h-4 text-indigo-600" />
          <span>Target Job Description</span>
        </label>
        <div className="flex-grow flex flex-col bg-white rounded-xl shadow-sm border border-slate-200">
          <textarea
            className="w-full h-64 md:h-96 p-4 resize-none rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 text-slate-600 text-sm leading-relaxed"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};