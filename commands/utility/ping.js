const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ping',
	description: 'Get my response time.',
	usage: 'ping',
	category: 'Utility',
	image: 'https://cdn-icons-png.flaticon.com/512/2633/2633821.png',

	async execute(message, args) {
		let embed1 = new MessageEmbed()
			.setColor('#3fdfff')
			.setTitle(`Pinging...`)
		let msg = await message.channel.send({ embeds: [embed1] });
		let embed2 = new MessageEmbed()
			.setColor('#3fdfff')
			.setTitle(`🏓 • Pong`)
			.setDescription(`Response time: \`${Date.now() - msg.createdTimestamp} ms\`.`)
			.setAuthor(message.author.tag, message.author.avatarURL())
		await msg.edit({ embeds: [embed2] });
	}
}