import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { authAPI } from '../api';
import { getSocket, connectSocket, disconnectSocket } from '../utils/socket';

const ChatContext = createContext(undefined);
const SESSION_KEY = 'chat_user';

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const socket = connectSocket(user.username);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onHistory = (history) => setMessages(history);

    const onNewMessage = (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    };

    const onStatusUpdate = (updatedMessages) => setMessages(updatedMessages);
    const onOnlineUsers = (users) => setOnlineUsers(users);

    const onTypingUpdate = ({ username, isTyping }) => {
      setTypingUsers((prev) =>
        isTyping
          ? Array.from(new Set([...prev, username]))
          : prev.filter((u) => u !== username)
      );
    };

    const onUserJoined = ({ username }) => {
      setMessages((prev) => [...prev, {
        id: `sys-${Date.now()}`,
        username: '__system__',
        text: `${username} joined the chat`,
        timestamp: new Date().toISOString(),
        status: 'delivered',
      }]);
    };

    const onUserLeft = ({ username }) => {
      setMessages((prev) => [...prev, {
        id: `sys-${Date.now()}`,
        username: '__system__',
        text: `${username} left the chat`,
        timestamp: new Date().toISOString(),
        status: 'delivered',
      }]);
      setTypingUsers((prev) => prev.filter((u) => u !== username));
    };

    const onError = (err) => console.error(err.message);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('messages:history', onHistory);
    socket.on('message:new', onNewMessage);
    socket.on('messages:statusUpdate', onStatusUpdate);
    socket.on('users:online', onOnlineUsers);
    socket.on('typing:update', onTypingUpdate);
    socket.on('user:joined', onUserJoined);
    socket.on('user:left', onUserLeft);
    socket.on('error', onError);

    if (socket.connected) {
      setIsConnected(true);
      socket.emit('user:join', { username: user.username });
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('messages:history', onHistory);
      socket.off('message:new', onNewMessage);
      socket.off('messages:statusUpdate', onStatusUpdate);
      socket.off('users:online', onOnlineUsers);
      socket.off('typing:update', onTypingUpdate);
      socket.off('user:joined', onUserJoined);
      socket.off('user:left', onUserLeft);
      socket.off('error', onError);
    };
  }, [user]);

  const login = useCallback(async (username) => {
    const data = await authAPI.login(username);
    const newUser = { username: data.username, token: data.token };
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    setUser(newUser);
    setMessages([]);
  }, []);

  const logout = useCallback(() => {
    disconnectSocket();
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setMessages([]);
    setOnlineUsers([]);
    setTypingUsers([]);
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback(
    (text) => {
      if (!text.trim() || !user) return;
      const socket = getSocket();
      socket.emit('message:send', { text: text.trim() });
    },
    [user]
  );

  const sendTypingStart = useCallback(() => {
    if (!user) return;
    const socket = getSocket();
    socket.emit('typing:start');

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing:stop');
    }, 3000);
  }, [user]);

  const sendTypingStop = useCallback(() => {
    if (!user) return;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    const socket = getSocket();
    socket.emit('typing:stop');
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        user,
        messages,
        onlineUsers,
        typingUsers,
        isConnected,
        login,
        logout,
        sendMessage,
        sendTypingStart,
        sendTypingStop,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};
