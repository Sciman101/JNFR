const storage = require('../util/storage.js');

module.exports = {
	name: 'gamble',
	aliases: ['wager'],
	cooldown: 3,
	description: 'Bet your hard earned jCoins in a game of double or nothing!',
	args:true,
	usage:'<wager>',
	guildOnly:false,
	execute(message, args) {	
		if (!args.length) {
			message.reply('You need to wager something!');
		}else{

			const user = message.author.id.toString();

			// Get wager
			const wager = parseInt(args[0]);
			if (wager == NaN) {
				return message.reply('IDK what that is, but you sure can\'t wager it');
			}
			// Get balance
			const bal = storage.userdata.get(user,'balance');
			if (wager > bal) {
				return message.reply(`Sorry, ${message.author}, I don't *give* credit. Come back when you're a little, mmm, richer!`);
			}

			// Did we do it?
			const success = Math.random() >= 0.5;

			if (success) {
				storage.userdata.put(user,'balance',bal+wager);
				message.reply(`Lucky! You doubled your wager, you now have ${bal+wager} jCoins!`);
			}else{
				storage.userdata.put(user,'balance',bal-wager);
				if (bal == wager) {
					message.reply('Ooooh, so sorry, you just lost everything. Better luck next time :smirk:');
				}else{
					message.reply(`Tough luck, you just lost ${wager} jCoin, my guy. You now have ${bal-wager}`);
				}
			}
		}
	}
}