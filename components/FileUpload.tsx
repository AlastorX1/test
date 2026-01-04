
import React, { useRef } from 'react';
import { CloudArrowUpIcon, MicrophoneIcon } from '@heroicons/react/24/outline';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onStartRecording: () => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onStartRecording, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Box */}
        <div 
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-12 transition-all duration-200 
            ${isProcessing ? 'border-gray-200 bg-gray-50' : 'border-indigo-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/30'}`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="audio/*"
            disabled={isProcessing}
          />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-indigo-100 rounded-full text-indigo-600 group-hover:scale-110 transition-transform">
              <CloudArrowUpIcon className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Upload Sales Call</h3>
              <p className="text-sm text-gray-500 mt-1">Drag and drop or click to browse</p>
              <p className="text-xs text-gray-400 mt-2">MP3, WAV, M4A supported</p>
            </div>
          </div>
        </div>

        {/* Record Box */}
        <div 
          onClick={() => !isProcessing && onStartRecording()}
          className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-12 transition-all duration-200 
            ${isProcessing ? 'border-gray-200 bg-gray-50' : 'border-emerald-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/30'}`}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-emerald-100 rounded-full text-emerald-600 group-hover:scale-110 transition-transform">
              <MicrophoneIcon className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Record Live Call</h3>
              <p className="text-sm text-gray-500 mt-1">Capture a session directly</p>
              <p className="text-xs text-gray-400 mt-2">Requires microphone access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icons manually defined since @heroicons/react might not be pre-installed in some environments, 
// but here I'm using standard SVG paths for safety if needed. 
// Adding minimal SVG components for icons to be safe.

const CloudArrowUpIconCustom = ({ className }: { className?: string }) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
  </svg>
);

const MicrophoneIconCustom = ({ className }: { className?: string }) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
  </svg>
);

export default FileUpload;
