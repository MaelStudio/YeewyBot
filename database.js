const Member = require('./models/member.js');
const Guild = require('./models/guild.js');
const config = require('./config.js');

module.exports = {
	getMember,
	updateMember,
	addCoinsToMember,
	getGuild,
	updateGuild
}

async function getMember(member) {

	const data = await Member.findOne({
		userId: member.id,
		guildId: member.guild.id
	});
	if (data) {
		return data;
	} else {

		const newMember = new Member({
			userId: member.id,
			guildId: member.guild.id,
			walletBal: 0,
			bankBal: 0,
			warns: [],
			cooldowns: {}
		});
		const dbMember = await newMember.save();
		console.log(`[^] Saved member ${member.user.tag} (${member.guild.name}) to the database`);
		return dbMember;
	}

}

async function updateMember(dbMember, settings) {
	console.log(`[^] Updated member ${dbMember['userId']} (${dbMember['guildId']}) in the database`);
	return dbMember.updateOne(settings);
}

async function addCoinsToMember(member, amount, place) {
	const dbMember = await getMember(member);
	if (place === 'wallet') updateMember(dbMember, { walletBal: dbMember['walletBal'] + parseInt(amount) });
	if (place === 'bank') updateMember(dbMember, { bankBal: dbMember['bankBal'] + parseInt(amount) });
}

async function getGuild(guild) {

	const data = await Guild.findOne({
		guildId: guild.id
	});
	if (data) {
		return data;
	} else {

		const newGuild = new Guild({
			guildId: guild.id,
			prefix: config.prefix
		});
		const dbGuild = await newGuild.save();
		console.log(`[^] Saved guild ${guild.name} to the database`);
		return dbGuild;
	}

}

async function updateGuild(guild, settings) {
	const dbGuild = await getGuild(guild);
	console.log(`[^] Updated guild '${guild.name}' in the database`);
	return dbGuild.updateOne(settings);
}