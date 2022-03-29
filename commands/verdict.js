const Text = require('../util/text.js');
const storage = require('../util/storage.js');

const responses = [
	'Yes',
	'No',
	'Maybe?',
	'Ehhhh',
	'Idk man',
	'Absolutely!!!',
	'YES',
	'Absolutely not',
	'God, no, what the fuck?',
	':shrug:',
	'If you think so, I guess',
	'Ask me later',
	'Sure, why not',
	'Noooooooo',
	'Maybe. Maybe...',
	'Uncertain',
	'Don\'t ask',
	'>:(',
	"What does that even MEAN"
];

module.exports = {
	name: 'verdict',
	aliases: ['yesno','8ball'],
	cooldown: 1,
	description: 'You know a magic 8 ball? It\'s like that. Ask me a yes/no question! (Do not take answers seriously)',
	args:true,
	usage:'<prompt/question/etc>',
	guildOnly:false,
	execute(message, args) {
		const thing = args.join(' ');
        const lowerThing = thing.toLowerCase();
        const response = responses[Math.floor(randFrom2d(message.author.id.hashCode(),thing.toLowerCase().hashCode()) * responses.length)];

        // random value
        return message.reply(response);
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