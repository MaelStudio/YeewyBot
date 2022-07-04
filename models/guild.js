const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guildSchema = new Schema({
  guildId: String,
  prefix: String,
  join: Object,
  leave: Object,
  autoRole: String
}, { timestamps: true });

const Guild = mongoose.model('Guild', guildSchema);
module.exports = Guild;