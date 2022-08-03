import {stringValue,any,numValue,optional} from '../parser/arguments.js';
import Database, {db} from '../util/db.js';
import {items, rarityString} from '../data/items.js';
import Babbler from '../util/babbler.js';
import {searchInventory} from '../util/inventoryHelper.js';

export default {
	name: 'eat',
	description: 'Eat one of your items, or some of your jollars. Humans can eat anything, right?\n(You only need to type the first few words of the item you want to eat. Type a number to eat that many jollars. If you have multiple items that work, I\'ll just feed you the first matching one)',
    argTree: any([numValue('jollars',1,undefined,true),stringValue('item',true)]),
	guildOnly:false,
	execute(message, args) {

        const userId = message.author.id.toString();
        const user = Database.getUser(userId);

        if (args.jollars) {
            user.balance -= args.jollars;
            user.balanceEaten += args.jollars;
            Database.scheduleWrite();
            return message.reply(`You ate ${args.jollars} ${Babbler.getJollarSign(message.guild)} of your money.`);
        }

		const food = args.item;
		let inventory = user.inventory;

        const results = searchInventory(inventory,food);
        // did we find something to eat?
        if (results.length == 0) {
            return message.reply("You don't have anything like that");
        }else if (results.length > 0) {
            
            // remove item
            const slot = results[0];
            slot.count -= 1;
            slot.eaten = (slot.eaten || 0) + 1;

            Database.scheduleWrite();

            let response = Babbler.get('eating',{food:items[slot.id].name});
            const item = items[slot.id];
            if (item.callbacks.eaten) {
				response = item.callbacks.eaten(message,user,slot,response);
			}

            // say funny thing
            return message.reply(response);
        }
	}
}