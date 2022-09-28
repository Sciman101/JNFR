import { stringValue } from '../parser/arguments.js';

export default {
    name: 'say',
    aliases: ['talk', 'speak'],
    description: 'Repeats back whatever you type and deletes the original message',
    guildOnly: false,
    argTree: stringValue('message', true),
    execute(message, args) {
        message.channel.send(args.message);
        message.delete();
    }
}