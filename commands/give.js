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
		const jollarAmount = parseInt(gift);

		// Find an item
		let item = searchInventory(userData.inventory,gift);

		if (item.length > 0) {
			item = item[0];
			// give it			
			addItem(gifteeData,item.id,1);
			removeItem(userData,item.id,1);

			Database.scheduleWrite();

			return message.reply(`You gave away your '${items[item.id].name}'!`);
		}else if (jollarAmount) {
			// Do we have that much?

			if (userData.balance >= jollarAmount) {

				userData.balance -= jollarAmount;
				gifteeData.balance += jollarAmount;

				Database.scheduleWrite();

				return message.reply(`You gave away ${jollarAmount}${Babbler.getJollarSign(message.guild)}!`);

			}else{
				return message.reply("You don't have that many Jollars!");
			}
		}else{
			return message.reply("You don't have that to give!");
		}

	}
}