import Babbler from "../util/babbler.js";

export default {
	name: 'info',
	aliases: ['about'],
	description: 'Get some info about me',
	guildOnly:false,
	execute(message, args) {
		message.channel.send(`My name is **J.N.F.R**! (${Babbler.get('jnfr_name')}).\nI'm a discord bot programmed by Sciman101 with a variety of fun and actually useful features.\n\n- I'm written in JavaScript and run on node.js. Like some sort of wild animal.\n- You can view my source code at <https://github.com/Sciman101/JNFR>, if you're into that sort of thing.\n- ${Babbler.get('funfact')}`);
	}
}