const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
  userId: String,
  guildId: String,
  walletBal: Number,
  bankBal: Number,
  cooldowns: Object
}, { timestamps: true });

const Member = mongoose.model('Member', memberSchema);
module.exports = Member;