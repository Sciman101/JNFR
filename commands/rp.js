module.exports = {
	name: 'rp',
	aliases: [],
	cooldown: 1,
	description: 'Repeats back whatever you type in the specified channel',
	args:true,
	usage:'<channel> <message>',
    hidden: true,
	guildOnly:false,
	execute(message, args) {
        const channel = message.guild.channels.cache.get(args[0].slice(2,-1));
		channel.send(args.slice(1).join(' '));
	}
}