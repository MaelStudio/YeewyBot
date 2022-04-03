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
			if (!util.getMemberFromArg(arg)) return false;
			break;

		case 'number':
			if(isNaN(arg)) return false;
			break;
		
		case 'numberall':
			if (isNaN(arg) && arg.toLowerCase() != 'all') return false;
			break;

		case 'integer':
			if(isNaN(arg) || arg % 1 !== 0) return false;
			break;
		
		case 'color':
			if (!['red', 'black'].includes(arg.toLowerCase())) return false;
			break;
	}
	return true;
}

// ready event
client.once('ready', async () => {
	client.user.setPresence({ activities: [{ name: 'Starting up...', type: 'PLAYING' }], status: 'online' });
	const guildIds = client.guilds.cache.map(guild => guild.id);
	const botOwner = client.users.cache.get('579760700700753924');

	console.log(`[+] Logged in as ${client.user.tag}`);
	console.log('——————————————————————————————');
	console.log(`Client ID: ${client.user.id}`);
	console.log(`Client status: ${client.presence.status}`);
	console.log(`Guilds count: ${guildIds.length}`);
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
	if (message.content === '<@!809060998015090741>') {
		let embed = new Discord.MessageEmbed()
			.setColor('#ffb5ed')
			.setTitle(`My prefix in this server is ${prefix}`)
			.setDescription(`Use \`${prefix}help\` to get the help page.`)
			.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });
	}
	
	if (!message.content.startsWith(prefix)) return;

	// commands
	const args = message.content.slice(prefix.length).split(' ');
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	// check permission
	if (command.permission) {
		const authorPerms = message.channel.permissionsFor(message.author, true);
		if (!authorPerms.has(command.permission) && message.author.id !== message.guild.ownerId) {
			let embed = new Discord.MessageEmbed()
				.setColor('#ffe900')
				.setTitle('🚧 • Missing permission')
				.setDescription(`You cannot use this command. Missing permission \`${command.permission}\`.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}
	}

	// check args
	if (command.args) {

		let goodUsage = true;
		
		// correct amount of arguments
		if (command.args.required && args.length < command.args.required.length) {
			goodUsage = false;
		} else {
			// required arguments
			if (command.args.required) {
				for(let i=0; i<command.args.required.length; i++) {
					if(!isValidArgument(args[i], command.args.required[i], message)) goodUsage = false;
				}
			}
			
			// optional arguments
			if (command.args.optional) {
				for(let i=0; i<command.args.optional.length; i++) {

					let arg = args[i];
					if (command.args.required) arg = args[i + command.args.required.length];

					if (!arg) break;
					if (!isValidArgument(arg, command.args.optional[i], message)) goodUsage = false;
					
				}
			}
		}

		if(!goodUsage) {
			let embed = new Discord.MessageEmbed()
				.setColor('#666768')
				.setTitle('📎 • Wrong command usage')
				.setDescription(`Invalid arguments specified: \`${prefix + command.usage}\``)
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}
	}

	// check cooldown
	if (command.cooldown) {

		const cooldown = util.toMs(command.cooldown.value, command.cooldown.unit);
		const dbMember = await database.getMember(message.member);
		const lastUsed = dbMember.cooldowns[command.name];

		if (lastUsed && Date.now() - lastUsed < cooldown) {
			const toWait = (lastUsed - Date.now() + cooldown) / util.toMs(1, command.cooldown.unit);
			let embed = new Discord.MessageEmbed()
				.setColor('#99611e')
				.setTitle('⏳ • Command on cooldown')
				.setDescription(`The \`${command.name}\` command is on cooldown. Please wait \`${Math.round(toWait*10)/10} ${command.cooldown.unit}\`.`)
				.setAuthor(message.author.tag, message.author.avatarURL())
			message.channel.send({ embeds: [embed] });
			return;
		}
	}

	// execute command
	console.log(`[*] '${command.name}' command used by ${message.author.tag} (${message.guild.name})`);
	try {
		command.execute(message, args);
	} catch (error) {

		console.error(error);
		let embed = new Discord.MessageEmbed()
				.setColor('#ff2a00')
				.setTitle('✂️ • Code error')
				.setDescription('Sorry, an error occured trying to execute the command. The bot owner has been warned.')
				.setAuthor(message.author.tag, message.author.avatarURL())
		message.channel.send({ embeds: [embed] });

		// log error
		let logEmbed = new Discord.MessageEmbed()
			.setTitle('An error occured executing command')
			.setDescription(`Message sent by **${message.author.tag}** (${message.guild.name}) :\n${message.content}\n\nError:\n\`\`\`js\n${error}\n\`\`\``)
			.setTimestamp()
		const logChannel = client.channels.cache.get(config.logChanelId);
		logChannel.send({ embeds: [logEmbed] })
	}
	
	// set command on cooldown
	if (command.cooldown) {
		const dbMember = await database.getMember(message.member);
		dbMember.cooldowns[command.name] = Date.now();
		await dbMember.updateOne({ cooldowns: dbMember.cooldowns });
	}

});

// login
client.login(config.token);