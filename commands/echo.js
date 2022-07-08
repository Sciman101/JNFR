import {stringValue, branch, any, numValue,literal} from '../parser/arguments.js';
import {log} from '../util/logger.js';

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