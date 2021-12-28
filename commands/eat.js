const inventoryHelper = require('../util/inventoryHelper.js');
const storage = require('../util/storage.js');
const Text = require('../util/text.js');

module.exports = {
	name: 'eat',
	aliases: ['munch','chomp','devour','snack'],
	cooldown: 5,
	description: 'Eat one of your items. Humans can eat anything, right?\n(You only need to type the first few words of the item you want to eat. If you have multiple items that work, I\'ll just feed you the first matching one)',
	args:true,
	usage:'<item to eat>',
	guildOnly:false,
	execute(message, args) {
		const food = args.join(' ');
        const user = message.author.id.toString();
		let inventory = storage.userdata.get(user,'inventory');

        const items = inventoryHelper.searchInventory(inventory,food);
        // did we find something to eat?
        if (items.length == 0) {
            return message.reply("You don't have anything like that");
        }else if (items.length > 0) {
            
            // remove item
            inventory[items[0]] -= 1;
            storage.userdata.put(user,'inventory',inventory);

            // say funny thing
            return message.reply(Text.get('eating',{FOOD:items[0]}));
        }
	}
}