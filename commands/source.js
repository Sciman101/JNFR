const { MessageButton } = require("discord-buttons");

module.exports = {
	name: 'source',
	aliases: ['sauce'],
	cooldown: 5,
	description: 'View my source code!',
	args:false,
	usage:'',
	guildOnly:false,
	execute(message, args) {
		message.reply('You can find my source code here! https://github.com/Sciman101/JNFR');
	}
}