import {stringValue} from '../parser/arguments.js';

export default {
	name: 'echo',
	aliases: ['pingpong'],
	description: 'Repeats back whatever you type',
	guildOnly:false,
	argTree:stringValue('message',true),
	execute(message, args) {
		message.channel.send(args.message);
	}
}