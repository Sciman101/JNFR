import {stringValue,optional} from '../parser/arguments.js';
import Database, {db} from '../util/db.js';
import {items, ITEM_RARITY_LABELS, ITEM_USABLE_LABEL} from '../data/items.js';
import {searchInventory} from '../util/inventoryHelper.js';

export default {
	name: 'inventory',
	aliases: ['stuff','items'],
	description: 'Look at all your stuff, or a specific item',
	guildOnly:false,
	argTree:optional(stringValue('itemname',true)),
	async execute(message, args) {

		const user = Database.getUser(message.author.id.toString());
		const inventory = user.inventory;

		if (!args.itemname) {

			let isEmpty = !inventory.some((element) => element.count > 0);
			if (isEmpty) {
				return message.reply('Your inventory is empty');
			}

			// Get inventory
			//console.log(inventory);
			let lines = Object.values(inventory).filter(slot => slot.count > 0).map(slot => '> **' + items[slot.id].name + '**' + ' (x'+slot.count + (items[slot.id].callbacks.used ? ', :gear:Usable:gear:' : '') + ')');
			lines.push('(Type j!stuff <item name> to learn more)');

			// Split into individual messages
			let messages = ['Your inventory contains: '];
			lines.forEach(line => {
				let msg = messages[messages.length - 1];
				if (msg.length + line.length >= 2000) {
					messages.push(line);
				}else{
					messages[messages.length - 1] = msg + '\n' + line;
				}
			});

			// Send
			message.reply(messages[0]);
			for (let i=1;i<messages.length;i++) {
				await message.channel.send(messages[i]);
			}
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
**${item.name}** - ${ITEM_RARITY_LABELS[item.rarity]}
\`You have: ${slot.count} | Total Owned: ${slot.owned} | Eaten: ${slot.eaten || 0}${item.callbacks.used ? ` | Used: ${slot.used || 0}` : ''}\`
${item.description}
			`;

			return message.reply(itemDescription);


		}
	}
}