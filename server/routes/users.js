const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const userStore = require('../db/userStore');

router.post('/login', (req, res) => {
  try {
    const { username } = req.body;

    if (!username || typeof username !== 'string') {
      return res.status(400).json({ success: false, error: 'username is required.' });
    }

    const trimmed = username.trim();

    if (trimmed.length < 2 || trimmed.length > 24) {
      return res.status(400).json({ success: false, error: 'Username must be 2–24 characters.' });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      return res.status(400).json({ success: false, error: 'Only letters, numbers, and underscores allowed.' });
    }

    const token = uuidv4();
    res.json({ success: true, data: { token, username: trimmed } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Login failed.' });
  }
});

router.get('/online', async (req, res) => {
  try {
    const users = await userStore.getOnlineUsernames();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch online users.' });
  }
});

module.exports = router;
