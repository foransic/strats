const request = require('request');
const config = require('../config');

exports.auth = (req, res) => {
  var code = req.query.code;
  var error = req.query.error;

  if (error) {
    res.redirect('/login');
  } else {
    request({
      url: 'https://www.strava.com/oauth/token',
      method: 'POST',
      form: {
        client_id: config.strava.client_id,
        client_secret: config.strava.client_secret,
        code: code,
        grant_type: 'authorization_code'
      }
    }, (err, resp) => {
      if (err) {
        console.error(err);
      } else {
        athleteInfo = JSON.parse(resp.body);
        req.session.token_type = athleteInfo.token_type;
        req.session.access_token = athleteInfo.access_token;
        req.session.refresh_token = athleteInfo.refresh_token;
        req.session.first_name = athleteInfo.athlete.firstname;

        res.redirect('/list');
      }
    });
  }
}
