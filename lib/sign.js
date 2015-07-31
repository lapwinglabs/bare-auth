/**
 * Module Dependencies
 */

var assign = require('object-assign');
var jwt = require('jsonwebtoken');
var env = require('./env');
var ms = require('ms');

/**
 * Export `sign`
 */

module.exports = sign;

/**
 * Create a JSON Web Token
 *
 * @param {Object} payload
 * @return {Object}
 */

function sign(payload) {
  if (!env.JWT_SECRET) return payload;
  var epoch = ~~((new Date()) / 1000);
  var exp = epoch + ms(env.JWT_EXPIRATION);

  payload = assign(payload, {
    iat: epoch,
    exp: exp
  })

  return jwt.sign(payload, env.JWT_SECRET);
}
