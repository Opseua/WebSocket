await import('./resources/@functions.js');

async function server(inf) {
    let ret = { 'ret': false };
    try {
        const { default: http } = await import('http'); const { WebSocketServer } = await import('ws'); let WebS = WebSocketServer;
        const infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; let retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
        const portWebSocket = retConfigStorage.portWebSocket; const max = retConfigStorage.max
        const par1 = retConfigStorage.par1; const par2 = retConfigStorage.par2; const par3 = retConfigStorage.par3
        const clients = new Set(); let rooms = {}; function heartbeat() { this.isAlive = true }

        function getClients() {
            let res = Object.keys(rooms).map(r => ({ 'sala': r, 'qtd': rooms[r].size })); res.unshift({ 'um': 'dois' }); return JSON.stringify(res)
        }
        async function log(inf) {
            let infFile, retFile; const dH = dateHour().res
            const folder = `MES_${dH.mon}_${dH.monNam}`; const text = `DIA_${dH.day} ${dH.hou}:${dH.min}:${dH.sec}:${dH.mil} - ${inf}\n`
            infFile = { 'action': 'write', 'functionLocal': true, 'path': `./log/WebSocket/${folder}/log.txt`, 'rewrite': true, 'text': text }
            retFile = await file(infFile);
            if (inf.includes('RESET')) {
                infFile = { 'action': 'write', 'functionLocal': true, 'path': './log/log.js', 'rewrite': false, 'text': ' ' }; retFile = await file(infFile)
            }
        }; log('START')

        function sendRoom(room, message, sender) {
            const clientsInRoom = rooms[room];
            if (clientsInRoom) {
                clientsInRoom.forEach((c) => {
                    if (c !== sender) { c.send(message) } else { if (message.includes(par2)) { c.send(`WEBSOCKET: OK '${room}'`); } }
                });
            }
        }

        const server = http.createServer(async (req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' }); const urlParts = req.url.split('/');
            if (urlParts.length < 3 && urlParts['1'] == '') { res.end(`${req.method}: ERRO | INFORMAR A SALA`) } else {
                const room = urlParts[1]; if (req.method == 'GET' || req.method == 'POST') {
                    let message = ''; if (req.method == 'GET') { message = decodeURIComponent(urlParts.slice(2).join('/')) }
                    else { await new Promise((resolve) => { req.on('data', (chunk) => { message += chunk.toString() }); req.on('end', () => { resolve(message) }) }) }
                    if (room.toLowerCase() == par1 || message.toLowerCase() == par1) {
                        res.end(`${req.method}: OK | CLIENTS:\n\n${getClients()}`)
                    } else if (room.toLowerCase() == par3 || message.toLowerCase() == par3) {
                        res.end(`${req.method}: OK ### RESET ###`); log('RESET')
                    } else if (!rooms[room]) { res.end(`${req.method}: ERRO | NAO EXISTE '${room}'`) }
                    else if (message.length == 0) { res.end(`${req.method}: ERRO | MENSAGEM VAZIA '${room}'`) }
                    else { sendRoom(room, message, null); res.end(`${req.method}: OK '${room}'`) }
                } else { res.end(`METODOS ACEITOS 'GET' OU 'POST'`) }
            }
        });

        const wss = new WebS({ server });
        wss.on('connection', async (ws, req) => {
            ws.isAlive = true; ws.on('error', console.error); ws.on('pong', heartbeat); clients.add(ws); const urlParts = req.url.split('/')
            if (urlParts.length < 3 && urlParts['1'] == '') { ws.send(`WEBSOCKET: ERRO | INFORMAR A SALA`); ws.terminate() }
            else {
                const room = urlParts[1]
                if (room.toLowerCase() == par1) { ws.send(`WEBSOCKET: OK | CLIENTS:\n\n${getClients()}`); ws.terminate() }
                else if (room.toLowerCase() == par3) { ws.send(`WEBSOCKET: OK ### RESET ###`); log('RESET') }
                else { if (!rooms[room]) { rooms[room] = new Set() }; rooms[room].add(ws) }; log(`WEBSOCKET: NOVO CLIENTE '${room}'`)
                ws.on('message', async (text) => {
                    const message = text.toString('utf-8');
                    if (message.length == 0) { ws.send(`WEBSOCKET:  ERRO | MENSAGEM VAZIA '${room}'`) }
                    else {
                        if (message.toLowerCase() == par1) { ws.send(`WEBSOCKET: OK | CLIENTS:\n\n${getClients()}`) }
                        else if (message.toLowerCase() == par3) { ws.send(`WEBSOCKET: OK ### RESET ###`); log('RESET') } else { sendRoom(room, message, ws) }
                    }
                });
                ws.on('close', () => {
                    log(`WEBSOCKET: CLIENTE DESCONECTADO '${room}'`); clients.delete(ws)
                    if (rooms[room]) { rooms[room].delete(ws); if (rooms[room].size == 0) { delete rooms[room] } }
                });
            }
        });
        setInterval(function ping() {
            wss.clients.forEach(function each(ws) { if (ws.isAlive == false) return ws.terminate(); ws.isAlive = false; ws.ping() })
        }, max * 1000)
        server.listen(portWebSocket, () => { console.log(`SERVER PORTA: ${portWebSocket}`) })
        ret['ret'] = true;
    } catch (e) { ret['msg'] = regexE({ 'e': e }).res }; if (!ret.ret) { console.log(ret.msg) }; return ret
}
server()