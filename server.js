console.log('1111');
/* 
const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3333;

const app = express();
app.use(express.text());
app.use(cors());

const server = app.listen(port, () => {
    console.log(`Servidor Express iniciado na porta ${port}`);
});

const wss = new WebSocket.Server({ server });

app.post('/enviar-dados', (req, res) => {
    const dados = req.body;
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(dados);
        }
    });
    app.emit('enviar-dados', dados);
    res.send("RECEBIDO");
});

app.get('/receber-dados', (req, res) => {
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    res.write(`Conectado ao servidor SSE\n\n`);

    app.on('enviar-dados', (dados) => {
        res.write(`${dados}\n\n`);
    });
});

wss.on('connection', (ws) => {
    ws.send('Conectado ao servidor WebSocket');

    ws.on('message', (message) => {
        app.emit('enviar-dados', message);
    });
});
 */