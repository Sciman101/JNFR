import Database, { db } from "../util/db.js";
import Babbler from "../util/babbler.js";

export default {
  name: "wallet",
  aliases: ["jollars", "balance", "money"],
  description:
    "View the balance of your Jallet (Jollar Wallet). Earn jCoins by chatting!",
  args: null,
  guildOnly: false,
  execute(message, args) {
    const userId = message.author.id.toString();
    const bal = Database.getUser(userId).balance;

    message.reply(
      `You have ${bal.toLocaleString()} ${Babbler.getJollarSign(
        message.guild
      )} !`
    );
  },
  listeners: {
    messageCreate: function (message) {
      // Ignore certain messages
      if (message.author.bot || message.cleanContent.startsWith("j!")) return;

      // Give em a coin
      const userId = message.author.id.toString();
      Database.getUser(userId).balance += 1;
      Database.scheduleWrite();
    },
  },
};
