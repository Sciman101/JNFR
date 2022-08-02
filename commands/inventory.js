import {stringValue,optional} from '../parser/arguments.js';
import Database, {db} from '../util/db.js';
import {items, rarityString} from '../data/items.js';
import Babbler from '../util/babbler.js';
import {searchInventory} from '../util/inventoryHelper.js';

export default {
	name: 'inventory',
	aliases: ['stuff','items'],
	description: 'Look at all your stuff, or a specific item',
	guildOnly:false,
	argTree:optional(stringValue('itemname',true)),
	execute(message, args) {

		const user = Database.getUser(message.author.id.toString());
		const inventory = user.inventory;

		if (!args.itemname) {

			// Get inventory
			//console.log(inventory);
			const inventoryString =
			`
Your inventory contains:
\`${Object.values(inventory).map(slot => '└ ' + items[slot.id].name + (slot.count > 1 ? ' (x'+slot.count+')' : '')).join('\n')}\`
			`;

			message.reply(inventoryString);
		}else{

			// Find matches
			const slots = searchInventory(inventory,args.itemname);
			if (slots.length === 0) {
				return message.reply(`You don't have anything like that`);
			}
			const slot = slots[0];
			const item = items[slot.id];
			// Describe item
			const itemDescription = `
**${item.name}** - ${rarityString(item.rarity)}
\`You have: ${slot.count} | Total Owned: ${slot.owned}\`
${item.description}
			`;

			return message.reply(itemDescription);


		}
	}
}