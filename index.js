const fs = require('fs');
const Discord = require('discord.js');
const Text = require('./util/text.js');
// Load from config file
const {prefix, token, defaultCooldown} = require('./config.json');

// Setup discord client
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });
require('discord-buttons')(client);
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	if (!file.startsWith('-')) {
		const command = require(`./commands/${file}`);
		client.commands.set(command.name,command);

		// Add listeners for specific commands
		if ('listeners' in command) {
			for (const listener in command.listeners) {
				client.on(listener,command.listeners[listener]);
			}
		}
	}
}

// Setup cooldown system
const cooldowns = new Discord.Collection();

// On initialization
client.once('ready', () => {
	console.log('JNFR ready!');
	client.user.setActivity('type j!help');
});

// On message received...
client.on('message', message => {
	
	// Ignore bots
	if (message.author.bot) return;

	// Make sure it's a command for us
	if (!message.content.startsWith(prefix)) return;
	
	// Parse command name and arguments
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command || command == undefined) {
		return message.reply(Text.get('unrecognized'));
	}
	
	// Check command requirements
	// Guild only
	if (command.guildOnly && message.channel.type == 'dm') {
		return message.reply(Text.get('guildOnly'));
	}

	// Check permissions
	if (command.permissions) {
		const member = message.guild.members.cache.get(message.author.id);
		for (const perm in command.permissions) {
			if (!member || !member.hasPermission(perm)) {
				return message.reply(Text.get('noPermission'));
			}
		}
	}
	
	// Missing parameters
	if (command.args && !args.length) {
		let reply = Text.get('noArgs',{AUTHOR:message.author});
		if (command.usage) {
			reply += '\n'+Text.get('properUsage',{USAGE:`\`${prefix}${command.name} ${command.usage}\``});
		}
		return message.channel.send(reply);
	}
	
	// Cooldown
	// Establish cooldowns, if we haven't already
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name,new Discord.Collection());
	}
	// Check
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmt = (command.cooldown || defaultCooldown) * 1000;
	
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmt;
		
		if (now < expirationTime) {
			const timeLeft = ((expirationTime - now)/1000).toFixed(1);

			let timeAmount = '';
			if (timeLeft < 60) {
				timeAmount = `${timeLeft} second(s)`;
			}else if (timeLeft < 3600) {
				timeAmount = `${Math.floor(timeLeft/60)} minute(s)`;
			}else{
				timeAmount = `${Math.floor(timeLeft/3600)} hour(s)`;
			}

			return message.reply(Text.get('cooldown',{TIME:timeAmount,COMMAND:command.name}));
		}
	}
	// Update timestamp
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmt);
	
	// Actually run the dang thing
	try {
		command.execute(message,args);
	}catch(error) {
		console.error(error);
		message.reply(Text.get('error'));
	}
});

// Handle shutdown
process.on('SIGINT', () => {
	process.exit();
});
process.on('SIGTERM', () => {
	process.exit();
});

// Login!
client.login(token);