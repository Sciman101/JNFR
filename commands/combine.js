const storage = require('../util/storage.js');
const items = require('../data/items.json');
const Text = require('../util/text.js');

module.exports = {
	name: 'combine',
	aliases: ['alchemy','craft'],
	cooldown: 10,
	description: 'Combine 2 items from your inventory into something new!\nAll recipes have a fixed input and output, but not every pair of items will necessarily make something.',
	args:true,
	usage:'<item slot 1> <item slot 2>',
	guildOnly:false,
	execute(message, args) {

        if (args.length != 2) {
            return message.reply('You need to provide me with 2 slots from your inventory to combine!');
        }
        // Get slots
        const slot1 = parseInt(args[0]);
        const slot2 = parseInt(args[1]);

        // Get inventory
        const user = message.author.id.toString();
		let inventory = storage.userdata.get(user,'inventory');

        if (!inventory) {
            return message.reply("You don't have any items to craft with!");
        }

        // Check slot validity
        const inventorySize = Object.keys(inventory).length;
        if (!slot1 || slot1 > inventorySize) {
            return message.reply(`The first inventory slot isn't valid (${args[0]}, your inventory has ${inventorySize} items)`);
        }
        if (!slot2 || slot2 > inventorySize) {
            return message.reply(`The second inventory slot isn't valid (${args[1]}, your inventory has ${inventorySize} items)`);
        }

        // Get the items
        let item1 = null;
        let item2 = null;
        let index = 0;
        for (const item in inventory) {
            if (index + 1 == slot1) {
                item1 = item;
            }
            if (index + 1 == slot2) {
                item2 = item;
            }else if (index > slot2 && index > slot1) {
                break;
            }
            index += 1;
        }
        if (!item1 || !item2) {
            return message.reply('Something went wrong!');
        }

        // Get their indices
        const itemIndex1 = items.indexOf(item1);
        const itemIndex2 = items.indexOf(item2);

        // Generate a new random number from these two
        const rand = randFrom2d(itemIndex1,itemIndex2);
        const newIndex = Math.floor(rand * items.length);
        const newItem = items[newIndex];

        message.channel.send(`Combining ${item1} and ${item2}...`);
        message.channel.send(Text.get('crafting'));
        message.reply(`You made '${newItem}'! Congrats!`);

        // Add and remove items from inventory
        if (--inventory[item1] <= 0) {
            delete inventory[item1];
        }
        if (--inventory[item2] <= 0) {
            delete inventory[item2];
        }

        if (inventory[newItem]) {
            inventory[newItem]++;
        }else{
            inventory[newItem] = 1;
        }
        // Save inventory
        storage.userdata.put(user,'inventory',inventory);
        
	}
}

//https://www.ronja-tutorials.com/post/024-white-noise/
//thanks again ronja
function randFrom2d(x,y) {

    const sin1 = Math.sin(x);
    const sin2 = Math.sin(y);

    let random = sin1 * 12.98666 + sin2 * 32493.0002;
    random = Math.sin(random) * 143758.5453;

    return Math.abs(random % 1);
}