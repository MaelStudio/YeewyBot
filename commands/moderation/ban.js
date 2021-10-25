const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ban',
	description: 'Ban a member from the server.',
	usage: 'ban [member] <reason>',
	args: [['member'], ['text']],
	permission: 'BAN_MEMBERS',
	category: 'Moderation',
	image: 'https://image.flaticon.com/icons/png/512/3477/premium/3477073.png',

	execute(message, args) {

		const member = message.mentions.members.first() || message.guild.members.cache.find(m => m == args[0] || m.user.username == args[0] || m.user.tag == args[0] || m.id == args[0]);
		args.shift();
		const reason = args.join(' ');

		if(member.id === message.author.id) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription('You cannot ban yourself.')
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}
		if(!member.bannable) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription('I cannot ban this member.')
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}
		if(member.roles.highest.position > message.member.roles.highest.position) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription('You cannot ban this member because their role is higher.')
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}
		
		member.ban({reason: reason});
		let embed = new MessageEmbed()
				.setColor('#47ff4d')
				.setTitle('✅ • Success')
				.setDescription(`Banned member **${member.user.tag}** from the server.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });

	}
}