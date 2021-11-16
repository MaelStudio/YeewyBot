const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'unban',
	description: 'Unban a banned member from the server.',
	usage: 'unban [member]',
	args: { required: ['bannedMember'] },
	permission: 'BAN_MEMBERS',
	category: 'Moderation',
	image: 'https://image.flaticon.com/icons/png/512/2061/premium/2061813.png',

	async execute(message, args) {
        
        const target = message.guild.bans.cache.find(m => m.user.username == args[0] || m.user.tag == args[0] || m.id == args[0]);
        
		if(!message.channel.permissionsFor(message.author, true).has('BAN_MEMBERS') && message.author.id !== message.guild.ownerId) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription('I do not have the permission to unban members.')
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}
		
        message.guild.members.unban(target);
		let embed = new MessageEmbed()
				.setColor('#47ff4d')
				.setTitle('✅ • Success')
				.setDescription(`Unbanned member **${target.user.tag}** from the server.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });

	}
}