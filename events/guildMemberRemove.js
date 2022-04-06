const { MessageEmbed } = require('discord.js');
const database = require('../database.js');

module.exports = {
    name: 'guildMemberRemove',
    async execute (member) {
        const dbGuild = await database.getGuild(member.guild);
        if(!dbGuild.leave) return;

        const channel = member.guild.channels.cache.get(dbGuild.leave.channel);
        const message = dbGuild.leave.message;

        if(dbGuild.leave.embed) {
            let embed = new MessageEmbed()
                .setColor('#ff3a3a')
                .setDescription(message)
                .setAuthor(member.user.tag, member.user.avatarURL())
            channel.send({ embeds: [embed] });
        } else {
            channel.send(message);
        }
        
    }
}