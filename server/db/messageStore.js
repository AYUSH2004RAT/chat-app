const Message = require('../models/Message');

const messageStore = {
  async save(data) {
    const message = await Message.create({
      username: data.username,
      text: data.text,
    });

    return {
      id: message._id.toString(),
      username: message.username,
      text: message.text,
      timestamp: message.createdAt.toISOString(),
      status: message.status,
    };
  },

  async getAll(limit = 100) {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return messages.reverse().map((m) => ({
      id: m._id.toString(),
      username: m.username,
      text: m.text,
      timestamp: m.createdAt.toISOString(),
      status: m.status,
    }));
  },

  async markRead(username) {
    await Message.updateMany(
      { username: { $ne: username }, status: 'delivered' },
      { $set: { status: 'read' } }
    );
  },

  async count() {
    return Message.countDocuments();
  },
};

module.exports = messageStore;
