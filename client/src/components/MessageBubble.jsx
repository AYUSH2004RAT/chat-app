import React from 'react';
import { format, isToday, isYesterday } from 'date-fns';

const formatTimestamp = (ts) => {
  const date = new Date(ts);
  if (isToday(date)) return format(date, 'h:mm a');
  if (isYesterday(date)) return `Yesterday ${format(date, 'h:mm a')}`;
  return format(date, 'MMM d, h:mm a');
};

const StatusIcon = ({ status }) => (
  <span className={`msg-status ${status}`} title={status}>
    {status === 'read' ? (
      <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
        <path d="M1 5L4 8L9 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 5L10 8L15 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ) : (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M1 5L4 8L9 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )}
  </span>
);

const MessageBubble = ({ message, isOwn }) => {
  if (message.username === '__system__') {
    return (
      <div className="system-message">
        <span>{message.text}</span>
      </div>
    );
  }

  return (
    <div className={`message-row ${isOwn ? 'own' : 'other'}`}>
      {!isOwn && (
        <div className="avatar" title={message.username}>
          {message.username.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="bubble-wrapper">
        {!isOwn && <span className="msg-username">{message.username}</span>}
        <div className={`bubble ${isOwn ? 'bubble-own' : 'bubble-other'}`}>
          <p className="msg-text">{message.text}</p>
          <div className="msg-meta">
            <span className="msg-time">{formatTimestamp(message.timestamp)}</span>
            {isOwn && <StatusIcon status={message.status} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
