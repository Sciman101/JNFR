import { duckIt } from "node-duckduckgo";

export default {
	name: 'duckduckbang',
	description: 'Adds support for DuckDuckGo\'s bang! search within discord',
	args:null,
	guildOnly:false,
	hidden:true,
	execute(message, args) {	
		message.reply("This command is not meant to be used!");
	},
	listeners:{
		'messageCreate':function(message) {
			// Ignore certain messages
			if (message.author.bot || !message.content.startsWith('!!')) return;

			// Format is !(bang) - ex. !!w mario
			doBangSearch(message.content.substring(1),message);
		}
	}
}

async function doBangSearch(query,message) {
	const response = await duckIt(query);
	console.log(response.res);
	if (response.status == 200 && response.request.res && response.request.res.responseUrl) {
		return message.reply(response.request.res.responseUrl);
	}else{
		message.react('🚫');
	}
}