const Text = require('../util/text.js');

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
	name: 'rate',
	aliases: ['score'],
	cooldown: 1,
	description: 'I give a 1-10 rating on anything (I\'m a stickler for punctuation)',
	args:true,
	usage:'<thing to rate>',
	guildOnly:false,
	execute(message, args) {
		const thing = args.join(' ');
        const lowerThing = thing.toLowerCase();

        if (lowerThing in specificResponses) {
            return message.reply(specificResponses[lowerThing]);
        }

        const score = Math.ceil(randFrom2d(0,thing.toLowerCase().hashCode()) * 10);

        // jnfr thinks very highly of herself
        if (lowerThing == 'jnfr' || lowerThing == 'you' || thing == '<@!352566617231720468>' || thing == '<@352566617231720468>') {
            return message.reply(`I rate myself at an 11/10 :)`);
        }

        // random value
        return message.reply(Text.get('rating',{THING:thing,SCORE:score}));
	}
}

//https://www.ronja-tutorials.com/post/024-white-noise/
//thanks again ronja
function randFrom2d(x,y) {

    const sin1 = Math.sin(x);
    const sin2 = Math.sin(y);

    let random = sin1 * 12.98666 + sin2 * 32493.0002;
    random = Math.sin(random) * 143758.5453;

    return Math.abs(random % 1);
}