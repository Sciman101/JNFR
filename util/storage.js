const fs = require('fs');

const WRITE_DELAY = 10000;

// Dictionary to store data per member
let userData = {};
// Dictionary to store data per server
let guildData = {};

// Timeouts
let userWriteTimeout = null;
let guildWriteTimeout = null;

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
try {
	const rawData = fs.readFileSync('.storage/guilddata.json');
	guildData = JSON.parse(rawData);
	console.log(`Loaded guild data!`);
}catch (err) {
	console.error(`Error loading guild data! ${err}`);
}
function writeGuildData() {
	fs.writeFileSync('.storage/guilddata.json',JSON.stringify(guildData));
	guildWriteTimeout = null;
	console.log('Updated guild data file');
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
			if (guildWriteTimeout == null) {
				guildWriteTimeout = setTimeout(writeGuildData,WRITE_DELAY);
			}
		}
	}
}