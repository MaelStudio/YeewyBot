const { MessageEmbed } = require('discord.js');
const database = require('../../functions/database.js');

module.exports = {
	name: 'balance',
	description: 'Get your or another user\'s balance',
	usage: 'balance <user>',
	args: [[], ['member']],
	aliases: ['bal', 'money'],
	category: 'Economy',
	image: 'https://image.flaticon.com/icons/png/512/845/845752.png',

	async execute(message, args) {

		const member = message.mentions.members.first() || message.guild.members.cache.find(m => m == args[0] || m.user.username == args[0] || m.user.tag == args[0] || m.id == args[0]) || message.member;
		const dbMember = await database.getMember(member);

		let embed = new MessageEmbed()
			.setColor('#ffc700')
			.setAuthor(member.user.tag, member.user.displayAvatarURL())
			.addFields(
				{ name: ':purse: Wallet', value: (`\`$${dbMember['walletBal']}\``), inline: true },
				{ name: ':bank: Bank', value: (`\`$${dbMember['bankBal']}\``), inline: true },
				{ name: ':dollar: Balance', value: `\`$${dbMember['bankBal'] + dbMember['walletBal']}\``, inline: true }
			)
			.setTimestamp()
		message.channel.send({ embeds: [embed] });
	}
}