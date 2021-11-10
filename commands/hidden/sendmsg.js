module.exports = {
	name: 'sendmsg',
	description: 'Send message to specific channel.',
	usage: 'sendmsg [channel] [text]',
	args: { required: ['channel', 'text'] },
	category: 'Hidden',
	image: 'https://image.flaticon.com/icons/png/512/1041/1041916.png',

	execute(message, args) {
		if (message.author.id != '579760700700753924') return;
		if(!args[1]) return;
		const channel = message.client.channels.cache.get(args.shift())
		if(!channel) return;
		channel.send(args.join(' '));
	}
}