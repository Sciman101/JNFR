import { discordMention, optional } from '../parser/arguments.js';
import Database, {db} from '../util/db.js';
import {addItem, searchInventory} from '../util/inventoryHelper.js';

export default {
	name: 'egg',
	aliases: ['eggs'],
	description: 'Receive an egg',
	guildOnly:false,
	argTree:optional(discordMention('recipient','user')),
	execute(message, args) {

		const goldenEgg = Math.random() < 0.005;
		const eggItemName = goldenEgg ? 'golden_egg' : 'egg';
		const eggName = goldenEgg ? 'a **Golden Egg**' : 'an egg';

		if (args.recipient) {
			const user = Database.getUser(args.recipient);
			addItem(user,eggItemName,1);
			message.reply(`You gave <@${args.recipient}> ${eggName}`);
		}else{
			const user = Database.getUser(message.author.id.toString());
			addItem(user,eggItemName,1);
			message.reply(`You got ${eggName}`);
		}

		Database.scheduleWrite();
	}
}