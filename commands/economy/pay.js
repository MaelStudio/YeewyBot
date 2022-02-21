const { MessageEmbed } = require('discord.js');
const database = require('../../database.js');

module.exports = {
	name: 'pay',
	description: 'Give money to a member',
	usage: 'pay [member] [amount | all]',
	args: { required: ['member', 'numberall'] },
	category: 'Economy',
	image: 'https://cdn-icons-png.flaticon.com/512/3081/3081315.png',

	async execute(message, args) {

		const target = message.mentions.members.first() || message.guild.members.cache.find(m => m == args[0] || m.user.username == args[0] || m.user.tag == args[0] || m.id == args[0]);
		const dbMember = await database.getMember(message.member);

		var amount = args[1];
		if (amount.toLowerCase() === 'all') amount = dbMember['walletBal'];
		if (amount < 0) amount *= -1;

		if (amount > dbMember['walletBal']) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription(`You do not have that much money to give. You currently have \`$${dbMember['walletBal']}\` in your wallet.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}

		database.addCoinsToMember(message.member, amount * -1, 'wallet');
		database.addCoinsToMember(target, amount, 'wallet');
		let embed = new MessageEmbed()
				.setColor('#47ff4d')
				.setTitle('✅ • Success')
				.setDescription(`**${target.user.tag}** has received your \`$${amount}\``)
				.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });
	}
}