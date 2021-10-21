module.exports = {
	name: 'say',
	description: 'Make me say something',
	usage: 'say [message]',
	args: [['text'], []],
	category: 'Fun',
	image: 'https://image.flaticon.com/icons/png/512/4287/4287330.png',

	execute(message, args) {

		if(message.mentions.everyone || message.mentions.members.size>0 || message.mentions.roles.size>0) return message.channel.send('⚠️ • I cannot mention everyone/here, roles or members.');
		message.channel.send(args.join(' '));
	}
}