await import('./resources/@export.js');
let e = import.meta.url, ee = e
let wsClients = { 'rooms': {} }, wsClientLoc
// SERVIDOR HTTP
let server = _http.createServer(async (req, res) => {
    if (req.url.includes('favicon.ico')) {
        let ico = await _fs.promises.readFile(`${letter}:/ARQUIVOS/WINDOWS/BAT/z_ICONES/websocket.ico`); res.writeHead(200, { 'Content-Type': 'image/x-icon' }).end(ico); return;
    }
    // SALA E PARAMETROS | PROCESSAR AÇÃO/MENSAGEM RECEBIDA
    let retRoomParams = await roomParams({ 'e': e, 'wsClients': wsClients, 'resWs': res, 'server': req, }); if (!retRoomParams.ret) { return }
    let { host, room, locWeb, action, message, method, } = retRoomParams.res; res['host'] = host; res['room'] = room; res['locWeb'] = locWeb; res['method'] = method;
    messageAction({ 'host': host, 'room': room, 'action': action, 'message': message, 'resWs': res, 'wsClients': wsClients, 'wsClientLoc': wsClientLoc })
});

// SERVIDOR WEBSOCKET | ### ON CONNECTION
let wss = new _WebSocketServer({ server });
wss.on('connection', async (ws, res) => {
    // SALA PARAMETROS E [ADICIONAR] | ENVIAR PING DE INÍCIO DE CONEXÃO
    let retRoomParams = await roomParams({ 'e': e, 'wsClients': wsClients, 'resWs': ws, 'server': res, }); if (!retRoomParams.ret) { return }
    let { host, room, locWeb, method, } = retRoomParams.res; ws['host'] = host; ws['room'] = room; ws['locWeb'] = locWeb; ws['method'] = method;
    let hostRoom = `${host}/${room}`; if (!wsClients.rooms[hostRoom]) { wsClients.rooms[hostRoom] = new Set(); }; wsClients.rooms[hostRoom].add(ws);
    logServer({ 'write': true, 'room': room, 'msg': `NOVO ${locWeb} '${room}'` });

    // ### ON MESSAGE
    ws.on('message', async (data) => {
        let message = data.toString('utf-8')
        if (message.length == 0) { ws.send(`ERRO | MENSAGEM VAZIA ${locWeb} '${room}'`) }
        else {
            let pingPong = message == `${globalWindow.par6}` ? 1 : message == `${globalWindow.par7}` ? 2 : 0
            // ÚLTIMA MENSAGEM RECEBIDA
            ws['lastMessage'] = ws.lastMessage || pingPong > 0 ? Number(dateHour().res.tim) : false
            // logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `← SER | ${ws.lastMessage} | ${hostRoom}` });
            if (pingPong > 0) {
                if (pingPong == 2) { return }
                // RECEBIDO: 'PING' ENVIAR 'PONG'
                ws.send('pong'); // logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `RECEBEU PING ${locWeb} '${room}'` });
            } else {
                try { message = JSON.parse(message); } catch (catchErr) { message = { 'message': message }; logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `ERRO M1` }) };
                if (!message.message) { message = { 'message': message }; logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `ERRO M2` }) }
                // PROCESSAR MENSAGEM RECEBIDA
                if (ws.lastMessage) { ws.send(`pong`) }; messageReceived({ ...message, 'host': host, 'room': room, 'resWs': ws, 'wsClients': wsClients, });
            }
        }
    });

    // ### ON ERROR/CLOSE
    ws.on('error', (error) => { removeSerCli({ 'resWs': ws, 'host': host, 'room': room, 'write': true, 'msg': `CLIENTE ERRO ${locWeb} '${room}'\n${error}`, }) });
    ws.on('close', () => { removeSerCli({ 'resWs': ws, 'host': host, 'room': room, 'write': true, 'msg': `CLIENTE DESCONECTADO ${locWeb} '${room}'`, }) });
});

// LOG DO SERVER
async function logServer(inf) {
    let { write, msg, room } = inf; logConsole({ 'e': e, 'ee': ee, 'write': write, 'msg': msg });
    // if (globalWindow.devMaster == 'OPSEUA' && room && globalWindow.sheetServer.devs.includes(room)) { // 'OPSEUA' → 'EC2'
    //     let infGoogleSheets = { // A2  | B2 | C2 
    //         'e': e, 'action': 'send', 'id': `1BKI7XsKTq896JcA-PLnrSIbyIK1PaakiAtoseWmML-Q`, 'tab': `SERVER`,
    //         'range': `${globalWindow.sheetServer.cols[globalWindow.sheetServer.devs.indexOf(room)]}2`,
    //         'values': [[`${dateHour().res.tim} | ${inf.msg.includes('NOVO') ? 'ON' : 'OFF'}`]]
    //     }; googleSheets(infGoogleSheets)
    // }
}

// REMOVER CLIENTE
function removeSerCli(inf) {
    let { resWs, write, msg, host, room } = inf; let hostRoom = `${host}/${room}`; logServer({ 'write': write, 'room': room, 'msg': msg, }); if (wsClients.rooms[hostRoom]) {
        wsClients.rooms[hostRoom].delete(resWs); if (wsClients.rooms[hostRoom].size == 0) { delete wsClients.rooms[hostRoom] }
    }
}

// LOOP: CHECAR ÚLTIMA MENSAGEM
let secPing = globalWindow.secPing; function lastMessageReceived() {
    for (const clientSet of Object.values(wsClients.rooms)) {
        for (const value of clientSet) {
            function check(inf) { let { lastMessage, locWeb, room } = inf; return { 'dif': lastMessage ? Number(dateHour().res.tim) - lastMessage : -99, 'locWeb': locWeb, 'room': room } };
            let retCheck = check(value); if (retCheck.dif > ((secPing * 2) - 1)) {
                logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `DESCONECTAR [PING ${retCheck.dif}] ${retCheck.locWeb} '${retCheck.room}'` }); value.close()
            }
        }
    };
}; setInterval(() => { lastMessageReceived() }, (secPing * 2) * 1000);

// SERVIDOR: INICIAR
server.listen(globalWindow.portLoc, async () => {
    // WEBSOCKET [CLIENT LOC] ------------------------------------------------------------------------------------------
    let ws = new _WebSocket(`ws://${letter == 'D' ? '127.0.0.1' : globalWindow.serverWeb}:${globalWindow.portLoc}/?roo=${globalWindow.par2}`)
    let url = ws._url ? ws._url : ws.url; let host = url.replace('ws://', '').split('/')[0]; let room = url.split(`${host}/`)[1].replace('?roo=', '')
    let locWeb = host.includes('127.0.0') ? `[LOC]` : `[WEB]`; ws['host'] = host; ws['room'] = room; ws['locWeb'] = locWeb; ws['method'] = 'WEBSOCKET';
    wsClientLoc = ws; ws.onerror = (data) => { logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `ERRO [CLIENT LOC]:\n${JSON.stringify(data)}` }) };
    ws.onmessage = async (data) => {
        let message = data.data.toString('utf-8'); let pingPong = message == `${globalWindow.par6}` ? 1 : message == `${globalWindow.par7}` ? 2 : 0
        if (pingPong > 0) { return }; try { message = JSON.parse(message) } catch (catchErr) { message = { 'message': message } }; if (!message.message) { message = { 'message': message } }
        // PROCESSAR MENSAGEM RECEBIDA
        messageReceived({ ...message, 'host': host, 'room': room, 'resWs': ws, });
    }
    // -------------------------------------------------------------------------------------------------------------
    // AGUARDAR SERVIDOR INICIAR
    logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `RODANDO NA PORTA: ${globalWindow.portLoc}` });
    await new Promise(resolve => { setTimeout(resolve, 1000) })

    // CLIENT (NÃO POR COMO 'await'!!!)
    client({ 'e': e })

    // AGUARDAR [CLIENT LOC] INICIAR
    await new Promise(resolve => { setTimeout(resolve, 1000) })

    // ACTION LOOP [SOMENTE SE FOR NO AWS (07H<>23H)
    setInterval(() => {
        let time = dateHour().res; if (globalWindow.devMaster == 'AWS' && Number(time.hou) > 6 && Number(time.hou) < 24) {
            // logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `ACTION: LOOP` });
            messageAction({ 'host': host, 'room': '*_NODEJS*', 'action': globalWindow.par10, 'message': '', 'resWs': false, 'wsClients': wsClients, 'wsClientLoc': wsClientLoc })
        }
    }, (globalWindow.secLoop * 1000));
});


// async function teste() {
//     await new Promise(resolve => { setTimeout(resolve, 1000) }); //  logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `INICIO` }) ; let data
//     async function sendTest(data) {
//         let retMessageSend = await messageSend({ 'destination': '127.0.0.1:8889/CLIENTE_2', 'messageId': true, 'message': data, 'resWs': ws, 'secondsAwait': 0, });
//         logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `RESPOSTA SENDO ESPERADA:\n${JSON.stringify(retMessageSend)}` });
//     }
//     // _fs.readFile('D:/1_IMAGE_2000KB.jpg', async (err, data) => {
//     //     // data = { "fun": [{ "securityPass": "passwordAqui", "retInf": true, "name": "commandLine", "par": { "command": "notepad", "awaitFinish": true } }] }
//     //     sendTest(data)
//     // });
//     let retFile = await file({ 'e': e, 'action': 'read', 'functionLocal': false, 'path': 'D:/1_ZIP_25MB.zip' }); await sendTest(retFile.res)
// }; // if (eng) { teste() }