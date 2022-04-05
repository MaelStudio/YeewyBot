const config = require('../config.js');
const util = require('../util.js');
const database = require('../database.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute (member) {
        const dbGuild = await database.getGuild(member.guild);
        if(!dbGuild.join) return;

        const channel = member.guild.channels.cache.get(dbGuild.join.channel);
        const message = dbGuild.join.message;

        channel.send(message);
    }
}