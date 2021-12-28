const storage = require('../util/storage.js');

module.exports = {
	name: 'inventory',
	aliases: ['stuff'],
	cooldown: 3,
	description: 'View the contents of your inventory',
	args:false,
	usage:'',
	guildOnly:false,
	execute(message, args) {	
		const user = message.author.id.toString();
		const inventory = storage.userdata.get(user,'inventory');
		
		if (!inventory) {
			return message.reply(`Your inventory is empty!`);
		}else{
			let result = `Your inventory contains:\n`;
			for (const item in inventory) {
				if (inventory[item] > 0) {
					result += `**${item}**`;
					if (inventory[item] > 1) {
						result += ` (x${inventory[item]})`;
					}
					result += `\n`;
				}
			}
			return message.reply(result);
		}
	}
}