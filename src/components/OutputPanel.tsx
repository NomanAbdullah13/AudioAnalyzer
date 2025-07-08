import React from 'react';
import { Loader2, Play, Pause, Download } from 'lucide-react';

interface OutputPanelProps {
  title: string;
  content: string;
  isLoading: boolean;
  icon: React.ReactNode;
  audioUrl?: string;
  onPlayAudio?: () => void;
  isPlaying?: boolean;
  onDownloadAudio?: () => void;
  step: number;
}

export default function OutputPanel({ 
  title, 
  content, 
  isLoading, 
  icon, 
  audioUrl, 
  onPlayAudio,
  isPlaying = false,
  onDownloadAudio,
  step
}: OutputPanelProps) {
  const getStepColor = (step: number) => {
    switch (step) {
      case 1: return 'from-teal-500 to-cyan-500';
      case 2: return 'from-cyan-500 to-turquoise-500';
      case 3: return 'from-emerald-500 to-teal-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStepBorder = (step: number) => {
    switch (step) {
      case 1: return 'border-teal-500/30';
      case 2: return 'border-cyan-500/30';
      case 3: return 'border-emerald-500/30';
      default: return 'border-gray-500/30';
    }
  };

  return (
    <div className={`bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border ${getStepBorder(step)} p-6 h-full transition-all hover:bg-white/15`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 bg-gradient-to-r ${getStepColor(step)} rounded-xl flex items-center justify-center shadow-lg`}>
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">STEP {step}</span>
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>
      
      <div className="min-h-[250px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-r ${getStepColor(step)} rounded-full flex items-center justify-center mb-4 mx-auto`}>
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
              <p className="text-gray-300 font-medium">Processing...</p>
              <p className="text-gray-400 text-sm mt-1">Please wait while AI works its magic</p>
            </div>
          </div>
        ) : content ? (
          <div className="flex-1">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-gray-200 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                {content}
              </div>
            </div>
            
            {audioUrl && (
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onPlayAudio}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all transform hover:scale-105 font-medium shadow-lg"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    {isPlaying ? 'Pause Audio' : 'Play Audio'}
                  </button>
                  
                  <button
                    onClick={onDownloadAudio}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl transition-all transform hover:scale-105 font-medium shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-r ${getStepColor(step)} opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto`}>
                {icon}
              </div>
              <p className="text-gray-400 text-center font-medium">
                Waiting for audio input
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Record or upload audio to see results
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}