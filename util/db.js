import {Low, JSONFile} from 'lowdb';
import {log} from './logger.js';
import fs from 'fs';

const SCHEDULED_WRITE_TIMEOUT = 5000;
const DB_PATH = 'storage/db.json';

export let db;

let writeQueued = false;

export default {

	init: () => {

		console.log({cwd: process.cwd()});
		fs.readdirSync(process.cwd()).forEach(file => {
			console.log('- ' + file);
		});

		const _db = new Low(new JSONFile(DB_PATH));
		_db.read();
		db = _db;

		if (!db.data || Object.keys(db.data).length === 0) {
			db.data = {
				users: {},
				guilds: {},
				jnfr: {
					pot: 0,
					shop_date: null
				}
			}
			db.write();
		}

		log.info('Database initialized!');
	},

	getUser: (id) => {
		if (!db.data.users[id]) {
			db.data.users[id] = {
				balance: 0,
				inventory: [],
				deaths: 0,
				race: 'Human'
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
				writeQueued = false;
				log.info('Database contents written');
			},SCHEDULED_WRITE_TIMEOUT)
		}
	}

}