const { MessageEmbed } = require('discord.js');
const database = require('../../database.js');
const util = require('../../util.js');

module.exports = {
	name: 'warns',
	description: 'Get the warns of a member of the server.',
	usage: 'warns [member]',
	args: { required: ['member'] },
	permission: 'KICK_MEMBERS',
	category: 'Moderation',
	image: 'https://cdn-icons-png.flaticon.com/512/3207/3207539.png',

	async execute(message, args) {

		const target = util.getMemberFromArg(args[0], message.guild);
        const dbTarget = await database.getMember(target);

		let embed = new MessageEmbed()
			.setColor('#ff7e2d')
			.setAuthor(target.user.tag, target.user.displayAvatarURL())
            .setTitle('Warns')
			.setFooter(`Warns count: ${dbTarget.warns.length}`)
			.setTimestamp()
        
        let info = '';
        for (i=0;i<dbTarget.warns.length;i++) {

			info = '';
            info += `Reason: ${dbTarget.warns[i].reason}`;
            info += `\nModerator: **${message.guild.members.cache.find(m => m.id == dbTarget.warns[i].moderator).user.tag}**`;
            info += `\nDate: \`${util.timeConverter(dbTarget.warns[i].date)}\``;

            embed.addField(`Warn '${dbTarget.warns[i].id}'`, info, true);
        }
        
		message.channel.send({ embeds: [embed] });
	}
}