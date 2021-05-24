const storage = require('../util/storage.js');
const items = require('../data/items.json');

module.exports = {
	name: 'lucky',
	aliases: ['lootbox','gacha'],
	cooldown: 60*15,
	description: 'Spend 100 jCoin to receive a random prize! Has a very long cooldown',
	args:false,
	usage:'',
	guildOnly:false,
	execute(message, args) {	
		// Get balance
		const user = message.author.id.toString();
		const bal = storage.userdata.get(user,'balance');
		const cost = 100;
		if (bal >= cost) {

			// Pick item
			if (Math.random() < 0.05) {
				// 5% chance to receive a huge cash bonus
				const reward = Math.floor(((Math.random()+1) * cost));
				storage.userdata.put(user,'balance',bal+reward);
				message.reply(`Woah! You got super lucky and found ${reward} jCoin!`);

			}else{

				// Remove money
				storage.userdata.put(user,'balance',bal-cost);

				const index = Math.floor(Math.random() * items.length);
				const item = items[index];

				// Add item
				let inventory = storage.userdata.get(user,'inventory');
				if (!inventory) {
					inventory = {};
				}
				if (inventory[item]) {
					inventory[item] += 1;
				}else{
					inventory[item] = 1;
				}
				storage.userdata.put(user,'inventory',inventory);

				message.reply(`Congradulations! You won a '${item}'!`);
			}

		}
	}
}