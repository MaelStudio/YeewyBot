const database = require('../../functions/database.js');

module.exports = {
	name: 'withdraw',
	description: 'Withdraw money from your bank',
	usage: 'withdraw [amount | all]',
	args: [['numberall'], []],
	aliases: ['with'],
	category: 'Economy',
	image: 'https://image.flaticon.com/icons/png/512/214/214362.png',

	async execute(message, args) {

		const dbMember = await database.getMember(message.member);

		let amount = args[0];
		if (amount.toLowerCase() === 'all') amount = dbMember['bankBal'];
		if (amount < 0) amount *= -1;

		if (amount > dbMember['bankBal']) {
			message.channel.send(`⚠️ • You do not have that much money to withdraw. You currently have \`$${dbMember['walletBal']}\` in your bank.`);
			return;
		}

		database.addCoinsToMember(message.member, amount, 'wallet');
		database.addCoinsToMember(message.member, amount * -1, 'bank');
		message.channel.send(`✅ • Withdrew \`$${amount}\` from your bank!`);
	}
}