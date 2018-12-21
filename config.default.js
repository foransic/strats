const config = {};

config.app = {};
config.strava = {};

config.app.secret = 'ABC easy as';
config.app.port = '123';

config.strava.client_id = '12345';
config.strava.client_secret = '6789';
config.strava.redirect_uri = 'http://<hostname>:<port>/<path>';

module.exports = config;
