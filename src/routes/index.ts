import express from 'express';
import { Request, Response, NextFunction } from 'express';
import GameRouter from './game';
import loginRouter from './login';

const router = express.Router();

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
router.use(loginCheck, GameRouter);
router.get('/user', loginCheck, (req, res) => {
    res.render('user', { user: req.user });
});

const dummyData = [
    {id: 1, name: "テスト", master: "たくや"},
    {id: 12, name: "てすと", master: "渋木"},
    {id: 13, name: "なにか", master: "tookubo"}
];

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.render('index', { user: req.user, roomData: dummyData });
});

/**
 * ルームを新規作成して、作成したルームにリダイレクトする
 */
router.post('/create', loginCheck, (req, res, next) => {
    const id = 1;
    console.log(`create new room id = ${id}`);
    res.redirect(`/game/${id}`);
});

export default router;

// This file ends here.