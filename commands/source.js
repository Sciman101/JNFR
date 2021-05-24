module.exports = {
	name: 'source',
	aliases: ['sauce'],
	cooldown: 5,
	description: 'View my source code!',
	args:false,
	usage:'',
	guildOnly:false,
	execute(message, args) {
		message.reply('Take a look! https://github.com/Sciman101/JNFR');
	}
}