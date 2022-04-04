const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guildSchema = new Schema({
  guildId: String,
  prefix: String,
  join: Object,
  leave: Object
}, { timestamps: true });

const Guild = mongoose.model('Guild', guildSchema);
module.exports = Guild;