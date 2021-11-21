const { MessageEmbed } = require('discord.js');
const database = require('../../functions/database.js');

module.exports = {
	name: 'deposit',
	description: 'Deposit money to your bank',
	usage: 'deposit [amount | all]',
	args: { required: ['numberall'] },
	aliases: ['dep'],
	category: 'Economy',
	image: 'https://image.flaticon.com/icons/png/512/3190/3190454.png',

	async execute(message, args) {

		const dbMember = await database.getMember(message.member);

		let amount = args[0];
		if (amount.toLowerCase() === 'all') {
			amount = dbMember['walletBal'];
		} else if (amount < 0) {
			amount *= -1;
		}

		if (amount > dbMember['walletBal']) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription(`You do not have that much money to deposit. You currently have \`$${dbMember['walletBal']}\` in your wallet.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}

		database.addCoinsToMember(message.member, amount, 'bank');
		database.addCoinsToMember(message.member, amount * -1, 'wallet');
		let embed = new MessageEmbed()
				.setColor('#47ff4d')
				.setTitle('✅ • Success')
				.setDescription(`Deposited \`$${amount}\` to your bank.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });
	}
}