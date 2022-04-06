const { MessageEmbed } = require('discord.js');
const database = require('../database.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute (member) {
        const dbGuild = await database.getGuild(member.guild);
        if(!dbGuild.join) return;

        const channel = member.guild.channels.cache.get(dbGuild.join.channel);
        const message = dbGuild.join.message;

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