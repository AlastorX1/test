
import React from 'react';
import { TranscriptPart } from '../types';

interface TranscriptViewProps {
  transcript: TranscriptPart[];
}

const TranscriptView: React.FC<TranscriptViewProps> = ({ transcript }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Transcript</h3>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-tighter">Diarized View</span>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
        {transcript.map((part, index) => (
          <div 
            key={index} 
            className={`flex flex-col ${part.speaker === 'Salesperson' ? 'items-start' : 'items-end'}`}
          >
            <div className={`flex items-center gap-2 mb-1 ${part.speaker === 'Salesperson' ? 'flex-row' : 'flex-row-reverse'}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                part.speaker === 'Salesperson' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {part.speaker}
              </span>
              <span className="text-[10px] text-gray-400">{part.timestamp}</span>
            </div>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              part.speaker === 'Salesperson' 
                ? 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100' 
                : 'bg-indigo-50 text-indigo-900 rounded-tr-none border border-indigo-100'
            }`}>
              {part.text}
              <div className="mt-2 flex items-center gap-1 opacity-60">
                <span className={`text-[10px] px-1.5 rounded ${
                    part.sentiment > 0.3 ? 'bg-emerald-100 text-emerald-700' : 
                    part.sentiment < -0.3 ? 'bg-red-100 text-red-700' : 
                    'bg-gray-200 text-gray-600'
                }`}>
                    {part.sentiment > 0.3 ? 'Positive' : part.sentiment < -0.3 ? 'Concerns' : 'Neutral'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranscriptView;
