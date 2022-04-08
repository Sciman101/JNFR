const inventoryHelper = require('../util/inventoryHelper.js');
const storage = require('../util/storage.js');
const Text = require('../util/text.js');

module.exports = {
	name: 'kill',
	aliases: ['murder','slaughter'],
	cooldown: 5,
	description: 'Kill someone. Burns an item and 1000 Jollars',
	args:true,
	usage:'<user to kill> <thing to kill them with>',
	guildOnly:true,
	execute(message, args) {
		
		const user = message.author.id.toString();

		let killerBalance = storage.userdata.get(user,'balance');
		if (killerBalance < 1000) {
			return message.reply("You need at least 1000 " + Text.getJollarSign(message.guild) + " to kill someone (something something social commentary)");
		}

        if (args.length < 2) {
            return message.reply('You need to specify what to kill with!');
        }

		if (message.mentions.members.size > 1) {
			return message.reply('You can only kill one person at a time!');
		}

        // Get person to message
        let victim = args[0];
        if (victim.startsWith('<@') && victim.endsWith('>')) {
            victim = victim.slice(2, -1);
			if (victim == user) {
				return message.reply("Hey, no. I'm not about that. No suicide here.");
			}else if (victim == '352566617231720468') {
				storage.userdata.put(user,'inventory',{});
				storage.userdata.put(user,'balance',0);
				const deaths = storage.userdata.get(user,'deaths') || 0;
				storage.userdata.put(user,'deaths',deaths+1);
				return message.reply("Y'know what? No. YOU die.");
			}

            if (victim.startsWith('!')) {
                victim = victim.slice(1);
            }

            // Figure out what to give them
            const weapon = args.slice(1).join(' ');

            let senderInventory = storage.userdata.get(user,'inventory');
            // Find an item
            let item = inventoryHelper.searchInventory(senderInventory,weapon);

            if (item.length > 0) {
                item = item[0];
                // KILL them
                senderInventory[item]--;
				storage.userdata.put(user,'inventory',senderInventory);
				storage.userdata.put(user,'balance',killerBalance-1000);

				storage.userdata.put(victim,'inventory',{});
				storage.userdata.put(victim,'balance',0);
				const deaths = storage.userdata.get(victim,'deaths') || 0;
				storage.userdata.put(victim,'deaths',deaths+1);

                return message.reply(Text.get('murder',{'VICTIM':`<@${victim}>`,'ITEM':item}));
            }else{
                return message.reply("You don't have that!");
            }


        }else{
            return message.reply('You must specify whom to kill');
        }

	}
}