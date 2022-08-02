import {branch,literal,discordMention,discordEmoji,numValue} from '../parser/arguments.js';
import Database from '../util/db.js';
import {log} from '../util/logger.js';
import {MessageEmbed} from 'discord.js';
import {MONTHS} from '../util/arrays.js';

export default {
	name: 'pinboard',
	description: 'Set up a pin board for your server! (Pins will only use the first attachment/embed in an image)',
	permissions:['MANAGE_MESSAGES'],
	guildOnly:true,
	argTree:branch([
		literal('setup',
			discordMention('channel','channel',
				discordEmoji('emoji',
					numValue('min_reacts',1,500,true)
				)
			)
		),
		literal('disable')
	]),
	execute(message, args) {
		
		if (args.setup) {

			// Set up pinboard
			const emoji = args.emoji;
			const minReacts = args.min_reacts;
			const channelId = args.channel;

			const guild = Database.getGuild(message.guild.id.toString());
			guild.pinboard = {
				channel: channelId,
				emoji: emoji,
				minReacts: minReacts,
				enabled: true,
				cache: guild.pinboard ? (guild.pinboard.cache || []) : []
			};
			Database.scheduleWrite();

			return message.reply(`Pin board established in <#${channelId}>!`);

		}else{
			// Turn off pinboard
			const guild = Database.getGuild(message.guild.id.toString());
			if (guild.pinboard) {
				guild.pinboard.enabled = false;
			}
			Database.scheduleWrite();
			return message.reply(`Disabled pin board`);
		}

	},

	listeners:{
		// When someone reacts to a message...
		'messageReactionAdd': async(reaction, _user) => {
			// When a reaction is received, check if the structure is partial
			if (reaction.partial) {
				// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
				try {
					await reaction.fetch();
				} catch (error) {
					log.error('Something went wrong when fetching the message: ', error);
					// Return as `reaction.message.author` may be undefined/null
					return;
				}
			}

			const guild = Database.getGuild(reaction.message.guild.id.toString());
			if (guild.pinboard && guild.pinboard.enabled) {
				const pinboard = guild.pinboard;
				// Check for channel (we don't want to pin messages already in the pins channel)
				if (reaction.message.channel.id.toString() !== pinboard.channel) {
					// Check for emoji
					let match = false;
					if (pinboard.emoji.unicode) {
						match = reaction.emoji.toString() === pinboard.emoji.unicode;
					}else{
						match = reaction.emoji.id === pinboard.emoji.id;
					}
					if (match) {
						// Check for amount of emoji
						if (reaction.count >= pinboard.minReacts) {
							// Is it already in the cache?
							if (pinboard.cache.indexOf(reaction.message.id.toString()) == -1) {

								// Let's find some media to pin
								const message = reaction.message;
								const member = await message.guild.members.fetch(message.author);
								const nickname = member ? member.displayName : message.author.username;

								let stupidWorkaroundForDiscordJsVideosNotEmbedding = null;

								// Post it!
								const channel = message.guild.channels.cache.get(pinboard.channel);
								if (channel) {

									const originalDate = new Date(message.createdTimestamp);
									//const pinnedDate = new Date();

									// Create an embed for it
									const pinEmbed = new MessageEmbed()
										.setColor('#62B7E8')
										.setTitle(`Jump to message!`)
										.setURL(message.url)
										.setAuthor({name:nickname, iconUrl:message.author.avatarURL()})
										.setDescription(message.cleanContent)
										//.setTimestamp()
										.setFooter({text:`Originally posted ${MONTHS[originalDate.getMonth()]} ${originalDate.getDate()}, ${originalDate.getFullYear()}`})
										/*.addFields(
											{name: 'Pinned on ', value: `${MONTHS[pinnedDate.getMonth()]} ${pinnedDate.getDate()}, ${pinnedDate.getFullYear()}`}
										);*/
									
									if (message.attachments.size > 0) {
										// Attach first attachment
										const attachment = message.attachments.first();
										const url = attachment.proxyURL.toLowerCase();
										//console.log(url);
										const isVideo = url.endsWith('webm') || url.endsWith('mp4') || url.endsWith('mov');

										pinEmbed.setImage(message.attachments.first().proxyURL);
										if (isVideo){
											stupidWorkaroundForDiscordJsVideosNotEmbedding = message.attachments.first().proxyURL;
										}
									}else if (message.embeds.length > 0) {
										// Attach embed

										//console.log('embed');

										if (message.embeds[0].thumbnail) {
											pinEmbed.setImage(message.embeds[0].thumbnail.url);
										}else if (message.embeds[0].video) {
											stupidWorkaroundForDiscordJsVideosNotEmbedding = message.embeds[0].video.proxyURL;
										}
									}

									if (stupidWorkaroundForDiscordJsVideosNotEmbedding) {
										channel.send(stupidWorkaroundForDiscordJsVideosNotEmbedding);
										pinEmbed.setDescription(`Discord.JS can't embed videos, so it's been posted above seperately`);
									}

									channel.send({ embeds: [pinEmbed] });

									// Add the message to the cache so we don't do it again
									pinboard.cache.push(message.id.toString());
									Database.scheduleWrite();
									
									log.info('Pinned a message in channel id ' + channel.id.toString());
								}
							}
						}
					}
				}
			}
		}
	}
}