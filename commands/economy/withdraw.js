const { MessageEmbed } = require('discord.js');
const database = require('../../database.js');

module.exports = {
	name: 'withdraw',
	description: 'Withdraw money from your bank',
	usage: 'withdraw [amount | all]',
	args: { required: ['numberall'] },
	aliases: ['with'],
	category: 'Economy',
	image: 'https://image.flaticon.com/icons/png/512/214/214362.png',

	async execute(message, args) {

		const dbMember = await database.getMember(message.member);

		let amount = args[0];
		if (amount.toLowerCase() === 'all') {
			amount = dbMember['bankBal'];
		} else if (amount < 0) {
			amount *= -1;
		}

		if (amount > dbMember['bankBal']) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription(`You do not have that much money to withdraw. You currently have \`$${dbMember['bankBal']}\` in your bank.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}

		database.addCoinsToMember(message.member, amount, 'wallet');
		database.addCoinsToMember(message.member, amount * -1, 'bank');
		let embed = new MessageEmbed()
				.setColor('#47ff4d')
				.setTitle('✅ • Success')
				.setDescription(`Withdrew \`$${amount}\` from your bank.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });
	}
}