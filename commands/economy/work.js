const { MessageEmbed } = require('discord.js');
const database = require('../../functions/database.js');
const util = require('../../functions/util.js');

module.exports = {
	name: 'work',
	description: 'Work to earn money (1h coolown)',
	usage: 'work',
	cooldown: { unit: 'm', amount: 60 },
	category: 'Economy',
	image: 'https://image.flaticon.com/icons/png/512/3281/3281289.png',

	async execute(message, args) {
		
		const dbMember = await database.getMember(message.member);

		let amount = util.randomInRange(20, 100);
		database.addCoinsToMember(message.member, amount, 'wallet');
		
		let embed = new MessageEmbed()
			.setColor('#47ff4d')
			.setTitle('✅ • Success')
			.setDescription(`You worked and got paid \`$${amount}\`.`)
			.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });
	}
}