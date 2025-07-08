import { ProcessingHistory } from '../types';

const HISTORY_KEY = 'ai_audio_history';

export const historyUtils = {
  // Get user's processing history
  getUserHistory(userId: string): ProcessingHistory[] {
    const allHistory = this.getAllHistory();
    return allHistory.filter(item => item.userId === userId).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },

  // Get all history
  getAllHistory(): ProcessingHistory[] {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  },

  // Save history item
  saveHistoryItem(userId: string, speechToText: string, explanation: string): void {
    const allHistory = this.getAllHistory();
    
    const newItem: ProcessingHistory = {
      id: Date.now().toString(),
      userId,
      timestamp: new Date().toISOString(),
      speechToText,
      explanation,
    };

    allHistory.push(newItem);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory));
  },

  // Delete history item
  deleteHistoryItem(itemId: string): void {
    const allHistory = this.getAllHistory();
    const filteredHistory = allHistory.filter(item => item.id !== itemId);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory));
  },

  // Clear user's history
  clearUserHistory(userId: string): void {
    const allHistory = this.getAllHistory();
    const filteredHistory = allHistory.filter(item => item.userId !== userId);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory));
  }
};