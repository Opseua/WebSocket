await import('./resources/@export.js');

// CLIENTS/SALAS E PING/LOOP
let e = import.meta.url;
let clients = new Set(), rooms = {}
setInterval(async () => {
    for (let value of clients) {
        let dif = value.pingLast ? Number(dateHour().res.tim) - value.pingLast : 0; if (dif > (secPing + 5)) {
            await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': `WEBSOCKET: CLIENTE DESCONECTADO [PING ${dif}] '${value.pingRoom}'` });
            value.close()
        }
    };
    // LOOP SOMENTE SE FOR NO EC2
    if (devMaster == 'EC2') {
        let infReceivedSendAwait, retReceivedSendAwait
        infReceivedSendAwait = { 'rooms': rooms, 'room': 'all', 'message': par10, 'action': par10, 'sender': null, 'server': 'res', 'method': 'WEBSOCKET' }
        received(infReceivedSendAwait)
    }
}, (secPing * 1000));

// SERVER HTTP
let server = _http.createServer(async (req, res) => {
    if (req.url.includes('favicon.ico')) { return }
    // SALA E PARAMETROS
    let retRoomParams = await roomParams({ 'method': 'HTTP', 'server': req })
    let method = retRoomParams.res.method
    let room = retRoomParams.res.room
    let action = retRoomParams.res.action
    let message = retRoomParams.res.message

    // PROCESSAR MENSAGEM RECEBIDA (SALA OU TIMEOUT)
    let infReceivedSendAwait, retReceivedSendAwait
    infReceivedSendAwait = { 'rooms': rooms, 'room': room, 'message': message, 'sender': null, 'server': res, 'action': action, 'method': method }
    received(infReceivedSendAwait)
});

// SERVER WEBSOCKET | ### ON CONNECTION
let wss = new _WebSocketServer({ server });
wss.on('connection', async (ws, res) => {
    ws.isAlive = true;
    // ### ON ERRO
    ws.on('error', async (error) => {
        // console.log(`WEBSOCKET: ERRO`)
        // await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': error })
    })

    // SALA E PARAMETROS
    let retRoomParams = await roomParams({ 'method': 'WEBSOCKET', 'server': res })
    let method = retRoomParams.res.method
    let room = retRoomParams.res.room

    if (!room) {
        ws.send(`ERRO | INFORMAR A SALA`);
        ws.terminate()
    } else {
        ws['pingRoom'] = room
        clients.add(ws);
        if (!rooms[room]) { rooms[room] = new Set() };
        rooms[room].add(ws)
        // console.log(`WEBSOCKET: NOVO CLIENTE '${room}'`)
        // await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': `WEBSOCKET: NOVO CLIENTE '${room}'` });

        // ### ON MESSAGE
        ws.on('message', async (text) => {
            let message = text.toString('utf-8');
            if (message.length == 0) {
                ws.send(`ERRO | MENSAGEM VAZIA '${room}'`)
            } else {
                if (message.toLowerCase() == par6.toLowerCase()) {
                    // PING / PONG
                    ws.send(par7);
                    ws['pingLast'] = Number(dateHour().res.tim)
                } else {
                    // PROCESSAR MENSAGEM RECEBIDA (SALA OU TIMEOUT)
                    let infReceivedSendAwait, retReceivedSendAwait
                    infReceivedSendAwait = { 'rooms': rooms, 'room': room, 'message': message, 'sender': ws, 'server': res, 'method': method }
                    received(infReceivedSendAwait)
                }
            }
        });

        // ### ON CLOSE
        ws.on('close', async () => {
            // console.log(`WEBSOCKET: CLIENTE DESCONECTADO '${room}'`)
            // await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': `WEBSOCKET: CLIENTE DESCONECTADO '${room}'` })
            clients.delete(ws);
            if (rooms[room]) {
                rooms[room].delete(ws);
                if (rooms[room].size == 0) { delete rooms[room] }
            }
        });
    }
});

// INICIAR SERVIDORES
server.listen(portLocal, async () => {
    let time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, `server [WebSocket] PORTA: ${portLocal}`, '\n');
    // CLIENT
    async function runFun1() {
        await new Promise(resolve => { setTimeout(resolve, 2000) });
        await import('./client.js');
    };
    runFun1()
});

