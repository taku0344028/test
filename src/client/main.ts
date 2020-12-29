import 'bootstrap';

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
            console.log('close websocket reconnect now');
            this.init();
        }
    }
    send(message: string) {
        this.ws?.send(message);
    }
}

window.addEventListener('load', () => {
    const textarea = document.getElementById('log') as HTMLTextAreaElement;
    const messageFunction = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        textarea.value += `[${data.username}]: ${data.message}\n`;
    }
    const connector = new Connector(location.origin, messageFunction);
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