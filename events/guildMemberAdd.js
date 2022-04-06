const { MessageEmbed } = require('discord.js');
const database = require('../database.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute (member) {
        const dbGuild = await database.getGuild(member.guild);
        if(!dbGuild.join) return;

        const channel = member.guild.channels.cache.get(dbGuild.join.channel);
        let message = dbGuild.join.message;

        // replace variables
        message = message.replace('[member.username]', member.user.username);
        message = message.replace('[member.tag]', member.user.tag);
        message = message.replace('[member.mention]', `<@${member.id}>`);
        message = message.replace('[server.name]', member.guild.name);
        message = message.replace('[server.memberCount]', member.guild.memberCount.toString());

        if(dbGuild.join.embed) {
            let embed = new MessageEmbed()
                .setColor('#47ff4d')
                .setDescription(message)
                .setAuthor(member.user.tag, member.user.avatarURL())
            channel.send({ embeds: [embed] });
        } else {
            channel.send(message);
        }
        
    }
}