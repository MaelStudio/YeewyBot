const { MessageEmbed } = require('discord.js');
const mongoose = require('../../functions/database.js');

module.exports = {
	name: 'prefix',
	description: 'Change my prefix in your server.',
	usage: 'prefix [new-prefix]',
	args: { required: ['prefix'] },
	aliases: ['setprefix'],
	permission: 'ADMINISTRATOR',
	category: 'Utility',
	image: '',

	execute(message, args) {

		const prefix = args[0];
		if(prefix.length > 5) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription('The prefix can\'t be more than 5 characters long.')
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}
		mongoose.updateGuild(message.guild, { prefix: prefix });
		let embed = new MessageEmbed()
				.setColor('#47ff4d')
				.setTitle('✅ • Success')
				.setDescription(`Set the server's prefix to \`${prefix}\`.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });
		
	}
}