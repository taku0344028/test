import express from 'express';
import expressWs from 'express-ws';
import session from 'express-session';
import bodyParser from 'body-parser';
import indexRouter from './routes/index';
import path from 'path';
import logger from 'morgan';
import sassMiddleware from 'node-sass-middleware';

const { app } = expressWs(express());
const sassDir = path.join(__dirname, '..', 'sass');
const publicDir = path.join(__dirname, '..', 'public');

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false
}));

app.use(sassMiddleware({
    src: sassDir,
    dest: publicDir,
    indentedSyntax: false,
    // debug: true,
    souceMap: true
}));

app.use(express.static(publicDir));

app.use('/', indexRouter);

export default app;

// This file ends here.