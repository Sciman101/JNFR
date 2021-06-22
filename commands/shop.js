const items = require('../data/items.json');
const storage = require('../util/storage.js');
const Text = require('../util/text.js');

// Get store inventory
let inventory = [];
let stock = [];
for (let i=0;i<5;i++) {
	// Add 5 random items
	let item = '';
	do {
		item = items[Math.floor(Math.random() * items.length)];
	}while (inventory.indexOf(item) != -1);
	inventory.push(item);
	stock.push(Math.floor(Math.random()*3)+1);
}

module.exports = {
	name: 'shop',
	aliases: ['store','buy'],
	cooldown: 1,
	description: 'Spend your Jollars on random crap I found! Shop contents refresh every day',
	args:false,
	usage:'[item number]',
	guildOnly:false,
	execute(message, args) {

		const jollarSign = Text.getJollarSign(message.guild);

		if (!args.length) {
			// Show products

			// Get balance
			const user = message.author.id.toString();
			const bal = storage.userdata.get(user,'balance') || 0;

			let result = `The store is currently selling:\n--------------\n`;
			for (let i=0;i<5;i++) {

				let desc = `${i+1}) **${inventory[i]}** (x${stock[i]}) - _\`${(i+1)*50}\`_ ${jollarSign}`;
				if (stock[i] == 0) {
					desc = `~~` + desc + `~~ (OUT OF STOCK)`;
				}
				result += desc + `\n\n`;
			}
			result += `--------------\n(You have ${bal} ${jollarSign})\n`;
			result += `To buy something, use \`j!shop <item number>\``;
			message.channel.send(result);
		}else{

			const itemNum = parseInt(args[0]);
			if (!itemNum || (itemNum < 1 || itemNum > 5)) {
				return message.reply("That's an invalid item number! (Pick something from 1-5)");
			}
			const index = itemNum-1;
			if (stock[index] <= 0) {
				return message.reply('That item is out of stock!');
			}

			// sell em the item
			const user = message.author.id.toString();

			// Get cost and balance
			const cost = (itemNum) * 50;
			const item = inventory[index];
			const bal = storage.userdata.get(user,'balance') || 0;
			if (bal < cost) {
				return message.reply(`Come back when you're a little, mmm, richer! (Current balance is ${bal} ${jollarSign})`);
			}else{
				// Take money
				storage.userdata.put(user,'balance',bal-cost);

				// Get inventory and add item
				let userInventory = storage.userdata.get(user,'inventory');
				if (!userInventory) {
					userInventory = {};
				}
				if (userInventory[item]) {
					userInventory[item] += 1;
				}else{
					userInventory[item] = 1;
				}
				stock[index]--;

				storage.userdata.put(user,'inventory',userInventory);

				// Done!
				message.reply(`You bought '${item}' for ${cost} ${jollarSign}! Pleasure doing business with you`);
			}

		}
	}
}