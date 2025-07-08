import React, { useRef, useState } from 'react';
import { Upload, File, Check } from 'lucide-react';

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export default function FileUploader({ onFileSelected, disabled }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelected(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      
      <button
        onClick={handleClick}
        disabled={disabled}
        className="group relative w-20 h-20 bg-white/10 hover:bg-white/20 border-2 border-dashed border-white/30 hover:border-white/50 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {selectedFile ? (
          <div className="flex flex-col items-center">
            <Check className="w-8 h-8 text-green-400" />
          </div>
        ) : (
          <Upload className="w-8 h-8 text-gray-300 group-hover:text-white transition-colors" />
        )}
      </button>

      <div className="text-center">
        {selectedFile ? (
          <div className="space-y-1">
            <p className="text-green-400 font-medium text-sm truncate max-w-32">
              {selectedFile.name}
            </p>
            <p className="text-gray-400 text-xs">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-white font-medium">File Upload</p>
            <p className="text-gray-400 text-sm">Click to select audio</p>
          </div>
        )}
      </div>
    </div>
  );
}