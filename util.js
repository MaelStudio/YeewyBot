module.exports = {

	randomInRange(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	},

	capitalize(text) {
		text = text.split('');
		text2 = text.shift().toUpperCase();
		text2.push(text);
		return text2;
	},

	timeConverter(timestamp){
		var a = new Date(timestamp);
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var year = a.getUTCFullYear();
		var month = months[a.getUTCMonth()];
		var date = a.getUTCDate();
		var hour = a.getUTCHours();
		var min = a.getUTCMinutes();
		var sec = a.getUTCSeconds();
		var time = `${date} ${month} ${year} ${hour}:${min}:${sec} (UTC)`;
		return time;
	},

	toMs: {
		s: 1000,
		m: 1000*60,
		h: 1000*60*60
	}

}