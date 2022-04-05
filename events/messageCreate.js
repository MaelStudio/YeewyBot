const { MessageEmbed } = require('discord.js');
const config = require('../config.js');
const util = require('../util.js');
const database = require('../database.js');

// argument checker
function isValidArgument(arg, argType, message) {
	switch(argType.toLowerCase()) {

		case 'member':
			if (!util.getMemberFromArg(arg, message.guild)) return false;
			break;
		
		case 'channel':
			if(!util.getChannelFromArg(arg, message.guild)) return false;
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

module.exports = {
    name: 'messageCreate',
    async execute (message) {

        if (message.author.bot || message.channel.type === 'dm') return;

        // get prefix
        let prefix = await database.getGuild(message.guild);
        prefix = prefix['prefix'];

        // mention
        if (message.content === '<@!809060998015090741>') {
            let embed = new MessageEmbed()
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
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        // check permission
        if (command.permission) {
            const authorPerms = message.channel.permissionsFor(message.author, true);
            if (!authorPerms.has(command.permission) && message.author.id !== message.guild.ownerId) {
                let embed = new MessageEmbed()
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
            
            // check for amount of arguments
            if (command.args.required && args.length < command.args.required.length) {
                goodUsage = false;
            } else {
                // check required arguments
                if (command.args.required) {
                    for(let i=0; i<command.args.required.length; i++) {
                        if(!isValidArgument(args[i], command.args.required[i], message)) goodUsage = false;
                    }
                }
                
                // check optional arguments
                if (command.args.optional) {
                    for(let i=0; i<command.args.optional.length; i++) {

                        let arg = args[i];
                        if (command.args.required) arg = args[i + command.args.required.length];

                        if (!arg) break;
                        if (!isValidArgument(arg, command.args.optional[i], message)) goodUsage = false;
                        
                    }
                }
            }

            // wrong args
            if(!goodUsage) {
                let embed = new MessageEmbed()
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
                let embed = new MessageEmbed()
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
            let embed = new MessageEmbed()
                    .setColor('#ff2a00')
                    .setTitle('✂️ • Code error')
                    .setDescription('Sorry, an error occured trying to execute the command. The bot owner has been warned.')
                    .setAuthor(message.author.tag, message.author.avatarURL())
            message.channel.send({ embeds: [embed] });

            // log error
            let logEmbed = new MessageEmbed()
                .setTitle('An error occured executing command')
                .setDescription(`Message sent by **${message.author.tag}** (${message.guild.name}) :\n${message.content}\n\nError:\n\`\`\`js\n${error}\n\`\`\``)
                .setTimestamp()
            const logChannel = message.client.channels.cache.get(config.logChanelId);
            logChannel.send({ embeds: [logEmbed] })
        }
        
        // set command on cooldown
        if (command.cooldown) {
            const dbMember = await database.getMember(message.member);
            dbMember.cooldowns[command.name] = Date.now();
            await dbMember.updateOne({ cooldowns: dbMember.cooldowns });
        }

    }
}