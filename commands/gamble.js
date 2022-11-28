import {numValue, any, literal} from '../parser/arguments.js';
import Database, {db} from '../util/db.js';
import Babbler from '../util/babbler.js';
import {addItem} from '../util/inventoryHelper.js'; 

const CLOVER_ID = '69_leaf_clover';

export default {
	name: 'gamble',
	description: 'Try your luck in a game of double or nothing!',
	guildOnly:false,
	argTree:any([numValue('bet',1,undefined,true),literal('egg')]),
	execute(message, args) {

		const jollarSign = Babbler.getJollarSign(message.guild);
		const user = Database.getUser(message.author.id.toString());

		const betAmount = args.egg ? 'egg' : args.bet;
		const eggSlot = user.inventory.find((slot) => slot.id === 'egg');

		if (betAmount !== 'egg' && betAmount > user.balance) {
			return message.reply(Babbler.get('insufficient_funds',{user:message.author.name,jollar:jollarSign}));
		}else if (betAmount === 'egg' && (!eggSlot || eggSlot.count <= 0)) {
			return message.reply("You have no eggs to gamble!");
		}

		let cloverCount = 0;
		for (let index in user.inventory) {
			const item = user.inventory[index];
			if (item.id === CLOVER_ID) {
				cloverCount = item.count;
			}
		}

		let win = false;
		let usedClover = false;
		for (let i=0;i<cloverCount+1;i++) {
			win = Math.random() < 0.5;
			if (win) {
				if (i > 0) {
					usedClover = true;
				}
				break;
			}
		}

		// Actually do the bet
		if (!win) {
			// Lose! Sad!
			if (betAmount === 'egg') {
				let reply = Babbler.get('gamble_lose_egg');
				addItem(user,'anti_egg');
				message.reply(reply);
			}else{
				user.balance -= betAmount;
				db.data.jnfr.pot += betAmount;
				if (user.balance <= 0) {
					message.reply(Babbler.get('gamble_lose_everything'));
				}else{
					return message.reply(Babbler.get('gamble_lose',{balance:user.balance+jollarSign,bet:betAmount}));
				}
			}
		}else{
			if (betAmount === 'egg') {
				const eggCount = Math.floor(Math.random() * 3)+1;
				addItem(user,'egg',eggCount);
				message.reply(Babbler.get('gamble_win_egg',{egg:eggCount}));
			}else{
				user.balance += betAmount;
				message.reply(Babbler.get('gamble_win',{balance:user.balance+jollarSign,bet:betAmount}));
			}

			if (usedClover) {
				user.inventory.find((item) => item.id === CLOVER_ID).used += 1;
			}
		}
		Database.scheduleWrite();

	}
}