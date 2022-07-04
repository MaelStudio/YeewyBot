const { MessageEmbed } = require('discord.js');
const database = require('../../database.js');
const util = require('../../util');

module.exports = {
	name: 'autorole',
	description: 'Choose a role that will automatically be assigned to new members.',
	usage: 'autorole [role]',
	args: { required: ['role'] },
	permission: 'ADMINISTRATOR',
	aliases: ['auto-role', 'joinrole', 'join-role'],
	category: 'Configuration',
	image: 'https://cdn-icons-png.flaticon.com/512/681/681392.png',

	async execute(message, args) {
		const role = util.getRoleFromArg(args[0], message.guild);
		const dbGuild = await database.getGuild(message.guild);
		await dbGuild.updateOne({ autoRole: role.id }); // role assignment on guildMemberAdd event todo

		let embed = new MessageEmbed()
			.setColor('#47ff4d')
			.setTitle('✅ • Success')
			.setDescription(`Set the server\'s automatic role to <@&${role.id}>`)
			.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });

	}
}