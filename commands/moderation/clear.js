const { MessageEmbed, Channel } = require('discord.js');

module.exports = {
	name: 'clear',
	description: 'Deletes the last messages of the channel.',
	usage: 'clear [amount]',
	args: { required: ['integer'] },
	permission: 'MANAGE_MESSAGES',
	category: 'Moderation',
	image: 'https://cdn-icons-png.flaticon.com/512/2496/2496733.png',

	async execute(message, args) {

        const amount = args[0];
		const channel = message.channel;

        if(amount > 100 || amount < 1) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription('The amount cannot exceed 100 and cannot be under 1.')
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}
		await message.delete();
        await channel.bulkDelete(amount, true);
        let embed = new MessageEmbed()
				.setColor('#47ff4d')
				.setTitle('✅ • Success')
				.setDescription(`Cleared the last \`${amount}\` messages of the channel.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
		const msg = await message.channel.send({ embeds: [embed] });
		msg.delete(2000);

	}
}