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
		console.log(args);

		if (args.recipient) {
			const user = Database.getUser(args.recipient);
			addItem(user,'egg',1);
			message.reply(`You gave <@${args.recipient}> an egg`);
		}else{
			const user = Database.getUser(message.author.id.toString());
			if (Math.random() < 0.0005) {
				addItem(user,'golden_egg',1);
				message.reply('You got a **golden egg**');
			}else{
				addItem(user,'egg',1);
				message.reply('You got an egg');
			}
		}

		Database.scheduleWrite();
	}
}