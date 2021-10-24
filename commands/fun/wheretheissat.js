const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'wheretheissat',
	description: 'Get the current ISS\'s coordinates and other info.',
	usage: 'wheretheissat',
	aliases: ['wtia'],
	category: 'Fun',
	image: 'https://image.flaticon.com/icons/png/512/662/662922.png',

	async execute(message, args) {
		const url = 'https://api.wheretheiss.at/v1/satellites/25544';
		const result = await fetch(url);
		const data = await result.json();
		const embed = new MessageEmbed()
			.setColor('#62a5f7')
			.setTitle('Where the ISS at ?')
			.setURL('https://wheretheiss.at/')
			.addFields(
				{ name: '↕️ Latitude', value: ('`' + data['latitude'] + '`'), inline: true },
				{ name: '↔️ Longitude', value: ('`' + data['longitude'] + '`'), inline: true },
				{ name: '\u200b', value: '\u200b', inline: true },
				{ name: '⛰️ Altitude', value: ('`' + Math.round(data['altitude'] * 100) / 100 + ' km`'), inline: true },
				{ name: '📡 Velocity', value: ('`' + Math.round(data['velocity'] * 100) / 100 + ' km/h`'), inline: true },
				{ name: '\u200b', value: '\u200b', inline: true }
			)
			.setTimestamp()
			.setFooter('Powered by WTIA')
		message.channel.send({ embeds: [embed] });
	}
}