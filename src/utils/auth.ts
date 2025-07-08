import { User } from '../types';

const USERS_KEY = 'ai_audio_users';
const CURRENT_USER_KEY = 'ai_audio_current_user';

export const authUtils = {
  // Get all users from localStorage
  getUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  // Save users to localStorage
  saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  // Register a new user
  register(email: string, password: string, name: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
      return { success: false, message: 'User with this email already exists' };
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date().toISOString(),
    };

    // Save password separately (in real app, this would be hashed)
    const passwords = JSON.parse(localStorage.getItem('ai_audio_passwords') || '{}');
    passwords[newUser.id] = password;
    localStorage.setItem('ai_audio_passwords', JSON.stringify(passwords));

    users.push(newUser);
    this.saveUsers(users);

    return { success: true, message: 'Registration successful', user: newUser };
  },

  // Login user
  login(email: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Check password
    const passwords = JSON.parse(localStorage.getItem('ai_audio_passwords') || '{}');
    if (passwords[user.id] !== password) {
      return { success: false, message: 'Invalid password' };
    }

    this.setCurrentUser(user);
    return { success: true, message: 'Login successful', user };
  },

  // Set current user
  setCurrentUser(user: User): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  // Get current user
  getCurrentUser(): User | null {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Logout
  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Update user (for API key)
  updateUser(userId: string, updates: Partial<User>): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      this.saveUsers(users);
      
      // Update current user if it's the same user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        this.setCurrentUser(users[userIndex]);
      }
    }
  }
};