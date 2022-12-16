import { stringValue } from '../parser/arguments.js';
import Database, {db} from '../util/db.js';

export default {
    name: 'say',
    aliases: ['talk', 'speak'],
    description: 'Repeats back whatever you type and deletes the original message',
    guildOnly: false,
    argTree: stringValue('message', true),
    execute(message, args) {

        const guild = Database.getGuild(message.guild.id.toString());
        if (guild.steamedhams && guild.steamedhams.channelId == message.channel.id.toString()) {
            return message.react('🚫');
        }

        message.channel.send(args.message);

        try {
            message.delete();
        } catch (e) {
            message.react('🗑️');
        }
    }
}