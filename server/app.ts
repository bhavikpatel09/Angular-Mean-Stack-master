import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as cors from 'cors';
import * as passport from 'passport';
//import TwitterStrategy from 'passport-twitter';
//import FacebookStrategy from 'passport-facebook';
//import User from 'models/user';

import setRoutes from './routes';
import * as config from './auth';

const app = express();
dotenv.load({ path: '.env' });
app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/*Passport related*/
passport.serializeUser(function (user, done) {
    //done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    //User.findById(id, function (err, user) {
    //    done(err, user);
    //});
});

var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({

    consumerKey: config.auth.twitterAuth.consumerKey,
    consumerSecret: config.auth.twitterAuth.consumerSecret,
    callbackURL: config.auth.twitterAuth.callbackURL

},
    function (token, tokenSecret, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Twitter
        process.nextTick(function () {

            //User.findOne({ 'twitter.id': profile.id }, function (err, user) {

            //    // if there is an error, stop everything and return that
            //    // ie an error connecting to the database
            //    if (err)
            //        return done(err);

            //    // if the user is found then log them in
            //    if (user) {
            //        return done(null, user); // user found, return that user
            //    } else {
            //        // if there is no user, create them
            //        var newUser = new User();

            //        // set all of the user data that we need
            //        newUser.twitter.id = profile.id;
            //        newUser.twitter.token = token;
            //        newUser.twitter.username = profile.username;
            //        newUser.twitter.displayName = profile.displayName;

            //        // save our user into the database
            //        newUser.save(function (err) {
            //            if (err)
            //                throw err;
            //            return done(null, newUser);
            //        });
            //    }
            //});

        });

    }));

passport.use(new FacebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID: config.auth.facebookAuth.clientID,
    clientSecret: config.auth.facebookAuth.clientSecret,
    callbackURL: config.auth.facebookAuth.callbackURL

},

    // facebook will send back the token and profile
    function (token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function () {

            // find the user in the database based on their facebook id
            //User.findOne({ 'facebook.id': profile.id }, function (err, user) {

            //    // if there is an error, stop everything and return that
            //    // ie an error connecting to the database
            //    if (err)
            //        return done(err);

            //    // if the user is found, then log them in
            //    if (user) {
            //        return done(null, user); // user found, return that user
            //    } else {
            //        // if there is no user found with that facebook id, create them
            //        var newUser = new User();

            //        // set all of the facebook information in our user model
            //        newUser.facebook.id = profile.id; // set the users facebook id                   
            //        newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
            //        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
            //        newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

            //        // save our user to the database
            //        newUser.save(function (err) {
            //            if (err)
            //                throw err;

            //            // if successful, return the new user
            //            return done(null, newUser);
            //        });
            //    }

            //});
        });

    }));
/*Passport Related End*/

app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(morgan('dev'));
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
(<any>mongoose).Promise = global.Promise;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');

  setRoutes(app);

  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  app.listen(app.get('port'), () => {
    console.log('Angular Full Stack listening on port ' + app.get('port'));
  });

});

export { app };
