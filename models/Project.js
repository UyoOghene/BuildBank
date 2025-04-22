const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  description: String,
  amount: Number,
  type: { type: String, enum: ['income', 'expense'] },
  comment: String,
  bank: String,
  createdAt: { type: Date, default: Date.now },
});

const projectSchema = new mongoose.Schema({
  name: String,
  entries: [entrySchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', projectSchema);
