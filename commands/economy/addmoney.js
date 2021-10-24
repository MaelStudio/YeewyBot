const database = require('../../functions/database.js');

module.exports = {
	name: 'addmoney',
	description: 'Add money to user\'s balance.',
	usage: 'addmoney [user] [amount] <bank | wallet>',
	args: [['member', 'number'], ['text']],
	aliases: ['add-money'],
	permission: 'ADMINISTRATOR',
	category: 'Economy',
	image: 'https://image.flaticon.com/icons/png/512/3135/3135679.png',

	execute(message, args) {

		const member = message.mentions.members.first() || message.guild.members.cache.find(m => m == args[0] || m.user.username == args[0] || m.user.tag == args[0] || m.id == args[0]);

		let place = 'bank';
		if (args.length > 2 && args[2].toLowerCase() === 'wallet') {
			place = 'wallet';
		}
		database.addCoinsToMember(member, parseInt(args[1]), place);
		if (args[1] < 0) {
			let embed = new Discord.MessageEmbed()
				.setColor('#ffe900')
				.setTitle('✅ • Success')
				.setDescription(`Removed \`$${Math.floor(args[1] * -1)}\` from **${member.user.tag}**'s ${place}.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
		} else {
			let embed = new Discord.MessageEmbed()
				.setColor('#ffe900')
				.setTitle('✅ • Success')
				.setDescription(`Added \`$${Math.floor(args[1])}\` to **${member.user.tag}**'s ${place}.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
		}
	}
}