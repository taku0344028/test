import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import flash from 'connect-flash';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import UserManager, { IUser } from '../user';
import dotenv from 'dotenv';

dotenv.config();

const userManager = new UserManager;

const User = {
    name: 'tookubo',
    email: 'hoge112x33x34hoge@google.com',
    password: 'password'
};

const googleStrategyOption = {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: "http://ws-sample-forest.herokuapp.com/login/google/callback"
};

passport.use(new GoogleStrategy(googleStrategyOption, (accessToken, refreshToken, profile, done) => {
    if (profile) {
        return done(undefined, {
            name: profile.displayName
        });
    }
}));

const facebookStrategyOption = {
    clientID: process.env.FACEBOOK_CLIENT_ID as string,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    callbackURL: "http://ws-sample-forest.herokuapp.com/login/facebook/callback"
};

passport.use(new FacebookStrategy(facebookStrategyOption, (accessToken, refreshToken, profile, done) => {
    if (profile) {
        return done(undefined, profile);
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
    return done(null, {name: User.name});
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

router.get('/login/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/login/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/success'
}));

router.get('/login/facebook', passport.authenticate('facebook'));

router.get('/login/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login',
    successRedirect: '/success'
}));

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