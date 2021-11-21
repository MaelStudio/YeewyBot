const { MessageEmbed } = require('discord.js');
const database = require('../../database.js');

module.exports = {
	name: 'balance',
	description: 'Get your balance or another member\'s balance',
	usage: 'balance <member>',
	args: { optional: ['member'] },
	aliases: ['bal', 'money'],
	category: 'Economy',
	image: 'https://image.flaticon.com/icons/png/512/845/845752.png',

	async execute(message, args) {

		const target = message.mentions.members.first() || message.guild.members.cache.find(m => m == args[0] || m.user.username == args[0] || m.user.tag == args[0] || m.id == args[0]) || message.member;
		const dbTarget = await database.getMember(target);

		let embed = new MessageEmbed()
			.setColor('#ffc700')
			.setAuthor(target.user.tag, target.user.displayAvatarURL())
			.addFields(
				{ name: ':purse: Wallet', value: (`\`$${dbTarget['walletBal']}\``), inline: true },
				{ name: ':bank: Bank', value: (`\`$${dbTarget['bankBal']}\``), inline: true },
				{ name: ':dollar: Balance', value: `\`$${dbTarget['bankBal'] + dbTarget['walletBal']}\``, inline: true }
			)
			.setTimestamp()
		message.channel.send({ embeds: [embed] });
	}
}