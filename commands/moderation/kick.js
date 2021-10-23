module.exports = {
	name: 'kick',
	description: 'Kick a member from the server.',
	usage: 'kick [member] <reason>',
	args: [['member'], ['text']],
	permission: 'KICK_MEMBERS',
	category: 'Moderation',
	image: 'https://image.flaticon.com/icons/png/512/4584/4584372.png',

	execute(message, args) {

		const member = message.mentions.members.first() || message.guild.members.cache.find(m => m == args[0] || m.user.username == args[0] || m.user.tag == args[0] || m.id == args[0]);
		args.shift();
		const reason = args.join(' ');

		if(member.id === message.author.id) return message.channel.send('⚠️ • You cannot kick yourself.');
		if(!member.kickable) return message.channel.send('⚠️ • I cannot kick this member.');
		if(member.roles.highest.position > message.member.roles.highest.position) return message.channel.send('⚠️ • You cannot kick this member because their role is higher.');
		
		member.kick({reason: reason})
		message.channel.send(`✅ • Kicked member **${member.user.tag}** from the server.`)
		
	}
}