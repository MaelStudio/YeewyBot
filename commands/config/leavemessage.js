const { MessageEmbed } = require('discord.js');
const database = require('../../database.js');
const util = require('../../util');

module.exports = {
	name: 'leavemessage',
	description: 'Set a message to say goodbye to members that leave.\nVariables:\n`[member.username]`\n`[member.tag]`\n`[member.mention]`\n`[server.name]`\n`[server.memberCount]`',
	usage: 'leavemessage [channel] [embed: yes | no] [message]',
	args: { required: ['channel', 'yesno', 'text'] },
	permission: 'ADMINISTRATOR',
	aliases: ['leave-message'],
	category: 'Configuration',
	image: 'https://cdn-icons-png.flaticon.com/512/3798/3798302.png',

	async execute(message, args) {

		const channel = util.getChannelFromArg(args[0], message.guild);
		let isEmbed;
		if(args[1].toLowerCase() === 'yes') {
			isEmbed = true;
		} else {
			isEmbed = false;
		}
		const leaveMessage = args.slice(2).join(' ');
		const dbGuild = await database.getGuild(message.guild);
		
		const leave = {
			message: leaveMessage,
			channel: channel.id,
			embed: isEmbed
		}
		await dbGuild.updateOne({ leave: leave });

		let embed = new MessageEmbed()
			.setColor('#47ff4d')
			.setTitle('✅ • Success')
			.setDescription(`Set the server\'s leave message in channel <#${channel.id}>:\n${leaveMessage}`)
			.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });

	}
}