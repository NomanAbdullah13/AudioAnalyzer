import React, { useState } from 'react';
import AuthForm from './components/AuthForm';
import ApiKeyValidator from './components/ApiKeyValidator';
import MainProcessor from './components/MainProcessor';
import { authUtils } from './utils/auth';
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(authUtils.getCurrentUser());
  const [apiKey, setApiKey] = useState<string>('');
  const [isValidated, setIsValidated] = useState(false);

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    // If user has saved API key, use it
    if (authenticatedUser.apiKey) {
      setApiKey(authenticatedUser.apiKey);
      setIsValidated(true);
    }
  };

  const handleApiKeyValidated = (validatedKey: string) => {
    setApiKey(validatedKey);
    setIsValidated(true);
    
    // Save API key to user profile
    if (user) {
      authUtils.updateUser(user.id, { apiKey: validatedKey });
    }
  };

  const handleLogout = () => {
    authUtils.logout();
    setUser(null);
    setApiKey('');
    setIsValidated(false);
  };

  return (
    <>
      {!user ? (
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      ) : !isValidated ? (
        <ApiKeyValidator onApiKeyValidated={handleApiKeyValidated} />
      ) : (
        <MainProcessor apiKey={apiKey} user={user} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;