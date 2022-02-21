const { MessageEmbed } = require('discord.js');
const database = require('../../database.js');
const util = require('../../util.js');

module.exports = {
	name: 'work',
	description: 'Work to earn money (1h coolown)',
	usage: 'work',
	cooldown: { unit: 'm', value: 60 },
	category: 'Economy',
	image: 'https://cdn-icons-png.flaticon.com/512/3281/3281289.png',

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