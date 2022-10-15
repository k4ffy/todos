import config from 'config';

export let configFTP = { 
	host: config.get('server.host'),
	user: config.get('server.user'),
	password: config.get('server.password'),
	parallel: config.get('server.parallel')
}