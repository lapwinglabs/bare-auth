/**
 * Module Dependencies
 */

var debug = require('debug')('bare-auth');
var bodyParser = require('body-parser');
var express = require('express');
var sign = require('./lib/sign');
var env = require('./lib/env');
var logger = require('morgan');
var cors = require('cors');

/**
 * Providers
 */

var Google = require('bare-auth-google');
var Twitter = require('bare-auth-twitter');
var LinkedIn = require('bare-auth-linkedin');
var Facebook = require('bare-auth-facebook');


/**
 * Setup express server
 */

var app = module.exports = express();

/**
 * Middleware
 */

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Routing
 */

if (env.GOOGLE_CLIENT_SECRET) {
  debug('enabling google authentication');
  app.use(Google({
    client_secret: env.GOOGLE_CLIENT_SECRET,
    sign: sign
  }))
}

if (env.TWITTER_CONSUMER_KEY && env.TWITTER_CONSUMER_SECRET) {
  debug('enabling twitter authentication');
  app.use(Twitter({
    consumer_key: env.TWITTER_CONSUMER_KEY,
    consumer_secret: env.TWITTER_CONSUMER_SECRET,
    sign: sign
  }))
}

if (env.LINKEDIN_CLIENT_SECRET) {
  debug('enabling linkedin authentication');
  app.use(LinkedIn({
    client_secret: env.LINKEDIN_CLIENT_SECRET,
    sign: sign
  }));
}

if (env.FACEBOOK_CLIENT_SECRET) {
  debug('enabling facebook authentication');
  app.use(Facebook({
    client_secret: env.FACEBOOK_CLIENT_SECRET,
    sign: sign
  }));
}

/**
 * Local route (for signing purposes)
 */

app.post('/auth/local', function(req, res, next) {
  var body = req.body;
  res.send(sign(body));
});

/**
 * Bind to a port if we're not already
 * requiring it.
 */

if (!module.parent) {
  app.listen(env.PORT, function() {
    var addr = this.address();
    console.log('listening on [%s]:%s', addr.address, addr.port);
  });
}
