const { MessageEmbed } = require('discord.js');
const database = require('../../database.js');
const util = require('../../util.js');

module.exports = {
	name: 'warn',
	description: 'Warn a member of the server.',
	usage: 'warn [member] <reason>',
	args: { required: ['member'], optional: ['text'] },
	permission: 'KICK_MEMBERS',
	category: 'Moderation',
	image: 'https://cdn-icons-png.flaticon.com/512/564/564619.png',

	async execute(message, args) {

		const target = util.getMemberFromArg(args[0], message.guild);
		const reason = args.slice(1).join(' ') || 'Unspecified';
        const dbTarget = await database.getMember(target);
		
		if(dbTarget.warns.length === 20) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription('This member has the maximum of 20 warns.')
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}

		let id = '';
		const alphabet = 'abcdefghijklmnopqrstuvwxyz';
		while (dbTarget.warns.includes(id) || id === '') {
			for (i=0;i<3;i++) {
				id += alphabet[util.randomInRange(0, 25)]
			}
		}

		const warn = {
			reason: reason,
			moderator: message.author.id,
			date: Date.now(),
			id: id
		}
		dbTarget.warns.push(warn);
		await dbTarget.updateOne({ warns: dbTarget.warns });
		
		let embed = new MessageEmbed()
				.setColor('#47ff4d')
				.setTitle('✅ • Success')
				.setDescription(`**${target.user.tag}** has been warned by **${message.author.tag}** for the reason: ${reason}`)
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setFooter(`Warns count: ${dbTarget.warns.length}`)
		message.channel.send({ embeds: [embed] });
        
	}
}