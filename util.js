const { aggregate } = require("./models/member");

module.exports = {
	toMs,
	randomInRange,
	capitalize,
	addLeadingZero,
	timeConverter,
	getMemberFromArg
}

function toMs(value, unit) {
	const coef = {
		s: 1000,
		min: 1000*60,
		h: 1000*60*60
	}
	return value*coef[unit];
}

function randomInRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function capitalize(text) {
	text = text.split('');
	text2 = text.shift().toUpperCase();
	text2.push(text);
	return text2;
}

function addLeadingZero(num) {
	if(num < 10) {
		num = '0' + num.toString();
	}
	return num;
}

function timeConverter(timestamp){
	var a = new Date(timestamp);
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var year = a.getUTCFullYear();
	var month = months[a.getUTCMonth()];
	var date = a.getUTCDate();
	var hour = addLeadingZero(a.getUTCHours());
	var min = addLeadingZero(a.getUTCMinutes());
	var sec = addLeadingZero(a.getUTCSeconds());
	var time = `${date} ${month} ${year} ${hour}:${min}:${sec} (UTC)`;
	return time;
}

function getUserIdFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return mention;
	}
}

function getMemberFromArg(arg, guild) {
	if (!arg) return;
	const member = guild.members.cache.find(m => m.user.username == arg || m.user.tag == arg || m.id == arg || m.id == getUserIdFromMention(arg));
	return member;
}