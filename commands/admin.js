import { branch, discordMention, literal } from "../parser/arguments.js";
import Database, { db } from "../util/db.js";

export default {
  name: "admin",
  aliases: ["admin"],
  description: "Administrative commands",
  argTree: branch([
    literal("add", discordMention("user", "user")),
    literal("remove", discordMention("user", "user")),
  ]),
  guildOnly: true,
  adminOnly: true,
  execute(message, args) {
    const guild = Database.getGuild(message.guild.id.toString());
    guild.admins = guild.admins || { "160121042902188033": true };
    if (args.add) {
      // Add new admin
      guild.admins[args.user] = true;
      Database.scheduleWrite();
      message.reply(`<@${args.user}> has been granted admin privlidges`);
    } else if (args.remove) {
      // Remove admin
      guild.admins[args.user] = false;
      Database.scheduleWrite();
      message.reply(`<@${args.user}> has been stripped of admin privlidges`);
    }
  },
};
