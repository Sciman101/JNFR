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
		let button = new MessageButton()
			.setStyle('url')
			.setURL('https://github.com/Sciman101/JNFR')
			.setLabel('GitHub');
		message.reply('You can find my source code here!',button);
	}
}