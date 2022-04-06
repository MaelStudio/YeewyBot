const { MessageEmbed } = require('discord.js');
const database = require('../database.js');

module.exports = {
    name: 'guildMemberRemove',
    async execute (member) {
        const dbGuild = await database.getGuild(member.guild);
        if(!dbGuild.leave) return;

        const channel = member.guild.channels.cache.get(dbGuild.leave.channel);
        const message = dbGuild.leave.message;

        // replace variables
        message = message.replace('[member.username]', member.user.username);
        message = message.replace('[member.tag]', member.user.tag);
        message = message.replace('[member.mention]', `<@${member.id}>`);
        message = message.replace('[server.name]', member.guild.name);
        message = message.replace('[server.memberCount]', member.guild.memberCount.toString());
        
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