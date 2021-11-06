const storage = require('../util/storage.js');
const Text = require('../util/text.js');

module.exports = {
	name: 'gamble',
	aliases: ['wager'],
	cooldown: 3,
	description: 'Bet your hard earned Jollars! in a game of double or nothing!',
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
				return message.channel.send(
					Text.get('gamblePoor',{'USER':message.author})
				);
			}

			// Did we do it?
			const success = Math.random() >= 0.5;

			if (success) {
				storage.userdata.put(user,'balance',bal+wager);
				message.reply(Text.get('gambleWin',{'BALANCE':(bal+wager).toString()+jollarSign}));
			}else{
				storage.userdata.put(user,'balance',bal-wager);
				storage.jnfr.put('pot',storage.jnfr.get('pot')+wager);
				if (bal == wager) {
					message.reply(Text.get('gambleTerrible'));
				}else{
					message.reply(Text.get('gambleLose',{'WAGER':wager.toString()+jollarSign,'BALANCE':(bal-wager).toString()+jollarSign}));
				}
			}
		}
	}
}