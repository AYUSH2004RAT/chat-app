import React, { useState, useRef, useCallback } from 'react';
import { useChat } from '../context/ChatContext';

const MAX_LENGTH = 1000;

const MessageInput = () => {
  const { sendMessage, sendTypingStart, sendTypingStop, isConnected } = useChat();
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || !isConnected) return;
    sendMessage(trimmed);
    sendTypingStop();
    setText('');
    inputRef.current?.focus();
  }, [text, isConnected, sendMessage, sendTypingStop]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (val.length > MAX_LENGTH) return;
    setText(val);
    if (val.trim().length > 0) {
      sendTypingStart();
    } else {
      sendTypingStop();
    }
  };

  const remaining = MAX_LENGTH - text.length;

  return (
    <div className="message-input-area">
      <div className={`input-container ${!isConnected ? 'disconnected' : ''}`}>
        <textarea
          ref={inputRef}
          className="message-textarea"
          placeholder={isConnected ? 'Type a message… (Enter to send)' : 'Connecting…'}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={sendTypingStop}
          disabled={!isConnected}
          rows={1}
          maxLength={MAX_LENGTH}
        />
        <div className="input-actions">
          {remaining < 100 && (
            <span className={`char-count ${remaining < 20 ? 'warn' : ''}`}>{remaining}</span>
          )}
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!text.trim() || !isConnected}
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 2L11 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 2L15 22L11 13L2 9L22 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      {!isConnected && (
        <div className="connection-banner">
          <span className="conn-dot" /> Reconnecting…
        </div>
      )}
    </div>
  );
};

export default MessageInput;
