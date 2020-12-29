import 'bootstrap';

window.addEventListener('load', () => {
    const HOST = location.origin.replace(/^http/, 'ws');
    const ws = new WebSocket(HOST);

    const form = document.getElementById('mainForm');
    form?.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = document.getElementById('message') as HTMLInputElement;
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const text = input?.value;
        ws.send(JSON.stringify({
            username: username,
            message: text
        }));
        input.value = '';
        input.focus();
        return false;
    });

    const textarea = document.getElementById('log') as HTMLTextAreaElement;
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        textarea.value += `[${data.username}]: ${data.message}\n`;
    }
});

// This file ends here.