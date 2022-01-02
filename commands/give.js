const inventoryHelper = require('../util/inventoryHelper.js');
const storage = require('../util/storage.js');
const Text = require('../util/text.js');

module.exports = {
	name: 'give',
	aliases: ['gift'],
	cooldown: 5,
	description: 'Give an item to someone else',
	args:true,
	usage:'<user to give item to> <item to give> *OR* <jollars to give>',
	guildOnly:true,
	execute(message, args) {

        const user = message.author.id.toString();
		
        if (args.length < 2) {
            return message.reply('You need to specify what to give!');
        }

        // Get person to message
        let mentionedUser = args[0];
        if (mentionedUser.startsWith('<@') && mentionedUser.endsWith('>')) {
            mentionedUser = mentionedUser.slice(2, -1);

            if (mentionedUser.startsWith('!')) {
                mentionedUser = mentionedUser.slice(1);
            }

            // Figure out what to give them
            const gift = args.slice(1).join(' ');
            const jollarAmount = parseInt(gift);

            if (!jollarAmount) {

                let senderInventory = storage.userdata.get(user,'inventory');

                // Find an item
                let item = inventoryHelper.searchInventory(senderInventory,gift);

                if (item.length > 0) {
                    item = item[0];
                    // give it
                    let receiverInventory = storage.userdata.get(mentionedUser,'inventory');
                    
                    senderInventory[item]--;
                    inventoryHelper.addItem(receiverInventory,item);

                    storage.userdata.put(user,'inventory',senderInventory);
                    storage.userdata.put(mentionedUser,'inventory',receiverInventory);

                    return message.reply(`You gave away your '${item}'!`);


                }else{
                    return message.reply("You don't have one of those");
                }
            }else{
                // Do we have that much?

                let senderBalance = storage.userdata.get(user,'balance');
                if (senderBalance >= jollarAmount) {

                    let receiverBalance = storage.userdata.get(mentionedUser,'balance');
                    senderBalance -= jollarAmount;
                    receiverBalance += jollarAmount;

                    storage.userdata.put(user,'balance',senderBalance);
                    storage.userdata.put(mentionedUser,'balance',receiverBalance);

                    return message.reply(`You gave away ${jollarAmount}${Text.getJollarSign(message.guild)}!`);

                }else{
                    return message.reply("You don't have that many Jollars!");
                }
            }


        }else{
            return message.reply('You need to mention someone for me to gift to!');
        }

	}
}