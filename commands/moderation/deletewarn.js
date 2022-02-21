const { MessageEmbed } = require('discord.js');
const database = require('../../database.js');

module.exports = {
	name: 'deletewarn',
	description: 'Delete a warn from a member of the server.',
	usage: 'deletewarn [member] [warn-id]',
	args: { required: ['member', 'text'] },
    aliases: ['delete-warn', 'removewarn', 'remove-warn'],
	permission: 'KICK_MEMBERS',
	category: 'Moderation',
	image: '',

	async execute(message, args) {

		const target = message.mentions.members.first() || message.guild.members.cache.find(m => m == args[0] || m.user.username == args[0] || m.user.tag == args[0] || m.id == args[0]);
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