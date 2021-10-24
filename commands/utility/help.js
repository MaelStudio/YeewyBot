const Discord = require('discord.js');
const database = require('../../functions/database.js');

module.exports = {
	name: 'help',
	description: 'Get a list of all commands or info about a specific command.',
	usage: 'help <command>',
	args: [[], ['command']],
	aliases: ['commands'],
	category: 'Utility',
	image: 'https://image.flaticon.com/icons/png/512/1041/1041728.png',

	async execute(message, args) {
		// testing
		console.log(inexistantVariable.qwerty)

		const { commands } = message.client;
		let commandsList = {};
		let prefix = await database.getGuild(message.guild);
		prefix = prefix['prefix'];

		if (!args.length) {

			for(const [key, value] of commands) {
				if(value.category != 'Hidden') commandsList[value.category] = [];
			}
			for(const [key, value] of commands) {
				if(value.category != 'Hidden') commandsList[value.category].push(value.name);
			}

			let botOwner = message.client.users.cache.get('579760700700753924');
			let embed = new Discord.MessageEmbed()
				.setColor('#ffc9e4')
				.setTitle('Help Page')
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setThumbnail('https://media.discordapp.net/attachments/772805402399604756/823642462110220308/yeewy-rainbow.png')
				.setFooter(`Use y.help <command> to get info on a specific command`)
			
			Object.keys(commandsList).forEach(function(key) {
				embed.addField(
					`**${key}**`,
					`> \`${commandsList[key].join('`, `')}\``,
					false
				);
			});

			message.channel.send({ embeds: [embed] });

		} else {
			const name = args[0].toLowerCase();
			let command = commands.get(name) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));

			if(!command || command.category.toLowerCase() === 'hidden') return message.channel.send('⚠️ • This command does not exist.');

			let embed = new Discord.MessageEmbed()
				.setColor('#ffc9e4')
				.setTitle(command.category + '/' + command.name)
				.setDescription(command.description)
				.addField('Usage:', '```' + prefix + command.usage + '```', false )
				.setThumbnail(command.image)
				.setFooter('[] = required argument / <> = optional argument ')
			
			if(command.aliases) embed.addField('Aliases:', '`' + command.aliases.join('`, `') + '`', true )
			if(command.permission) embed.addField('Permission:', '`' + command.permission + '`', true)
			
			message.channel.send({ embeds: [embed] });
		}
	}
}