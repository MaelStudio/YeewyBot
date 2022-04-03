const { MessageEmbed } = require('discord.js');
const util = require('../../util.js');

module.exports = {
	name: 'kick',
	description: 'Kick a member from the server.',
	usage: 'kick [member] <reason>',
	args: { required: ['member'], optional: ['text'] },
	permission: 'KICK_MEMBERS',
	category: 'Moderation',
	image: 'https://cdn-icons-png.flaticon.com/512/4584/4584372.png',

	execute(message, args) {

		const target = util.getMemberFromArg(args[0], message.guild);
		const reason = args.slice(1).join(' ');

		if(target.id === message.author.id) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription('You cannot kick yourself.')
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}
		if(!target.kickable) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription('I cannot kick this member.')
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}
		if(target.roles.highest.position > message.member.roles.highest.position) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription('You cannot kick this member because their role is higher.')
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}
		
		target.kick(reason);
		let embed = new MessageEmbed()
				.setColor('#47ff4d')
				.setTitle('✅ • Success')
				.setDescription(`Kicked member **${target.user.tag}** from the server.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });
		
	}
}