const database = require('../../functions/database.js');

module.exports = {
	name: 'deposit',
	description: 'Deposit money to the bank',
	usage: 'deposit [amount | all]',
	args: [['numberall'], []],
	aliases: ['dep'],
	category: 'Economy',
	image: 'https://image.flaticon.com/icons/png/512/3190/3190454.png',

	async execute(message, args) {

		const dbMember = await database.getMember(message.member);

		let amount = args[0];
		if (amount.toLowerCase() === 'all') amount = dbMember['walletBal'];
		if (amount < 0) amount *= -1;

		if (amount > dbMember['walletBal']) {
			message.channel.send(`⚠️ • You do not have that much money to deposit. You currently have \`$${dbMember['walletBal']}\` in your wallet.`);
			return;
		}

		database.addCoinsToMember(message.member, amount, 'bank');
		database.addCoinsToMember(message.member, amount * -1, 'wallet');
		message.channel.send(`✅ • Deposited \`$${amount}\` to your bank!`);
	}
}