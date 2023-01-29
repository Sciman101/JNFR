import { any, literal, numValue, stringValue } from "../parser/arguments.js";
import Database, { db } from "../util/db.js";
import client from "../index.js";

export default {
  name: "remindme",
  hidden: true,
  aliases: ["reminder"],
  description: "Set a reminder for later!",
  guildOnly: false,
  argTree: numValue(
    "duration",
    1,
    999,
    true,
    any(
      [
        literal("days"),
        literal("day"),
        literal("hours"),
        literal("hour"),
        literal("minutes"),
        literal("minute"),
        literal("week"),
        literal("weeks"),
        literal("month"),
        literal("months"),
        literal("year"),
        literal("years"),
        literal("seconds"),
        literal("second"),
      ],
      stringValue("reminder", true)
    )
  ),
  execute(message, args) {
    // Get the reminder table
    const jnfr = db.data.jnfr;
    jnfr.reminders ||= [];
    const reminders = jnfr.reminders;

    // Figure out the duration
    const duration = args.duration;
    let date = new Date();

	if (args.day || args.days) {
		date.setDate(date.getDate() + duration);
	} else if (args.hours || args.hour) {
		date.setHours(date.getHours() + duration);
	} else if (args.minutes || args.minute) {
		date.setMinutes(date.getMinutes() + duration);
	} else if (args.weeks || args.week) {
		date.setDate(date.getDate() + duration * 7);
	} else if (args.month || args.months) {
		date.setMonth(date.getMonth() + duration);
	} else if (args.year || args.years) {
		date.setFullYear(date.getFullYear() + duration);
	} else if (args.seconds || args.second) {
		date.setSeconds(date.getSeconds() + duration);
	}

    const epochMs = Math.floor(date.getTime() / 1000);
    reminders.push({
      who: message.author.id.toString(),
      when: epochMs,
      what: args.reminder,
      where: {
        guild: message.channel.guild.id.toString(),
		channel: message.channel.id.toString()
      },
    });

    message.reply(`I'll remind you <t:${epochMs}:R> to '${args.reminder}'`);
    Database.scheduleWrite();

    // Set timeout
    setTimeout(
      handleOutdatedReminders,
      ((date.getTime() - Date.now()) / 1000) + 100
    );
  },
};

function handleOutdatedReminders() {
	let reminders = db.data.jnfr.reminders || [];
  	const currentEpoch = Math.floor(Date.now() / 1000);

	for (let i = reminders.length - 1; i >= 0; i--) {
		const reminder = reminders[i];
		console.log(currentEpoch - reminder.when);
		if (currentEpoch >= reminder.when) {
			// Resolve the reminder and delete
			resolveReminder(reminder);
			reminders = reminders.splice(i,1);
		}
	}
	Database.scheduleWrite();
}

function resolveReminder(reminder) {
	client.guilds.fetch(reminder.where.guild)
		.then(guild => {
			guild.channels.fetch(reminder.where.channel)
				.then(channel => {
					channel.send(`<@${reminder.who}>, ${reminder.what}!!`);
				})
		})
}