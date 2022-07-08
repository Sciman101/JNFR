import {optional, stringValue} from '../parser/arguments.js';
import {generateCommandUsage} from '../parser/usageGenerator.js';
import {log} from '../util/logger.js';
import Babbler from '../util/babbler.js';

export default {
	name: 'help',
	description: 'Get a list of commands, or help with a specific command',
	guildOnly:false,
	argTree:optional(stringValue('command_name')),
	execute(message, args) {
		const {commands} = message.client;

		if (args.command_name) {
			const command = commands.get(args.command_name) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(args.command_name));
			if (command) {

				// Generate description of command
				const commandDescription = `
**${command.name}** ${command.aliases ? `(${command.aliases.join(', ')})` : ''}
\`Usage: ${generateCommandUsage(command.argTree)}\`
${command.description}
`
				message.reply(commandDescription);

			}else{
				message.reply(Babbler.get('unknown_command_help',{command:args.command_name}));
			}
		}else{
			// List all commands
			// Spit out all commands
			const response = '```Commands:' + commands.map(command => '\n└ '+command.name).join('') + '\nUse j!help [command name] to get specific details on a command```';
			
			return message.author.send(response)
				.then(() => {
					if (message.channel.type == 'DM') return;
					message.reply('I DM\'d you a list of commands!');
				}).catch(error => {
					log.error(`Couldn\'t send help DM to ${message.author.tag}.\n`, error);
					message.reply('Couldn\'t DM you for some reason? Do you have DMs disabled?');
				});
		}
	}
}