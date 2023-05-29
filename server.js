const WebSocketServer = require('ws');

const port = 8888;
const wss = new WebSocketServer.Server({ port: port });
const clients = new Set();

wss.on("connection", ws => {
    clients.add(ws);
    console.log("NOVO CLIENTE");
    ws.on("message", data => {
        const message = data.toString();
        clients.forEach(client => {
            if (client !== ws) {
                client.send(message);
            }
        });
    });
    ws.on("close", () => {
        clients.delete(ws);
        console.log("CLIENTE DESCONECTADO");
    });
    ws.onerror = function () {
        console.log("ERRO");
    };
});
console.log(`RODANDO NA PORTA: ${port}`)
