import 'bootstrap';
import Game from './game';

class Connector {
    private host: string;
    private ws: WebSocket | undefined = undefined;
    private onMessageFunction: (msg: MessageEvent) => void;
    constructor(host: string, onMessageFunction: (msg: MessageEvent) => void) {
        this.host = host.replace(/^http/, 'ws');
        this.onMessageFunction = onMessageFunction;
    }
    init() {
        this.ws = new WebSocket(this.host);
        this.ws.onmessage = this.onMessageFunction;
        this.ws.onclose = (event) => {
            console.log(`close websocket reconnect now, host = ${this.host}`);
            this.init();
        }
    }
    send(message: string) {
        this.ws?.send(message);
    }
}

window.addEventListener('load', () => {
    const canvas: HTMLCanvasElement = document.getElementById('mainBoard') as HTMLCanvasElement;
    const game = new Game(canvas);
    game.init(canvas).then(() => game.start());
    const textarea = document.getElementById('log') as HTMLTextAreaElement;
    const messageFunction = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        textarea.value += `[${data.username}]: ${data.message}\n`;
        const command = 'deal';
        game.update(command);
    }
    const connector = new Connector(location.href, messageFunction);
    connector.init();

    const form = document.getElementById('mainForm');
    form?.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = document.getElementById('message') as HTMLInputElement;
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const text = input?.value;
        connector.send(JSON.stringify({
            username: username,
            message: text
        }));
        input.value = '';
        input.focus();
        return false;
    });
});

// This file ends here.