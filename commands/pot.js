const storage = require('../util/storage.js');
const Text = require('../util/text.js');

module.exports = {
	name: 'pot',
	cooldown: 5,
	description: "Check how much money has been lost in gambling, universally",
	args:false,
	usage:'',
	guildOnly:false,
	execute(message, args) {	
		// Get balance
		const bal = storage.jnfr.get('pot');
		message.reply(`The pot currently contains ${bal} ${Text.getJollarSign(message.guild)}!`);
	}
}