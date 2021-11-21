const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
  userId: String,
  guildId: String,
  walletBal: Number,
  bankBal: Number,
  warns: Array,
  cooldowns: Object
}, { timestamps: true, minimize: false });

const Member = mongoose.model('Member', memberSchema);
module.exports = Member;