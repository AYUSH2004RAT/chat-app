const express = require('express');
const router = express.Router();
const messageStore = require('../db/messageStore');

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const messages = await messageStore.getAll(limit);
    res.json({ success: true, data: messages, count: messages.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch messages.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { username, text } = req.body;

    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'username is required.' });
    }
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'text is required.' });
    }
    if (text.trim().length > 1000) {
      return res.status(400).json({ success: false, error: 'Message too long (max 1000 chars).' });
    }

    const message = await messageStore.save({
      username: username.trim(),
      text: text.trim(),
    });

    res.status(201).json({ success: true, data: message });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Failed to save message.' });
  }
});

module.exports = router;
