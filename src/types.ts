export interface ProcessingState {
  isRecording: boolean;
  isProcessing: boolean;
  speechToText: string;
  explanation: string;
  audioUrl: string;
  error: string;
}

export interface AudioRecorderProps {
  onAudioReady: (blob: Blob) => void;
  isRecording: boolean;
  onRecordingChange: (recording: boolean) => void;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  apiKey?: string;
}

export interface ProcessingHistory {
  id: string;
  userId: string;
  timestamp: string;
  speechToText: string;
  explanation: string;
  audioFileName?: string;
}