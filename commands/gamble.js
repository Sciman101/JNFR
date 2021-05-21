const storage = require('../util/storage.js');
const Text = require('../util/text.js');

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
			const jollarSign = Text.getJollarSign(message.guild);

			// Get wager
			const wager = parseInt(args[0]);
			if (wager == NaN || wager <= 0) {
				return message.reply('You can\'t wager that amount!');
			}
			// Get balance
			const bal = storage.userdata.get(user,'balance');
			if (wager > bal) {
				return message.channel.send(`Sorry, ${message.author}, I don't *give* credit. You can't wager more than you have!`);
			}

			// Did we do it?
			const success = Math.random() >= 0.5;

			if (success) {
				storage.userdata.put(user,'balance',bal+wager);
				message.reply(`Lucky! You doubled your wager, you now have ${bal+wager} ${jollarSign}!`);
			}else{
				storage.userdata.put(user,'balance',bal-wager);
				if (bal == wager) {
					message.reply('Ooooh, so sorry, you just lost everything. Better luck next time :smirk:');
				}else{
					message.reply(`Tough luck, you just lost ${wager} ${jollarSign}, my guy. You now have ${bal-wager} ${jollarSign}`);
				}
			}
		}
	}
}