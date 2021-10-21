// require modules
const Discord = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');

// require files
const config = require('./config.js');
const util = require('./functions/util.js');
const database = require('./functions/database.js');

// create discord client
const intents = new Discord.Intents(32767)
const client = new Discord.Client({ intents });


// get all the commands
client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands/');

for (const folder of commandFolders) {

	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}


// mongoose database
mongoose.connect(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('[^] Connected to the database'))
	.catch((err) => console.error(err));

// argument checker
function isValidArgument(arg, argType, message) {
	switch(argType.toLowerCase()) {

		case 'member':
			const mention = message.mentions.members.first();
			const member = message.mentions.members.first() || message.guild.members.cache.find(m => m == arg || m.user.username == arg || m.user.tag == arg || m.id == arg);
			if (!member || mention && arg != `<@!${mention.id}>`) return false;
			break;

		case 'number':
			if(isNaN(arg)) return false;
			break;
		
		case 'numberall':
			if (isNaN(arg) && arg.toLowerCase() != 'all') return false;
			break;
		
		case 'color':
			if (!['red', 'black'].includes(arg.toLowerCase())) return false;
			break;
	}
	return true;
}

// ready event
client.once('ready', async () => {
	client.user.setPresence({ activities: [{ name: 'Starting up...', type: 'PLAYING' }], status: 'idle' });
	const guildIds = client.guilds.cache.map(guild => guild.id);
	const botOwner = await client.users.fetch('579760700700753924');

	console.log(`[+] Logged in as ${client.user.tag}`);
	console.log('——————————————————————————————');
	console.log(`Bot owner: ${botOwner.tag}`);
	console.log(`Client ID: ${client.user.id}`);
	console.log(`Client status: ${client.presence.status}`);
	console.log(`Currently on ${guildIds.length} guilds`);
	console.log('——————————————————————————————');

	// changing status
	function updateStatus() {
        let status = `${config.prefix}help — ${config.statuses[util.randomInRange(0, config.statuses.length-1)]}`;
		while(status === client.user.presence.activities[0].name) {
			status = `${config.prefix}help — ${config.statuses[util.randomInRange(0, config.statuses.length-1)]}`;
		}
        client.user.setPresence({ activities: [{ name: status, type: 'PLAYING' }], status: 'online' });
	}
	setInterval(updateStatus, 10000);
});

// messageCreate event
client.on('messageCreate', async message => {

	let prefix = await database.getGuild(message.guild);
	prefix = prefix['prefix'];
	
	if (message.author.bot || message.channel.type === 'dm') return;
	if (message.content === '<@!809060998015090741>') message.channel.send(`**My prefix in this server is \`${prefix}\`**\nSend \`${prefix}help\` to get the help page !`);
	if (!message.content.startsWith(prefix)) return;

	// commands
	const args = message.content.slice(prefix.length).split(' ');
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	// check permission
	if (command.permission) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms.has(command.permission)) {
			return message.channel.send(`🚧 • You cannot use this command. Missing permission \`${command.permission}\`.`);
		}
	}

	// check args
	if(command.args) {

		let goodUsage = true;
		
		// correct amount of arguments
		if(args.length < command.args[0].length) {
			goodUsage = false;
		} else {
			// required arguments
			for(let i=0; i<command.args[0].length; i++) {
				if(!isValidArgument(args[i], command.args[0][i], message)) goodUsage = false;
			}
			// optional arguments
			for(let i=0; i<command.args[1].length; i++) {
				if(args.length > (command.args[0].length + i) && !isValidArgument(args[i], command.args[1][i], message)) goodUsage = false;
			}
		}

		if(!goodUsage) return message.channel.send(`📎 • Wrong command usage: \`${prefix + command.usage}\``);
	}

	// execute command
	try {
		console.log(`[*] '${command.name}' command used by ${message.author.tag} (${message.guild.name})`);
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.channel.send('✂️ • An error occured trying to execute the command.');
	}

});

// login
client.login(config.token);