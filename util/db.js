import {Low, JSONFile} from 'lowdb';
import {log} from './logger.js';

const SCHEDULED_WRITE_TIMEOUT = 5000;

export let db;

let writeQueued = false;

export default {

	init: async () => {
		const _db = new Low(new JSONFile('db.json'));
		await _db.read();
		log.info('Database initialized!');
		db = _db;

		db.data ||= {
			users: [],
			guilds: [],
			jnfr: {}
		}
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