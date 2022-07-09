import {Low, JSONFile} from 'lowdb';
import {log} from './logger.js';

const SCHEDULED_WRITE_TIMEOUT = 5000;

export let db;

let writeQueued = false;

export default {

	init: async () => {
		const _db = new Low(new JSONFile('db.json'));
		await _db.read();
		db = _db;

		db.data ||= {
			users: {},
			guilds: {},
			jnfr: {
				pot: 0
			}
		}
		await db.write();

		log.info('Database initialized!');
	},

	getUser: (id) => {
		if (!db.data.users[id]) {
			db.data.users[id] = {
				balance: 0,
				inventory: []
			};
		}
		return db.data.users[id];
	},

	getGuild: (id) => {
		if (!db.data.guilds[id]) {
			db.data.guilds[id] = {
				pinboard:{},
				emojiroles:[]
			};
		}
		return db.data.guilds[id];
	},

	scheduleWrite: () => {
		if (!writeQueued) {
			log.info('Writing database contents in ',SCHEDULED_WRITE_TIMEOUT,'ms');
			writeQueued = true;
			setTimeout(() => {
				db.write();
				log.info('Database contents written');
			},SCHEDULED_WRITE_TIMEOUT)
		}
	}

}