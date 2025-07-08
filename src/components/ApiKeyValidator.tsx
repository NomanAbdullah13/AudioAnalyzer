import React, { useState } from 'react';
import { Key, Loader2, CheckCircle, XCircle, Sparkles } from 'lucide-react';

interface ApiKeyValidatorProps {
  onApiKeyValidated: (apiKey: string) => void;
}

export default function ApiKeyValidator({ onApiKeyValidated }: ApiKeyValidatorProps) {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        onApiKeyValidated(apiKey);
      } else {
        setError('Invalid API key. Please check your key and try again.');
      }
    } catch (err) {
      setError('Failed to validate API key. Please check your internet connection.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 rounded-2xl mb-6 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-3">
              AI Audio Processor
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Transform your voice into intelligent insights
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-teal-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>English & Bengali (বাংলা) supported</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-200">
                OpenAI API Key
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-white placeholder-gray-400 backdrop-blur-sm"
                  disabled={isValidating}
                  onKeyPress={(e) => e.key === 'Enter' && validateApiKey()}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              onClick={validateApiKey}
              disabled={isValidating || !apiKey.trim()}
              className="w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 hover:from-teal-600 hover:via-cyan-600 hover:to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 shadow-lg"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Validate & Continue
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-xs text-gray-400 leading-relaxed">
                Your API key is encrypted and stored securely.<br/>
                We never share your data with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}