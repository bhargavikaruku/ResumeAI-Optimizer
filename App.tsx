import React, { useState, useRef } from 'react';
import { InputSection } from './components/InputSection';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { Button } from './components/Button';
import { analyzeResume } from './services/geminiService';
import { AnalysisState, AnalysisStatus } from './types';
import { Sparkles, FileSearch, ArrowDown } from 'lucide-react';

const App: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [state, setState] = useState<AnalysisState>({
    status: AnalysisStatus.IDLE,
    result: null,
    error: null,
  });

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) return;

    setState(prev => ({ ...prev, status: AnalysisStatus.ANALYZING, error: null }));

    try {
      const result = await analyzeResume(resumeText, jobDescription);
      setState({
        status: AnalysisStatus.COMPLETE,
        result: result,
        error: null,
      });
      
      // Scroll to results after a short delay to allow rendering
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err: any) {
      setState(prev => ({
        ...prev,
        status: AnalysisStatus.ERROR,
        error: err.message || "Something went wrong during analysis.",
      }));
    }
  };

  const handleClear = () => {
    setResumeText('');
    setJobDescription('');
    setState({
      status: AnalysisStatus.IDLE,
      result: null,
      error: null
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              ResumAI
            </span>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Gemini Powered Resume Optimization
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center pt-8 pb-20 px-4 sm:px-6">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Beat the ATS. <br className="hidden md:block" />
            <span className="text-indigo-600">Land the Interview.</span>
          </h1>
          <p className="text-lg text-slate-600">
            Paste your resume and the job description below. Our AI will analyze the match, identify missing keywords, and rewrite your bullet points.
          </p>
        </div>

        {/* Input Area */}
        <InputSection 
          resumeText={resumeText} 
          setResumeText={setResumeText}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
        />

        {/* Actions */}
        <div className="mt-8 flex items-center space-x-4 mb-16">
           <Button 
             variant="ghost" 
             onClick={handleClear}
             disabled={state.status === AnalysisStatus.ANALYZING}
           >
             Clear All
           </Button>
           <Button 
             onClick={handleAnalyze} 
             isLoading={state.status === AnalysisStatus.ANALYZING}
             disabled={!resumeText.trim() || !jobDescription.trim()}
             className="px-8 py-3 text-lg"
           >
             <FileSearch className="w-5 h-5 mr-2" />
             Optimize My Resume
           </Button>
        </div>

        {/* Error Message */}
        {state.status === AnalysisStatus.ERROR && (
          <div className="w-full max-w-4xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p>{state.error}</p>
          </div>
        )}

        {/* Results Area */}
        <div ref={resultsRef} className="w-full flex justify-center">
           {state.status === AnalysisStatus.COMPLETE && state.result && (
             <div className="w-full flex flex-col items-center">
                <div className="flex items-center space-x-2 text-slate-400 mb-8 animate-bounce">
                  <ArrowDown className="w-5 h-5" />
                  <span className="text-sm font-medium">Scroll for Analysis</span>
                </div>
                <AnalysisDashboard result={state.result} />
             </div>
           )}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} ResumAI. Powered by Google Gemini 3.</p>
        </div>
      </footer>
    </div>
  );
};

// Helper for error display used in JSX
const AlertCircle = ({className, ...props}: React.SVGProps<SVGSVGElement>) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
)

export default App;