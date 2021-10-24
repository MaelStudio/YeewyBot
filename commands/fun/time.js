const { MessageEmbed } = require('discord.js');

function getTimeString(utcOffset) {

	const now = new Date();

	let hours = now.getUTCHours() + utcOffset;
	if(hours > 23) hours = hours - 24;
	if(hours < 0) hours = 24 + hours;
	if(hours < 10) hours = ('0' + hours.toString());

	let minutes = now.getUTCMinutes();
	if(minutes < 10) minutes = ('0' + minutes.toString());

	return `${hours}:${minutes}`;
}

module.exports = {
	name: 'time',
	description: 'Get the time in different cities.',
	usage: 'time',
	aliases: ['whattimeisit'],
	category: 'Fun',
	image: 'https://image.flaticon.com/icons/png/512/2784/2784459.png',

	execute(message, args) {

		let embed = new MessageEmbed()
			.setColor('#ff5230')
			.setTitle('What time is it ?')
			.setTimestamp()

		timezones = [
			{
				city: 'Paris',
				utcOffset: 2,
				emoji: ':flag_fr:'
			},
			{
				city: 'New York',
				utcOffset: -4,
				emoji: ':flag_us:'
			},
			{
				city: 'Tokyo',
				utcOffset: 9,
				emoji: ':flag_jp:'
			},
			{
				city: 'Buenos Aires',
				utcOffset: -3,
				emoji: ':flag_ar:'
			},
			{
				city: 'London',
				utcOffset: 1,
				emoji: ':flag_gb:'
			},
			{
				city: 'Beijing',
				utcOffset: 8,
				emoji: ':flag_cn:'
			}
		];

		timezones.sort(function (a, b) {
  			return  a.utcOffset - b.utcOffset;
		});

		timezones.forEach((timezone, i) => {

			embed.addField(
				`${timezone.emoji} ${timezone.city}`,
				getTimeString(timezone.utcOffset),
				true
			);

		});

		message.channel.send({ embeds: [embed] });
	}
}