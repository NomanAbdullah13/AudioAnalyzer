import React, { useState } from 'react';
import { User, History, Trash2, Calendar, MessageSquare, Brain, X, LogOut } from 'lucide-react';
import { historyUtils } from '../utils/history';
import { authUtils } from '../utils/auth';
import { ProcessingHistory } from '../types';

interface UserProfileProps {
  user: any;
  onClose: () => void;
  onLogout?: () => void;
}

export default function UserProfile({ user, onClose, onLogout }: UserProfileProps) {
  const [history, setHistory] = useState<ProcessingHistory[]>(historyUtils.getUserHistory(user.id));
  const [selectedItem, setSelectedItem] = useState<ProcessingHistory | null>(null);

  const handleDeleteItem = (itemId: string) => {
    historyUtils.deleteHistoryItem(itemId);
    setHistory(historyUtils.getUserHistory(user.id));
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem(null);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all your history? This action cannot be undone.')) {
      historyUtils.clearUserHistory(user.id);
      setHistory([]);
      setSelectedItem(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      authUtils.logout();
      if (onLogout) {
        onLogout();
      }
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <p className="text-gray-300">{user.email}</p>
                  <p className="text-sm text-gray-400">Member since {formatDate(user.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-xl transition-all border border-red-500/30"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* History List */}
            <div className="w-1/2 border-r border-white/20 flex flex-col">
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-teal-400" />
                    <h3 className="text-lg font-semibold text-white">Processing History</h3>
                    <span className="bg-teal-500/20 text-teal-300 px-2 py-1 rounded-full text-xs">
                      {history.length}
                    </span>
                  </div>
                  {history.length > 0 && (
                    <button
                      onClick={handleClearHistory}
                      className="text-red-400 hover:text-red-300 text-sm transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {history.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No processing history yet</p>
                    <p className="text-gray-500 text-sm mt-1">Start using the AI processor to see your history here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedItem?.id === item.id
                            ? 'bg-teal-500/20 border-teal-500/50'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              {item.speechToText.substring(0, 60)}...
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                              <Calendar className="w-3 h-3" />
                              {formatDate(item.timestamp)}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(item.id);
                            }}
                            className="p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Detail View */}
            <div className="w-1/2 flex flex-col">
              {selectedItem ? (
                <>
                  <div className="p-6 border-b border-white/20">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-lg font-semibold text-white">Processing Details</h3>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{formatDate(selectedItem.timestamp)}</p>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-4 h-4 text-teal-400" />
                        <h4 className="font-medium text-white">Speech to Text</h4>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-gray-200 leading-relaxed">{selectedItem.speechToText}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="w-4 h-4 text-cyan-400" />
                        <h4 className="font-medium text-white">AI Analysis</h4>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{selectedItem.explanation}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Select an item to view details</p>
                    <p className="text-gray-500 text-sm mt-1">Click on any history item to see the full conversation</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}