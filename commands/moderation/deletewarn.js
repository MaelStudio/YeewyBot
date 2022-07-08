const { MessageEmbed } = require('discord.js');
const database = require('../../database.js');
const util = require('../../util.js');

module.exports = {
	name: 'deletewarn',
	description: 'Delete a warn from a member of the server.',
	usage: 'deletewarn [member] [warn-id]',
	args: { required: ['member', 'text'] },
    aliases: ['removewarn', 'unwarn'],
	permission: 'KICK_MEMBERS',
	category: 'Moderation',
	image: 'https://cdn-icons-png.flaticon.com/512/1006/1006555.png',

	async execute(message, args) {

		const target = util.getMemberFromArg(args[0], message.guild);
		const id = args[1];
        const dbTarget = await database.getMember(target);

		if(!dbTarget.warns.find(w => w.id == id)) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription(`Could not find warn of **${target.user.tag}** with id \`${id}\`.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}
		
        const newWarns = dbTarget.warns.filter(w => w.id != id);
		await dbTarget.updateOne({ warns: newWarns });

		let embed = new MessageEmbed()
				.setColor('#47ff4d')
				.setTitle('✅ • Success')
				.setDescription(`Deleted warn of **${target.user.tag}** with id \`${id}\`.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });
        
	}
}