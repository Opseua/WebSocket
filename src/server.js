await import('./resources/clearConsole.js');
await import('./resources/@functions.js');
const { default: http } = await import('http');
const { default: WebSocket } = await import('isomorphic-ws');
let WebS = WebSocket;

async function server(inf) {
    let ret = { 'ret': false };
    try {
        const infConfigStorage = { 'path': '/src/config.json', 'action': 'get', 'key': 'websocket' }
        const retConfigStorage = await configStorage(infConfigStorage)
        const port = retConfigStorage.res.port
        const par1 = retConfigStorage.res.par1
        const par2 = retConfigStorage.res.par2
        const clients = new Set();
        const rooms = {};
        function getClients() {
            return Object.keys(rooms).map(r => ({ 'sala': r, 'qtd': rooms[r].size }));
        }

        function sendRoom(room, message, sender) {
            const clientsInRoom = rooms[room];
            if (clientsInRoom) {
                clientsInRoom.forEach((client) => {
                    if (client !== sender) {
                        client.send(message);
                    } else {
                        if (message.includes(par2)) {
                            client.send(`WEBSOCKET: OK '${room}'`);
                        }
                    }
                });
            }
        }

        const server = http.createServer(async (req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            const urlParts = req.url.split('/');
            if (req.method === 'POST') {
                let requestBody = '';
                req.on('data', (chunk) => {
                    requestBody += chunk.toString();
                });
                req.on('end', async () => {
                    if (urlParts.length < 3 && urlParts['1'] == '') {
                        res.end(`POST: ERRO | INFORMAR A SALA`);
                    } else {
                        const room = urlParts[1];
                        const message = requestBody;
                        if (room.toLowerCase() == par1 || message.toLowerCase() == par1) {
                            res.end(`POST: OK | CLIENTS:\n\n${JSON.stringify(getClients())}`);
                        }
                        else {
                            if (!rooms[room]) {
                                res.end(`POST: ERRO | NAO EXISTE '${room}'`);
                            } else {
                                if (message.length == 0) {
                                    res.end(`POST: ERRO | MENSAGEM VAZIA '${room}'`);
                                } else {
                                    sendRoom(room, message, null);
                                    res.end(`POST: OK '${room}'`);
                                }
                            }
                        }
                    }
                })
            } else if (req.method === 'GET') {
                if (urlParts.length < 3 && urlParts['1'] == '') {
                    res.end(`GET: ERRO | INFORMAR A SALA`);
                } else {
                    const room = urlParts[1]
                    const message = urlParts.slice(2).join('/');
                    if (room.toLowerCase() == par1 || message.toLowerCase() == par1) {
                        res.end(`GET: OK | CLIENTS:\n\n${JSON.stringify(getClients())}`);
                    } else {
                        if (!rooms[room]) {
                            res.end(`GET: ERRO | NAO EXISTE '${room}'`);
                        } else {
                            if (message.length == 0) {
                                res.end(`GET: ERRO | MENSAGEM VAZIA '${room}'`);
                            } else {
                                const mess = decodeURIComponent(message)
                                if (mess.toLowerCase() == 'clients') {
                                    res.end(`GET: OK | CLIENTS:\n\n${JSON.stringify(getClients())}`);
                                } else {
                                    sendRoom(room, mess, null);
                                    res.end(`GET: OK '${room}'`);
                                }
                            }
                        }
                    }
                }
            } else {
                res.end(`METODOS ACEITOS 'GET' OU 'POST'`);
            }
        });

        const wss = new WebS.Server({ server });
        wss.on('connection', (client, req) => {
            clients.add(client);
            const urlParts = req.url.split('/');
            if (urlParts.length < 3 && urlParts['1'] == '') {
                client.send(`WEBSOCKET: ERRO | INFORMAR A SALA`)
            } else {
                const room = urlParts[1]
                if (room.toLowerCase() == par1) {
                    client.send(`WEBSOCKET: OK | CLIENTS:\n\n${JSON.stringify(getClients())}`);
                } else {
                    if (!rooms[room]) {
                        rooms[room] = new Set();
                    }
                    rooms[room].add(client);
                }
                console.log(`WEBSOCKET: NOVO CLIENTE '${room}'`);
                client.on('message', async (text) => {
                    const message = text.toString('utf-8');
                    if (message.length == 0) {
                        client.send(`WEBSOCKET:  ERRO | MENSAGEM VAZIA '${room}'`)
                    } else {
                        if (message.toLowerCase() == par1) {
                            client.send(`WEBSOCKET: OK | CLIENTS:\n\n${JSON.stringify(getClients())}`);
                        } else {
                            sendRoom(room, message, client);
                        }
                    }
                });
                client.on('close', () => {
                    console.log(`WEBSOCKET: CLIENTE DESCONECTADO '${room}'`);
                    if (room.toLowerCase() !== par1) {
                        clients.delete(client);
                        if (rooms[room]) {
                            rooms[room].delete(client);
                            if (rooms[room].size === 0) {
                                delete rooms[room];
                            }
                        }
                    }
                });
            }
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