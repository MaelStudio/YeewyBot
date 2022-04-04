const { MessageEmbed } = require('discord.js');
const database = require('../../database.js');
const util = require('../../util');

module.exports = {
	name: 'joinmessage',
	description: 'Set a message to welcome new members.',
	usage: 'joinmessage [channel] [message]',
	args: { required: ['channel', 'text'] },
	permission: 'ADMINISTRATOR',
	aliases: ['join-message'],
	category: 'Configuration',
	image: 'https://cdn-icons-png.flaticon.com/512/817/817615.png',

	async execute(message, args) {

		const channel = util.getChannelFromArg(args[0], message.guild);
		const joinMessage = args.slice(1).join(' ');
		const dbGuild = await database.getGuild(message.guild);
		
		const join = {
			message: joinMessage,
			channel: channel.id
		}
		await dbGuild.updateOne({ join: join });

		let embed = new MessageEmbed()
			.setColor('#47ff4d')
			.setTitle('✅ • Success')
			.setDescription(`Set the server\'s join message in channel <#${channel.id}>:\n${joinMessage}`)
			.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });

	}
}