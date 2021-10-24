const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'uptime',
	description: 'For how long have I been running ?',
	usage: 'uptime',
	category: 'Utility',
	image: 'https://image.flaticon.com/icons/png/512/850/850960.png',

	execute(message, args) {
		let embed = new MessageEmbed()
			.setColor('#5ef263')
			.setTitle('Uptime')
			.setTimestamp()
		
		let uptime = Math.round(message.client.uptime/1000/60/6)/10
		if(uptime > 0) embed.setDescription(`⏱️ • I have been running for \`${uptime}h\`.`);
		else embed.setDescription(`⏱️ • I just started up !`);
		
		message.channel.send({ embeds: [embed] });
	}
}