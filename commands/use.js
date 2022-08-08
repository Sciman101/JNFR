import {stringValue,optional} from '../parser/arguments.js';
import Database, {db} from '../util/db.js';
import {items, rarityString} from '../data/items.js';
import Babbler from '../util/babbler.js';
import {searchInventory} from '../util/inventoryHelper.js';

export default {
	name: 'use',
	description: 'Use one of your items',
    argTree: stringValue('item',true),
	guildOnly:false,
	execute(message, args) {
		const item = args.item;
        const user = message.author.id.toString();
		let inventory = Database.getUser(user).inventory;

        const results = searchInventory(inventory,item);
        // did we find something to use?
        if (results.length == 0) {
            return message.reply("You don't have anything like that");
        }else if (results.length > 0) {
            
			const slot = results[0];
			const item = items[slot.id];

			// Can we use it?
			if (!item.callbacks.used) {
				return message.reply(Babbler.get('no_use',{item:items[slot.id].name}));
			}else{
				const response = item.callbacks.used(message,Database.getUser(user),slot,`\`You use the ${item.name}!\``);
				slot.used += 1;
				// say funny thing
            	return message.reply(response);
			}
        }
	}
}