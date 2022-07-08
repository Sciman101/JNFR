import {optional, numValue} from '../parser/arguments.js';
import {ItemRarity, randomItem} from '../data/items.js';
import Database, {db} from '../util/db.js';
import Babbler from '../util/babbler.js';
import {addItem} from '../util/inventoryHelper.js';

// Generate items for the day
let inventory = [];
for (let i=0;i<5;i++) {
	// Add 5 random items
	let item;
	do {
		item = randomItem();
	}while (inventory.length != 0 && inventory.find(slot => slot.item === item));
	inventory.push({item:item,stock:Math.floor(Math.random()*2)+1});
}

const MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
const ITEM_RARITY_LABELS = {};
ITEM_RARITY_LABELS[ItemRarity.COMMON] = '';
ITEM_RARITY_LABELS[ItemRarity.RARE] = ' - Rare! ';
ITEM_RARITY_LABELS[ItemRarity.LEGENDARY] = ' - *Legendary!* ';

export default {
	name: 'store',
	aliases: ['shop','buy'],
	description: 'Spend your Jollars on random crap I found! Shop contents refresh every day',
	guildOnly:false,
	argTree:optional(numValue('item_number',1,5,true)),
	execute(message, args) {

		const jollarSign = Babbler.getJollarSign(message.guild);

		if (!args.item_number) {
			// Display shop
			const today = new Date();
			const shopMessage = `
\`Shop for ${MONTHS[today.getMonth()].toUpperCase()} ${today.getDate()}, ${today.getFullYear()}\`
=================
${inventory.map((slot,index) => {
	let itemDesc = `${index+1}) **${slot.item.name}** (x${slot.stock}) ${ITEM_RARITY_LABELS[slot.item.rarity]} - \`${50*(index+1)}\`${jollarSign}`;
	if (slot.stock === 0) {
		itemDesc = '~~'+itemDesc+'~~';
	}
	return itemDesc;
}).join('\n\n')}
=================
\`Type j!shop [item number] to buy that item\`
			`;

			message.channel.send(shopMessage);

		}else{
			const itemIndex = args.item_number-1;
			const itemSlot = inventory[itemIndex];
			const item = itemSlot.item;
			const cost = (itemIndex+1) * 50;
			if (itemSlot.stock <= 0) {
				// We can't sell this
				return message.reply(Babbler.get('out_of_stock',{item:item.name}));
			}

			const user = Database.getUser(message.author.id.toString());
			if (user.balance < cost) {
				return message.reply(Babbler.get('insufficient_funds',{jollar:jollarSign}));
			}

			user.balance -= cost;
			const userItemSlot = addItem(user,item);
			
			let response = `You bought '${item.name}' for ${cost} ${jollarSign}! Pleasure doing business with you`;

			// Try callback
			if (item.callbacks.bought) {
				response = item.callbacks.bought(message,user,userItemSlot,response);
			}
			message.reply(response);

			// Write data
			Database.scheduleWrite();
		}
	}
}