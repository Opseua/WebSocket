await import('./resources/@functions.js');

async function server(inf) {
    let ret = { 'ret': false }; try {
        const infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; let retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
        const port = retConfigStorage.portWebSocket; const max = retConfigStorage.max; const chatGptAiChatos = retConfigStorage.chatGptAiChatos
        const par1 = retConfigStorage.par1; const par2 = retConfigStorage.par2; const par3 = retConfigStorage.par3; const par4 = retConfigStorage.par4
        const clients = new Set(); let rooms = {}; function heartbeat() { this.isAlive = true }

        function getClients() {
            let res = Object.keys(rooms).map(r => ({ 'sala': r, 'qtd': rooms[r].size }));
            const dH = dateHour().res; res.unshift({ 'hour': `${dH.hou}:${dH.min}:${dH.sec}` }); return JSON.stringify(res)
        }; await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': 'START' })

        function sendRoom(room, message, sender) {
            const clientsInRoom = rooms[room]; if (clientsInRoom) {
                clientsInRoom.forEach((c) => { if (c !== sender) { c.send(message) } else { if (message.includes(par2)) { c.send(`WEBSOCKET: OK '${room}'`); } } })
            }
        }

        const server = _http.createServer(async (req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' }); const urlParts = req.url.split('/');
            if (urlParts.length < 3 && urlParts['1'] == '') { res.end(`${req.method}: ERRO | INFORMAR A SALA`) } else {
                const room = urlParts[1]; if (req.method == 'GET' || req.method == 'POST') {
                    let message = ''; if (req.method == 'GET') { message = decodeURIComponent(urlParts.slice(2).join('/')) }
                    else { await new Promise((resolve) => { req.on('data', (chunk) => { message += chunk.toString() }); req.on('end', () => { resolve(message) }) }) }
                    if (room.toLowerCase() == par1 || message.toLowerCase() == par1) { res.end(`${req.method}: OK | CLIENTS:\n\n${getClients()}`) }
                    else if (room.toLowerCase() == par3 || message.toLowerCase() == par3) {
                        res.end(`${req.method}: OK ### RESET ###`); await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': 'RESET' })
                        await log({ 'folder': 'JavaScript', 'path': `reset.js`, 'text': ' ' })
                    } else if (req.method == 'POST' && room.toLowerCase() == par4) {
                        try {
                            if (!message.length > 0) { throw new Error() } else {
                                message = JSON.parse(message); if (!message.prompt) { res.end(`INFORMAR O 'prompt'`) } else {
                                    const network = message.network ? true : false; const infApi = {
                                        'method': 'POST', 'url': chatGptAiChatos,
                                        'headers': {
                                            'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"', 'accept': 'application/json, text/plain, */*',
                                            'content-type': 'application/json', 'dnt': '1', 'sec-ch-ua-mobile': '?0', 'sec-ch-ua-platform': '"Windows"',
                                            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                                            'origin': 'https://chat9.yqcloud.top', 'sec-fetch-site': 'cross-site', 'sec-fetch-mode': 'cors',
                                            'sec-fetch-dest': 'empty', 'referer': 'https://chat9.yqcloud.top/', 'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,it;q=0.6'
                                        }, 'body': { "prompt": message.prompt, "userId": "#/chat/1695782874949", "network": network, "system": "", "withoutContext": false, "stream": false }
                                    }; const r = await api(infApi); res.end(JSON.stringify({ 'ret': r.res.code == 200 ? true : false, 'res': r.res.body }))
                                }
                            }
                        } catch (e) { res.end(`BODY INVALIDO`) }
                    } else if (!rooms[room]) { res.end(`${req.method}: ERRO | NAO EXISTE '${room}'`) }
                    else if (message.length == 0) { res.end(`${req.method}: ERRO | MENSAGEM VAZIA '${room}'`) }
                    else { sendRoom(room, message, null); res.end(`${req.method}: OK '${room}'`) }
                } else { res.end(`METODOS ACEITOS 'GET' OU 'POST'`) }
            }
        });

        const wss = new _WebSServer({ server }); wss.on('connection', async (ws, req) => {
            ws.isAlive = true; ws.on('error', async (text) => { (console.error); await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': error }) })
            ws.on('pong', heartbeat); clients.add(ws); const urlParts = req.url.split('/')
            if (urlParts.length < 3 && urlParts['1'] == '') { ws.send(`WEBSOCKET: ERRO | INFORMAR A SALA`); ws.terminate() } else {
                const room = urlParts[1]; if (room.toLowerCase() == par1) { ws.send(`WEBSOCKET: OK | CLIENTS:\n\n${getClients()}`); ws.terminate() } else if (room.toLowerCase() == par3) {
                    ws.send(`WEBSOCKET: OK ### RESET ###`); await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': 'RESET' })
                    await log({ 'folder': 'JavaScript', 'path': `reset.js`, 'text': ' ' })
                } else { if (!rooms[room]) { rooms[room] = new Set() }; rooms[room].add(ws) };
                await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': `WEBSOCKET: NOVO CLIENTE '${room}'` }); ws.on('message', async (text) => {
                    const message = text.toString('utf-8'); if (message.length == 0) { ws.send(`WEBSOCKET:  ERRO | MENSAGEM VAZIA '${room}'`) } else {
                        if (message.toLowerCase() == par1) { ws.send(`WEBSOCKET: OK | CLIENTS:\n\n${getClients()}`) } else if (message.toLowerCase() == par3) {
                            ws.send(`WEBSOCKET: OK ### RESET ###`); await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': 'RESET' })
                            await log({ 'folder': 'JavaScript', 'path': `reset.js`, 'text': ' ' })
                        } else { sendRoom(room, message, ws) }
                    }
                }); ws.on('close', async () => {
                    await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': `WEBSOCKET: CLIENTE DESCONECTADO '${room}'` })
                    clients.delete(ws); if (rooms[room]) { rooms[room].delete(ws); if (rooms[room].size == 0) { delete rooms[room] } }
                });
            }
        }); setInterval(function ping() {
            wss.clients.forEach(function each(ws) { if (ws.isAlive == false) return ws.terminate(); ws.isAlive = false; ws.ping() })
        }, max * 1000); server.listen(port, () => { console.log(`SERVER PORTA: ${port}`) }); ret['ret'] = true
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
}
server()