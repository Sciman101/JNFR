import {stringValue} from '../parser/arguments.js';
import {log} from '../util/logger.js';

export default {
	name: 'echo',
	description: 'Repeats back whatever you type',
	guildOnly:false,
	argTree:stringValue(true),
	execute(message, args) {
		message.channel.send(args[0]);
		log.info('Thing happened!');
	}
}