const database = require('../../functions/database.js');
const util = require('../../functions/util.js');

module.exports = {
	name: 'work',
	description: 'Work to earn money (1h coolown)',
	usage: 'work',
	category: 'Economy',
	image: 'https://image.flaticon.com/icons/png/512/3281/3281289.png',

	async execute(message, args) {
		
		const dbMember = await database.getMember(message.member);

		if (util.getMinutesSinceEpoch() - dbMember['worked'] < 60) {
			message.channel.send(`⏳ • You have already worked. Please wait \`${(dbMember['worked'] - util.getMinutesSinceEpoch()) + 60}\` minutes.`);
			return;
		}

		let amount = util.randomInRange(20, 100);
		database.addCoinsToMember(message.member, amount, 'wallet');
		database.updateMember(dbMember, { worked: util.getMinutesSinceEpoch() });
		message.channel.send(`✅ • You worked and got paid \`$${amount}\`!`);
	}
}