const { MessageEmbed } = require('discord.js');
const { getChannelFromArg } = require('../../util');

module.exports = {
	name: 'joinmessage',
	description: 'Set a message to welcome new members.',
	usage: 'joinmessage [channel] [message]',
	args: { required: ['channel', 'text'] },
	permission: 'ADMINISTRATOR',
	category: 'Config',
	image: 'https://cdn-icons-png.flaticon.com/512/817/817615.png',

	execute(message, args) {

		const channel = getChannelFromArg(args[0], message.guild);
		const message = args.slice(1).join(' ');
		
		let embed = new MessageEmbed()
			.setColor('#47ff4d')
			.setTitle('✅ • Success')
			.setDescription(`Set the server\'s join message in channel <#${channel.id}>:\n${message}`)
			.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });

	}
}