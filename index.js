/**
 * Load in any environment variables in .env
 */

require('localenv');

/**
 * DEBUG
 */

var debug = require('debug')('bare-auth');

/**
 * Module Dependencies
 */

var browserify = require('browserify-middleware');
var bodyParser = require('body-parser');
var express = require('express');
var sign = require('./lib/sign');
var env = require('./lib/env');
var logger = require('morgan');
var throng = require('throng');
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
 * Enable the front-end
 */

if (env.FRONTEND) {
  app.set('views', __dirname + '/client');
  browserify.settings({ transform: ['envify'] })
  app.get('/client.js', browserify(__dirname + '/client/client.js'));
  app.get('/client.css', function(req, res, next) {
    res.sendFile(__dirname + '/client/client.css')
  })

  env.FRONTEND = 'string' == typeof env.FRONTEND ? env.FRONTEND : '/';

  app.get(env.FRONTEND, function(req, res, next) {
    res.render('client.jade', {
      twitter: env.TWITTER_CONSUMER_SECRET && env.TWITTER_CONSUMER_KEY,
      facebook: env.FACEBOOK_CLIENT_SECRET && env.FACEBOOK_CLIENT_ID,
      linkedin: env.LINKEDIN_CLIENT_SECRET && env.LINKEDIN_CLIENT_ID,
      google: env.GOOGLE_CLIENT_SECRET && env.GOOGLE_CLIENT_ID
    });
  });
}

/**
 * Listen function
 */

function listen() {
  app.listen(env.PORT, function() {
    var addr = this.address();
    console.log('listening on [%s]:%s', addr.address, addr.port);
  });
}

/**
 * Bind to a port if we're not already
 * requiring it.
 */

if (!module.parent) {
  listen();
  // throng(listen);
}
