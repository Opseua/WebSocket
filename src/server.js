await import('./clearConsole.js');
await import('./resources/functions.js');
const { default: http } = await import('http');
const { default: WebSocket } = await import('isomorphic-ws');

async function server(inf) {
    let ret = { 'ret': false };
    try {
        const port = retConfigStorage.res.port
        const clients = new Set();
        const rooms = {};

        function sendRoom(room, message, sender) {
            const clientsInRoom = rooms[room];
            if (clientsInRoom) {
                clientsInRoom.forEach((client) => {
                    if (client !== sender) {
                        client.send(message);
                    } else {
                        client.send(`WEBSOCKET: OK '${room}'`);
                    }
                });
            }
        }

        const server = http.createServer(async (req, res) => {
            if (req.method === 'POST') {
                let requestBody = '';
                req.on('data', (chunk) => {
                    requestBody += chunk.toString();
                });
                req.on('end', async () => {
                    const urlParts = req.url.split('/');
                    if (urlParts.length >= 2) {
                        const room = urlParts[1];
                        const message = requestBody;
                        if (!rooms[room]) {
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            res.end(`POST: ERRO | NAO EXISTE '${room}'`);
                            return;
                        }
                        if (message.length == 0) {
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            res.end(`POST: ERRO | MENSAGEM VAZIA '${room}'`);
                        } else {
                            sendRoom(room, message, null);
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            res.end(`POST: OK '${room}'`);
                        }
                        return;
                    } else {
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end(`POST: OUTRO ERRO`);
                        return;
                    }
                })
            } else if (req.method === 'GET') {
                const urlParts = req.url.split('/');
                if (urlParts.length >= 2) {
                    const room = urlParts[1];
                    const message = urlParts.slice(2).join('/');
                    if (!rooms[room]) {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end(`GET: ERRO | NAO EXISTE '${room}'`);
                        return;
                    }
                    if (message.length == 0) {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end(`GET: ERRO | MENSAGEM VAZIA '${room}'`);
                    } else {
                        sendRoom(room, decodeURIComponent(message), null);
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end(`GET: OK '${room}'`);
                    }
                    return;
                } else {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('GET: OUTRO ERRO');
                    return;
                }
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`METODOS ACEITOS 'GET' OU 'POST'`);
                return
            }
        });

        const wss = new WebSocket.Server({ server });
        wss.on('connection', (client, req) => {
            clients.add(client);
            const urlParts = req.url.split('/');
            const room = urlParts[urlParts.length - 1];
            if (!rooms[room]) {
                rooms[room] = new Set();
            }
            console.log(`WEBSOCKET: NOVO CLIENTE '${room}'`);
            rooms[room].add(client);
            client.on('message', async (message) => {
                const text = message.toString('utf-8');
                if (rooms[room].size == 1) {
                    client.send(`WEBSOCKET: NENHUM CLIENTE '${room}'`)
                    return
                } else {
                    sendRoom(room, text, client);
                    return
                }
            });
            client.on('close', () => {
                console.log(`WEBSOCKET: CLIENTE DESCONECTADO '${room}'`);
                clients.delete(client);
                if (rooms[room]) {
                    rooms[room].delete(client);
                    if (rooms[room].size === 0) {
                        delete rooms[room];
                    }
                }
            });
        });

        server.listen(port, () => {
            console.log(`SERVER PORTA: ${port}`);
        });

        ret['ret'] = true;
        ret['msg'] = `SERVER: OK`;

    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}
server()