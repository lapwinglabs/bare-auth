/**
 * Application environment variables
 */

// Port
exports.PORT = process.env.PORT || 5000;

// JSON Web Token
exports.JWT_SECRET = process.env.JWT_SECRET || false;
exports.JWT_EXPIRATION = process.env.JWT_EXPIRATION || '14d';

// Google
exports.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || false;

// Twitter
exports.TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY || false;
exports.TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET || false;

// LinkedIn
exports.LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || false;

// Facebook
exports.FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET || false;
