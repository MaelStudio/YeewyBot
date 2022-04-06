const { MessageEmbed } = require('discord.js');
const database = require('../../database.js');
const util = require('../../util');

module.exports = {
	name: 'joinmessage',
	description: 'Set a message to welcome new members.\nVariables:\n`[member.username]`\n`[member.tag]`\n`[member.mention]`\n`[server.name]`\n`[server.memberCount]`',
	usage: 'joinmessage [channel] [embed: yes | no] [message]',
	args: { required: ['channel', 'yesno', 'text'] },
	permission: 'ADMINISTRATOR',
	aliases: ['join-message'],
	category: 'Configuration',
	image: 'https://cdn-icons-png.flaticon.com/512/817/817615.png',

	async execute(message, args) {

		const channel = util.getChannelFromArg(args[0], message.guild);
		let isEmbed;
		if(args[1].toLowerCase() === 'yes') {
			isEmbed = true;
		} else {
			isEmbed = false;
		}
		const joinMessage = args.slice(2).join(' ');
		const dbGuild = await database.getGuild(message.guild);
		
		const join = {
			message: joinMessage,
			channel: channel.id,
			embed: isEmbed
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