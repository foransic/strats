const querystring = require('querystring');
const request = require('request');
const config = require('../config');

exports.list_home = (req, res) => {
  checkAccess(req).then((message) => {
    res.render('list', {
      user: req.session.first_name
    });
  }, (message) => {
    res.redirect('/login');
  });
}

exports.list_submit = (req, res) => {
  checkAccess(req).then((message) => {
    var before = Math.round(new Date(req.body.before).getTime()/1000);
    var after = Math.round(new Date(req.body.after).getTime()/1000);
    var type = req.body.export?'csv':'html';

    var qs = querystring.stringify({
      before: before,
      after: after,
      per_page: 200
    });

    request({
      url: 'https://www.strava.com/api/v3/activities?' + qs,
      method: 'GET',
      headers: {
        'Authorization': req.session.token_type + ' ' + req.session.access_token
      }
    }, (err, resp) => {
      //console.log(resp.body);

      activities = JSON.parse(resp.body);
      result = [];

      for (var idx in activities) {
        activity = activities[idx];

        if (type === 'html') {
          jsonActivity = {
            type: activity.type,
            name: activity.name,
            start_date: new Date(activity.start_date).toLocaleString(),
            elapsed_time: Math.round(activity.elapsed_time/0.6)/100,
            moving_time: Math.round(activity.moving_time/0.6)/100,
            distance: Math.round(activity.distance/10)/100,
            total_elevation_gain: activity.total_elevation_gain,
            commute: activity.commute?'Oui':'Non',
            avg_speed: Math.round(activity.average_speed*360)/100,
            max_speed: Math.round(activity.max_speed*360)/100,
            activity_id: activity.id
          }
          result.push(jsonActivity);
        } else if (type === 'csv') {
          var line = activity.type + ';' +
            activity.name + ';' +
            new Date(activity.start_date).toLocaleString() + ';' +
            Math.round(activity.elapsed_time/0.6)/100 + ';' +
            Math.round(activity.moving_time/0.6)/100 + ';' +
            Math.round(activity.distance/10)/100 + ';' +
            activity.total_elevation_gain + ';';
          line += activity.commute?'Oui;':'Non;';
          line += Math.round(activity.average_speed*360)/100 + ';' +
            Math.round(activity.max_speed*360)/100;

          result += line + '\n';
        }
      }

      if (type === 'csv') {
        res.set('Content-Type', 'text/csv');
        res.send(result);
      } else if (type === 'html') {
        res.render('list', {
            user: req.session.first_name,
            before: req.body.before,
            after: req.body.after,
            activities: result
        });
      }
    });
  }, (message) => {
    res.redirect('/login');
  });
}

checkAccess = (req) => {
  return new Promise((resolve, reject) => {
    if (req.session.access_token) {
      request({
        url: 'https://www.strava.com/oauth/token',
        method: 'POST',
        form: {
          client_id: config.strava.client_id,
          client_secret: config.strava.client_secret,
          grant_type: 'refresh_token',
          refresh_token: req.session.refresh_token
        }
      }, (err, resp) => {
        if (err) {
          req.session.token_type = null;
          req.session.access_token = null;
          req.session.refresh_token = null;

          reject("refresh token error");
        } else {
          athleteInfo = JSON.parse(resp.body);
          req.session.token_type = athleteInfo.token_type;
          req.session.access_token = athleteInfo.access_token;
          req.session.refresh_token = athleteInfo.refresh_token;

          resolve("token refreshed");
        }
      });
    } else {
      reject("no access token");
    }
  });
}
