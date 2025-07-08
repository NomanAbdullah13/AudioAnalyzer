import React, { useState, useRef } from 'react';
import { RefreshCw, Zap, MessageSquare, Brain, Volume2, LogOut, Mic2, User } from 'lucide-react';
import AudioRecorder from './AudioRecorder';
import FileUploader from './FileUploader';
import OutputPanel from './OutputPanel';
import UserProfile from './UserProfile';
import { ProcessingState } from '../types';
import { historyUtils } from '../utils/history';

interface MainProcessorProps {
  apiKey: string;
  user: any;
  onLogout: () => void;
}

export default function MainProcessor({ apiKey, user, onLogout }: MainProcessorProps) {
  const [processing, setProcessing] = useState<ProcessingState>({
    isRecording: false,
    isProcessing: false,
    speechToText: '',
    explanation: '',
    audioUrl: '',
    error: ''
  });
  
  const [currentAudio, setCurrentAudio] = useState<Blob | File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleAudioReady = (audio: Blob | File) => {
    setCurrentAudio(audio);
  };

  const handleRecordingChange = (recording: boolean) => {
    setProcessing(prev => ({ ...prev, isRecording: recording }));
  };

  const processAudio = async () => {
    if (!currentAudio) return;

    setProcessing(prev => ({ 
      ...prev, 
      isProcessing: true, 
      error: '',
      speechToText: '',
      explanation: '',
      audioUrl: ''
    }));

    try {
      // Step 1: Speech to Text
      const formData = new FormData();
      formData.append('file', currentAudio);
      formData.append('model', 'whisper-1');
      formData.append('language', 'en'); // Prioritize English, but Whisper can auto-detect Bengali

      const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!transcriptionResponse.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const transcriptionData = await transcriptionResponse.json();
      const transcribedText = transcriptionData.text;

      setProcessing(prev => ({ ...prev, speechToText: transcribedText }));

      // Step 2: Generate Explanation
      const explanationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that provides clear explanations and answers based on the given text. You should respond in the same language as the input text. If the input is in Bengali (বাংলা), respond in Bengali. If the input is in English, respond in English. Only support English and Bengali languages. Provide a comprehensive response that explains or answers the content.'
            },
            {
              role: 'user',
              content: `Please explain or provide an answer to this (respond in the same language as the input - English or Bengali only): ${transcribedText}`
            }
          ],
          max_tokens: 500,
        }),
      });

      if (!explanationResponse.ok) {
        throw new Error('Failed to generate explanation');
      }

      const explanationData = await explanationResponse.json();
      const explanation = explanationData.choices[0].message.content;

      setProcessing(prev => ({ ...prev, explanation }));

      // Step 3: Text to Speech
      const ttsResponse = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: explanation,
          voice: 'alloy', // Note: OpenAI TTS currently has limited Bengali support
        }),
      });

      if (!ttsResponse.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await ttsResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      setProcessing(prev => ({ ...prev, audioUrl }));

      // Save to history
      historyUtils.saveHistoryItem(user.id, transcribedText, explanation);

    } catch (error) {
      setProcessing(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'An error occurred'
      }));
    } finally {
      setProcessing(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownloadAudio = () => {
    if (processing.audioUrl) {
      const link = document.createElement('a');
      link.href = processing.audioUrl;
      link.download = 'ai-generated-audio.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRefresh = () => {
    setProcessing({
      isRecording: false,
      isProcessing: false,
      speechToText: '',
      explanation: '',
      audioUrl: '',
      error: ''
    });
    setCurrentAudio(null);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Mic2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-teal-200 to-cyan-200 bg-clip-text text-transparent">
                    AI Audio Processor
                  </h1>
                  <p className="text-gray-300 text-sm sm:text-base mt-1">
                    Transform voice into intelligent insights
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-teal-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>English & Bengali (বাংলা)</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-xl transition-all border border-white/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Change API Key</span>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-xl transition-all border border-white/20"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </button>
                <button
                  onClick={onLogout}
                  className="sm:hidden flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-xl transition-all border border-white/20"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 mb-8">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 flex-1">
                <AudioRecorder
                  onAudioReady={handleAudioReady}
                  isRecording={processing.isRecording}
                  onRecordingChange={handleRecordingChange}
                />
                
                <div className="hidden sm:block h-12 w-px bg-white/20"></div>
                
                <FileUploader
                  onFileSelected={handleAudioReady}
                  disabled={processing.isProcessing || processing.isRecording}
                />
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={handleRefresh}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-xl transition-all border border-white/20"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="sm:inline">Reset</span>
                </button>
                
                <button
                  onClick={processAudio}
                  disabled={!currentAudio || processing.isProcessing || processing.isRecording}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 hover:from-teal-600 hover:via-cyan-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                >
                  <Zap className="w-4 h-4" />
                  Generate
                </button>
              </div>
            </div>
            
            {processing.error && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  {processing.error}
                </div>
              </div>
            )}
          </div>

          {/* Output Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <OutputPanel
              title="Speech to Text"
              content={processing.speechToText}
              isLoading={processing.isProcessing && !processing.speechToText}
              icon={<MessageSquare className="w-5 h-5 text-white" />}
              step={1}
            />
            
            <OutputPanel
              title="AI Analysis"
              content={processing.explanation}
              isLoading={processing.isProcessing && processing.speechToText && !processing.explanation}
              icon={<Brain className="w-5 h-5 text-white" />}
              step={2}
            />
            
            <OutputPanel
              title="Text to Speech"
              content={processing.audioUrl ? "Audio generated successfully!" : ""}
              isLoading={processing.isProcessing && processing.explanation && !processing.audioUrl}
              icon={<Volume2 className="w-5 h-5 text-white" />}
              audioUrl={processing.audioUrl}
              onPlayAudio={handlePlayAudio}
              isPlaying={isPlaying}
              onDownloadAudio={handleDownloadAudio}
              step={3}
            />
          </div>
        </div>
      </div>
      
      {processing.audioUrl && (
        <audio
          ref={audioRef}
          src={processing.audioUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
      
      {showProfile && (
        <UserProfile user={user} onClose={() => setShowProfile(false)} onLogout={onLogout} />
      )}
    </div>
  );
}