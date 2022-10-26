import Database, {db} from '../util/db.js';
import Babbler from '../util/babbler.js';

export default {
	name: 'pot',
	aliases: ['howmuchmoneyyouguyshavewasted'],
	description: 'View the pot (how much money you\'ve lost to gambling)',
	guildOnly:false,
	execute(message, args) {
		message.channel.send(`The pot contains ${db.data.jnfr.pot}${Babbler.getJollarSign(message.guild)}`);
	}
}