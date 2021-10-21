const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guildSchema = new Schema({
  guildId: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Guild = mongoose.model('Guild', guildSchema);
module.exports = Guild;