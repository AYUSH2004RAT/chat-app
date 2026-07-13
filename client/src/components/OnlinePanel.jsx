import React from 'react';

const OnlinePanel = ({ onlineUsers, currentUser }) => {
  return (
    <aside className="online-panel">
      <div className="panel-header">
        <span className="online-dot pulse" />
        <span className="panel-title">Online — {onlineUsers.length}</span>
      </div>
      <ul className="user-list">
        {onlineUsers.map((username) => (
          <li key={username} className="user-item">
            <div className="user-avatar" style={{ background: stringToColor(username) }}>
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="user-name">
              {username}
              {username === currentUser && <span className="you-badge"> (you)</span>}
            </span>
          </li>
        ))}
        {onlineUsers.length === 0 && (
          <li className="user-item user-empty">No one online yet</li>
        )}
      </ul>
    </aside>
  );
};

function stringToColor(str) {
  const colors = [
    '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B',
    '#10B981', '#3B82F6', '#EF4444', '#14B8A6',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default OnlinePanel;
