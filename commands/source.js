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
		message.reply('You can find my source code here! https://github.com/Sciman101/JNFR\nAlso, use this link to invite me to more servers so I can spread my reign!\nhttps://discord.com/oauth2/authorize?client_id=352566617231720468&permissions=2483546176&scope=bot%20applications.commands');
	}
}