const {prefix, defaultCooldown} = require('../config.json');

module.exports = {
	name: 'help',
	cooldown: 5,
	description: 'Lists everything I can do, or get info on a specific command',
	aliases: ['command'],
	usage:'[command name]',
	guildOnly:false,
	execute(message, args) {
		const data = [];
		const {commands} = message.client;
		
		if (!args.length) {
			// Spit out all commands
			data.push('Here\'s a list of everything I can do:\n');
			data.push(commands.filter(command => !command.hidden).map(command => '-'+command.name).join('\n'));
			data.push(`\nYou can do \`${prefix}help [command name]\` to get specific details on a command`);
			
			return message.author.send(data, {split: true})
				.then(() => {
					if (message.channel.type == 'dm') return;
					message.reply('I DM\'d you a list of commands!');
				}).catch(error => {
					console.error(`Couldn\'t send help DM to ${message.author.tag}.\n`, error);
					message.reply('Couldn\'t DM you for some reason? Do you have DMs disabled?');
				});
		}else{
			// Specific command
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));
			
			if (!command) {
				return message.reply('I don\'t know that one!');
			}
			
			data.push(`**[--- ${command.name} ---]**`);
			
			if (command.aliases) data.push(`*Aliases: ${command.aliases.join(', ')}*`);
			if (command.usage) data.push(`*Usage:* \`${prefix}${command.name} ${command.usage}\` (${command.cooldown || defaultCooldown}s delay)\n`);
			if (command.description) data.push(`${command.description}`);
			
			message.channel.send(data, {split:true});
		}
	}
}