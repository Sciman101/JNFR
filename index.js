const fs = require('fs');
const Discord = require('discord.js');
// Load from config file
const {prefix, token, defaultCooldown} = require('./config.json');

// Setup discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name,command);
}

// Setup cooldown system
const cooldowns = new Discord.Collection();

// On initialization
client.once('ready', () => {
	console.log('JNFR ready!');
});

// On message received...
client.on('message', message => {
	
	// Make sure it's a command for us
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	
	// Parse command name and arguments
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;
	
	// Check command requirements
	// Guild only
	if (command.guildOnly && message.channel.type == 'dm') {
		return message.reply('I can\'t use that command here!');
	}
	
	// Missing parameters
	if (command.args && !args.length) {
		let reply = `You didn't give me any arguments, ${message.author}!`
		if (command.usage) {
			reply += `\nThe proper usage of that command is \`${prefix}${command.name} ${command.usage}\``;
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
			return message.reply(`Wait ${timeLeft} more second(s) before using \`${command.name}\` again`);
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
		message.reply('Something went wrong! :P');
	}
});

// Login!
client.login(token);