import Database, { db } from "../util/db.js";
import Babbler from "../util/babbler.js";

export default {
  name: "me",
  aliases: ["bio"],
  description: "View information about yourself",
  args: null,
  guildOnly: false,
  execute(message, args) {
    const userId = message.author.id.toString();
    const data = Database.getUser(userId);

    message.reply(
      `\`[${message.author.username}'s Stats]\`\nYou are a \`${
        data.race || "Human"
      }\`\nYou have died \`${
        data.deaths || 0
      }\` times\nYour genetic instability is at ${
        data.geneticInstability || 0
      }% ${data.geneticInstability > 100 ? "**(DANGER)**" : ""}`
    );
  },
};
