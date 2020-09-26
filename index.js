const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('JNFR ready!');
});

client.on('message', message => {
	if (message.content.indexOf('69') != -1) {
		message.channel.send('Nice');
	}
});

// Remove this
client.login('MzUyNTY2NjE3MjMxNzIwNDY4.WacvPw.bTBF4FmmxoL7j3EM0ciwzf9CxcE');