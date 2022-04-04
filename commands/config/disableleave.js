const { MessageEmbed } = require('discord.js');
const database = require('../../database.js');
const util = require('../../util');

module.exports = {
	name: 'disableleave',
	description: 'Disables the server\'s leave message.',
	usage: 'disableleave',
	permission: 'ADMINISTRATOR',
	aliases: ['disable-leave'],
	category: 'Configuration',
    image: 'https://cdn-icons-png.flaticon.com/512/3798/3798302.png',

	async execute(message, args) {

		const dbGuild = await database.getGuild(message.guild);

        if(!dbGuild.leave) {
            let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription('The server\'s leave message is already disabled.')
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
            return;
        }

		await dbGuild.updateOne({ leave: null });

		let embed = new MessageEmbed()
			.setColor('#47ff4d')
			.setTitle('✅ • Success')
			.setDescription(`The server\'s leave message has been disabled.`)
			.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });

	}
}