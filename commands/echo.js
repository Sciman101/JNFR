module.exports = {
	name: 'echo',
	aliases: ['repeat'],
	cooldown: 1,
	description: 'Repeats back whatever you type',
	args:true,
	usage:'<message>',
	guildOnly:false,
	execute(message, args) {
		message.channel.send(args.join(' '));
	}
}