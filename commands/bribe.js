const Text = require('../util/text.js');
const storage = require('../util/storage.js');

const specificResponses = {
    iekika: 'Fun but she threw her spear through my face once. 7/10',
    uma: "Too clingy, keep finding slime jamming my motors, 3/10",
    amber: "Cheapest way for me to fix myself, solid 8/10",
    jamie: "Taller than me, but a kobold. 1/10",
    root: "Pretty chill but they're just barely taller than me and that makes them a 0/10",
    aparna: "Doesn't say much, looks like a skyscraper. 7/10",
    orange: "Best (only) roommate ever, doesn't mind me playing loud music all the time, 10/10",
    ramda: "Love that goof, won't stop assaulting me with wikipedia orbs, 9/10"
}


module.exports = {
	name: 'bribe',
	cooldown: 1,
	description: 'Tell me to rate something higher or lower... for enough jollars :).\nThe more people bribe me, the more expensive it gets.',
	args:true,
	usage:'<up/down> <thing to rate>',
	guildOnly:false,
	execute(message, args) {
		const dir = args[0].toLowerCase();
		const thing = args.slice(1).join(' ');
		if (dir != 'up' && dir != 'down') {
			return message.reply('I need to know if you want to increase (up) or decrease (down) my rating for ' + thing + '!');
		}
        const lowerThing = thing.toLowerCase();

        if (lowerThing in specificResponses) {
            return message.reply('You can\'t change my opinion of my friends! (Well, *you* couldn\'t afford to.)');
        }

        // jnfr thinks very highly of herself
        if (lowerThing == 'jnfr' || lowerThing == 'you' || lowerThing == ':jnfr:' || lowerThing == 'j.n.f.r.' || lowerThing == 'j.n.f.r' || thing == '<@!352566617231720468>' || thing == '<@352566617231720468>') {
            return message.reply(`Sorry, can't change some things.`);
        }

		// get the current bias
		let biases = storage.jnfr.get('biases');
		if (biases == null) {
			biases = {};
		}
		let bribe = {};
		if (biases != null && lowerThing in biases) {
			bribe = biases[lowerThing];
		}else{
			bribe = {
				score: 0,
				sponsors: 0
			}
		}
		// check if they've sponsored this before
		const cost = bribe.sponsors * 3 + 5;

		const user = message.author.id.toString();
		const bal = storage.userdata.get(user,'balance');

		const costString = cost.toString() + Text.getJollarSign(message.guild);

		if (bal > cost) {
			// we can bribe her
			bribe.score += (dir == 'up' ? 1 : -1);
			bribe.sponsors++;

			// write data
			biases[lowerThing] = bribe;
			storage.jnfr.put('biases',biases);
			storage.userdata.put(user,'balance',bal-cost);

			return message.reply(`You make a good argument (of ${costString}), friend! My rating of '${thing}' has gone ${dir}!`);

		}else{
			return message.reply(`Sorry, you'll need at least ${costString} to shake my opinion on '${thing}'.`);
		}
	}
}