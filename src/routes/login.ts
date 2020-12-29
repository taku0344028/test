import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import passportGoogle from 'passport-google-oauth20';
import flash from 'connect-flash';
import express from 'express';
import { Request, Response, NextFunction } from 'express';

const User = {
    name: 'tookubo',
    email: 'hoge112x33x34hoge@google.com',
    password: 'password'
};

passport.use(new LocalStrategy({
    usernameField: 'email'
}, (email, password, done) => {
    if (email !== User.email) {
        return done(null, false, {message: 'User does not exist'});
    }
    if (password !== User.password) {
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

export default router;

// This file ends here.