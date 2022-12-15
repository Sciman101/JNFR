import {discordMention, stringValue} from '../parser/arguments.js';
import { addItem, removeItem, searchInventory } from '../util/inventoryHelper.js';
import Database, {db} from '../util/db.js';
import { items } from '../data/items.js';
import Babbler from '../util/babbler.js';

export default {
	name: 'give',
	aliases: ['gift'],
	description: 'Give an item to someone else',
	argTree:discordMention('giftee','user',stringValue('gift',true)),
	guildOnly:true,
	execute(message, args) {

        const user = message.author.id.toString();
		const giftee = args.giftee;

		const userData = Database.getUser(user);
		const gifteeData = Database.getUser(giftee);

		// Figure out what to give them
		const gift = args.gift;
		if (gift.toLowerCase().endsWith('jlr') || gift.toLowerCase().endsWith(' jlr')) {
			const jollarAmount = parseInt(gift.substring(0,gift.length - 3));
			// Do we have that much?
			if (jollarAmount > 0) {
				if (userData.balance >= jollarAmount) {

					userData.balance -= jollarAmount;
					gifteeData.balance += jollarAmount;

					Database.scheduleWrite();

					return message.reply(`You gave away ${jollarAmount}${Babbler.getJollarSign(message.guild)}!`);

				}else{
					return message.reply("You don't have that many Jollars!");
				}
			}else{
				return message.reply("You can't give that amount of Jollars!");
			}
		}else{
			// Find an item
			let item = searchInventory(userData.inventory,gift);

			if (item.length == 1) {
				item = item[0];
				// give it			
				addItem(gifteeData,item.id,1);
				removeItem(userData,item.id,1);

				Database.scheduleWrite();

				return message.reply(`You gave away your '${items[item.id].name}'!`);
			}else if (item.length > 1) {
				const list = item.map(itm => items[itm.id]).reduce((text,itm) => `${text}\n-${itm.name}`,'Matching items: ');
				return message.reply(`You have multiple items that match, be more specific!\n${list}\n(If you want to send jollars, add 'JLR' to the end of the number)`);
			}else{
				return message.reply("You don't have that to give!\n(If you want to send jollars, add 'JLR' to the end of the number)");
			}
		}

	}
}