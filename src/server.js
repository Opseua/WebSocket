await import('./resources/@export.js');

// CLIENTS/SALAS E PING/LOOP
let e = import.meta.url, ee = e
let clients = new Set(), rooms = {}

// LOG DO SERVER
async function logServer(inf) {
    logConsole({ 'e': e, 'ee': ee, 'write': inf.write, 'msg': `${inf.msg}${inf.server ? " '" + inf.server.roomLocWeb + "'" : ''}` });
    if (inf.server && inf.server.master && inf.server.roomLocWeb.includes('WEB') && windowGlobal.sheetServer.devs.includes(inf.server.room) && inf.msg.includes('CONECTADO')) {
        let infGoogleSheets, retGoogleSheets;
        infGoogleSheets = { // A2  | B2 | C2 
            'e': e, 'action': 'send', 'id': `1BKI7XsKTq896JcA-PLnrSIbyIK1PaakiAtoseWmML-Q`, 'tab': `SERVER`,
            'range': `${windowGlobal.sheetServer.cols[windowGlobal.sheetServer.devs.indexOf(inf.server.room)]}2`,
            'values': [[`${dateHour().res.tim} | ${inf.msg.includes('DESCONECTADO') ? 'OFF' : 'ON'}`]]
        }
        googleSheets(infGoogleSheets)
    }
}
// LOOP: ENVIAR 'pong' PARA OS CLIENTES | AÇÃO 'loop'
setInterval(async () => {
    for (let value of clients) {
        let dif = value.pingLast ? Number(dateHour().res.tim) - value.pingLast : 0; if (dif > (windowGlobal.secPing + 5)) {
            logServer({ 'write': true, 'server': value, 'msg': `[SERVER] CLIENTE DESCONECTADO [PING ${dif}]` });
            value.close()
        }
    };
}, (windowGlobal.secPing * 1000));
setInterval(async () => {
    let time = dateHour().res;
    // LOOP SOMENTE SE FOR NO EC2 (07H<>23H)
    if (windowGlobal.devMaster == 'EC2' && Number(time.hou) > 6 && Number(time.hou) < 24) {
        let infReceivedSendAwait, retReceivedSendAwait
        infReceivedSendAwait = { 'e': e, 'rooms': rooms, 'room': 'all', 'message': windowGlobal.par10, 'action': windowGlobal.par10, 'sender': null, 'server': 'res', 'method': 'WEBSOCKET' }
        received(infReceivedSendAwait)
    }
}, (windowGlobal.secLoop * 1000));

// SERVER HTTP
let server = _http.createServer(async (req, res) => {
    if (req.url.includes('favicon.ico')) { return }
    // SALA E PARAMETROS
    await log({ 'e': e, 'folder': 'JavaScriptNovo', 'path': `log.txt`, 'text': `createServer 1` });
    let retRoomParams = await roomParams({ 'e': e, 'method': 'HTTP', 'server': req })
    await log({ 'e': e, 'folder': 'JavaScriptNovo', 'path': `log.txt`, 'text': `createServer 2` });
    let method = retRoomParams.res.method
    let room = retRoomParams.res.room
    let action = retRoomParams.res.action
    let message = retRoomParams.res.message

    // PROCESSAR MENSAGEM RECEBIDA (SALA OU TIMEOUT)
    let infReceivedSendAwait, retReceivedSendAwait
    infReceivedSendAwait = { 'rooms': rooms, 'room': room, 'message': message, 'sender': null, 'server': res, 'action': action, 'method': method }
    await log({ 'e': e, 'folder': 'JavaScriptNovo', 'path': `log.txt`, 'text': `createServer 3` });
    await received(infReceivedSendAwait)
    await log({ 'e': e, 'folder': 'JavaScriptNovo', 'path': `log.txt`, 'text': `createServer 4` });
});

// SERVER WEBSOCKET | ### ON CONNECTION
let wss = new _WebSocketServer({ server });
wss.on('connection', async (ws, res) => {
    ws.isAlive = true;
    // ### ON ERRO
    ws.on('error', async (error) => {
        logServer({ 'write': true, 'server': false, 'msg': `[SERVER] ERRO:\n${error}` });
    })

    // SALA E PARAMETROS
    let retRoomParams = await roomParams({ 'e': e, 'method': 'WEBSOCKET', 'server': res })
    let method = retRoomParams.res.method
    let room = retRoomParams.res.room

    if (!room) {
        ws.send(`ERRO | INFORMAR A SALA`);
        ws.terminate()
    } else {
        ws['room'] = room
        ws['roomLocWeb'] = res.headers.host.includes('127.0.0') ? `[LOC] ${room}` : `[WEB] ${room}`
        clients.add(ws);
        if (!rooms[room]) { rooms[room] = new Set() };
        rooms[room].add(ws)
        logServer({ 'write': true, 'server': ws, 'msg': `[SERVER] NOVO CLIENTE` });

        await new Promise(resolve => { setTimeout(resolve, 6000) })
        let infFile, retFile // 'logFun': true, 'raw': true,         rewrite TRUE → adicionar no mesmo arquivo
        infFile = { 'e': e, 'action': 'read', 'functionLocal': false, 'path': 'D:/IMAGE_2000KB.jpg' }
        retFile = await file(infFile);
        let retWsMessageSend
        retWsMessageSend = await wsMessageSend({ 'e': e, 'room': 'OPSEUA_NODEJS', 'message': retFile.res, 'messageId': false, 'rooms': rooms, 'sender': null, 'secondsAwait': 0 })
        console.log(`AQUI → ${JSON.stringify(retWsMessageSend)}`)
        return

        // ### ON MESSAGE
        ws.on('message', async (text) => {
            let message = data.toString('utf-8');
            let parsedData = {}; try { parsedData = JSON.parse(message); parsedData = parsedData.message ? parsedData : { 'e': e, 'message': message, 'messageId': false, 'parts': false, } }
            catch (e) { parsedData = { 'e': e, 'message': message, 'messageId': false, 'parts': false, } };
            if (message.length == 0) {
                ws.send(`ERRO | MENSAGEM VAZIA '${room}'`)
            } else {
                if (message.toLowerCase() == windowGlobal.par6.toLowerCase()) {
                    // RECEBEU: PING → ENVIAR: PONG
                    ws.send(windowGlobal.par7);
                    ws['pingLast'] = Number(dateHour().res.tim)
                } else if (message.toLowerCase() == windowGlobal.par11.toLowerCase()) {
                    ws['master'] = true
                    logServer({ 'write': true, 'server': ws, 'msg': `[SERVER] MASTER CONECTADO` });
                } else {
                    // PROCESSAR MENSAGEM RECEBIDA (SALA OU TIMEOUT)
                    let infReceivedSendAwait, retReceivedSendAwait
                    infReceivedSendAwait = { 'e': e, 'rooms': rooms, 'room': room, 'message': message, 'action': '', 'sender': ws, 'server': res, 'method': method }
                    // received(infReceivedSendAwait)
                    wsMessageReceived({ 'e': e, 'room': room, 'parsedData': parsedData, 'rooms': rooms, 'action': '', 'sender': ws, 'server': res, 'method': method })
                }
            }
        });

        // ### ON CLOSE
        ws.on('close', async () => {
            logServer({ 'write': true, 'server': ws, 'msg': '[SERVER] CLIENTE DESCONECTADO', })
            clients.delete(ws);
            if (rooms[room]) {
                rooms[room].delete(ws);
                if (rooms[room].size == 0) { delete rooms[room] }
            }
        });
    }
});

// INICIAR SERVIDORES
server.listen(windowGlobal.portLocal, async () => {
    let infFile, retFile // 'logFun': true, 'raw': true,         rewrite TRUE → adicionar no mesmo arquivo
    infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'path': './log/JavaScript/MES_01_JAN/DIA_31_log.txt', 'rewrite': false, 'text': '\n' }
    await file(infFile);

    logServer({ 'write': true, 'server': false, 'msg': `[WebSocket] PORTA: ${windowGlobal.portLocal}\n` });

    // CLIENT (NÃO POR COMO 'await'!!!)
    await new Promise(resolve => { setTimeout(resolve, 2000) });
    client({ 'e': e })
});

