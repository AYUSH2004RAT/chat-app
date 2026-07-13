const User = require('../models/User');

const userStore = {
  async add(socketId, username) {
    await User.create({ socketId, username, connectedAt: new Date() });
  },

  async remove(socketId) {
    return User.findOneAndDelete({ socketId }).lean();
  },

  async getBySocketId(socketId) {
    return User.findOne({ socketId }).lean();
  },

  async getOnlineUsernames() {
    return User.distinct('username');
  },

  async isOnline(username) {
    const exists = await User.exists({ username });
    return !!exists;
  },

  async count() {
    return User.countDocuments();
  },

  async clearAll() {
    await User.deleteMany({});
  },
};

module.exports = userStore;
