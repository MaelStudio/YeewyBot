module.exports = {
	name: 'ping',
	description: 'Get my response time.',
	usage: 'ping',
	category: 'Utility',
	image: 'https://image.flaticon.com/icons/png/512/140/140412.png',

	async execute(message, args) {
		let msg = await message.channel.send('Pinging...');
		await msg.edit(`🏓 • **Pong !** \`${Date.now() - msg.createdTimestamp} ms\``);
	}
}