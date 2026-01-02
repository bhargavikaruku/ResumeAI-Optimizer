import React from 'react';
import { OptimizationResult } from '../types';
import { ScoreChart } from './ScoreChart';
import { CheckCircle2, AlertCircle, ArrowRight, FileCheck, XCircle } from 'lucide-react';

interface AnalysisDashboardProps {
  result: OptimizationResult;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result }) => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* Top Cards: Score & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-2 w-full text-left">Match Potential</h3>
          <ScoreChart score={result.matchScore} />
        </div>

        {/* Executive Summary */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <FileCheck className="w-5 h-5 mr-2 text-indigo-600" />
            Analysis Summary
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {result.summary}
          </p>
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <span className="text-green-700 font-semibold text-sm block mb-2">Strengths</span>
              <ul className="space-y-1">
                {result.strengths.slice(0, 3).map((s, i) => (
                  <li key={i} className="flex items-start text-xs text-green-800">
                    <CheckCircle2 className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <span className="text-amber-700 font-semibold text-sm block mb-2">Areas for Improvement</span>
              <ul className="space-y-1">
                {result.weaknesses.slice(0, 3).map((w, i) => (
                  <li key={i} className="flex items-start text-xs text-amber-800">
                    <AlertCircle className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Missing Keywords */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
             <div className="p-4 border-b border-slate-100 bg-slate-50">
               <h3 className="font-semibold text-slate-800 flex items-center">
                 <XCircle className="w-4 h-4 mr-2 text-red-500" />
                 Missing Keywords
               </h3>
             </div>
             <div className="p-4">
               {result.missingKeywords.length > 0 ? (
                 <div className="flex flex-wrap gap-2">
                   {result.missingKeywords.map((keyword, idx) => (
                     <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                       {keyword}
                     </span>
                   ))}
                 </div>
               ) : (
                 <p className="text-sm text-green-600 flex items-center">
                   <CheckCircle2 className="w-4 h-4 mr-2" />
                   Great job! No major keywords missing.
                 </p>
               )}
               <p className="mt-4 text-xs text-slate-400">
                 Tip: Try to weave these exact phrases into your "Skills" or "Experience" sections naturally.
               </p>
             </div>
          </div>
        </div>

        {/* Right Column: Detailed Improvements */}
        <div className="lg:col-span-2">
           <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-xl text-slate-800">Suggested Improvements</h3>
              <span className="text-xs font-medium px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                {result.suggestedImprovements.length} Suggestions
              </span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {result.suggestedImprovements.map((item, index) => (
                <div key={index} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                     <span className="inline-block px-2 py-1 text-xs font-bold tracking-wide uppercase text-slate-500 bg-slate-100 rounded">
                        {item.section}
                     </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                     {/* Before */}
                     <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                        <p className="text-xs text-red-600 font-semibold mb-1 uppercase tracking-wider">Original</p>
                        <p className="text-sm text-slate-700 font-mono text-opacity-80">"{item.original}"</p>
                     </div>
                     
                     {/* After */}
                     <div className="bg-green-50 rounded-lg p-3 border border-green-100 relative">
                        <ArrowRight className="absolute top-1/2 -left-5 w-6 h-6 text-slate-300 hidden md:block transform -translate-y-1/2 bg-white rounded-full p-1" />
                        <p className="text-xs text-green-600 font-semibold mb-1 uppercase tracking-wider">Suggested Rewrite</p>
                        <p className="text-sm text-slate-800 font-medium">"{item.improved}"</p>
                     </div>
                  </div>
                  
                  <div className="mt-3 flex items-start">
                     <div className="flex-shrink-0 w-1 h-full bg-indigo-500 rounded-full mr-3"></div>
                     <p className="text-sm text-slate-600 italic">
                       <span className="font-semibold text-indigo-600">Why: </span>
                       {item.reason}
                     </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};