const fs = require('fs');

const WRITE_DELAY = 10000;

// Dictionary to store data per member
let userData = {};
// Dictionary to store data per server
let guildData = {};
// Dictinary to store data for JNFR
let jnfrData = {};

// Timeouts
let userWriteTimeout = null;
let guildWriteTimeout = null;
let jnfrWriteTimeout = null;

// Validate files
if (!fs.existsSync('.storage')){
    fs.mkdirSync('.storage');
}
fs.writeFile('.storage/jnfrdata.json','{}',{flag:'wx'},(err) => {});
fs.writeFile('.storage/guilddata.json','{}',{flag:'wx'},(err) => {});
fs.writeFile('.storage/userdata.json','{}',{flag:'wx'},(err) => {});

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

// load JNFR data
try {
	const rawData = fs.readFileSync('.storage/jnfrdata.json');
	jnfrData = JSON.parse(rawData);
	console.log(`Loaded jnfr data!`);
}catch (err) {
	console.error(`Error loading jnfr data! ${err}`);
}
function writeJnfrData() {
	fs.writeFileSync('.storage/jnfrdata.json',JSON.stringify(jnfrData));
	jnfrWriteTimeout = null;
	console.log('Updated jnfr data file');
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
	},
	jnfr: {
		// Get jnfr data
		get(key) {
			if (key in jnfrData) {
				return jnfrData[key];
			}
			return null;
		},
		// Put user data
		put(key,value) {
			jnfrData[key] = value;
			// Write to storage
			if (jnfrWriteTimeout == null) {
				jnfrWriteTimeout = setTimeout(writeJnfrData,WRITE_DELAY);
			}
		}
	}
}