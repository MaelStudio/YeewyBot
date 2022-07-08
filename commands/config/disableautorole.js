const { MessageEmbed } = require('discord.js');
const database = require('../../database.js');
const util = require('../../util');

module.exports = {
	name: 'disableautorole',
	description: 'Disables the server\'s automatic role.',
	usage: 'disableautorole',
	permission: 'ADMINISTRATOR',
	aliases: ['disablejoinrole'],
	category: 'Configuration',
	image: 'https://i.imgur.com/srqsAXH.png',

	async execute(message, args) {

		const dbGuild = await database.getGuild(message.guild);

        if(!dbGuild.autoRole) {
            let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription('There is no automatic role set for this server.')
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
            return;
        }

		await dbGuild.updateOne({ autoRole: null });

		let embed = new MessageEmbed()
			.setColor('#47ff4d')
			.setTitle('✅ • Success')
			.setDescription(`The server\'s automatic role has been disabled.`)
			.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });

	}
}