import { any, literal, discordMention } from "../parser/arguments.js";
import Database, { db } from "../util/db.js";
import Babbler from "../util/babbler.js";
import fs from "fs";
import { Permissions } from "discord.js";

const loadScript = (path) => {
  let script = [];
  let data = fs.readFileSync(path, "utf8");
  data.split("\n").forEach((item) => {
    item = item.trim().toLowerCase();
    if (item.indexOf("|") == -1) {
      script.push(item);
    } else {
      script.push(item.split("|"));
    }
  });

  return script;
};

let script = loadScript("data/scripts/steamed_hams.txt");
let altScripts = [
  {
    name: "Eggman's Announcement",
    content: loadScript("data/scripts/eggman_announcement.txt"),
  },
  {
    name: "Spamton's [[Introduction]]",
    content: loadScript("data/scripts/spamton_intro.txt"),
  },
  {
    name: "BIG BILL HELLS",
    content: loadScript("data/scripts/big_bill_hells.txt"),
  },
  {
    name: "Mario, the Idea vs. Mario, the Man",
    content: loadScript("data/scripts/mario_the_man.txt"),
  },
  {
    name: "The FitnessGram Pacer Test",
    content: loadScript("data/scripts/the_fittnessgram_pacer_test.txt"),
  },
  {
    name: "The Alphabet",
    content: loadScript("data/scripts/the_alphabet.txt"),
  },
];

function failChain(hams, failType) {
  hams.lastSenderId = null;

  hams.fails = hams.fails || {};
  if (hams.altScript == -1) {
    hams.fails[failType] = (hams.fails[failType] || 0) + 1;
  } else {
    hams.fails[altScripts[hams.altScript].name] =
      (hams.fails[altScripts[hams.altScript].name] || 0) + 1;
  }

  hams.index = 0;
  hams.altScript = -1;
  Database.scheduleWrite();
}

async function generateMessage(hams, channel) {
  const messageCache = hams.messageCache || [];
  hams.messageCache = [];
  let result = [];
  for (let i = 0; i < messageCache.length; i++) {
    const messageId = messageCache[i];
    const message = await channel.messages.fetch(messageId);
    result.push(message.cleanContent.trim());
  }
  return result.join(" ");
}

export default {
  name: "steamedhams",
  aliases: ["steamedclams,mouthewateringhamburgers"],
  description: "Configure a channel for steamed hams",
  guildOnly: true,
  argTree: any([
    literal("stats"),
    literal("disable"),
    discordMention("channel", "channel"),
  ]),
  execute(message, args) {
    const guild = Database.getGuild(message.guild.id.toString());
    guild.steamedhams ||= {
      enabled: false,
      channelId: null,
      lastSenderId: null,
      messageCache: [],
      index: 0,
      record: 0,
      wins: 0,
      altScript: -1,
      fails: {},
    };

    if (args.stats) {
      const hams = guild.steamedhams;

      let totalFails = 0;
      let sorted = [];
      for (let key in hams.fails) {
        const v = hams.fails[key];
        totalFails += v;
        sorted.push({
          type: key === "double" ? key : "index",
          index: parseInt(key),
          count: v,
        });
      }
      sorted.sort((a, b) => b.count - a.count);

      const statsMessage = `
**Steamed Ham Statistics for '${message.guild.name}':**
*Most Words: * ${hams.record || 0}
*Wins: * ${hams.wins || 0}
*Fails: * ${totalFails || 0}
${sorted
  .slice(0, 10)
  .map(
    (item, idx) =>
      `   ${idx + 1}) ${
        item.type == "double" ? "Doubled Word" : '"' + script[item.index] + '"'
      } - ${item.count}`
  )
  .join("\n")}
			`;

      return message.reply(statsMessage);
    } else {
      const member = message.guild.members.cache.get(message.author.id);
      if (
        !member ||
        !member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)
      ) {
        return message.reply(Babbler.get("lacking_permissions"));
      }
    }

    if (args.disable) {
      guild.steamedhams.enabled = false;
      guild.steamedhams.index = 0;
      guild.steamedhams.altScript = -1;
      guild.steamedhams.messageCache = [];
      Database.scheduleWrite();
      return message.reply(
        "Steamed hams disabled. Score information preserved"
      );
    } else {
      const channel = args.channel;
      guild.steamedhams.channelId = channel;
      guild.steamedhams.enabled = true;
      guild.steamedhams.altScript = -1;
      guild.steamedhams.messageCache = [];
      Database.scheduleWrite();
      return message.reply(
        `Steamed hams enabled, at this time of day, in this server, localized entierly within <#${channel}>`
      );
    }
  },
  listeners: {
    messageCreate: function (message) {
      // Ignore certain messages
      if (message.author.bot || message.content.startsWith("j!")) return;

      const guild = Database.getGuild(message.guild.id.toString());
      if (!guild.steamedhams) return;
      const hams = guild.steamedhams;
      if (!("altScript" in hams)) {
        hams.altScript = -1;
      }

      if (message.channel.id.toString() === hams.channelId) {
        // Strip message content
        // Ignore messages in parehtnasees
        if (message.cleanContent.startsWith("(")) return;
        const content = message.cleanContent
          .toLowerCase()
          .trim()
          .replace(/[\W_]/g, "");

        // Compare to the next line in the script
        let currentScript =
          hams.altScript == -1 ? script : altScripts[hams.altScript].content;
        const nextWord = currentScript[hams.index];

        let comparison =
          (nextWord instanceof Array && nextWord.indexOf(content) !== -1) ||
          nextWord === content;
        let oldIndex = hams.index;

        // Check to start alt script
        if (hams.index == 0) {
          for (let i = 0; i < altScripts.length; i++) {
            let altScript = altScripts[i];
            if (altScript.content[0] === content) {
              // Switch to this as our alt script

              hams.altScript = i;

              message.channel.send(
                `You've activated an ALTERNATE SCRIPT - ${altScript.name}! This will continue until someone breaks the chain.`
              );
              comparison = true;
              break;
            }
          }
        }

        if (!comparison) {
          // Oops
          if (hams.index > 0) {
            const wasAltScript = hams.altScript !== -1;
            failChain(hams, oldIndex);
            if (!wasAltScript) {
              message.channel.send(
                `Ah egads!! The chain is ruined!! <@${message.author.id.toString()}> ruined it ${oldIndex} word(s) in.\nThe next word was \`${nextWord}\`. You've messed up on this word \`${
                  hams.fails[oldIndex]
                }\` time(s).`
              );
            } else {
              message.channel.send(
                `Ah egads!! The chain is ruined!! <@${message.author.id.toString()}> ruined it ${oldIndex} word(s) in.\nThe next word was \`${nextWord}\`. We now return to your regularly scheduled steamed hams.`
              );
            }
            generateMessage(hams, message.channel).then((chainResult) => {
              message.channel.send(`Here's what you had:\n> ${chainResult}`);
            });
          }
        } else {
          // Check for someone sending 2 messages in a roe
          if (
            hams.lastSenderId === message.author.id.toString() &&
            hams.index > 0
          ) {
            failChain(hams, "double");
            message.channel.send(
              `Ah egads!! The chain is ruined!! <@${message.author.id.toString()}> ruined it ${oldIndex} word(s) in.\nYou cannot put a word twice in a row. You've messed up this way \`${
                hams.fails.double
              }\` time(s).`
            );
            generateMessage(hams, message.channel).then((chainResult) => {
              message.channel.send(`Here's what you had:\n> ${chainResult}`);
            });
            return;
          }

          // Increment index
          hams.index += 1;
          let newRecord = false;
          if (hams.index + 1 > hams.record && hams.altScript === -1) {
            hams.record = hams.index + 1;
            newRecord = true;
          }
          hams.lastSenderId = message.author.id.toString();
          hams.messageCache ||= [];
          hams.messageCache.push(message.id);
          Database.scheduleWrite();

          if (hams.index >= currentScript.length) {
            hams.index = 0;
            hams.wins += 1;
            hams.altScript = -1;
            hams.lastSenderId = null;
            Database.scheduleWrite();

            return message.channel.send(
              `You group are an odd one, but I must say, you steam a good ham. You made it to the end!\nWins: ${hams.wins}`
            );
          } else {
            message.react(newRecord ? "🔥" : "🍔");
          }
        }

        Database.scheduleWrite();
      }
    },
  },
};
