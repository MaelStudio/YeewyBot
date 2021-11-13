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

	toMs: {
		s: 1000,
		m: 1000*60,
		h: 1000*60*60
	}

}