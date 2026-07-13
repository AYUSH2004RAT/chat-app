const messageStore = require('../db/messageStore');
const userStore = require('../db/userStore');

const TYPING_TIMEOUT_MS = 3000;
const typingTimers = new Map();

function registerSocketHandlers(io) {
  io.on('connection', (socket) => {

    socket.on('user:join', async ({ username } = {}) => {
      try {
        if (!username || typeof username !== 'string') {
          socket.emit('error', { message: 'Invalid username.' });
          return;
        }

        const trimmed = username.trim();
        await userStore.add(socket.id, trimmed);
        socket.data.username = trimmed;

        const history = await messageStore.getAll(100);
        socket.emit('messages:history', history);

        const onlineUsers = await userStore.getOnlineUsernames();
        io.emit('users:online', onlineUsers);

        socket.broadcast.emit('user:joined', {
          username: trimmed,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error(err.message);
        socket.emit('error', { message: 'Failed to join.' });
      }
    });

    socket.on('message:send', async ({ text } = {}) => {
      try {
        const username = socket.data.username;

        if (!username) {
          socket.emit('error', { message: 'Not authenticated.' });
          return;
        }

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
          socket.emit('error', { message: 'Message cannot be empty.' });
          return;
        }

        if (text.trim().length > 1000) {
          socket.emit('error', { message: 'Message too long.' });
          return;
        }

        clearTypingTimer(socket, io);

        const message = await messageStore.save({ username, text: text.trim() });
        io.emit('message:new', message);
      } catch (err) {
        console.error(err.message);
        socket.emit('error', { message: 'Failed to send message.' });
      }
    });

    socket.on('typing:start', () => {
      const username = socket.data.username;
      if (!username) return;

      socket.broadcast.emit('typing:update', { username, isTyping: true });

      clearTypingTimer(socket, io);
      const timer = setTimeout(() => {
        socket.broadcast.emit('typing:update', { username, isTyping: false });
        typingTimers.delete(socket.id);
      }, TYPING_TIMEOUT_MS);

      typingTimers.set(socket.id, timer);
    });

    socket.on('typing:stop', () => {
      const username = socket.data.username;
      if (!username) return;

      clearTypingTimer(socket, io);
      socket.broadcast.emit('typing:update', { username, isTyping: false });
    });

    socket.on('messages:read', async () => {
      try {
        const username = socket.data.username;
        if (!username) return;

        await messageStore.markRead(username);
        const allMessages = await messageStore.getAll(100);
        io.emit('messages:statusUpdate', allMessages);
      } catch (err) {
        console.error(err.message);
      }
    });

    socket.on('disconnect', async () => {
      try {
        clearTypingTimer(socket, io);

        const user = await userStore.remove(socket.id);
        if (user) {
          socket.broadcast.emit('user:left', {
            username: user.username,
            timestamp: new Date().toISOString(),
          });

          const onlineUsers = await userStore.getOnlineUsernames();
          io.emit('users:online', onlineUsers);

          socket.broadcast.emit('typing:update', {
            username: user.username,
            isTyping: false,
          });
        }
      } catch (err) {
        console.error(err.message);
      }
    });

    socket.on('error', (err) => {
      console.error(err.message);
    });
  });
}

function clearTypingTimer(socket) {
  if (typingTimers.has(socket.id)) {
    clearTimeout(typingTimers.get(socket.id));
    typingTimers.delete(socket.id);
  }
}

module.exports = { registerSocketHandlers };
