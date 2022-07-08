const { MessageEmbed } = require('discord.js');
const database = require('../../database.js');
const util = require('../../util.js');

module.exports = {
	name: 'addmoney',
	description: 'Add money to a member\'s balance.',
	usage: 'addmoney [member] [amount] <bank | wallet>',
	args: { required: ['member', 'number'], optional: ['text'] },
	permission: 'ADMINISTRATOR',
	category: 'Economy',
	image: 'https://cdn-icons-png.flaticon.com/512/3135/3135679.png',

	execute(message, args) {

		const target = util.getMemberFromArg(args[0], message.guild);

		let place = 'bank';
		if (args.length > 2 && args[2].toLowerCase() === 'wallet') {
			place = 'wallet';
		}
		let amount = parseInt(args[1])

		database.addCoinsToMember(target, amount, place);
		if (amount < 0) {
			let embed = new MessageEmbed()
				.setColor('#47ff4d')
				.setTitle('✅ • Success')
				.setDescription(`Removed \`$${amount * -1}\` from **${target.user.tag}**'s ${place}.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
		} else {
			let embed = new MessageEmbed()
				.setColor('#47ff4d')
				.setTitle('✅ • Success')
				.setDescription(`Added \`$${amount}\` to **${target.user.tag}**'s ${place}.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
		}
	}
}