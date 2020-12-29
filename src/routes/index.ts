import express from 'express';
import { Request, Response, NextFunction } from 'express';
import expressWs from 'express-ws';
import WebSocket from 'ws';

import loginRouter from './login';

const { applyTo } = expressWs(express());
applyTo(express.Router());

const router = express.Router();
const clients = new Set<WebSocket>();

const loginCheck = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
        next();
    }
    else {
        res.redirect('/login');
    }
}

router.use(loginRouter);

router.all('/', loginCheck);
router.get('/user', loginCheck, (req, res) => {
    res.render('user', { user: req.user });
});

router.ws('/', (ws, req) => {
    clients.add(ws);
    ws.on('message', msg => {
        clients.forEach(client => {
            client.send(msg);
        });
    });
    ws.on('close', () => {
        clients.delete(ws);
    });
});

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.render('index', { user: req.user });
});


export default router;

// This file ends here.