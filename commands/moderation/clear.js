const { MessageEmbed, Channel } = require('discord.js');

module.exports = {
	name: 'clear',
	description: 'Deletes the last messages of the channel.',
	usage: 'clear [amount]',
	args: { required: ['integer'] },
	permission: 'MANAGE_MESSAGES',
	category: 'Moderation',
	image: 'https://image.flaticon.com/icons/png/512/3477/premium/3477073.png',

	async execute(message, args) {s

        const amount = args[0];

        if(amount > 100 || amount < 1) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription('The amount cannot exceed 100 and cannot be under 1.')
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}

        await message.channel.bulkDelete(amount, true);
        let embed = new MessageEmbed()
				.setColor('#47ff4d')
				.setTitle('✅ • Success')
				.setDescription(`Cleared the last \`${amount}\` of the channel.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });

	}
}