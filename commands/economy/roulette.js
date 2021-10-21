const Discord = require('discord.js')
const database = require('../../functions/database.js');
const util = require('../../functions/util.js');
const config = require('../../config.js');

module.exports = {
	name: 'roulette',
	description: 'Bet money on the color the ball will land on',
	usage: 'roulette [bet] [red | black]',
	args: [['numberall', 'color'], []],
	category: 'Economy',
	image: 'https://image.flaticon.com/icons/png/512/1055/1055813.png',

	async execute(message, args) {

		betColor = args[1].toLowerCase();

		const dbMember = await database.getMember(message.member);

		let amount = args[0];
		if (amount.toLowerCase() === 'all') amount = dbMember['walletBal'];
		if (amount < 0) amount *= -1;

		if (amount > dbMember['walletBal']) {
			message.channel.send(`⚠️ • You do not have enough money for this bet. You currently have \`$${dbMember['walletBal']}\` in your wallet.`);
			return;
		}

		if (util.getSecondsSinceEpoch() - dbMember['roulette'] < 10) {
			message.channel.send(`⏳ • You already played the roulette. Please wait \`${dbMember['roulette'] - util.getSecondsSinceEpoch() + 10}\` seconds.`);
			return;
		}

		let ball = util.randomInRange(0, config.roulette.length - 1)
		
		let embed = new Discord.MessageEmbed()
			.setColor('#43d852')
			.setAuthor(message.author.tag, message.author.displayAvatarURL())
			.setDescription(config.roulette[ball])
			.setTimestamp()
		
		let color = '';
		if (ball % 2 == 0) color = 'black';
		else color = 'red';

		if (color === betColor) {
			embed.setDescription(embed.description + `\n\nThe ball landed on **${color}**.\nYou won \`$${amount}\`!`);
			database.addCoinsToMember(message.member, amount, 'wallet');
		} else {
			embed.setDescription(embed.description + `\n\nThe ball landed on **${color}**.\nYou lose!`);
			embed.setColor('#ff3232')
			database.addCoinsToMember(message.member, amount * -1, 'wallet');
		}
		message.channel.send({ embeds: [embed] });
		database.updateMember(dbMember, { roulette: util.getSecondsSinceEpoch() });
	}
}