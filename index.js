import fs from "fs";

import { Client, Intents, Collection } from "discord.js";
const prefix = "j!";

if (!process.env.DISCORD_TOKEN) {
  throw new Error("DISCORD_TOKEN environment variable missing.");
}
const token = process.env.DISCORD_TOKEN;

import Babbler from "./util/babbler.js";
import Logger, { log } from "./util/logger.js";
import Database from "./util/db.js";
import argumentParser from "./parser/argumentParser.js";
import { createItems } from "./data/items.js";

Logger.init();
Babbler.init();
Database.init();

createItems();

// Setup discord client
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
  ],
  partials: ["REACTION", "MESSAGE"],
});
client.prefix = prefix;
client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
log.info("Loading commands...");
for (const file of commandFiles) {
  if (!file.startsWith("-")) {
    // Files starting with a hyphen are ignored
    import(`./commands/${file}`)
      .then((module) => {
        const command = module.default;
        client.commands.set(command.name, command);
        log.info("└ " + command.name);

        // Add listeners for specific commands
        if ("listeners" in command) {
          for (const listener in command.listeners) {
            client.on(listener, command.listeners[listener]);
          }
        }
      })
      .catch((err) => {
        log.error("Error importing command ", file, "\n", err);
      });
  }
}

// On initialization
client.once("ready", () => {
  log.info("JNFR ready!");
  client.user.setActivity("type j!help");
});

// On message received...
client.on("messageCreate", (message) => {
  // Ignore bots
  if (message.author.bot) return;

  if (
    message.content.toLowerCase().indexOf("dialouge") != -1 &&
    message.author.id.toString() === "160121042902188033"
  ) {
    message.reply(Babbler.get("dialouge"));
  }

  // nice
  if (
    message.content == "69" ||
    message.content.toLowerCase().replace(/[- ]/, "") == "sixtynine"
  ) {
    return message
      .react("🇳")
      .then(() => message.react("🇮"))
      .then(() => message.react("🇨"))
      .then(() => message.react("🇪"))
      .then(() => message.react("😎"))
      .catch(() => console.error("Not nice :("));
  }

  // Make sure it's a command for us
  if (!message.content.startsWith(prefix)) return;

  // Parse command name and arguments
  const rawArgs = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = rawArgs.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );
  if (!command || command == undefined) {
    return message.reply(Babbler.get("unknown_command"));
  }

  // Check command requirements
  // Guild only
  if (command.guildOnly && message.channel.type == "dm") {
    return message.reply(Babbler.get("guild_only"));
  }

  // Check admin only
  if (command.adminOnly) {
    const admins = Database.getGuild(message.guild.id.toString()).admins || {};
    if (!admins[message.author.id.toString()]) {
      return message.reply(Babbler.get("admin_only"));
    }
  }

  // Parse arguments
  const parseResult = argumentParser(rawArgs, command.argTree);
  if (parseResult.error) {
    // Oops!
    return message.reply(
      Babbler.get("argument_error") + "\n`" + parseResult.error + "`"
    );
  }

  // Actually run the dang thing
  try {
    command.execute(message, parseResult.args);
  } catch (error) {
    log.error(error);
    message.reply(Babbler.get("error"));
  }
});

// Handle shutdown
process.on("SIGINT", () => {
  process.exit();
});
process.on("SIGTERM", () => {
  process.exit();
});

// Login!
client.login(token);

export default client;
