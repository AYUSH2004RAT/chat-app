import React from 'react';
import { ChatProvider, useChat } from './context/ChatContext';
import LoginScreen from './components/LoginScreen';
import ChatScreen from './components/ChatScreen';
import './App.css';

const AppContent = () => {
  const { user } = useChat();
  return user ? <ChatScreen /> : <LoginScreen />;
};

const App = () => {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
};

export default App;
