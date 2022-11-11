import { stringValue } from '../parser/arguments.js';
import Database, {db} from '../util/db.js';

export default {
    name: 'say',
    aliases: ['talk', 'speak'],
    description: 'Repeats back whatever you type and deletes the original message',
    guildOnly: false,
    argTree: stringValue('message', true),
    execute(message, args) {
        message.channel.send(args.message);

        // Add to memory
        let memory = db.data.jnfr.memory = db.data.jnfr.memory || [];
        memory.push(args.message);
        Database.scheduleWrite();

        try {
            message.delete();
        } catch (e) {
            message.react('🗑️');
        }
    }
}