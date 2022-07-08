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
        variables = {
            '[member.username]': member.user.username,
            '[member.tag]': member.user.tag,
            '[member.mention]': `<@${member.id}>`,
            '[server.name]': member.guild.name,
            '[server.memberCount]': member.guild.memberCount.toString()
        }

        for (const v in variables) {
            message = message.replace(v, variables[v])
        }

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