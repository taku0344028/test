import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import flash from 'connect-flash';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import UserManager, { IUser } from '../user';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.DEVELOP_MODE ? "http://localhost:3000" : "https://ws-sample-forest.herokuapp.com";
const userManager = new UserManager;

const googleStrategyOption = {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: `${host}/login/google/callback`
};

passport.use(new GoogleStrategy(googleStrategyOption, (accessToken, refreshToken, profile, done) => {
    if (profile) {
        console.log(profile.photos);
        return done(undefined, {
            name: profile.displayName,
            photo: profile.photos ? profile.photos[0].value : ''
        });
    }
}));

const facebookStrategyOption = {
    clientID: process.env.FACEBOOK_CLIENT_ID as string,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    callbackURL: `${host}/login/facebook/callback`,
    profileFields: ['displayName', 'photos']
};

passport.use(new FacebookStrategy(facebookStrategyOption, (accessToken, refreshToken, profile, done) => {
    if (profile) {
        return done(undefined, {
            name: profile.displayName,
            photo: profile.photos ? profile.photos[0].value : ''
        });
    }
}));

const twitterStrategyOption = {
    consumerKey: process.env.TWITTER_API_KEY as string,
    consumerSecret: process.env.TWITTER_API_KEY_SECRET as string,
    callbackURL: `${host}/login/twitter/callback`
};

passport.use(new TwitterStrategy(twitterStrategyOption, (accessToken, refreshToken, profile, done) => {
    if (profile) {
        return done(undefined, {
            name: profile.displayName,
            photo: profile.photos ? profile.photos[0].value : ''
        })
    }
}));

passport.use(new LocalStrategy({
    usernameField: 'email'
}, (email, password, done) => {
    const user: IUser = {
        name: '',
        email: email,
        password: password
    }
    if (!userManager.findUser(user)) {
        return done(null, false, {message: 'User does not exist'});
    }
    if (!userManager.auth(user)) {
        return done(null, false, {message: 'Password incorrect'});
    }
    return done(null, {name: 'test'});
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
});

const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

router.get('/login/:provider', (req, res, next) => {
    const provider = req.params.provider;
    const option = provider == 'facebook' ? {scope: ['public_profile']} : {scope: ['profile']};
    passport.authenticate(provider, option)(req, res, next);
});

router.get('/login/:provider/callback', (req, res, next) => {
    const provider = req.params.provider;
    passport.authenticate(provider, {
        failureRedirect: '/login',
        successRedirect: '/success'
    })(req, res, next);
});

router.get('/login', (req: Request, res: Response, next: NextFunction) => {
    res.render('login');
});

router.get('/failure', (req, res) => {
    res.render('error', { message: req.flash('error')});
});

router.get('/success', (req, res) => {
    res.redirect('/');
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/failure',
    successRedirect: '/success',
    failureFlash: true
}));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', (req, res, next) => {
    if (userManager.registration({
        name: req.body.first_name,
        email: req.body.email,
        password: req.body.password
    })) {
        res.redirect('login');
    }
    else {
    // next();
        res.render('signup');
    }
});

export default router;

// This file ends here.