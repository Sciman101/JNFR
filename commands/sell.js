import {stringValue} from '../parser/arguments.js';
import { addItem, countItem, removeItem, searchInventory } from '../util/inventoryHelper.js';
import {ITEM_RARITY_LABELS, ITEM_USABLE_LABEL, getItemQualities, randomItem, items, ItemRarity} from '../data/items.js';
import Database, {db} from '../util/db.js';
import Babbler from '../util/babbler.js';
import {MONTHS} from '../util/arrays.js';
import {log} from '../util/logger.js';

let soldToday = {};
let pendingSales = {};

export default {
	name: 'sell',
	aliases: [],
	description: 'Sell me your weird crap!',
	guildOnly:false,
	argTree:stringValue('item',true),
	execute(message, args) {
		const itemName = args.item;
		const user = message.author.id.toString();

		const userData = Database.getUser(user);
		const inventory = userData.inventory;

		const search = searchInventory(inventory,itemName);
		if (search.length > 0) {

			const item = search[0];
			const itemDef = items[item.id];
			// Appraise
			let value = 25;

			if (itemDef.rarity === ItemRarity.RARE) {
				value = 50;
			}else if (itemDef.rarity === ItemRarity.LEGENDARY) {
				value = 100;
			}
				
			const shop = db.data.jnfr.shop_inventory;
			for (let i=0;i<shop.length;i++) {
				const shopItem = shop[i];
				if (shopItem.item_id === item.id) {
					value = (i+1) * 50;
				}
			}

			if (soldToday[item.id]) {
				value -= soldToday[item.id];
				if (value <= 0) {
					value = 1;
				}
			}

			message.reply(`I'll buy that ${itemDef.name} from you, for... ${value} ${Babbler.getJollarSign(message.guild)}! React to this message with :white_check_mark: to confirm the sale`).then(
				(msg) => {
					pendingSales[message.author.id] = {
						'message': msg.id,
						'value': value,
						'id': item.id
					}
					//msg.react('✅');
				}
			);

		}else{
			return message.reply("You don't have one of those to sell!");
		}

	},

    listeners: {
        // When someone reacts to a message...
        'messageReactionAdd': async(reaction, user) => {
            // When a reaction is received, check if the structure is partial
            if (reaction.partial) {
                // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
                try {
                    await reaction.fetch();
                } catch (error) {
                    log.error('Something went wrong when fetching the message: ', error);
                    // Return as `reaction.message.author` may be undefined/null
                    return;
                }
            }

			const sale = pendingSales[user.id];
			if (sale && sale.message === reaction.message.id) {

				pendingSales[user.id] = null;

				// Perform the transaction
				const userData = Database.getUser(user.id);
				const howMuch = countItem(userData.inventory,sale.id);
				if (howMuch <= 0) {
					return reaction.message.reply("You don't have that item, anymore!");
				}
				removeItem(userData,sale.id,1);
				userData.balance += sale.value;

				soldToday[sale.id] = soldToday[sale.id] + 1 || 1;

				// Add to shop
				const shop = db.data.jnfr.shop_inventory;
				for (let i=0;i<shop.length;i++) {
					const shopItem = shop[i];
					if (shopItem.item_id === sale.id) {
						shopItem.stock++;
					}
				}

				Database.scheduleWrite();

				return reaction.message.reply(Babbler.get('sold'));
			}


        }
    }
}