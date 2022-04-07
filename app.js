const express = require('express');
const session = require('express-session');
const mustache = require('mustache-express');

const config = require('./config');

var app = express();
app.use(session({
  secret: config.app.secret,
  resave: false,
  saveUninitialized: false
}));

// needed for POST body params retrieval
app.use(express.urlencoded());

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// to be removed in production!
app.use('/assets', express.static(__dirname + '/assets'));

/**
  Homepage : redirect to activities list page and let it check if Strava has the authorization
*/
app.get('/', (req, res) => {
    res.redirect('/list');
});

const logController = require('./controllers/logController');
/**
  Login: generate the oauth link and display the login page
*/
app.get('/login', logController.login);
/**
  Logout : erase all memories for the current user session
*/
app.get('/logout', logController.logout);

const authController = require('./controllers/authController');
/**
  Auth: the Strava callback page
*/
app.get('/auth', authController.auth);

const listController = require('./controllers/listController');
/**
  List : main page of the app, let's you search for Strava activities
*/
app.get('/list', listController.list_home);
app.post('/list', listController.list_submit);

app.listen(config.app.port);
