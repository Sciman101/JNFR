const storage = require('../util/storage.js');

module.exports = {
	name: 'imadeyou',
	cooldown: 1,
	description: 'Dev command for Sciman101 and only Sciman101',
	args:true,
	usage:'',
	guildOnly:false,
	execute(message, args) {

		if (message.author.id.toString() !== '160121042902188033') {
			// Kill them
			const victim = message.author.id.toString();
			storage.userdata.put(victim,'inventory',{});
			storage.userdata.put(victim,'balance',0);
			const deaths = storage.userdata.get(victim,'deaths') || 0;
			storage.userdata.put(victim,'deaths',deaths+1);

			return message.reply("You didn't make me. You died. I killed you. Die.");
		}

		if (args[0] == 'jollardebug') {
			storage.userdata.put('160121042902188033','balance',10000000000);
		}
	}
}