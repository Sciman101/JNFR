import {optional, stringValue} from '../parser/arguments.js';

export default {
	name: 'help',
	description: 'Get a list of commands, or help with a specific command',
	guildOnly:false,
	argTree:optional(stringValue()),
	execute(message, args) {
		console.log(args[0]);
	}
}