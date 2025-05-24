import { any, discordMention, literal, optional } from "../parser/arguments.js";
import Database, { db } from "../util/db.js";
import Babbler from "../util/babbler.js";
import { log } from "../util/logger.js";
import { ChannelType } from "discord.js";

const regex_matchers = [
];

export default {
  name: "chatter",
  aliases: [],
  description:
    "Enable/Disable random messages from me now and then (disabled by default)",
  argTree: any(
    [literal("enable"), literal("check"), literal("disable")],
    optional(any([literal("all"), discordMention("channel", "channel")]))
  ),
  adminOnly: true,
  guildOnly: true,
  execute(message, args) {
    // Identify channel
    const guildId = message.guild.id.toString();
    const guildData = Database.getGuild(guildId);
    guildData.chatterChannels = guildData.chatterChannels || [];

    let enabled = args.enable;
    if (args.check) {
      return message.reply(
        `This channel is ${
          guildData.chatterChannels.indexOf(message.channel.id.toString()) ===
          -1
            ? "disabled"
            : "enabled"
        }`
      );
    }

    let target = message.channel.id.toString();
    if (args.channel) {
      target = args.channel;
    } else if (args.all) {
      target = "all";
    }

    if (target === "all") {
      // Enable/disable all
      if (!enabled) {
        guildData.chatterChannels = [];
      } else {
        message.guild.channels.cache.forEach((channel, key) => {
          const id = channel.id.toString();
          if (
            guildData.chatterChannels.indexOf(id) === -1 &&
            channel.type === ChannelType.GuildText
          ) {
            guildData.chatterChannels.push(id);
          }
        });
      }
    } else {
      // Find a specific channel
      if (enabled) {
        guildData.chatterChannels.push(target);
      } else {
        const index = guildData.chatterChannels.indexOf(target);
        if (index != -1) {
          guildData.chatterChannels.splice(index, 1);
        } else {
          return message.reply("That channel isn't enabled!");
        }
      }
    }

    Database.scheduleWrite();
    const channelString = `<#${target}>`;
    return message.reply(
      `${enabled ? "Enabled" : "Disabled"} chatter messages in ${
        target === "all" ? "all channels" : channelString
      }!`
    );
  },
  listeners: {
    messageCreate: function (message) {
      // Ignore certain messagesst
      if (
        message.author.bot ||
        message.content.startsWith(message.client.prefix)
      )
        return;

      // Make sure it's in an enabled channel
      const channelIds =
        Database.getGuild(message.guild.id.toString()).chatterChannels || [];
      // We can only send it in certain channels
      if (
        !channelIds ||
        channelIds.indexOf(message.channel.id.toString()) == -1
      )
        return;

      // mention
      if (message.content.indexOf("<@352566617231720468>") !== -1) {
        return message.channel.send(Babbler.get("mention"));
      }

      // Maxxer
      /* if (Math.random() < 0) {
        const noSymbols = message.cleanContent
          .toString()
          .replace(/[^a-zA-Z0-9 ]/g, "");
        if (noSymbols.length > 0) {
          const words = noSymbols
            .split(" ")
            .filter((substr) => substr.length > 2)
            .map((word) => word.toLowerCase());
          if (words.length >= 2) {
            const firstWordIndex = Math.floor(
              Math.random() * (words.length - 2)
            );
            const secondWordIndex =
              firstWordIndex +
              Math.floor(Math.random() * (words.length - 1 - firstWordIndex)) +
              1;
            return message.reply(
              `${words[firstWordIndex]}-pilled ${words[secondWordIndex]}-maxxer`
            );
          }
        }
      }*/

      // Misinformation
      if (Math.random() < 0.001) {
        return message.channel.send(
          ":warning: The above post may contain misinformation :warning:"
        );
      }

      // Information
      if (Math.random() < 0.0005) {
        return message.channel.send(
          ":white_check_mark: The above post contains information :white_check_mark:"
        );
      }

      // user was
      if (Math.random() < 0.00075) {
        return message.channel.send(
          `User was ${Babbler.get("user_msg")} for this post`
        );
      }

      // Regex
      regex_matchers.forEach((matcher) => {
        const matches = message.cleanContent.matchAll(matcher.regex);
        for (const match of matches) {
          const number = parseInt(match[1]);
          if (number != NaN) {
            return message.channel.send(Babbler.get(matcher.babblerString));
          }
        }
      });

      // Memory
      if (Math.random() < 0.002) {
        const guild = Database.getGuild(message.guild.id.toString());
        let memory = (guild.memory = guild.memory || []);
        if (memory.length > 0) {
          const index = Math.floor(Math.random() * memory.length);
          const text = memory[index];

          if (Math.random() < 0.25) {
            memory.splice(index, 1);
            Database.scheduleWrite();
          }

          return message.channel.send(text);
        }
      }
    },
    // Allow users to delete JNFR messages with ⛔
    messageReactionAdd: async (reaction, user) => {
      // When a reaction is received, check if the structure is partial
      if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        try {
          await reaction.fetch();
        } catch (error) {
          log.error("Something went wrong when fetching the message: ", error);
          // Return as `reaction.message.author` may be undefined/null
          return;
        }
      }

      const message = reaction.message;

      // Make sure it's in an enabled channel
      const channelIds =
        Database.getGuild(message.guild.id.toString()).chatterChannels || [];
      // We can only send it in certain channels
      if (
        !channelIds ||
        channelIds.indexOf(message.channel.id.toString()) == -1
      )
        return;

      if (
        message.author.id === "352566617231720468" ||
        message.author.id === "844191168899842049"
      ) {
        if (reaction.emoji.name === "⛔") {
          try {
            message.delete();
          } catch (e) {
            log.warn("Unable to delete message");
          }
        }
      }
    },
  },
};
