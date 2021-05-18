const fs = require('fs');

const WRITE_DELAY = 10000;

// Dictionary to store data per member
let userData = {};
// Dictionary to store data per server
let guildData = {};

// Timeouts
let userWriteTimeout = null;

// Load userdata
try {
	const rawData = fs.readFileSync('.storage/userdata.json');
	userData = JSON.parse(rawData);
	console.log(`Loaded user data!`);
}catch (err) {
	console.error(`Error loading user data! ${err}`);
}
function writeUserData() {
	fs.writeFileSync('.storage/userdata.json',JSON.stringify(userData));
	userWriteTimeout = null;
	console.log('Updated user data file');
}

// Load guilddata
const guildFiles = fs.readdirSync('.storage/guild').filter(file => file.endsWith('.json'));
for (const file of guildFiles) {
	// Load file
	try {
		const guildId = file.slice(0,-5);
		const rawData = fs.readFileSync(`.storage/guild/${file}`);

		guildData[guildId] = JSON.parse(rawData);

		console.log(`Loaded guild data for ${file}`);

	}catch (err) {
		console.error(`Error loading guild data ${file}`);
	}
}
function writeGuildData(guild) {
	const data = guildData[guild];
	fs.writeFileSync(`.storage/guild/${guild}.json`,JSON.stringify(data));
	console.log(`Updated guild data file ${guild}`);
}

// Actual functionality
module.exports = {
	userdata: {
		// Get user data
		get(user,key) {
			if (user in userData && key in userData[user]) {
				return userData[user][key];
			}
			return null;
		},
		// Put user data
		put(user,key,value) {
			if (!(user in userData)) {
				userData[user] = {};
			}
			userData[user][key] = value;
			// Write to storage
			if (userWriteTimeout == null) {
				userWriteTimeout = setTimeout(writeUserData,WRITE_DELAY);
			}
		}
	},
	guilddata: {
		// Get guild data
		get(guild,key) {
			if (guild in guildData && key in guildData[guild]) {
				return guildData[guild][key];
			}
			return null;
		},
		// Put user data
		put(guild,key,value) {
			if (!(guild in guildData)) {
				guildData[guild] = {};
			}
			guildData[guild][key] = value;
			// Write to storage
			writeGuildData(guild);
		}
	}
}