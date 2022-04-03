const { MessageEmbed } = require('discord.js');
const util = require('../../util.js');

module.exports = {
	name: 'ban',
	description: 'Ban a member from the server.',
	usage: 'ban [member] <reason>',
	args: { required: ['member'], optional: ['text'] },
	permission: 'BAN_MEMBERS',
	category: 'Moderation',
	image: 'https://cdn-icons-png.flaticon.com/512/3122/3122321.png',

	execute(message, args) {

		const target = util.getMemberFromArg(args[0], message.guild);
		const reason = args.slice(1).join(' ');

		if(target.id === message.author.id) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription('You cannot ban yourself.')
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}
		if(!target.bannable) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription('I cannot ban this member.')
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}
		if(target.roles.highest.position > message.member.roles.highest.position) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription('You cannot ban this member because their role is higher.')
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}
		
		target.ban({reason: reason});
		let embed = new MessageEmbed()
			.setColor('#47ff4d')
			.setTitle('✅ • Success')
			.setDescription(`Banned member **${target.user.tag}** from the server.`)
			.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });

	}
}