const {stringValue} = require('../parser/arguments.js');

module.exports = {
	name: 'echo',
	description: 'Repeats back whatever you type',
	guildOnly:false,
	argTree:stringValue(true),
	execute(message, args) {
		message.channel.send(args[0]);
	}
}