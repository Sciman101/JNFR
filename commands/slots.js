import {literal, optional} from '../parser/arguments.js';
import Database, {db} from '../util/db.js';
import Babbler from '../util/babbler.js';

const MIN_TO_PLAY = 25;
const SYMBOLS = ':seven:,:heart_decoration:,:moyai:,:stars:,:moneybag:'.split(',');

const generateRandomSpins = () => {
	let spins = [];
	for (let i=0;i<3;i++) {
		spins.push(Math.floor(Math.random()*SYMBOLS.length));
	}
	return spins;
}

const advaneSpins = (spins,counter) => {
	for (let i=0;i<Math.min(counter,3);i++) {
		spins[i]++;
		if (spins[i] >= SYMBOLS.length) spins[i] = 0;
	}
}

const spinsToText = (spins) => spins.map(num => SYMBOLS[num]).join('');

function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
  }

export default {
	name: 'slots',
	description: 'A weird slot machine. Get 3 in a row to win all the money currently in the pot! Costs 25 Jollars to play',
	guildOnly:false,
	argTree:optional(literal('play')),
	async execute(message, args) {

		const jollarSign = Babbler.getJollarSign(message.guild);
		const pot = db.data.jnfr.pot || 0;

		if (args.play) {
			const user = Database.getUser(message.author.id.toString());
			/*if (MIN_TO_PLAY > user.balance) {
				return message.reply(Babbler.get('insufficient_funds',{user:message.author.name,jollar:jollarSign}) + '\nYou need at least 25 ' + jollarSign + ' to play slots');
			}*/
			// Take it
			//user.balance -= MIN_TO_PLAY;
			db.data.jnfr.pot += MIN_TO_PLAY;

			// Generate symbols
			let spins = generateRandomSpins();
			const slotsMessage = await message.channel.send('Spin time!');

			for (let i=0;i<5;i++) {
				await slotsMessage.edit(spinsToText(spins));
				await sleep(1000);
				advaneSpins(spins,i);
			}

			// count spins
			let counts = {};
			let maxCount = 0;
			for (let i=0;i<3;i++) {
				counts[spins[i]] = counts[spins[i]]+1 || 1;
				if (counts[spins[i]] > maxCount) {
					maxCount = counts[spins[i]];
				}
			}
			console.log(counts);
			// Ok, now what?
			if (maxCount === 1) {
				message.reply(Babbler.get('slots_1'));
			}else if (maxCount === 2) {
				user.balance += 40;
				message.reply(Babbler.get('slots_2',{jollar:Babbler.getJollarSign(message.guild)}));
			}else if (maxCount === 3) {
				user.balance += pot;
				db.data.jnfr.pot = 0;
				message.reply(Babbler.get('slots_3',{jollar:Babbler.getJollarSign(message.guild),pot:pot}));
			}
			Database.scheduleWrite();


		}else{
			// Display info
			return message.reply(`The current pot is ${pot} ${Babbler.getJollarSign(message.guild)}`);
		}


		

	}
}