const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'bitcoin',
	description: 'Get the bitcoin\'s price.',
	usage: 'bitcoin',
	aliases: ['btc'],
	category: 'Fun',
	image: 'https://image.flaticon.com/icons/png/512/2586/2586092.png',

	async execute(message, args) {
		const url = 'http://api.coindesk.com/v1/bpi/currentprice.json';
		const result = await fetch(url);
		const data = await result.json();
		const embed = new MessageEmbed()
			.setColor('#174da5')
			.setTitle('Bitcoin Price')
			.setURL('https://www.coindesk.com/price/bitcoin')
			.addFields(
				{ name: ':dollar: USD', value: ('``' + Math.round(data['bpi']['USD']['rate_float'] * 100) / 100 + '``'), inline: true },
				{ name: ':euro: EUR', value: ('``' + Math.round(data['bpi']['EUR']['rate_float'] * 100) / 100 + '``'), inline: true },
				{ name: ':pound: GBP', value: ('``' + Math.round(data['bpi']['GBP']['rate_float'] * 100) / 100 + '``'), inline: true }
			)
			.setTimestamp()
			.setFooter('Powered by CoinDesk')
		message.channel.send({ embeds: [embed] });
	}
}