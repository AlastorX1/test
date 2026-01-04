
import React, { useState, useCallback, useRef } from 'react';
import { AppStatus, AnalysisResult } from './types';
import { analyzeSalesCall } from './services/geminiService';
import FileUpload from './components/FileUpload';
import TranscriptView from './components/TranscriptView';
import SentimentChart from './components/SentimentChart';
import CoachingCard from './components/CoachingCard';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const processAudio = async (blob: Blob) => {
    setStatus(AppStatus.PROCESSING);
    setError(null);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = (reader.result as string).split(',')[1];
        const result = await analyzeSalesCall(base64data, blob.type);
        setAnalysis(result);
        setStatus(AppStatus.ANALYZED);
      };
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during analysis.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleFileSelect = (file: File) => {
    processAudio(file);
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setStatus(AppStatus.RECORDING);
    } catch (err) {
      setError("Microphone access denied or not available.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && status === AppStatus.RECORDING) {
      mediaRecorderRef.current.stop();
    }
  };

  const reset = () => {
    setStatus(AppStatus.IDLE);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="bg-indigo-600 p-2 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">VocalEdge</h1>
          </div>
          <div className="flex items-center gap-4">
             {status === AppStatus.ANALYZED && (
                <button 
                  onClick={reset}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Analyze New Call
                </button>
             )}
             <div className="w-8 h-8 rounded-full bg-slate-200"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {status === AppStatus.IDLE && (
          <div className="text-center py-12">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Turn your sales calls into <span className="text-indigo-600">revenue intelligence.</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-12">
              Upload recordings or record live sessions. VocalEdge uses Gemini 3 Pro to diarize speakers, 
              map sentiment, and provide coaching in seconds.
            </p>
            <FileUpload 
              onFileSelect={handleFileSelect} 
              onStartRecording={handleStartRecording} 
              isProcessing={false}
            />
          </div>
        )}

        {status === AppStatus.RECORDING && (
          <div className="flex flex-col items-center justify-center py-20 space-y-8">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-red-100"></div>
              <div className="relative w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-200">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-800">Recording Call...</h3>
              <p className="text-slate-500 mt-2">Speak clearly into your microphone</p>
            </div>
            <button 
              onClick={handleStopRecording}
              className="px-12 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl"
            >
              Finish Recording
            </button>
          </div>
        )}

        {status === AppStatus.PROCESSING && (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-8"></div>
             <h3 className="text-2xl font-bold text-slate-800">Processing Intelligence</h3>
             <p className="text-slate-500 mt-2">Gemini is diarizing speakers and analyzing sentiment...</p>
             <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-md">
                {[1,2,3].map(i => <div key={i} className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 animate-[loading_1.5s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.2}s` }}></div>
                </div>)}
             </div>
          </div>
        )}

        {status === AppStatus.ERROR && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-2xl mx-auto text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
            </div>
            <h3 className="text-lg font-bold text-red-800">Analysis Failed</h3>
            <p className="text-red-600 mt-2">{error}</p>
            <button 
              onClick={reset}
              className="mt-6 px-6 py-2 bg-white border border-red-200 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {status === AppStatus.ANALYZED && analysis && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Talk Ratio</p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-800">{analysis.metrics.talkRatio.sales}%</span>
                    <span className="text-xs text-slate-500">Salesperson</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${analysis.metrics.talkRatio.sales}%` }}></div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Prospect Engagement</p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-800">{analysis.metrics.talkRatio.prospect}%</span>
                    <span className="text-xs text-slate-500">Speaking Time</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${analysis.metrics.talkRatio.prospect}%` }}></div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Overall Sentiment</p>
                <div className="flex items-center gap-2">
                    <span className={`text-2xl font-black ${analysis.metrics.overallSentiment > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                        {analysis.metrics.overallSentiment > 0 ? '+' : ''}{analysis.metrics.overallSentiment.toFixed(1)}
                    </span>
                    <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">Healthy</span>
                </div>
                <p className="text-xs text-slate-500 mt-3">Positive interaction detected</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Engagement Score</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-indigo-600">{analysis.metrics.engagementScore}</span>
                    <span className="text-xs text-slate-400">/ 100</span>
                </div>
                <div className="flex gap-1 mt-3">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= (analysis.metrics.engagementScore / 20) ? 'bg-indigo-500' : 'bg-slate-100'}`}></div>
                    ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <SentimentChart data={analysis.transcript} />
                <TranscriptView transcript={analysis.transcript} />
              </div>
              <div className="lg:col-span-1">
                <CoachingCard 
                  strengths={analysis.coachingCard.strengths} 
                  missedOpportunities={analysis.coachingCard.missedOpportunities} 
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default App;
