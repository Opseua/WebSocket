// * Microsoft Graph
const microsoft = async (i) => (await import('../Microsoft_Graph_API/src/services/excel/updateRange.js')).default(i);

const clearConsole = await import('./clearConsole.js');
const imp1 = () => import('express').then(module => module.default);
const express = await imp1();
const imp2 = () => import('body-parser').then(module => module.default);
const bodyParser = await imp2();
import WebSocket from 'isomorphic-ws';

const port = 8888;
const app = express();
const server = app.listen(port, () => {
    console.log(`RODANDO NA PORTA: ${port}`);
});
app.use(bodyParser.text());
async function sendMessage(message, sender) {
    wss.clients.forEach(client => {
        if (client !== sender) {
            client.send(message);
        }
    });
}
app.get('/get/*', (req, res) => {
    const message = req.params[0];
    sendMessage(message, null);
    res.sendStatus(200).send('Requisição GET bem sucedida');
});
app.post('/post', (req, res) => {
    const message = req.body;
    sendMessage(message, null);
    res.sendStatus(200).send('Requisição POST bem sucedida');
});

const wss = new WebSocket.Server({ server });
wss.on('connection', ws => {
    console.log('NOVO CLIENTE CONECTADO');
    ws.on('message', data => {
        const message = data.toString();
        sendMessage(message, ws);
    });
    ws.on('close', () => {
        console.log('CLIENTE DESCONECTADO');
    });
    ws.onerror = function () {
        console.log('ERRO');
    };
});




