import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import MessageInput from './MessageInput';
import OnlinePanel from './OnlinePanel';

const ChatScreen = () => {
  const { user, messages, onlineUsers, typingUsers, isConnected, logout } = useChat();
  const bottomRef = useRef(null);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  if (!user) return null;

  return (
    <div className="chat-screen">
      <header className="chat-header">
        <div className="header-left">
          <div className="header-logo">
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#6366F1" />
              <path
                d="M12 26 C12 26 14 18 20 18 C26 18 28 26 28 26"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="20" cy="14" r="3" fill="white" />
            </svg>
          </div>
          <div>
            <h2 className="header-title">ChatFlow</h2>
            <div className="header-status">
              <span className={`status-dot ${isConnected ? 'online' : 'offline'}`} />
              <span className="status-text">
                {isConnected ? 'Connected' : 'Reconnecting…'}
              </span>
            </div>
          </div>
        </div>

        <div className="header-right">
          <button
            className="online-toggle"
            onClick={() => setShowPanel((p) => !p)}
            aria-label="Toggle online users"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
              <path
                d="M23 21v-2a4 4 0 0 0-3-3.87"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M16 3.13a4 4 0 0 1 0 7.75"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="online-count">{onlineUsers.length}</span>
          </button>

          <button className="logout-btn" onClick={logout} title="Leave chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <polyline
                points="16 17 21 12 16 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="21"
                y1="12"
                x2="9"
                y2="12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <div className="chat-body">
        <main className="messages-area">
          {messages.length === 0 && (
            <div className="empty-state">
              <p>No messages yet. Say something! 👋</p>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.username === user.username}
            />
          ))}

          <TypingIndicator typingUsers={typingUsers.filter((u) => u !== user.username)} />
          <div ref={bottomRef} />
        </main>

        {showPanel && (
          <OnlinePanel onlineUsers={onlineUsers} currentUser={user.username} />
        )}
        <div className="online-panel-desktop">
          <OnlinePanel onlineUsers={onlineUsers} currentUser={user.username} />
        </div>
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatScreen;
