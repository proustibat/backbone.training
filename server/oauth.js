"use strict";

var express = require('express');
var router = express.Router();
var _ = require('lodash');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;

var users = require('./db/users');

passport.use(new GoogleStrategy({
    clientID: '663254030363.apps.googleusercontent.com',
    clientSecret: 'yGvVRKdxm-efJ7UI9KAQ1x1E',
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true
    },
    function(request, accessToken, refreshToken, profile, done) {
        if (!profile)
            done('Profile missing');

        var user = _.findWhere(users, {name: profile.displayName});
        if (!user) {
            user = {name: profile.displayName, bio: 'Fill me'};
            users.push(user);
        }
        done(null, user);
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.name);
});

passport.deserializeUser(function (name, done) {
    var user = _.findWhere(users, {name: name});
    if (user)
        done(null, user);
    else
        done('User not found');
});

router.get('/auth/google',
    passport.authenticate('google', { scope:[ 'email', 'profile' ] })
);

router.get('/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));

router.get('/auth/google/success', function(req, res) {
    res.sendFile(__dirname + '/templates/success.html')
});

router.get('/auth/google/failure', function(req, res) {
    res.sendFile(__dirname + '/templates/failure.html')
});

module.exports = router;
