# ChatFlow

Real-time chat app with React, Node.js, Express, Socket.io, and MongoDB.

## What it does

- Real-time messaging with Socket.io
- Message history stored in MongoDB
- Typing indicators
- Online user list
- Read receipts (delivered / read ticks)
- Auto-reconnect on connection drop
- Responsive layout

## Getting started

### Backend

```bash
cd server
npm install
```

Create a `.env` file:

```
PORT=5000
CLIENT_URL=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/chatflow
```

```bash
npm start
```

### Frontend

```bash
cd client
npm install
```

Create a `.env` file:

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

```bash
npm start
```

## API

| Method | Endpoint           | What it does                   |
|--------|--------------------|--------------------------------|
| GET    | `/health`          | Health check                   |
| POST   | `/api/auth/login`  | Login with a username          |
| GET    | `/api/auth/online` | Get online users               |
| GET    | `/api/messages`    | Get message history            |
| POST   | `/api/messages`    | Send a message                 |

## Socket events

| Event                 | Direction       | Payload                    |
|-----------------------|-----------------|----------------------------|
| `user:join`           | client → server | `{ username }`             |
| `message:send`        | client → server | `{ text }`                 |
| `typing:start`        | client → server | —                          |
| `typing:stop`         | client → server | —                          |
| `messages:read`       | client → server | —                          |
| `messages:history`    | server → client | `Message[]`                |
| `message:new`         | server → client | `Message`                  |
| `users:online`        | server → all    | `string[]`                 |
| `typing:update`       | server → others | `{ username, isTyping }`   |
| `user:joined`         | server → others | `{ username, timestamp }`  |
| `user:left`           | server → others | `{ username, timestamp }`  |
| `messages:statusUpdate` | server → all | `Message[]`                |

## Tech stack

- **Frontend:** React, Socket.io-client, Axios, date-fns
- **Backend:** Node.js, Express, Socket.io, Mongoose, uuid
- **Database:** MongoDB
- **Styling:** CSS
