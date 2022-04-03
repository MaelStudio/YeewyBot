const { MessageEmbed } = require('discord.js');
const database = require('../../database.js');

module.exports = {
	name: 'prefix',
	description: 'Change my prefix in your server.',
	usage: 'prefix [new-prefix]',
	args: { required: ['prefix'] },
	aliases: ['setprefix', 'set-prefix'],
	permission: 'ADMINISTRATOR',
	category: 'Configuration',
	image: 'https://cdn-icons-png.flaticon.com/512/773/773330.png',

	async execute(message, args) {

		const newPrefix = args[0];
		if(newPrefix.length > 5) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription('The prefix can\'t be more than 5 characters long.')
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}

		const dbGuild = await database.getGuild(message.guild);
		await dbGuild.updateOne({ prefix: newPrefix })

		let embed = new MessageEmbed()
				.setColor('#47ff4d')
				.setTitle('✅ • Success')
				.setDescription(`Set the server's prefix to \`${newPrefix}\`.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });
		
	}
}