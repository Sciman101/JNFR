import {numValue} from '../parser/arguments.js';
import Database, {db} from '../util/db.js';
import Babbler from '../util/babbler.js';

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

		// Actually do the bet
		if (Math.random() < 0.5) {
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
		}
		Database.scheduleWrite();

	}
}