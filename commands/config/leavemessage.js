const { MessageEmbed } = require('discord.js');
const database = require('../../database.js');
const util = require('../../util');

module.exports = {
	name: 'leavemessage',
	description: 'Set a message to say goodbye to members that leave.',
	usage: 'leavemessage [channel] [message]',
	args: { required: ['channel', 'text'] },
	permission: 'ADMINISTRATOR',
	aliases: ['leave-message'],
	category: 'Configuration',
	image: 'https://cdn-icons-png.flaticon.com/512/3798/3798302.png',

	async execute(message, args) {

		const channel = util.getChannelFromArg(args[0], message.guild);
		const leaveMessage = args.slice(1).join(' ');
		const dbGuild = await database.getGuild(message.guild);
		
		const leave = {
			message: leaveMessage,
			channel: channel.id
		}
		await dbGuild.updateOne({ leave: leave });

		let embed = new MessageEmbed()
			.setColor('#47ff4d')
			.setTitle('✅ • Success')
			.setDescription(`Set the server\'s leave message in channel <#${channel.id}>:\n${joinMessage}`)
			.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });

	}
}