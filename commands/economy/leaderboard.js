const Discord = require('discord.js');
const Member = require('../../models/member.js');

module.exports = {
	name: 'leaderboard',
	description: 'Get the server\'s economy leaderboard',
	usage: 'leaderboard',
	aliases: ['lb', 'top'],
	category: 'Economy',
	image: 'https://image.flaticon.com/icons/png/512/3553/3553968.png',

	async execute(message, args) {

		const members = await Member.find();
		let guildMembers = [];

		for (let i in members) {
			if (members[i]['guildId'] === message.guild.id) {
				guildMembers.push(members[i]);
			}
		}

		const leaderboard = guildMembers.sort(function (memberA, memberB) {
  			return  (memberB['walletBal'] + memberB['bankBal']) - (memberA['walletBal'] + memberA['bankBal']);
		});

		let lbMessage = '';
		let yourRank = 0;
		for (let i in leaderboard) {
			if (i < 10 && leaderboard[i]['walletBal'] + leaderboard[i]['bankBal'] > 0) lbMessage += `**${parseInt(i) + 1}.** ${message.client.users.cache.get(leaderboard[i]['userId']).tag} • \`$${leaderboard[i]['walletBal'] + leaderboard[i]['bankBal']}\`\n`;
			if (leaderboard[i]['userId'] === message.author.id) yourRank = parseInt(i) + 1;
		}

		let embed = new Discord.MessageEmbed()
			.setColor('#22a7e5')
			.setTitle(`${message.guild.name} Leaderboard`)
			.setDescription(lbMessage)
			.setTimestamp()
		if (yourRank > 0) embed.setFooter(`Your rank: #${yourRank}`)
		message.channel.send({ embeds: [embed] });
	}
}