const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  guildId: {
    type: String,
    required: true
  },
  walletBal: {
    type: Number,
    required: true
  },
  bankBal: {
    type: Number,
    required: true
  },
  worked: {
    type: Number,
    required: true
  },
  robbed: {
    type: Number,
    required: true
  },
  roulette: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Member = mongoose.model('Member', memberSchema);
module.exports = Member;