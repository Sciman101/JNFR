const fs = require('fs');
const {Client, Intents, Collection} = require('discord.js');
const {prefix, token} = require('./config.json');

const argumentParser = require('./parser/argumentParser.js');

// Setup discord client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	if (!file.startsWith('-')) { // Files starting with a hyphen are ignored
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
	const rawArgs = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = rawArgs.shift().toLowerCase();
	
	const command = client.commands.get(commandName);
	if (!command || command == undefined) {
		return message.reply('Unknown command');
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
				return message.reply('You do not have permission to use that command!');
			}
		}
	}

	// Parse arguments
	const parseResult = argumentParser(rawArgs,command.argTree);
	if (parseResult.error) {
		// Oops!
		return message.reply(parseResult.error);
	}
	
	// Actually run the dang thing
	try {
		command.execute(message,parseResult);
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