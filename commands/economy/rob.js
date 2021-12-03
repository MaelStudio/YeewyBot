const { MessageEmbed } = require('discord.js');
const database = require('../../database.js');
const util = require('../../util.js');

module.exports = {
	name: 'rob',
	description: 'Attempt to rob a member\'s wallet (1h coolown)',
	usage: 'rob [member]',
	args: { required: ['member'] },
	cooldown: { unit: 'm', amount: 60 },
	category: 'Economy',
	image: 'https://image.flaticon.com/icons/png/512/1576/1576476.png',

	async execute(message, args) {
		
		const target = message.mentions.members.first() || message.guild.members.cache.find(m => m == args[0] || m.user.username == args[0] || m.user.tag == args[0] || m.id == args[0]);

		if (target.id === message.author.id) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription('You cannot rob yourself.')
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}

		const dbMember = await database.getMember(message.member);
		const dbTarget = await database.getMember(target);

		let percentage = util.randomInRange(10, 50);
		let amount = 0;
		if (util.randomInRange(1, 4) === 1) {
			if (dbMember['walletBal'] + dbMember['bankBal'] > 0) {
				amount = Math.floor((dbMember['walletBal'] + dbMember['bankBal']) * percentage / 100);
			}

			database.addCoinsToMember(message.member, amount * -1, 'wallet');
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('🚔 • Failure')
				.setDescription(`You were caught attempting to rob **${target.user.tag}** and have been fined \`$${amount}\`.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });

		} else {
			if (dbTarget['walletBal'] > 0) {
				amount = Math.floor(dbTarget['walletBal'] * percentage / 100);
			}

			database.addCoinsToMember(target, amount * -1, 'wallet');
			database.addCoinsToMember(message.member, amount, 'wallet');
			let embed = new MessageEmbed()
				.setColor('#47ff4d')
				.setTitle('✅ • Success')
				.setDescription(`You robbed \`$${amount}\` from **${target.user.tag}**.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
		}
	}
}