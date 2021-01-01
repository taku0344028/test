import express from 'express';
import expressWs from 'express-ws';
import WebSocket from 'ws';

const { applyTo } = expressWs(express());
applyTo(express.Router());

const router = express.Router();

class ClientManager {
    private map = new Map<string, Set<WebSocket>>();
    getClients(roomId: string): Set<WebSocket> {
        const clients = this.map.get(roomId);
        if (!clients) {
            this.map.set(roomId, new Set<WebSocket>());
            return this.map.get(roomId) as Set<WebSocket>;
        }
        return clients;
    }
}

const clientManager = new ClientManager;

router.get('/game', (req, res, next) => {
    res.redirect('/');
});

router.get('/game/:id', (req, res, next) => {
    const roomId = req.params.id;
    console.log(`room id = ${roomId}`);
    res.render('game', { user: req.user });
});

router.ws('/game/:id', (ws, req) => {
    const roomId = req.params.id;
    const clients = clientManager.getClients(roomId);
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

export default router;

// This file ends here.