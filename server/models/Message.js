const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['delivered', 'read'],
      default: 'delivered',
    },
  },
  { timestamps: true }
);

messageSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
