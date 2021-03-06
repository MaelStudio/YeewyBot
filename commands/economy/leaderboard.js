const { MessageEmbed } = require('discord.js');
const Member = require('../../models/member.js');

module.exports = {
	name: 'leaderboard',
	description: 'Get the server\'s economy leaderboard',
	usage: 'leaderboard',
	aliases: ['lb', 'top'],
	category: 'Economy',
	image: 'https://cdn-icons-png.flaticon.com/512/3553/3553968.png',

	async execute(message, args) {

		const members = await Member.find();
		const guildMembers = members.filter(mbr => mbr['guildId'] === message.guild.id);
		const leaderboard = guildMembers.sort((mbrA, mbrB) => (mbrB['walletBal'] + mbrB['bankBal']) - (mbrA['walletBal'] + mbrA['bankBal']));

		let lbMessage = '';
		let yourRank = 0;
		for (let i in leaderboard) {
			if (i < 10 && leaderboard[i]['walletBal'] + leaderboard[i]['bankBal'] > 0) lbMessage += `**${parseInt(i) + 1}.** ${message.client.users.cache.get(leaderboard[i]['userId']).tag} • \`$${leaderboard[i]['walletBal'] + leaderboard[i]['bankBal']}\`\n`;
			if (leaderboard[i]['userId'] === message.author.id) yourRank = parseInt(i) + 1;
		}

		let embed = new MessageEmbed()
			.setColor('#22a7e5')
			.setTitle(`${message.guild.name} Leaderboard`)
			.setDescription(lbMessage)
			.setTimestamp()
		if (yourRank > 0) embed.setFooter(`Your rank: #${yourRank}`)
		message.channel.send({ embeds: [embed] });
	}
}