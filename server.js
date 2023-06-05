await import('../Microsoft_Graph_API/src/services/excel/updateRange.js');
await import('../Chrome_Extension/globalObject.js');
addListener(monitorGlobalObject);
async function monitorGlobalObject(value) {
    console.log('Valor de globalObject alterado: 1', value.inf);
}
await new Promise(resolve => setTimeout(resolve, (2000)));
globalObject.inf = true;

// *****************************************************************

const { globalObject } = await import('./globalObject.js');
console.log(globalObject.inf);
await new Promise(resolve => setTimeout(resolve, (2000)));
globalObject.inf = 'NOVO VALOR';
await new Promise(resolve => setTimeout(resolve, (2000)));
console.log(globalObject.inf)

const imp9 = () => import('fs').then(module => module.default);
const fs = await imp9();
const configFile = fs.readFileSync('config.json');
const config = JSON.parse(configFile);
const microsoft = async (i) => (await import('../Microsoft_Graph_API/src/services/excel/updateRange.js')).default(i);



const clearConsole = await import('./clearConsole.js');
const imp1 = () => import('express').then(module => module.default);
const express = await imp1();
const imp2 = () => import('body-parser').then(module => module.default);
const bodyParser = await imp2();
import WebSocket from 'isomorphic-ws';

const port = 8888;
const app = express();

const server = app.listen(port, async () => {
    console.log(`RODANDO NA PORTA: ${port}`);
});
app.use(bodyParser.text());
async function sendMessage(message, sender) {
    for (const client of wss.clients) {
        if (client !== sender) {
            client.send(message);
        }
    }
}
app.get('/get/*', async (req, res) => {
    const message = req.params[0];
    sendMessage(message, null);
    res.status(200).send('Requisição GET bem sucedida');
});
app.post('/post', async (req, res) => {
    const message = req.body;
    sendMessage(message, null);
    res.status(200).send('Requisição POST bem sucedida');
});

const wss = new WebSocket.Server({ server });
wss.on('connection', async ws => {
    console.log('NOVO CLIENTE CONECTADO');
    ws.on('message', async data => {
        const message = data.toString();
        ws.send('Requisição WEBSOCKET bem sucedida');

        await microsoft({ 'sheetTabName': 'HAUPC', 'send': message, 'qtd': 0 })

        wss.clients.forEach(async client => {
            if (client !== ws) {
                client.send(message);
            }
        });
    });
    ws.on('close', async () => {
        console.log('CLIENTE DESCONECTADO');
    });
    ws.onerror = async function () {
        console.log('ERRO');
    };
});







