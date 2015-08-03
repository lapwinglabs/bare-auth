/**
 * Module Dependencies
 */

var Linkedin = require('bare-auth-linkedin')
var Facebook = require('bare-auth-facebook')
var Twitter = require('bare-auth-twitter')
var Google = require('bare-auth-google')

/**
 * Services
 */

var services = {};

services.google = Google({
  client_id: process.env.GOOGLE_CLIENT_ID,
  scope: 'profile'
});

services.twitter = Twitter();

services.linkedin = Linkedin({
  client_id: process.env.LINKEDIN_CLIENT_ID
})

services.facebook = Facebook({
  client_id: process.env.FACEBOOK_CLIENT_ID,
  scope: ['public_profile', 'email']
})

/**
 * Listen for clicks on buttons
 */

document.addEventListener('click', function(e) {
  if (e.target.nodeName != 'BUTTON') return;
  var service = e.target.getAttribute('service')
  if (!services[service]) return;
  services[service](function(err, profile) {
    var output = document.querySelector('.output[service="' + service + '"]');

    if (err) {
      output.innerHTML = '<span class="string">' + err.stack + '</span>';
    } else if (process.env.JWT_SECRET) {
      output.innerHTML = highlight_jwt(profile);
    } else {
      output.innerHTML = highlight_json(profile);
    }
  });
})

/**
 * Highlight JSON
 *
 * @param {Object} json
 * @return {String}
 */

function highlight_json(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

/**
 * Highlight the parts of a JSON webtoken
 *
 * @param {String} jwt
 * @return {String}
 */

function highlight_jwt(jwt) {
  return jwt.split('.').map(function(part, i) {
    switch (i) {
      case 0: return '<span class="string">' + part + '</span>';
      case 1: return '<span class="boolean">' + part + '</span>';
      case 2: return '<span class="key">' + part + '</span>';
    }
  }).join('.');
}
