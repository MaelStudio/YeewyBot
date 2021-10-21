const database = require('../../functions/database.js');
const util = require('../../functions/util.js');

module.exports = {
	name: 'rob',
	description: 'Attempt to rob a user\'s wallet (1h coolown)',
	usage: 'rob [user]',
	args: [['member'], []],
	category: 'Economy',
	image: 'https://image.flaticon.com/icons/png/512/1576/1576476.png',

	async execute(message, args) {
		
		const member = message.mentions.members.first() || message.guild.members.cache.find(m => m == args[0] || m.user.username == args[0] || m.user.tag == args[0] || m.id == args[0]);

		if (member.id === message.author.id) {
			message.channel.send('⚠️ • You cannot rob yourself.');
			return;
		}

		const dbMember = await database.getMember(message.member);
		const targetMember = await database.getMember(member);

		if (util.getMinutesSinceEpoch() - dbMember['robbed'] < 60) {
			message.channel.send(`⏳ • You have already tried to rob someone. Please wait \`${(dbMember['robbed'] - util.getMinutesSinceEpoch()) + 60}\` minutes.`);
			return;
		}

		let percentage = util.randomInRange(20, 50);
		let amount = 0;
		if (util.randomInRange(1, 4) === 1) {
			if (dbMember['walletBal'] + dbMember['bankBal'] > 0) {
				amount = Math.floor((dbMember['walletBal'] + dbMember['bankBal']) * percentage / 100);
			}

			database.addCoinsToMember(message.member, amount * -1, 'wallet');
			message.channel.send(`✅ • You were caught attempting to rob **${member.user.tag}** and have been fined \`$${amount}\`!`);

		} else {
			if (targetMember['walletBal'] > 0) {
				amount = Math.floor(targetMember['walletBal'] * percentage / 100);
			}

			database.addCoinsToMember(member, amount * -1, 'wallet');
			database.addCoinsToMember(message.member, amount, 'wallet');
			message.channel.send(`✅ • You robbed \`$${amount}\` from **${member.user.tag}**!`);
		}
		database.updateMember(dbMember, { robbed: util.getMinutesSinceEpoch() });
	}
}