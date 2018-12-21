const querystring = require('querystring');
const config = require('../config');

exports.login = (req, res) => {
  link = 'https://www.strava.com/oauth/authorize?' + querystring.stringify({
    client_id: config.strava.client_id,
    redirect_uri: config.strava.redirect_uri,
    response_type: 'code',
    scope: 'activity:read_all'
  });

  res.render('login', {
    link: link
  });
}

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/login');
  });
}
