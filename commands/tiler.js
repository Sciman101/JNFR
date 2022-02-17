const storage = require('../util/storage.js');
const Text = require('../util/text.js');

// data for displaying stuff
const NUMBER_NAMES = [
	'one',
	'two',
	'three',
	'four',
	'five',
	'six',
	'seven',
	'eight'
];
const TEAM_NAMES = [
	'WHAT???',
	':blue_square: **BLUE** :blue_square:',
	':orange_square: **ORANGE** :orange_square:'
]
const TEAM_SYMBOLS = [
	':white_large_square:',
	':blue_square:',
	':orange_square:',
]
const DEFAULT_BOARD = [
	0,0,0,0,0,0,0,2,
	0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,
	1,0,0,0,0,0,0,0,
];

const DA_RULES = "```TILER (JNFR EDITION) RULES:\n0) Your team is randomly assigned\n1) You can claim a space adjacent to one your team owns\n2) You may only claim one space per day\n3) If that space is owned by the opposing team, every space around it will become yours if unclaimed, and flip which team they're on otherwise\n4) Once the board is filled, the team with more claimed spaces wins!\n5) The winning team receives 250 jollars per player who participated!```";

// turn the board into a printable string
function generateBoardString(board) {
	let boardString = ":black_large_square: :regional_indicator_a: :regional_indicator_b: :regional_indicator_c: :regional_indicator_d: :regional_indicator_e: :regional_indicator_f: :regional_indicator_g: :regional_indicator_h: ";
	for (let y=0;y<8;y++) {
		boardString += "\n:" + NUMBER_NAMES[y] + ": ";
		for (let x=0;x<8;x++) {
			boardString += TEAM_SYMBOLS[board[y*8+x]] + " ";
		}
	}
	return boardString;
}

function getTeamFromId(id) {
	return id.charCodeAt(0) % 2 + 1;
}

// get the thing at a position in the board
function bs(board,row,col) {
	if (row >= 0 && row < 8 && col >= 0 && col < 8) {
		return board[row*8+col];
	}
	return -1; // OOB
}
// check if a specified tile is adjacent to a position
function isAdjacent(board,row,col,test) {
	for (let r=-1;r<2;r++) {
		for (let c=-1;c<2;c++) {
			// check adjacent square
			if (!(c == 0 && r == 0) && bs(board,row+r,col+c) == test) {
				return true;
			}
		}
	}
	return false;
}
// flip every tile around a space
function flipAround(board,row,col,team) {
	for (let r=-1;r<2;r++) {
		for (c=-1;c<2;c++) {
			const t = bs(board,row+r,col+c);
			if (t == 0) {
				board[(row+r)*8+col+c] = team;
			}else if (t > 0) {
				board[(row+r)*8+col+c] = 3 - t;
			}
		}
	}
}
// Check for a winner
function checkWinner(board) {
	let total = 0;
	for (let i=0;i<64;i++) {
		if (board[i] == 0) return -1;
		total += board[i] == 2 ? 1 : -1;
	}
	if (total > 0) return 2;
	if (total < 0) return 1;
	return 0; //tie??
}

let timeouts = {};

module.exports = {
	name: 'tiler',
	aliases: ['board'],
	cooldown: 5,
	description: 'Enjoy the classic game of Tiler in a competitive, per-server daily rumble!\nUse with no args to view your current team and board info.\nUse `j!tiler rules` to view game rules',
	args:false,
	usage:'[space to play (i.e. a3)]',
	guildOnly:true,
	execute(message, args) {	
		
		// figure out what guild and board we're on
		const guild = message.guild;
		const guildId = guild.id.toString();
		let guildBoard = storage.guilddata.get(guildId,'board') || DEFAULT_BOARD;

		// teams are determined by author id
		const authorId = message.author.id.toString();
		const authorTeam = getTeamFromId(authorId);

		// just show the current board
		if (!args.length) {
			const boardString = `You are on ${TEAM_NAMES[authorTeam]} team. The board currently looks like this.\n${generateBoardString(guildBoard)}`;
			return message.channel.send(boardString);

		}else if (args[0].toLowerCase() == 'rules') {
			// send rules
			return message.author.send(DA_RULES, {split: true}).then(() => {}).catch(error => {
					console.error(`Couldn\'t send help DM to ${message.author.tag}.\n`, error);
					message.reply('Couldn\'t DM you for some reason? Do you have DMs disabled?');
				});

		}else{

			// Can this player play?
			if (guildId in timeouts && timeouts[guildId].indexOf(authorId) != -1) {
				return message.reply('You can only claim one space per day! Come back tomorrow');
			}

			// get the space they want to play
			const space = args[0].toLowerCase();
			if (space.length != 2) {
				return message.reply(`'${space}' is not a valid tile!`);
			}
			const row = space.charCodeAt(1) - 49;
			const col = space.charCodeAt(0) - 97;
			// validate square
			if (row < 0 || row > 7 || col < 0 || col > 7) {
				return message.reply(`'${space}' is not a valid tile!`);
			}

			// Can we take this square?
			const currentSquare = bs(guildBoard,row,col);
			if (currentSquare == authorTeam) {
				return message.reply('Your team already owns that space!');
			}
			
			// Check for an adjacent square
			if (isAdjacent(guildBoard,row,col,authorTeam)) {

				let response = "";

				if (currentSquare == 0) {
					// just take the square
					guildBoard[row*8+col] = authorTeam;
					response = `You took '${space}' for ${TEAM_NAMES[authorTeam]}!\n${generateBoardString(guildBoard)}`;
				}else{
					// take square from enemy
					flipAround(guildBoard,row,col,authorTeam);
					response = `You took '${space}' from ${TEAM_NAMES[3-authorTeam]}! All spaces around it have flipped ownership, or become your team's.\n${generateBoardString(guildBoard)}`;
				}

				// set timeout
				let guildTimeouts = timeouts[guildId] || [];
				guildTimeouts.push(authorId);
				timeouts[guildId] = guildTimeouts;

				// make sure this user is marked as a participant
				let gamers = storage.guilddata.get(guildId,'gamers') || [];
				if (gamers.indexOf(authorId) == -1) {
					gamers.push(authorId);
					storage.guilddata.put(guildId,'gamers',gamers);
				}

				// Check for a winner
				const winner = checkWinner(guildBoard);
				if (winner != -1) {

					// Looks like we have a winner!
					const gamers = storage.guilddata.get(guildId,'gamers');

					if (winner != 0) {
						message.channel.send(`${response}\n\n${TEAM_NAMES[winner]} team wins! Every player on that team who participated will get 250 ${Text.getJollarSign(guild)}.\n\nThe board for this server will now reset. Thanks for playing!`);
					}else{
						message.channel.send(`${response}\n\nIt's a tie! Every player who participated will get 50 ${Text.getJollarSign(guild)}.\n\nThe board for this server will now reset. Thanks for playing!`);
					}

					// reward
					const reward = winner == 0 ? 50 : 250;
					gamers.forEach(
						gamer => {
							if (winner == 0 || getTeamFromId(gamer) == winner) {
								const bal = storage.userdata.get(gamer,'balance') || 0;
								storage.userdata.put(gamer,'balance',bal+reward);
							}
						}
					);

					// clear 'gamers' array and board
					storage.guilddata.put(guildId,'gamers',[]);
					storage.guilddata.put(guildId,'board',DEFAULT_BOARD);
					return;
				}

				// write data
				storage.guilddata.put(guildId,'board',guildBoard);

				return message.reply(response);

			}else{
				return message.reply('You can only claim spaces adjacent to ones your team already owns!');
			}


		}

	}
}