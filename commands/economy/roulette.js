const { MessageEmbed } = require('discord.js');
const database = require('../../functions/database.js');
const util = require('../../functions/util.js');

module.exports = {
	name: 'roulette',
	description: 'Bet money on the color the ball will land on',
	usage: 'roulette [bet] [red | black]',
	args: { required: ['numberall', 'color'] },
	cooldown: { unit: 's', amount: 10 },
	category: 'Economy',
	image: 'https://image.flaticon.com/icons/png/512/1055/1055813.png',

	async execute(message, args) {

		const roulette = [
			'⚪🟥⬛🟥⬛\n🟥🟩🟩🟩🟥\n⬛🟩🟩🟩⬛\n🟥🟩🟩🟩🟥\n⬛🟥⬛🟥⬛',
			'⬛⚪⬛🟥⬛\n🟥🟩🟩🟩🟥\n⬛🟩🟩🟩⬛\n🟥🟩🟩🟩🟥\n⬛🟥⬛🟥⬛',
			'⬛🟥⚪🟥⬛\n🟥🟩🟩🟩🟥\n⬛🟩🟩🟩⬛\n🟥🟩🟩🟩🟥\n⬛🟥⬛🟥⬛',
			'⬛🟥⬛⚪⬛\n🟥🟩🟩🟩🟥\n⬛🟩🟩🟩⬛\n🟥🟩🟩🟩🟥\n⬛🟥⬛🟥⬛',
			'⬛🟥⬛🟥⚪\n🟥🟩🟩🟩🟥\n⬛🟩🟩🟩⬛\n🟥🟩🟩🟩🟥\n⬛🟥⬛🟥⬛',
			'⬛🟥⬛🟥⬛\n🟥🟩🟩🟩⚪\n⬛🟩🟩🟩⬛\n🟥🟩🟩🟩🟥\n⬛🟥⬛🟥⬛',
			'⬛🟥⬛🟥⬛\n🟥🟩🟩🟩🟥\n⬛🟩🟩🟩⚪\n🟥🟩🟩🟩🟥\n⬛🟥⬛🟥⬛',
			'⬛🟥⬛🟥⬛\n🟥🟩🟩🟩🟥\n⬛🟩🟩🟩⬛\n🟥🟩🟩🟩⚪\n⬛🟥⬛🟥⬛',
			'⬛🟥⬛🟥⬛\n🟥🟩🟩🟩🟥\n⬛🟩🟩🟩⬛\n🟥🟩🟩🟩🟥\n⬛🟥⬛🟥⚪',
			'⬛🟥⬛🟥⬛\n🟥🟩🟩🟩🟥\n⬛🟩🟩🟩⬛\n🟥🟩🟩🟩🟥\n⬛🟥⬛⚪⬛',
			'⬛🟥⬛🟥⬛\n🟥🟩🟩🟩🟥\n⬛🟩🟩🟩⬛\n🟥🟩🟩🟩🟥\n⬛🟥⚪🟥⬛',
			'⬛🟥⬛🟥⬛\n🟥🟩🟩🟩🟥\n⬛🟩🟩🟩⬛\n🟥🟩🟩🟩🟥\n⬛⚪⬛🟥⬛',
			'⬛🟥⬛🟥⬛\n🟥🟩🟩🟩🟥\n⬛🟩🟩🟩⬛\n🟥🟩🟩🟩🟥\n⚪🟥⬛🟥⬛',
			'⬛🟥⬛🟥⬛\n🟥🟩🟩🟩🟥\n⬛🟩🟩🟩⬛\n⚪🟩🟩🟩🟥\n⬛🟥⬛🟥⬛',
			'⬛🟥⬛🟥⬛\n🟥🟩🟩🟩🟥\n⚪🟩🟩🟩⬛\n🟥🟩🟩🟩🟥\n⬛🟥⬛🟥⬛',
			'⬛🟥⬛🟥⬛\n⚪🟩🟩🟩🟥\n⬛🟩🟩🟩⬛\n🟥🟩🟩🟩🟥\n⬛🟥⬛🟥⬛'
		]

		betColor = args[1].toLowerCase();

		const dbMember = await database.getMember(message.member);

		let amount = args[0];
		if (amount.toLowerCase() === 'all') amount = dbMember['walletBal'];
		if (amount < 0) amount *= -1;

		if (amount > dbMember['walletBal']) {
			let embed = new MessageEmbed()
				.setColor('#ff3a3a')
				.setTitle('⚠️ • Error')
				.setDescription(`You do not have enough money for this bet. You currently have \`$${dbMember['walletBal']}\` in your wallet.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}

		let ball = util.randomInRange(0, roulette.length - 1)
		
		let embed = new MessageEmbed()
			.setColor('#47ff4d')
			.setAuthor(message.author.tag, message.author.displayAvatarURL())
			.setDescription(roulette[ball])
			.setTimestamp()
		
		let color = '';
		if (ball % 2 == 0) color = 'black';
		else color = 'red';

		if (color === betColor) {
			embed.setDescription(embed.description + `\n\nThe ball landed on **${color}**.\nYou won \`$${amount}\`!`);
			database.addCoinsToMember(message.member, amount, 'wallet');
		} else {
			embed.setDescription(embed.description + `\n\nThe ball landed on **${color}**.\nYou lost!`);
			embed.setColor('#ff3a3a')
			database.addCoinsToMember(message.member, amount * -1, 'wallet');
		}
		message.channel.send({ embeds: [embed] });
	}
}