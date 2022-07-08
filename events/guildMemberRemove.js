const { MessageEmbed } = require('discord.js');
const database = require('../database.js');

module.exports = {
    name: 'guildMemberRemove',
    async execute (member) {
        const dbGuild = await database.getGuild(member.guild);
        if(!dbGuild.leave) return;

        const channel = member.guild.channels.cache.get(dbGuild.leave.channel);
        let message = dbGuild.leave.message;

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