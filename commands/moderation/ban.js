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

	}
}