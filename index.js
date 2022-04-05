// require modules
const Discord = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');

// require files
const config = require('./config.js');
const util = require('./util.js');
const database = require('./database.js');

// create discord client
const intents = new Discord.Intents(32767)
const client = new Discord.Client({ intents });


// load all the commands
client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands/');

for (const folder of commandFolders) {

	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

// load all events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// connect to database
mongoose.connect(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('[^] Connected to the database'))
	.catch((err) => console.error(err));

// login
client.login(config.token);