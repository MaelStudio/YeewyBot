const { MessageEmbed } = require('discord.js');
const database = require('../../database.js');

module.exports = {
	name: 'warns',
	description: 'Get the warns of a member of the server.',
	usage: 'warns [member]',
	args: { required: ['member'] },
	permission: 'KICK_MEMBERS',
	category: 'Moderation',
	image: 'https://cdn-icons.flaticon.com/png/512/2645/premium/2645424.png',

	async execute(message, args) {

		const target = message.mentions.members.first() || message.guild.members.cache.find(m => m == args[0] || m.user.username == args[0] || m.user.tag == args[0] || m.id == args[0]);
        const dbTarget = await database.getMember(target);

		let embed = new MessageEmbed()
			.setColor('#ffffff')
			.setAuthor(target.user.tag, target.user.displayAvatarURL())
            .setTitle('Warns')
			.setTimestamp()
        
        let info = ''
        for (i=0;i<dbTarget.warns.length;i++) {

            info += `Reason: ${dbTarget.warns[i].reason}`;
            info += `\nModerator: ${message.guild.members.cache.find(m.id == dbTarget.warns[i].moderator).author.tag}`;
            info += `\nDate: \`${dbTarget.warns[i].date}\``;

            embed.addField(`Warn ${dbTarget.warns[i].id}`, info);
        }
        
		message.channel.send({ embeds: [embed] });
	}
}