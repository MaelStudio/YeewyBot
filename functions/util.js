module.exports = {

	getMinutesSinceEpoch() {
		return Math.floor(Date.now() / 1000 / 60);
	},

	getSecondsSinceEpoch() {
		return Math.floor(Date.now() / 1000);
	},

	randomInRange(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	},

	capitalize(text) {
		text = text.split('');
		text2 = text.shift().toUpperCase();
		text2.push(text);
		return text2;
	}
	
}