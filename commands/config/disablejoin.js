const { MessageEmbed } = require('discord.js');
const database = require('../../database.js');
const util = require('../../util');

module.exports = {
	name: 'disablejoin',
	description: 'Disables the server\'s join message.',
	usage: 'disablejoin',
	permission: 'ADMINISTRATOR',
	aliases: ['disable-join'],
	category: 'Configuration',
	image: 'https://i.imgur.com/Pk8qTZn.png',

	async execute(message, args) {

		const dbGuild = await database.getGuild(message.guild);

        if(!dbGuild.join) {
            let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription('The server\'s join message is already disabled.')
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
            return;
        }

		await dbGuild.updateOne({ join: null });

		let embed = new MessageEmbed()
			.setColor('#47ff4d')
			.setTitle('✅ • Success')
			.setDescription(`The server\'s join message has been disabled.`)
			.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });

	}
}