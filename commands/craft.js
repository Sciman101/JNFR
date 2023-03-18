import {stringValue} from '../parser/arguments.js';
import { findItem, getItemRecipe } from '../data/items.js';
import Database, {db} from '../util/db.js';
import { addItem, removeItem } from '../util/inventoryHelper.js';

export default {
	name: 'craft',
	aliases: ['make'],
	description: 'Create an item using stuff in your inventory',
	guildOnly:false,
	argTree:stringValue('item',true),
	execute(message, args) {
		const item = findItem(args.item);
		if (item) {

			const recipe = getItemRecipe(item);
			const user = Database.getUser(message.author.id.toString());
			const inventory = user.inventory;

			const slots = recipe.map(item => {
				console.log(item);
				if (Array.isArray(item)) {
					// Any item is valid
					for (const i in item) {
						const slot = inventory.find(slot => slot.id == i.id);
						if (slot) return slot;
					}
					return undefined;
				}else if (item.customComponent) {
					return inventory.find(slot => item.customComponent(slot.id));
				}else{
					return inventory.find(slot => slot.id === item.id);
				}
			});
			const valid = slots.every(slot => slot && slot.count > 0);
			
			if (!valid) {
				return message.reply(`***You don't have enough ingredients!***\nTo craft **${item.name}** you need...\n${getRecipeString(recipe)}`);
			}else{
				addItem(user, item.id, 1);
				recipe.forEach(item => {
					removeItem(user, item.id, 1);
				});
				Database.scheduleWrite();

				return message.reply(`You crafted a **${item.name}** from ${recipe.map(item => item.name).join(', ')}!`);
			}

		}else{
			return message.reply("That item doesn't exist!");
		}

	}
}

const getRecipeString = (recipe) => recipe.map((item) => {
	if (Array.isArray(item)) {
		return 'One of ' + item.map((itm) => itm.name).join(', ');
	}else{
		// This covers items, as well as custom recipe components
		return '-' + item.name;
	}
}).join('\n');