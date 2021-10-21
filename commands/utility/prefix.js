const Discord = require('discord.js');
const mongoose = require('../../functions/database.js');

module.exports = {
	name: 'prefix',
	description: 'Change my prefix in your server.',
	usage: 'prefix [new-prefix]',
	args: [['prefix'], []],
	aliases: ['setprefix'],
	permission: 'ADMINISTRATOR',
	category: 'Utility',
	image: '',

	execute(message, args) {

		const prefix = args[0];
		if(prefix.length > 5) return message.channel.send('⚠️ • The prefix can\'t be more than 5 characters long.');
		mongoose.updateGuild(message.guild, { prefix: prefix });
		message.channel.send(`✅ • Set the server's prefix to \`${prefix}\`.`);
		
	}
}