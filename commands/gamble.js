import {numValue} from '../parser/arguments.js';
import Database, {db} from '../util/db.js';
import Babbler from '../util/babbler.js';

const CLOVER_ID = '69_leaf_clover';

export default {
	name: 'gamble',
	description: 'Try your luck in a game of double or nothing!',
	guildOnly:false,
	argTree:numValue('bet',1,undefined,true),
	execute(message, args) {

		const jollarSign = Babbler.getJollarSign(message.guild);

		const betAmount = args.bet;
		const user = Database.getUser(message.author.id.toString());
		if (betAmount > user.balance) {
			return message.reply(Babbler.get('insufficient_funds',{user:message.author.name,jollar:jollarSign}));
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
			user.balance -= betAmount;
			db.data.jnfr.pot += betAmount;
			if (user.balance <= 0) {
				message.reply(Babbler.get('gamble_lose_everything'));
			}else{
				return message.reply(Babbler.get('gamble_lose',{balance:user.balance+jollarSign,bet:betAmount}));
			}
		}else{
			user.balance += betAmount;
			message.reply(Babbler.get('gamble_win',{balance:user.balance+jollarSign,bet:betAmount}));

			if (usedClover) {
				user.inventory.find((item) => item.id === CLOVER_ID).used += 1;
			}
		}
		Database.scheduleWrite();

	}
}