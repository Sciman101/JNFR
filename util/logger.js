import fs from 'fs';
import SimpleLogger from 'simple-node-logger';

export let log = null;

export default {
	init: () => {
		if (!fs.existsSync('./logs')){
			fs.mkdirSync('./logs');
		}		
	
		const logManager = new SimpleLogger();
		logManager.createConsoleAppender();
		logManager.createRollingFileAppender({
			errorEventName:'error',
			logDirectory:'./logs', // NOTE: folder must exist and be writable...
			fileNamePattern:'JNFR-<DATE>.log',
			dateFormat:'YYYY.MM.DD'
		});
		log = logManager.createLogger();
		log.info('-=== Logger initialized ===-');
	}
}