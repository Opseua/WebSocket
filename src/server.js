await import('./resources/@functions.js');
const { default: http } = await import('http'); const { default: WebSocket } = await import('isomorphic-ws'); let WebS = WebSocket;

async function server(inf) {
    let ret = { 'ret': false };
    try {
        const infConfigStorage = { 'action': 'get', 'key': 'webSocket' }
        let retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
        const portWebSocket = retConfigStorage.portWebSocket;const max = retConfigStorage.max
        const msg = retConfigStorage.msg;const par1 = retConfigStorage.par1;const par2 = retConfigStorage.par2
        const par3 = retConfigStorage.par3
        const clients = new Set(); let rooms = {}; let clientInfo = {};

        function getClients() { return Object.keys(rooms).map(r => ({ 'sala': r, 'qtd': rooms[r].size })); }
        async function log(inf) {
            let infFile, retFile; const dH = dateHour().res
            const folder = `MES_${dH.mon}`; const text = `DIA_${dH.day} ${dH.hou}:${dH.min}:${dH.sec}:${dH.mil} - ${inf}\n`
            infFile = { 'action': 'write', 'functionLocal': true, 'path': `./log/WebSocket/${folder}/log.txt`, 'rewrite': true, 'text': text }
            retFile = await file(infFile);
            if (inf.includes('RESET')) {
                infFile = { 'action': 'write', 'functionLocal': true, 'path': './log/log.js', 'rewrite': false, 'text': ' ' }
                retFile = await file(infFile);
            }
        }; log('START')

        function sendRoom(room, message, sender) {
            const clientsInRoom = rooms[room];
            if (clientsInRoom) {
                clientsInRoom.forEach((client) => {
                    if (client !== sender) { client.send(message) }
                    else { if (message.includes(par2)) { client.send(`WEBSOCKET: OK '${room}'`); } }
                });
            }
        }

        async function pingClients(client, room) {
            if (!clientInfo[client]) { return; };
            setTimeout(async function () {
                const datHou1 = dateHour(-max).res; const datHou2 = dateHour(+max).res;
                const infWebSocket = {
                    'infWebSocket': {
                        'start': `${datHou1.hou}:${datHou1.min}:${datHou1.sec}`, 'sec': max - 2, 'msg': msg,
                        'console': `CONEXÃO TEMPO MÁXIMO: ${datHou2.hou}:${datHou2.min}:${datHou2.sec}`
                    }
                }
                client.send(JSON.stringify(infWebSocket));
                const pingTimer = setTimeout(() => {
                    if (clientInfo[client] == 'pending') {
                        log(`WEBSOCKET: NAO RESPONDEU '${room}'`); const retDateHour = dateHour(0); let datHou = retDateHour.res
                        const infWebSocket = {
                            'infWebSocket': {
                                'console': `CONEXÃO TEMPO MÁXIMO: ${datHou.hou}:${datHou.min}:${datHou.sec} EXPIRADO`
                            }
                        }; client.send(JSON.stringify(infWebSocket)); client.close(); delete clientInfo[client];
                    }
                }, max * 1000); clientInfo[client] = 'pending';
                client.once('message', (message) => {
                    if (message == msg) {
                        log(`WEBSOCKET: RESPONDEU '${room}'`);
                        clearTimeout(pingTimer); clientInfo[client] = 'active'; pingClients(client, room);
                    }
                });
            }, max * 1000);

        }

        const server = http.createServer(async (req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' }); const urlParts = req.url.split('/');
            if (req.method === 'POST') {
                let requestBody = ''; req.on('data', (chunk) => { requestBody += chunk.toString() });
                req.on('end', async () => {
                    if (urlParts.length < 3 && urlParts['1'] == '') { res.end(`POST: ERRO | INFORMAR A SALA`); }
                    else {
                        const room = urlParts[1]; const message = requestBody;
                        if (room.toLowerCase() == par1 || message.toLowerCase() == par1) {
                            res.end(`POST: OK | CLIENTS:\n\n${JSON.stringify(getClients())}`);
                        } else if (room.toLowerCase() == par3 || message.toLowerCase() == par3) {
                            res.end(`POST: OK ### RESET ###`); log('RESET')
                        }
                        else {
                            if (!rooms[room]) { res.end(`POST: ERRO | NAO EXISTE '${room}'`); }
                            else {
                                if (message.length == 0) {
                                    res.end(`POST: ERRO | MENSAGEM VAZIA '${room}'`);
                                } else { sendRoom(room, message, null); res.end(`POST: OK '${room}'`); }
                            }
                        }
                    }
                })
            } else if (req.method === 'GET') {
                if (urlParts.length < 3 && urlParts['1'] == '') { res.end(`GET: ERRO | INFORMAR A SALA`); }
                else {
                    const room = urlParts[1]; const message = urlParts.slice(2).join('/');
                    if (room.toLowerCase() == par1 || message.toLowerCase() == par1) {
                        res.end(`GET: OK | CLIENTS:\n\n${JSON.stringify(getClients())}`);
                    } else if (room.toLowerCase() == par3 || message.toLowerCase() == par3) {
                        res.end(`GET: OK ### RESET ###`); log('RESET')
                    }
                    else {
                        if (!rooms[room]) { res.end(`GET: ERRO | NAO EXISTE '${room}'`); }
                        else {
                            if (message.length == 0) { res.end(`GET: ERRO | MENSAGEM VAZIA '${room}'`); }
                            else {
                                const mess = decodeURIComponent(message)
                                if (mess.toLowerCase() == 'clients') { res.end(`GET: OK | CLIENTS:\n\n${JSON.stringify(getClients())}`); }
                                else { sendRoom(room, mess, null); res.end(`GET: OK '${room}'`); }
                            }
                        }
                    }
                }
            } else { res.end(`METODOS ACEITOS 'GET' OU 'POST'`); }
        });

        const wss = new WebS.Server({ server });
        wss.on('connection', async (client, req) => {
            clients.add(client); const urlParts = req.url.split('/');
            if (urlParts.length < 3 && urlParts['1'] == '') { client.send(`WEBSOCKET: ERRO | INFORMAR A SALA`) }
            else {
                const room = urlParts[1]
                if (room.toLowerCase() == par1) { client.send(`WEBSOCKET: OK | CLIENTS:\n\n${JSON.stringify(getClients())}`); }
                else {
                    if (!rooms[room]) { rooms[room] = new Set(); }
                    rooms[room].add(client); clientInfo[client] = 'active'; pingClients(client, room);
                }; log(`WEBSOCKET: NOVO CLIENTE '${room}'`)
                client.on('message', async (text) => {
                    const message = text.toString('utf-8');
                    if (message.length == 0) { client.send(`WEBSOCKET:  ERRO | MENSAGEM VAZIA '${room}'`) }
                    else {
                        if (message.toLowerCase() == par1) { client.send(`WEBSOCKET: OK | CLIENTS:\n\n${JSON.stringify(getClients())}`); }
                        else if (message.toLowerCase() == par3) { log('RESET') }
                        else if (message.toLowerCase() == msg) { } // MENSAGEM PARA FORCAR A CONECAO
                        else { sendRoom(room, message, client); }
                    }
                });
                client.on('close', () => {
                    log(`WEBSOCKET: CLIENTE DESCONECTADO '${room}'`); clients.delete(client);
                    if (rooms[room]) { rooms[room].delete(client); if (rooms[room].size === 0) { delete rooms[room]; } };
                    delete clientInfo[client]
                });
            }
        });
        server.listen(portWebSocket, () => { console.log(`SERVER PORTA: ${portWebSocket}`); });
        ret['ret'] = true;
        ret['msg'] = `SERVER: OK`;
    } catch (e) { ret['msg'] = regexE({ 'e': e }).res }
    if (!ret.ret) { console.log(ret.msg) }
    return ret
}
server()