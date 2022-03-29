const storage = require('../util/storage.js');

module.exports = {
	name: 'deaths',
	aliases: [],
	cooldown: 1,
	description: 'How many times have you died?',
	args:false,
	usage:'',
	guildOnly:false,
	execute(message, args) {
		const user = message.author.id.toString();
		const deaths = storage.userdata.get(user,'deaths') || 0;

		message.reply(`You have died ${deaths} times.`);
	}
}